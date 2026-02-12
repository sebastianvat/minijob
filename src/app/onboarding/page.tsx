'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap, ArrowRight, ArrowLeft, CheckCircle2, User, MapPin, Phone,
  Briefcase, Home, Hammer, Car, Laptop, PawPrint, Baby, Sparkles,
  Camera, Upload, X, Award, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { createClient, createStorageClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Category, Skill } from '@/types/database';

const CATEGORY_ICONS: Record<string, typeof Home> = {
  casa: Home, constructii: Hammer, auto: Car, tech: Laptop, pets: PawPrint, kids: Baby,
};

const CATEGORY_COLORS: Record<string, string> = {
  casa: 'from-teal-500 to-teal-600',
  constructii: 'from-amber-500 to-amber-600',
  auto: 'from-blue-500 to-blue-600',
  tech: 'from-purple-500 to-purple-600',
  pets: 'from-green-500 to-green-600',
  kids: 'from-pink-500 to-pink-600',
};

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);

  // Step 1: Personal info
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('Sibiu');
  const [bio, setBio] = useState('');
  const [businessType, setBusinessType] = useState<'individual' | 'pfa' | 'srl'>('individual');

  // Step 2: Categories & Skills
  const [categories, setCategories] = useState<Category[]>([]);
  const [allSkills, setAllSkills] = useState<Record<string, Skill[]>>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(false);

  // Step 3: Pricing
  const [serviceRadius, setServiceRadius] = useState('15');

  // Step 4: Portfolio - real files + preview URLs
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([]);
  const [portfolioPreviews, setPortfolioPreviews] = useState<string[]>([]);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        window.location.href = '/auth/login';
        return;
      }
      setUser(user);

      // Pre-fill from user metadata
      const meta = user.user_metadata;
      if (meta?.full_name) setFullName(meta.full_name);
      if (meta?.phone) setPhoneNumber(meta.phone);

      // Load categories
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .order('sort_order');
      if (catData) setCategories(catData);

      setLoading(false);
    };
    init();
  }, []);

  // Load skills when categories change
  useEffect(() => {
    const loadSkills = async () => {
      if (selectedCategories.length === 0) return;
      setLoadingSkills(true);
      const supabase = createClient();

      for (const catSlug of selectedCategories) {
        if (allSkills[catSlug]) continue;
        const cat = categories.find(c => c.slug === catSlug);
        if (!cat) continue;

        const { data } = await (supabase as any)
          .from('skills')
          .select('*')
          .eq('category_id', cat.id)
          .eq('active', true)
          .order('sort_order');
        
        if (data) {
          setAllSkills(prev => ({ ...prev, [catSlug]: data }));
        }
      }
      setLoadingSkills(false);
    };
    loadSkills();
  }, [selectedCategories]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev => 
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev =>
      prev.includes(skillId) ? prev.filter(s => s !== skillId) : [...prev, skillId]
    );
  };

  const handleFinish = async () => {
    setSaving(true);
    const supabase = createClient();

    try {
      // 1. Update profile
      await (supabase as any).from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: fullName,
        phone: phoneNumber || null,
        location_city: city,
        role: 'provider',
      });

      // 2. Create provider record
      const { data: providerData, error: providerError } = await (supabase as any)
        .from('providers')
        .upsert({
          user_id: user.id,
          business_type: businessType,
          bio: bio || null,
          categories: selectedCategories,
          service_radius_km: parseInt(serviceRadius) || 15,
          active: true,
        })
        .select('id')
        .single();

      if (providerError) {
        console.error('Provider create error:', providerError);
        toast.error('Eroare la crearea profilului. Încearcă din nou.');
        setSaving(false);
        return;
      }

      // 3. Add provider_skills
      if (providerData && selectedSkills.length > 0) {
        const skillInserts = selectedSkills.map(skillId => ({
          provider_id: providerData.id,
          skill_id: skillId,
          level: 'new',
        }));

        await (supabase as any)
          .from('provider_skills')
          .upsert(skillInserts, { onConflict: 'provider_id,skill_id' });
      }

      // 4. Upload portfolio photos to Supabase Storage
      if (portfolioFiles.length > 0 && providerData) {
        const uploadedUrls: string[] = [];
        const storageClient = createStorageClient();

        for (let i = 0; i < portfolioFiles.length; i++) {
          const file = portfolioFiles[i];
          const ext = file.name.split('.').pop() || 'jpg';
          const path = `providers/${user.id}/portfolio/${Date.now()}_${i}.${ext}`;

          const { data: uploadData, error: uploadError } = await storageClient.storage
            .from('portfolio')
            .upload(path, file, {
              cacheControl: '3600',
              upsert: false,
            });

          if (uploadData && !uploadError) {
            const { data: { publicUrl } } = storageClient.storage
              .from('portfolio')
              .getPublicUrl(path);
            uploadedUrls.push(publicUrl);
          }
        }

        // Save photo URLs to services or a portfolio record
        if (uploadedUrls.length > 0) {
          // Create a service entry with portfolio photos
          await (supabase as any).from('services').insert({
            provider_id: providerData.id,
            category_id: categories.find(c => selectedCategories.includes(c.slug))?.id || categories[0]?.id,
            title: `Servicii ${selectedCategories.map(s => categories.find(c => c.slug === s)?.name).join(', ')}`,
            price: 0,
            price_type: 'custom',
            photos: uploadedUrls,
            active: true,
          });
        }
      }

      toast.success('Profil creat cu succes!');
      setDone(true);
    } catch (err) {
      console.error('Onboarding error:', err);
      toast.error('Eroare neașteptată. Încearcă din nou.');
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  // ═══ SUCCESS SCREEN ═══
  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Bine ai venit!</h1>
          <p className="text-slate-600 mb-2">
            Profilul tău de specialist a fost creat cu succes.
          </p>
          <p className="text-slate-500 text-sm mb-8">
            Acum poți vedea proiectele din zona ta și să faci oferte clienților.
          </p>

          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-8">
            <p className="text-sm text-teal-700">
              <strong>Sfat:</strong> Adaugă poze din lucrări anterioare în portofoliu. 
              Specialiștii cu portofoliu primesc de 3x mai multe cereri!
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button className="bg-orange-500 hover:bg-orange-600 h-12" asChild>
              <Link href="/projects">
                <Briefcase className="w-4 h-4 mr-2" />
                Vezi proiecte disponibile
              </Link>
            </Button>
            <Button variant="outline" className="h-12" asChild>
              <Link href="/dashboard">
                Mergi la dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">MiniJob</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Pas {step} din {TOTAL_STEPS}</span>
            <div className="flex gap-1">
              {[...Array(TOTAL_STEPS)].map((_, i) => (
                <div key={i} className={`w-8 h-1.5 rounded-full transition-colors ${i < step ? 'bg-orange-500' : 'bg-slate-200'}`} />
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">

          {/* ═══ STEP 1: Despre tine ═══ */}
          {step === 1 && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-500" />
                  Despre tine
                </CardTitle>
                <CardDescription>Informații de bază pentru profilul tău de specialist</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Nume complet *</Label>
                  <Input
                    id="name"
                    placeholder="Ion Popescu"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="07XX XXX XXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Oraș *</Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sibiu">Sibiu</SelectItem>
                      <SelectItem value="Cluj-Napoca">Cluj-Napoca</SelectItem>
                      <SelectItem value="București">București</SelectItem>
                      <SelectItem value="Brașov">Brașov</SelectItem>
                      <SelectItem value="Timișoara">Timișoara</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tip activitate</Label>
                  <RadioGroup value={businessType} onValueChange={(v) => setBusinessType(v as any)}>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'individual', label: 'Persoană fizică', desc: 'Fără firmă' },
                        { value: 'pfa', label: 'PFA', desc: 'Persoană fizică autorizată' },
                        { value: 'srl', label: 'SRL', desc: 'Societate comercială' },
                      ].map((opt) => (
                        <label key={opt.value} className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all text-center
                          ${businessType === opt.value ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                          <RadioGroupItem value={opt.value} className="sr-only" />
                          <span className="font-semibold text-sm text-slate-900">{opt.label}</span>
                          <span className="text-xs text-slate-500 mt-1">{opt.desc}</span>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Descriere scurtă</Label>
                  <Textarea
                    id="bio"
                    placeholder="Povestește în câteva propoziții ce faci și de cât timp lucrezi în domeniu..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-slate-400">Opțional, dar ajută clienții să te cunoască</p>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  disabled={!fullName || !city}
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600"
                >
                  Continuă
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* ═══ STEP 2: Categorii & Skills ═══ */}
          {step === 2 && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-500" />
                  Skill-urile tale
                </CardTitle>
                <CardDescription>Alege categoriile și serviciile pe care le oferi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category selection */}
                <div>
                  <Label className="mb-3 block">Alege categoriile *</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.map((cat) => {
                      const Icon = CATEGORY_ICONS[cat.slug] || Sparkles;
                      const gradient = CATEGORY_COLORS[cat.slug] || 'from-slate-500 to-slate-600';
                      const isSelected = selectedCategories.includes(cat.slug);
                      return (
                        <button
                          key={cat.slug}
                          onClick={() => toggleCategory(cat.slug)}
                          className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all
                            ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                          <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-2`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-semibold text-sm text-slate-900">{cat.name}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-orange-500 mt-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Skills per selected category */}
                {selectedCategories.length > 0 && (
                  <div>
                    <Label className="mb-3 block">Alege serviciile specifice</Label>
                    {loadingSkills && (
                      <div className="flex items-center gap-2 text-sm text-slate-500 py-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500" />
                        Se încarcă...
                      </div>
                    )}
                    {selectedCategories.map((catSlug) => {
                      const skills = allSkills[catSlug] || [];
                      const cat = categories.find(c => c.slug === catSlug);
                      if (skills.length === 0) return null;
                      return (
                        <div key={catSlug} className="mb-4">
                          <p className="text-sm font-medium text-slate-700 mb-2">{cat?.name}</p>
                          <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => {
                              const isSelected = selectedSkills.includes(skill.id);
                              return (
                                <button
                                  key={skill.id}
                                  onClick={() => toggleSkill(skill.id)}
                                  className={`px-3 py-1.5 rounded-full text-sm transition-all border
                                    ${isSelected
                                      ? 'bg-orange-500 text-white border-orange-500'
                                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                    }`}
                                >
                                  {skill.name}
                                  {skill.price_unit && (
                                    <span className="text-xs ml-1 opacity-70">/{skill.price_unit}</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Înapoi
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={selectedCategories.length === 0}
                    className="flex-1 h-12 bg-orange-500 hover:bg-orange-600"
                  >
                    Continuă
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ═══ STEP 3: Zona de acoperire ═══ */}
          {step === 3 && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  Zona de acoperire
                </CardTitle>
                <CardDescription>Cât de departe ești dispus să te deplasezi?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Oraș principal: <strong>{city}</strong></Label>
                  <p className="text-sm text-slate-500">Setat în pasul anterior</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="radius">Rază de deplasare</Label>
                  <Select value={serviceRadius} onValueChange={setServiceRadius}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 km - Doar în oraș</SelectItem>
                      <SelectItem value="15">15 km - Oraș + împrejurimi</SelectItem>
                      <SelectItem value="30">30 km - Zonă metropolitană</SelectItem>
                      <SelectItem value="50">50 km - Județ</SelectItem>
                      <SelectItem value="100">100 km - Regional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Summary */}
                <div className="bg-slate-50 rounded-xl p-5 space-y-3">
                  <h4 className="font-semibold text-slate-900">Rezumat profil</h4>
                  <div className="text-sm text-slate-600 space-y-2">
                    <p><strong>Nume:</strong> {fullName}</p>
                    <p><strong>Oraș:</strong> {city} ({serviceRadius} km rază)</p>
                    <p><strong>Tip:</strong> {businessType === 'individual' ? 'Persoană fizică' : businessType.toUpperCase()}</p>
                    <p><strong>Categorii:</strong> {selectedCategories.map(s => categories.find(c => c.slug === s)?.name).join(', ')}</p>
                    {selectedSkills.length > 0 && (
                      <p><strong>Skills:</strong> {selectedSkills.length} selectate</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-12">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Înapoi
                  </Button>
                  <Button
                    onClick={() => setStep(4)}
                    className="flex-1 h-12 bg-orange-500 hover:bg-orange-600"
                  >
                    Continuă
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ═══ STEP 4: Portofoliu & Finalizare ═══ */}
          {step === 4 && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Camera className="w-5 h-5 text-orange-500" />
                  Portofoliu
                </CardTitle>
                <CardDescription>Adaugă poze din lucrări anterioare (opțional, dar recomandat)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                  <p className="text-sm text-teal-700">
                    <strong>Sfat:</strong> Specialiștii cu poze din lucrări primesc de 3x mai multe oferte. 
                    Poți adăuga poze și mai târziu din dashboard.
                  </p>
                </div>

                {/* Photo upload placeholder */}
                <div className="grid grid-cols-3 gap-3">
                  {portfolioPreviews.map((preview, i) => (
                    <div key={i} className="aspect-square rounded-xl bg-slate-100 relative overflow-hidden">
                      <img src={preview} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => {
                          setPortfolioFiles(prev => prev.filter((_, idx) => idx !== i));
                          setPortfolioPreviews(prev => prev.filter((_, idx) => idx !== i));
                        }}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {portfolioPreviews.length < 9 && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors">
                      <Upload className="w-6 h-6 text-slate-400 mb-1" />
                      <span className="text-xs text-slate-400">Adaugă</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            const files = Array.from(e.target.files);
                            const previews = files.map((file) => URL.createObjectURL(file));
                            setPortfolioFiles(prev => [...prev, ...files].slice(0, 9));
                            setPortfolioPreviews(prev => [...prev, ...previews].slice(0, 9));
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-slate-400">Maximum 9 poze. Formate: JPG, PNG. Max 5MB per poză.</p>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(3)} className="flex-1 h-12">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Înapoi
                  </Button>
                  <Button
                    onClick={handleFinish}
                    disabled={saving}
                    className="flex-1 h-12 bg-orange-500 hover:bg-orange-600"
                  >
                    {saving ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Se salvează...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Finalizează profilul
                      </span>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-center text-slate-400">
                  Poți sări peste poze și le adaugi mai târziu din dashboard
                </p>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
