'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Zap, ArrowLeft, Upload, X, Save, Trash2,
  Home, Hammer, Car, Laptop, PawPrint, Baby
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClient, createStorageClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { generateSlug } from '@/lib/utils';
import { UrgencyLevel, Category } from '@/types/database';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  casa: <Home className="w-5 h-5" />,
  constructii: <Hammer className="w-5 h-5" />,
  auto: <Car className="w-5 h-5" />,
  tech: <Laptop className="w-5 h-5" />,
  pets: <PawPrint className="w-5 h-5" />,
  kids: <Baby className="w-5 h-5" />,
  altceva: <Zap className="w-5 h-5" />,
};

function EditProjectContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [newPhotoFiles, setNewPhotoFiles] = useState<File[]>([]);
  const [newPhotoPreviews, setNewPhotoPreviews] = useState<string[]>([]);
  const [budgetType, setBudgetType] = useState<'budget' | 'offers'>('offers');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [city, setCity] = useState('Sibiu');
  const [address, setAddress] = useState('');
  const [deadline, setDeadline] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('normal');
  const [status, setStatus] = useState('open');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/auth/login';
        return;
      }
      setUser(user);

      // Load categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .order('sort_order');
      if (categoriesData) setCategories(categoriesData);

      // Load project
      if (!projectId) {
        setLoading(false);
        return;
      }

      const { data: project, error } = await (supabase as any)
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error || !project) {
        toast.error('Proiectul nu a fost găsit.');
        setLoading(false);
        return;
      }

      // Check ownership
      if (project.client_id !== user.id) {
        toast.error('Nu ai permisiunea să editezi acest proiect.');
        window.location.href = '/my-projects';
        return;
      }

      // Fill form
      setTitle(project.title || '');
      setDescription(project.description || '');
      setCategoryId(project.category_id || '');
      setCity(project.location_city || 'Sibiu');
      setAddress(project.location_address || '');
      setDeadline(project.deadline || '');
      setUrgency(project.urgency || 'normal');
      setStatus(project.status || 'open');

      // Budget
      if (project.budget_min || project.budget_max) {
        setBudgetType('budget');
        setBudgetMin(project.budget_min?.toString() || '');
        setBudgetMax(project.budget_max?.toString() || '');
      } else {
        setBudgetType('offers');
      }

      // Existing photos - filter out invalid ones
      const validPhotos = (project.photos || []).filter((url: string) =>
        url && !url.includes('picsum.photos') && !url.includes('placeholder') && url.startsWith('http')
      );
      setExistingPhotos(validPhotos);

      setLoading(false);
    };

    init();
  }, [projectId]);

  const handleNewPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const previews = files.map(f => URL.createObjectURL(f));
      const maxNew = 5 - existingPhotos.length;
      setNewPhotoFiles(prev => [...prev, ...files].slice(0, maxNew));
      setNewPhotoPreviews(prev => [...prev, ...previews].slice(0, maxNew));
    }
  };

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewPhoto = (index: number) => {
    setNewPhotoFiles(prev => prev.filter((_, i) => i !== index));
    setNewPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!title || !description) {
      toast.error('Titlu și descriere sunt obligatorii.');
      return;
    }

    setSaving(true);
    const supabase = createClient();

    // Upload new photos (using service role key to bypass RLS)
    let uploadedNewUrls: string[] = [];
    if (newPhotoFiles.length > 0) {
      const storageClient = createStorageClient();
      for (let i = 0; i < newPhotoFiles.length; i++) {
        const file = newPhotoFiles[i];
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `projects/${user.id}/${Date.now()}_${i}.${ext}`;
        const { data: uploadData, error: uploadError } = await storageClient.storage
          .from('portfolio')
          .upload(path, file, { cacheControl: '3600', upsert: false });
        if (uploadData && !uploadError) {
          const { data: { publicUrl } } = storageClient.storage.from('portfolio').getPublicUrl(path);
          uploadedNewUrls.push(publicUrl);
        }
      }
    }

    const allPhotos = [...existingPhotos, ...uploadedNewUrls];
    const newSlug = generateSlug(title);

    const { error } = await (supabase as any)
      .from('projects')
      .update({
        title,
        description,
        photos: allPhotos,
        budget_min: budgetType === 'budget' && budgetMin ? parseInt(budgetMin) : null,
        budget_max: budgetType === 'budget' && budgetMax ? parseInt(budgetMax) : null,
        location_city: city,
        location_address: address || null,
        deadline: deadline || null,
        urgency,
      })
      .eq('id', projectId);

    if (error) {
      toast.error(`Eroare: ${error.message}`);
    } else {
      toast.success('Proiect actualizat!');
      // Redirect to the updated project
      window.location.href = `/project?id=${projectId}&p=${newSlug}`;
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm('Ești sigur că vrei să ștergi acest proiect? Acțiunea nu poate fi anulată.')) return;

    const supabase = createClient();
    const { error } = await (supabase as any)
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      toast.error(`Eroare la ștergere: ${error.message}`);
    } else {
      toast.success('Proiect șters.');
      window.location.href = '/my-projects';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!projectId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Proiect negăsit</h1>
          <p className="text-slate-600">ID-ul proiectului lipsește.</p>
        </div>
      </div>
    );
  }

  const totalPhotos = existingPhotos.length + newPhotoFiles.length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">MiniJob</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/my-projects">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Înapoi la proiecte
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Editează Proiectul</h1>
            <p className="text-slate-600">Actualizează detaliile proiectului tău</p>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Detalii proiect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titlu *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descriere *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Photos */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Fotografii ({totalPhotos}/5)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {/* Existing photos */}
                  {existingPhotos.map((url, i) => (
                    <div key={`existing-${i}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeExistingPhoto(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {/* New photo previews */}
                  {newPhotoPreviews.map((url, i) => (
                    <div key={`new-${i}`} className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-green-300">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeNewPhoto(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-[10px] text-center py-0.5">Nouă</span>
                    </div>
                  ))}
                  {/* Upload button */}
                  {totalPhotos < 5 && (
                    <label className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors">
                      <Upload className="w-5 h-5 text-slate-400" />
                      <span className="text-xs text-slate-400 mt-1">Adaugă</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleNewPhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Budget */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Buget</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBudgetType('offers')}
                    className={`p-3 rounded-xl border-2 text-left transition-all
                      ${budgetType === 'offers'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <p className="font-medium text-slate-900 text-sm">Aștept oferte</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBudgetType('budget')}
                    className={`p-3 rounded-xl border-2 text-left transition-all
                      ${budgetType === 'budget'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <p className="font-medium text-slate-900 text-sm">Am un buget</p>
                  </button>
                </div>
                {budgetType === 'budget' && (
                  <div className="flex items-center gap-3">
                    <Input type="number" placeholder="Min" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} />
                    <span className="text-slate-400">-</span>
                    <Input type="number" placeholder="Max" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location & Urgency */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Locație și termen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Oraș</Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger>
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
                  <Label>Adresă (opțional)</Label>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Deadline (opțional)</Label>
                  <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="space-y-2">
                  <Label>Urgență</Label>
                  <RadioGroup value={urgency} onValueChange={(v) => setUrgency(v as UrgencyLevel)}>
                    <div className="flex gap-3">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="urgent" id="edit-urgent" />
                        <Label htmlFor="edit-urgent" className="cursor-pointer text-sm">🔥 Urgent</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="normal" id="edit-normal" />
                        <Label htmlFor="edit-normal" className="cursor-pointer text-sm">📅 Normal</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="flexible" id="edit-flexible" />
                        <Label htmlFor="edit-flexible" className="cursor-pointer text-sm">🕐 Flexibil</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Șterge
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !title || !description}
                className="flex-1 bg-orange-500 hover:bg-orange-600 gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Se salvează...' : 'Salvează modificările'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditProjectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    }>
      <EditProjectContent />
    </Suspense>
  );
}
