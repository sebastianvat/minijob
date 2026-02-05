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
};

// Mock categories until we run migration
const MOCK_CATEGORIES: Category[] = [
  { id: '1', slug: 'casa', name: 'Casă', description: 'Curățenie, gătit, organizare, menaj', icon: 'Home', price_type: 'hourly', price_min: 40, price_max: 100, duration_min: null, duration_max: null, instant_booking: true, active: true, sort_order: 1, created_at: '' },
  { id: '2', slug: 'constructii', name: 'Construcții', description: 'Zugrăvit, parchet, renovări, reparații', icon: 'Hammer', price_type: 'custom', price_min: 100, price_max: 10000, duration_min: null, duration_max: null, instant_booking: false, active: true, sort_order: 2, created_at: '' },
  { id: '3', slug: 'auto', name: 'Auto', description: 'Detailing, polish, mecanică ușoară', icon: 'Car', price_type: 'fixed', price_min: 100, price_max: 1000, duration_min: null, duration_max: null, instant_booking: true, active: true, sort_order: 3, created_at: '' },
  { id: '4', slug: 'tech', name: 'Tech Jobs', description: 'Social media, data entry, tech support', icon: 'Laptop', price_type: 'hourly', price_min: 50, price_max: 200, duration_min: null, duration_max: null, instant_booking: true, active: true, sort_order: 4, created_at: '' },
  { id: '5', slug: 'pets', name: 'Pet Care', description: 'Plimbat câini, pet sitting', icon: 'PawPrint', price_type: 'hourly', price_min: 30, price_max: 80, duration_min: null, duration_max: null, instant_booking: true, active: true, sort_order: 5, created_at: '' },
  { id: '6', slug: 'kids', name: 'Kids & Learning', description: 'Bonă, meditații, skill-uri noi', icon: 'Baby', price_type: 'hourly', price_min: 50, price_max: 150, duration_min: null, duration_max: null, instant_booking: true, active: true, sort_order: 6, created_at: '' },
];

// Mock skills per category
const MOCK_SKILLS: Record<string, Skill[]> = {
  'casa': [
    { id: 's1', category_id: '1', slug: 'curatenie-generala', name: 'Curățenie Generală', description: 'Curățenie standard', icon: 'Sparkles', price_unit: 'ora', price_min: 40, price_max: 80, active: true, sort_order: 1, created_at: '' },
    { id: 's2', category_id: '1', slug: 'curatenie-dupa-constructor', name: 'Curățenie după Constructor', description: 'Curățenie intensivă', icon: 'Sparkles', price_unit: 'ora', price_min: 80, price_max: 120, active: true, sort_order: 2, created_at: '' },
    { id: 's3', category_id: '1', slug: 'gatit', name: 'Gătit', description: 'Preparare mese', icon: 'ChefHat', price_unit: 'ora', price_min: 60, price_max: 120, active: true, sort_order: 3, created_at: '' },
  ],
  'constructii': [
    { id: 's4', category_id: '2', slug: 'zugravit', name: 'Zugrăvit', description: 'Zugrăvit interior/exterior', icon: 'PaintBucket', price_unit: 'mp', price_min: 15, price_max: 40, active: true, sort_order: 1, created_at: '' },
    { id: 's5', category_id: '2', slug: 'parchet', name: 'Montaj Parchet', description: 'Instalare parchet', icon: 'Layers', price_unit: 'mp', price_min: 25, price_max: 60, active: true, sort_order: 2, created_at: '' },
    { id: 's6', category_id: '2', slug: 'montaj-mobila', name: 'Montaj Mobilă', description: 'Asamblare mobilier', icon: 'Package', price_unit: 'ora', price_min: 60, price_max: 120, active: true, sort_order: 3, created_at: '' },
    { id: 's7', category_id: '2', slug: 'instalatii-sanitare', name: 'Instalații Sanitare', description: 'Montaj/reparații', icon: 'Droplet', price_unit: 'ora', price_min: 80, price_max: 150, active: true, sort_order: 4, created_at: '' },
  ],
  'auto': [
    { id: 's8', category_id: '3', slug: 'detailing', name: 'Detailing Auto', description: 'Curățare profesională', icon: 'CarFront', price_unit: 'bucata', price_min: 150, price_max: 500, active: true, sort_order: 1, created_at: '' },
    { id: 's9', category_id: '3', slug: 'polish', name: 'Polish Auto', description: 'Polish și ceruire', icon: 'Sparkle', price_unit: 'bucata', price_min: 200, price_max: 600, active: true, sort_order: 2, created_at: '' },
  ],
  'tech': [
    { id: 's10', category_id: '4', slug: 'social-media', name: 'Social Media', description: 'Gestionare conturi', icon: 'MessageCircle', price_unit: 'ora', price_min: 50, price_max: 150, active: true, sort_order: 1, created_at: '' },
    { id: 's11', category_id: '4', slug: 'tech-support', name: 'Tech Support', description: 'Ajutor tehnic', icon: 'Monitor', price_unit: 'ora', price_min: 60, price_max: 120, active: true, sort_order: 2, created_at: '' },
  ],
  'pets': [
    { id: 's12', category_id: '5', slug: 'plimbat-caini', name: 'Plimbat Câini', description: 'Plimbări zilnice', icon: 'Dog', price_unit: 'ora', price_min: 30, price_max: 60, active: true, sort_order: 1, created_at: '' },
    { id: 's13', category_id: '5', slug: 'pet-sitting', name: 'Pet Sitting', description: 'Îngrijire la domiciliu', icon: 'Home', price_unit: 'zi', price_min: 80, price_max: 200, active: true, sort_order: 2, created_at: '' },
  ],
  'kids': [
    { id: 's14', category_id: '6', slug: 'bona', name: 'Bonă', description: 'Supraveghere copii', icon: 'Baby', price_unit: 'ora', price_min: 40, price_max: 80, active: true, sort_order: 1, created_at: '' },
    { id: 's15', category_id: '6', slug: 'meditatii-matematica', name: 'Meditații Matematică', description: 'Pregătire matematică', icon: 'Calculator', price_unit: 'ora', price_min: 60, price_max: 150, active: true, sort_order: 2, created_at: '' },
  ],
};

export default function PostProjectPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [city, setCity] = useState('Sibiu');
  const [address, setAddress] = useState('');
  const [deadline, setDeadline] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('normal');

  // Get skills for selected category
  const availableSkills = selectedCategory ? MOCK_SKILLS[selectedCategory] || [] : [];
  const selectedCategoryData = MOCK_CATEGORIES.find(c => c.slug === selectedCategory);
  const selectedSkillData = availableSkills.find(s => s.slug === selectedSkill);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        window.location.href = '/auth/login?redirect=/post-project';
        return;
      }
      
      setUser(user);
      setLoading(false);
    };
    
    checkUser();
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In production, upload to Cloudflare R2
    // For now, just simulate with placeholder URLs
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files).map((_, i) => 
        `https://picsum.photos/400/300?random=${Date.now() + i}`
      );
      setPhotos([...photos, ...newPhotos].slice(0, 5)); // Max 5 photos
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !title || !description || !city) {
      toast.error('Te rugăm să completezi toate câmpurile obligatorii.');
      return;
    }

    setSubmitting(true);

    const supabase = createClient();

    // Get category ID from database
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', selectedCategory)
      .single();

    if (!categoryData) {
      toast.error('Categoria selectată nu a fost găsită.');
      setSubmitting(false);
      return;
    }

    // Get skill ID if selected
    let skillId = null;
    if (selectedSkill) {
      const { data: skillData } = await supabase
        .from('skills')
        .select('id')
        .eq('slug', selectedSkill)
        .single();
      
      if (skillData) {
        skillId = skillData.id;
      }
    }

    // Create project
    const { error } = await supabase
      .from('projects')
      .insert({
        client_id: user.id,
        category_id: categoryData.id,
        skill_id: skillId,
        title: title,
        description: description,
        photos: photos,
        budget_min: budgetMin ? parseInt(budgetMin) : null,
        budget_max: budgetMax ? parseInt(budgetMax) : null,
        location_city: city,
        location_address: address || null,
        deadline: deadline || null,
        urgency: urgency,
        status: 'open',
      });

    if (error) {
      toast.error(`Eroare la publicare: ${error.message}`);
      console.error('Project creation error:', error);
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setSubmitting(false);
    toast.success('Proiect publicat cu succes! Vei primi oferte în curând.');
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Postează un Proiect</h1>
            <p className="text-slate-600">Descrie ce ai nevoie și primește oferte de la specialiști</p>
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
                  {MOCK_CATEGORIES.map((cat) => (
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
                {selectedCategory && availableSkills.length > 0 && (
                  <div className="mt-6">
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">
                      Specifică serviciul (opțional)
                    </Label>
                    <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                      <SelectTrigger>
                        <SelectValue placeholder="Alege un serviciu specific..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSkills.map((skill) => (
                          <SelectItem key={skill.slug} value={skill.slug}>
                            {skill.name} ({skill.price_min}-{skill.price_max} lei/{skill.price_unit})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

                {/* Budget */}
                <div className="space-y-2">
                  <Label>Buget estimat (RON)</Label>
                  <div className="flex items-center gap-3">
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
                  {selectedSkillData && (
                    <p className="text-xs text-teal-600">
                      💡 Prețul mediu pentru {selectedSkillData.name}: {selectedSkillData.price_min}-{selectedSkillData.price_max} lei/{selectedSkillData.price_unit}
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
                    {budgetMin && budgetMax && <p><strong>Buget:</strong> {budgetMin} - {budgetMax} RON</p>}
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
