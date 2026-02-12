'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, ArrowLeft, Upload, X, MapPin, Calendar, 
  DollarSign, Clock, CheckCircle2, AlertCircle,
  Home, Hammer, Car, Laptop, PawPrint, Baby
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { UrgencyLevel, Category, Skill } from '@/types/database';

// Category icons mapping
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  casa: <Home className="w-6 h-6" />,
  constructii: <Hammer className="w-6 h-6" />,
  auto: <Car className="w-6 h-6" />,
  tech: <Laptop className="w-6 h-6" />,
  pets: <PawPrint className="w-6 h-6" />,
  kids: <Baby className="w-6 h-6" />,
  altceva: <Zap className="w-6 h-6" />,
};

// "Altceva" category for custom projects (always available as fallback)
const ALTCEVA_CATEGORY: Category = {
  id: 'altceva', slug: 'altceva', name: 'Altceva', description: 'Ai nevoie de altceva? Spune-ne!',
  icon: 'Zap', price_type: 'custom', price_min: null, price_max: null,
  duration_min: null, duration_max: null, instant_booking: false, active: true, sort_order: 99, created_at: ''
};

export default function PostProjectPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  
  // Data from Supabase
  const [categories, setCategories] = useState<Category[]>([]);
  const [skillsByCategory, setSkillsByCategory] = useState<Record<string, Skill[]>>({});
  const [loadingSkills, setLoadingSkills] = useState(false);

  // Form state
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [budgetType, setBudgetType] = useState<'budget' | 'offers'>('offers'); // default: wait for offers
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [city, setCity] = useState('Sibiu');
  const [address, setAddress] = useState('');
  const [deadline, setDeadline] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('normal');

  // Get skills for selected category
  const availableSkills = selectedCategory ? skillsByCategory[selectedCategory] || [] : [];
  const allCategories = [...categories, ...(categories.some(c => c.slug === 'altceva') ? [] : [ALTCEVA_CATEGORY])];
  const selectedCategoryData = allCategories.find(c => c.slug === selectedCategory);
  const selectedSkillData = availableSkills.find(s => s.slug === selectedSkill);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      
      // Check user auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/auth/login?redirect=/post-project';
        return;
      }
      setUser(user);

      // Load categories from Supabase
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .order('sort_order');
      
      if (categoriesData && categoriesData.length > 0) {
        setCategories(categoriesData);
      }
      
      setLoading(false);
    };
    
    init();
  }, []);

  // Load skills when category changes
  useEffect(() => {
    if (!selectedCategory || selectedCategory === 'altceva') return;
    if (skillsByCategory[selectedCategory]) return; // Already loaded

    const loadSkills = async () => {
      setLoadingSkills(true);
      const supabase = createClient();
      
      // Find category ID
      const cat = allCategories.find(c => c.slug === selectedCategory);
      if (!cat) { setLoadingSkills(false); return; }
      
      const { data: skillsData } = await supabase
        .from('skills')
        .select('*')
        .eq('category_id', cat.id)
        .eq('active', true)
        .order('sort_order');
      
      if (skillsData) {
        setSkillsByCategory(prev => ({ ...prev, [selectedCategory]: skillsData }));
      }
      setLoadingSkills(false);
    };

    loadSkills();
  }, [selectedCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const previews = files.map(f => URL.createObjectURL(f));
      setPhotoFiles(prev => [...prev, ...files].slice(0, 5));
      setPhotos(prev => [...prev, ...previews].slice(0, 5));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setPhotoFiles(photoFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !title || !description || !city) {
      toast.error('Te rugăm să completezi toate câmpurile obligatorii.');
      return;
    }

    setSubmitting(true);

    const supabase = createClient();

    // Get category ID from database
    console.log('Looking for category:', selectedCategory);
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', selectedCategory)
      .single() as { data: { id: string } | null; error: any };

    console.log('Category lookup result:', { categoryData, categoryError });

    if (!categoryData) {
      toast.error('Categoria selectată nu a fost găsită în baza de date. Te rugăm să reîncerci.');
      console.error('Category not found:', selectedCategory, categoryError);
      setSubmitting(false);
      return;
    }

    // Get skill ID if selected
    let skillId: string | null = null;
    if (selectedSkill) {
      const { data: skillData } = await supabase
        .from('skills')
        .select('id')
        .eq('slug', selectedSkill)
        .single() as { data: { id: string } | null };
      
      if (skillData) {
        skillId = skillData.id;
      }
    }

    // Upload photos to Supabase Storage
    let uploadedPhotoUrls: string[] = [];
    // #region agent log
    fetch('http://localhost:7242/ingest/634abb5f-2f5a-4519-b060-6a93159490ba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'post-project/page.tsx:upload-start',message:'Photo upload starting',data:{photoFilesCount:photoFiles.length,fileNames:photoFiles.map(f=>f.name),fileSizes:photoFiles.map(f=>f.size)},timestamp:Date.now(),hypothesisId:'H1-upload'})}).catch(()=>{});
    // #endregion
    if (photoFiles.length > 0) {
      for (let i = 0; i < photoFiles.length; i++) {
        const file = photoFiles[i];
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `projects/${user.id}/${Date.now()}_${i}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(path, file, { cacheControl: '3600', upsert: false });
        // #region agent log
        fetch('http://localhost:7242/ingest/634abb5f-2f5a-4519-b060-6a93159490ba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'post-project/page.tsx:upload-result',message:'Single file upload result',data:{index:i,path,uploadData,uploadError:uploadError?.message||null,hasData:!!uploadData},timestamp:Date.now(),hypothesisId:'H2-bucket'})}).catch(()=>{});
        // #endregion
        if (uploadData && !uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(path);
          // #region agent log
          fetch('http://localhost:7242/ingest/634abb5f-2f5a-4519-b060-6a93159490ba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'post-project/page.tsx:public-url',message:'Got public URL',data:{index:i,publicUrl},timestamp:Date.now(),hypothesisId:'H3-url'})}).catch(()=>{});
          // #endregion
          uploadedPhotoUrls.push(publicUrl);
        }
      }
    }
    // #region agent log
    fetch('http://localhost:7242/ingest/634abb5f-2f5a-4519-b060-6a93159490ba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'post-project/page.tsx:upload-done',message:'All uploads done',data:{uploadedPhotoUrls,totalUploaded:uploadedPhotoUrls.length},timestamp:Date.now(),hypothesisId:'H1-upload'})}).catch(()=>{});

    // Create project
    const { error } = await (supabase as any)
      .from('projects')
      .insert({
        client_id: user.id,
        category_id: categoryData.id,
        skill_id: skillId,
        title: title,
        description: description,
        photos: uploadedPhotoUrls,
        budget_min: budgetType === 'budget' && budgetMin ? parseInt(budgetMin) : null,
        budget_max: budgetType === 'budget' && budgetMax ? parseInt(budgetMax) : null,
        location_city: city,
        location_address: address || null,
        deadline: deadline || null,
        urgency: urgency,
        status: 'open',
      });

    if (error) {
      toast.error(`Eroare la publicare: ${error.message}`);
      console.error('Project creation error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      setSubmitting(false);
      return;
    }

    console.log('Project created successfully!');
    setSuccess(true);
    setSubmitting(false);
    toast.success('Proiect publicat cu succes!');
    
    // Redirect to my-projects after 2 seconds
    setTimeout(() => {
      window.location.href = '/my-projects';
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">MiniJob</span>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Proiect Publicat!</h1>
            <p className="text-slate-600 mb-8">
              Proiectul tău a fost publicat cu succes. Specialiștii din categoria{' '}
              <strong>{selectedCategoryData?.name}</strong> vor putea vedea și face oferte.
            </p>
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-8">
              <p className="text-teal-700 text-sm">
                💡 <strong>Sfat:</strong> În medie primești 3-5 oferte în primele 24 de ore.
                Verifică-ți email-ul și notificările!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="outline">
                <Link href="/my-projects">Vezi proiectele mele</Link>
              </Button>
              <Button asChild className="bg-orange-500 hover:bg-orange-600">
                <Link href="/">Înapoi acasă</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">MiniJob</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Înapoi
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Postează un Proiect</h1>
            <p className="text-sm md:text-base text-slate-600">Descrie ce ai nevoie și primește oferte de la specialiști</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  ${s <= step 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-slate-200 text-slate-500'}`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-1 mx-1 rounded ${s < step ? 'bg-orange-500' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Category Selection */}
          {step === 1 && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">1. Alege categoria</CardTitle>
                <CardDescription>Ce tip de serviciu cauți?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {allCategories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setSelectedSkill(''); // Reset skill when category changes
                      }}
                      className={`p-4 rounded-xl border-2 text-left transition-all
                        ${selectedCategory === cat.slug
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                    >
                      <div className={`mb-2 ${selectedCategory === cat.slug ? 'text-orange-500' : 'text-slate-600'}`}>
                        {CATEGORY_ICONS[cat.slug]}
                      </div>
                      <p className="font-medium text-slate-900">{cat.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{cat.description}</p>
                    </button>
                  ))}
                </div>

                {/* Skill selection */}
                {selectedCategory && selectedCategory !== 'altceva' && (
                  <div className="mt-6">
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">
                      Specifică serviciul (opțional)
                    </Label>
                    {loadingSkills ? (
                      <div className="flex items-center gap-2 text-sm text-slate-500 py-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                        Se încarcă serviciile...
                      </div>
                    ) : availableSkills.length > 0 ? (
                      <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                        <SelectTrigger>
                          <SelectValue placeholder="Alege un serviciu specific..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSkills.map((skill) => (
                            <SelectItem key={skill.slug} value={skill.slug}>
                              {skill.name}
                              {skill.price_unit ? ` (per ${skill.price_unit})` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-slate-500 py-2">
                        Nu sunt servicii specifice pentru această categorie. Descrie în detaliu ce ai nevoie în pasul următor.
                      </p>
                    )}
                  </div>
                )}

                <Button 
                  onClick={() => setStep(2)}
                  disabled={!selectedCategory}
                  className="w-full mt-6 bg-orange-500 hover:bg-orange-600"
                >
                  Continuă
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Project Details */}
          {step === 2 && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">2. Detalii proiect</CardTitle>
                <CardDescription>Descrie exact ce ai nevoie</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Titlu proiect *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Zugrăvit 3 camere apartament"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-12"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descriere detaliată *</Label>
                  <Textarea
                    id="description"
                    placeholder="Descrie în detaliu ce ai nevoie: dimensiuni, materiale preferate, cerințe speciale..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                  />
                </div>

                {/* Photos */}
                <div className="space-y-2">
                  <Label>Fotografii (opțional, max 5)</Label>
                  <div className="flex flex-wrap gap-3">
                    {photos.map((photo, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                        <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removePhoto(i)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {photos.length < 5 && (
                      <label className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors">
                        <Upload className="w-5 h-5 text-slate-400" />
                        <span className="text-xs text-slate-400 mt-1">Adaugă</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Pozele ajută specialiștii să înțeleagă mai bine proiectul
                  </p>
                </div>

                {/* Budget toggle */}
                <div className="space-y-3">
                  <Label>Buget</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setBudgetType('offers')}
                      className={`p-4 rounded-xl border-2 text-left transition-all
                        ${budgetType === 'offers'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      <p className="font-medium text-slate-900 text-sm">Aștept oferte</p>
                      <p className="text-xs text-slate-500 mt-1">Specialiștii propun prețul lor</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBudgetType('budget')}
                      className={`p-4 rounded-xl border-2 text-left transition-all
                        ${budgetType === 'budget'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      <p className="font-medium text-slate-900 text-sm">Am un buget</p>
                      <p className="text-xs text-slate-500 mt-1">Setez un interval de preț</p>
                    </button>
                  </div>
                  {budgetType === 'budget' && (
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={budgetMin}
                          onChange={(e) => setBudgetMin(e.target.value)}
                        />
                      </div>
                      <span className="text-slate-400">-</span>
                      <div className="flex-1">
                        <Input
                          type="number"
                          placeholder="Max"
                          value={budgetMax}
                          onChange={(e) => setBudgetMax(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  {selectedSkillData && selectedSkillData.price_min && selectedSkillData.price_max && (
                    <p className="text-xs text-teal-600">
                      Prețul mediu pentru {selectedSkillData.name}: {selectedSkillData.price_min}-{selectedSkillData.price_max} lei/{selectedSkillData.price_unit}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Înapoi
                  </Button>
                  <Button 
                    onClick={() => setStep(3)}
                    disabled={!title || !description}
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                  >
                    Continuă
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Location & Deadline */}
          {step === 3 && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">3. Locație și termen</CardTitle>
                <CardDescription>Unde și când ai nevoie de serviciu?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* City */}
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

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Adresă (opțional)</Label>
                  <Input
                    id="address"
                    placeholder="Strada, număr, bloc, apartament"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <p className="text-xs text-slate-500">
                    Poți adăuga adresa exactă după ce accepți o ofertă
                  </p>
                </div>

                {/* Deadline */}
                <div className="space-y-2">
                  <Label htmlFor="deadline">Când ai nevoie? (opțional)</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Urgency */}
                <div className="space-y-3">
                  <Label>Urgență</Label>
                  <RadioGroup value={urgency} onValueChange={(v) => setUrgency(v as UrgencyLevel)}>
                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <Label htmlFor="urgent" className="flex items-center gap-2 cursor-pointer">
                        <span className="text-lg">🔥</span>
                        <div>
                          <span className="font-medium">Urgent</span>
                          <p className="text-xs text-slate-500">Cât mai repede posibil</p>
                        </div>
                      </Label>
                      <RadioGroupItem value="urgent" id="urgent" />
                    </div>
                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <Label htmlFor="normal" className="flex items-center gap-2 cursor-pointer">
                        <span className="text-lg">📅</span>
                        <div>
                          <span className="font-medium">Normal</span>
                          <p className="text-xs text-slate-500">În săptămânile următoare</p>
                        </div>
                      </Label>
                      <RadioGroupItem value="normal" id="normal" />
                    </div>
                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <Label htmlFor="flexible" className="flex items-center gap-2 cursor-pointer">
                        <span className="text-lg">🕐</span>
                        <div>
                          <span className="font-medium">Flexibil</span>
                          <p className="text-xs text-slate-500">Nu mă grăbesc</p>
                        </div>
                      </Label>
                      <RadioGroupItem value="flexible" id="flexible" />
                    </div>
                  </RadioGroup>
                </div>

                {/* Summary */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                  <h4 className="font-medium text-slate-900">Sumar proiect</h4>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p><strong>Categorie:</strong> {selectedCategoryData?.name}</p>
                    {selectedSkillData && <p><strong>Serviciu:</strong> {selectedSkillData.name}</p>}
                    <p><strong>Titlu:</strong> {title}</p>
                    <p><strong>Locație:</strong> {city}</p>
                    <p><strong>Buget:</strong> {budgetType === 'budget' && budgetMin && budgetMax ? `${budgetMin} - ${budgetMax} RON` : 'Aștept oferte'}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(2)}
                    className="flex-1"
                  >
                    Înapoi
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={submitting || !city}
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                  >
                    {submitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Se publică...
                      </span>
                    ) : (
                      'Publică Proiectul'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Box */}
          <div className="mt-6 bg-teal-50 border border-teal-200 rounded-xl p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-teal-700">
                <p className="font-medium mb-1">Cum funcționează?</p>
                <ol className="list-decimal list-inside space-y-1 text-teal-600">
                  <li>Postezi proiectul cu detaliile necesare</li>
                  <li>Specialiștii îl văd și fac oferte</li>
                  <li>Compari ofertele (preț, rating, portofoliu)</li>
                  <li>Alegi oferta care ți se potrivește</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
