'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Zap, User, Mail, Phone, MapPin, Camera, Save, ArrowLeft,
  Building2, FileText, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';

const CATEGORIES = [
  { id: 'curatenie', name: 'Curățenie' },
  { id: 'montaj-mobila', name: 'Montaj Mobilă' },
  { id: 'reparatii', name: 'Reparații' },
  { id: 'zugravit', name: 'Zugrăvit' },
  { id: 'instalatii', name: 'Instalații' },
  { id: 'gradinarit', name: 'Grădinărit' },
  { id: 'mutari', name: 'Mutări' },
];

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // User data
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  
  // Profile data
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [role, setRole] = useState<'client' | 'provider'>('client');
  
  // Provider data
  const [businessType, setBusinessType] = useState<'individual' | 'pfa' | 'srl'>('individual');
  const [businessName, setBusinessName] = useState('');
  const [cui, setCui] = useState('');
  const [bio, setBio] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [serviceRadius, setServiceRadius] = useState(10);
  const [providerId, setProviderId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }

      setUserId(user.id);
      setEmail(user.email || '');

      // Load profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const profileData = profile as any;
      
      if (profileData) {
        setFullName(profileData.full_name || '');
        setPhone(profileData.phone || '');
        setCity(profileData.location_city || '');
        setRole(profileData.role || 'client');
      }

      // Load provider data if exists
      if (profileData?.role === 'provider') {
        const { data: provider } = await supabase
          .from('providers')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const providerData = provider as any;
        
        if (providerData) {
          setProviderId(providerData.id);
          setBusinessType(providerData.business_type || 'individual');
          setBusinessName(providerData.business_name || '');
          setCui(providerData.cui || '');
          setBio(providerData.bio || '');
          setSelectedCategories(providerData.categories || []);
          setServiceRadius(providerData.service_radius_km || 10);
        }
      }

      setLoading(false);
    };

    loadData();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    try {
      // Update profile - using any to bypass strict typing
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: profileError } = await (supabase as any)
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone,
          location_city: city,
          role: role,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      // If provider, update or create provider record
      if (role === 'provider') {
        const providerUpdateData = {
          user_id: userId,
          business_type: businessType,
          business_name: businessName || null,
          cui: cui || null,
          bio: bio || null,
          categories: selectedCategories,
          service_radius_km: serviceRadius,
          updated_at: new Date().toISOString(),
        };

        if (providerId) {
          // Update existing
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error: providerError } = await (supabase as any)
            .from('providers')
            .update(providerUpdateData)
            .eq('id', providerId);

          if (providerError) throw providerError;
        } else {
          // Create new
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: newProvider, error: providerError } = await (supabase as any)
            .from('providers')
            .insert(providerUpdateData)
            .select()
            .single();

          if (providerError) throw providerError;
          if (newProvider) setProviderId(newProvider.id);
        }
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la salvare');
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">MiniJob</span>
            </Link>
          </div>
          
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {saving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvez...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Salvează
              </span>
            )}
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Setări cont</h1>

        {/* Status Messages */}
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-green-700">Modificările au fost salvate!</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            {role === 'provider' && (
              <TabsTrigger value="provider">Servicii</TabsTrigger>
            )}
            <TabsTrigger value="account">Cont</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informații personale</CardTitle>
                <CardDescription>
                  Datele tale de contact și locație
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-3xl text-orange-600 font-semibold">
                      {fullName?.[0] || email?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Schimbă poza
                    </Button>
                    <p className="text-xs text-slate-500 mt-1">JPG, PNG. Max 2MB</p>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-2">
                  <Label>Tip cont</Label>
                  <Select value={role} onValueChange={(v) => setRole(v as 'client' | 'provider')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client - Caut servicii</SelectItem>
                      <SelectItem value="provider">Prestator - Ofer servicii</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nume complet</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10"
                      placeholder="Ion Popescu"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10"
                      placeholder="07XX XXX XXX"
                    />
                  </div>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city">Oraș</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="pl-10"
                      placeholder="Sibiu"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Provider Tab */}
          {role === 'provider' && (
            <TabsContent value="provider">
              <div className="space-y-6">
                {/* Business Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informații afacere</CardTitle>
                    <CardDescription>
                      Detalii despre forma ta de organizare
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Business Type */}
                    <div className="space-y-2">
                      <Label>Tip organizare</Label>
                      <Select value={businessType} onValueChange={(v) => setBusinessType(v as 'individual' | 'pfa' | 'srl')}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Persoană fizică</SelectItem>
                          <SelectItem value="pfa">PFA</SelectItem>
                          <SelectItem value="srl">SRL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Business Name (for PFA/SRL) */}
                    {businessType !== 'individual' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="businessName">Denumire firmă</Label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                              id="businessName"
                              value={businessName}
                              onChange={(e) => setBusinessName(e.target.value)}
                              className="pl-10"
                              placeholder="SC Exemplu SRL"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cui">CUI / CIF</Label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                              id="cui"
                              value={cui}
                              onChange={(e) => setCui(e.target.value)}
                              className="pl-10"
                              placeholder="RO12345678"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Bio */}
                    <div className="space-y-2">
                      <Label htmlFor="bio">Descriere</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Descrie serviciile tale, experiența și ce te diferențiază..."
                        rows={4}
                      />
                      <p className="text-xs text-slate-500">{bio.length}/500 caractere</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle>Categorii servicii</CardTitle>
                    <CardDescription>
                      Selectează categoriile în care oferi servicii
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <Badge
                          key={cat.id}
                          variant={selectedCategories.includes(cat.id) ? 'default' : 'outline'}
                          className={`cursor-pointer text-sm py-2 px-4 ${
                            selectedCategories.includes(cat.id)
                              ? 'bg-orange-500 hover:bg-orange-600'
                              : 'hover:bg-orange-50 hover:border-orange-300'
                          }`}
                          onClick={() => toggleCategory(cat.id)}
                        >
                          {cat.name}
                        </Badge>
                      ))}
                    </div>
                    {selectedCategories.length === 0 && (
                      <p className="text-sm text-slate-500 mt-3">
                        Selectează cel puțin o categorie
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Service Area */}
                <Card>
                  <CardHeader>
                    <CardTitle>Zonă de acoperire</CardTitle>
                    <CardDescription>
                      Raza în care oferi servicii
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Rază: {serviceRadius} km</span>
                        <span className="text-sm text-slate-500">de la {city || 'locația ta'}</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        step="5"
                        value={serviceRadius}
                        onChange={(e) => setServiceRadius(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>5 km</span>
                        <span>50 km</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Account Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Setări cont</CardTitle>
                <CardDescription>
                  Email și securitate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="pl-10 bg-slate-50"
                    />
                  </div>
                  <p className="text-xs text-slate-500">Email-ul nu poate fi schimbat</p>
                </div>

                {/* Password Change */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-slate-900 mb-2">Schimbă parola</h4>
                  <p className="text-sm text-slate-500 mb-4">
                    Vei primi un email cu link pentru resetare
                  </p>
                  <Button variant="outline">
                    Trimite link resetare
                  </Button>
                </div>

                {/* Danger Zone */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-red-600 mb-2">Zonă periculoasă</h4>
                  <p className="text-sm text-slate-500 mb-4">
                    Ștergerea contului este permanentă și nu poate fi anulată
                  </p>
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    Șterge contul
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
