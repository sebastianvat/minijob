'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { 
  Zap, MapPin, Calendar, Clock, ArrowLeft,
  Home, Hammer, Car, Laptop, PawPrint, Baby, Star,
  CheckCircle2, Send, User, MessageCircle, Briefcase,
  Image as ImageIcon, ZoomIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { 
  Project, Category, Profile, ProjectOffer, Provider,
  URGENCY_LABELS, SKILL_LEVEL_LABELS, SKILL_LEVEL_COLORS, SkillLevel
} from '@/types/database';

interface ProjectDetailProps {
  projectId?: string;
  projectSlug?: string;
}

// Category icons mapping
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  casa: <Home className="w-5 h-5" />,
  constructii: <Hammer className="w-5 h-5" />,
  auto: <Car className="w-5 h-5" />,
  tech: <Laptop className="w-5 h-5" />,
  pets: <PawPrint className="w-5 h-5" />,
  kids: <Baby className="w-5 h-5" />,
};

interface ProjectWithDetails extends Project {
  category: Category;
  client: Profile;
}

interface OfferWithProvider extends ProjectOffer {
  provider: Provider & {
    profile: Profile;
  };
  provider_skill?: {
    rating: number;
    reviews_count: number;
    jobs_completed: number;
    level: SkillLevel;
    skill_score: number;
  };
}

export function ProjectDetail({ projectId, projectSlug }: ProjectDetailProps = {}) {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  
  // Get ID from props, params, or search params
  const id = projectId || params?.id || searchParams?.get('id') || '';
  
  const [project, setProject] = useState<ProjectWithDetails | null>(null);
  const [offers, setOffers] = useState<OfferWithProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isProvider, setIsProvider] = useState(false);
  const [hasOffered, setHasOffered] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Offer form state
  const [offerPrice, setOfferPrice] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [offerDuration, setOfferDuration] = useState('');
  const [offerAvailableFrom, setOfferAvailableFrom] = useState('');
  const [includesMaterials, setIncludesMaterials] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();

      // Check user
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Get user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setUserProfile(profileData);

        // Check if user is a provider
        const { data: providerData } = await supabase
          .from('providers')
          .select('id')
          .eq('user_id', user.id)
          .single() as { data: { id: string } | null };
        
        setIsProvider(!!providerData);

        // Check if user already made an offer (will check after project loads)
        if (providerData && id) {
          const { data: existingOffer } = await (supabase as any)
            .from('project_offers')
            .select('id')
            .eq('project_id', id)
            .eq('provider_id', providerData.id)
            .single();
          
          setHasOffered(!!existingOffer);
        }
      }

      // Load project details by id
      const { data: projectData, error: projectError } = await (supabase as any)
        .from('projects')
        .select(`
          *,
          category:categories(*),
          client:profiles!client_id(*)
        `)
        .eq('id', id)
        .single();

      if (projectError) {
        console.error('Error loading project:', projectError);
      } else {
        // Filter out invalid/placeholder photos (old picsum URLs)
        if (projectData?.photos && Array.isArray(projectData.photos)) {
          projectData.photos = projectData.photos.filter((url: string) => 
            url && !url.includes('picsum.photos') && !url.includes('placeholder') && url.startsWith('http')
          );
        }
        // #region agent log
        fetch('http://localhost:7242/ingest/634abb5f-2f5a-4519-b060-6a93159490ba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'project-detail.tsx:loaded',message:'Project loaded - checking photos',data:{projectId:projectData?.id,slug:projectData?.slug,photos:projectData?.photos,photosType:typeof projectData?.photos,photosLength:projectData?.photos?.length},timestamp:Date.now(),hypothesisId:'H4-stored'})}).catch(()=>{});
        // #endregion
        setProject(projectData as ProjectWithDetails);
      }

      // Load offers (only if user is project owner)
      if (user && projectData && projectData.client_id === user.id) {
        const { data: offersData } = await (supabase as any)
          .from('project_offers')
          .select(`
            *,
            provider:providers(
              *,
              profile:profiles(*)
            )
          `)
          .eq('project_id', projectData.id)
          .order('created_at', { ascending: false });

        if (offersData) {
          setOffers(offersData as OfferWithProvider[]);
        }
      }

      setLoading(false);
    };

    if (id) {
      loadData();
    }
  }, [id]);

  // Save offer form data to sessionStorage for redirect flows
  const saveOfferDraft = () => {
    if (typeof window !== 'undefined' && project) {
      sessionStorage.setItem('offerDraft', JSON.stringify({
        projectId: project.id,
        price: offerPrice,
        message: offerMessage,
        duration: offerDuration,
        availableFrom: offerAvailableFrom,
        includesMaterials,
      }));
    }
  };

  // Restore offer draft from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && project) {
      const draft = sessionStorage.getItem('offerDraft');
      if (draft) {
        try {
          const data = JSON.parse(draft);
          if (data.projectId === project.id) {
            setOfferPrice(data.price || '');
            setOfferMessage(data.message || '');
            setOfferDuration(data.duration || '');
            setOfferAvailableFrom(data.availableFrom || '');
            setIncludesMaterials(data.includesMaterials || false);
            sessionStorage.removeItem('offerDraft');
          }
        } catch {}
      }
    }
  }, [project]);

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Not logged in -> redirect to register as provider
    if (!user) {
      saveOfferDraft();
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `/auth/register?type=provider&redirect=${returnUrl}`;
      return;
    }

    // 2. Logged in but not a provider -> redirect to onboarding
    if (!isProvider) {
      saveOfferDraft();
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `/onboarding?redirect=${returnUrl}`;
      return;
    }

    // 3. Validate form
    if (!offerPrice || !offerMessage) {
      toast.error('Te rugăm să completezi prețul și mesajul.');
      return;
    }

    setSubmitting(true);
    const supabase = createClient();

    // Get provider ID
    const { data: providerData } = await supabase
      .from('providers')
      .select('id')
      .eq('user_id', user.id)
      .single() as { data: { id: string } | null };

    if (!providerData) {
      toast.error('Nu s-a găsit profilul de specialist.');
      setSubmitting(false);
      return;
    }

    const { error } = await (supabase as any)
      .from('project_offers')
      .insert({
        project_id: project!.id,
        provider_id: providerData.id,
        price: parseInt(offerPrice),
        message: offerMessage,
        estimated_duration: offerDuration || null,
        available_from: offerAvailableFrom || null,
        includes_materials: includesMaterials,
      });

    if (error) {
      toast.error(`Eroare: ${error.message}`);
    } else {
      toast.success('Oferta a fost trimisă cu succes!');
      setHasOffered(true);
      
      // Update project offers count locally
      if (project) {
        setProject({ ...project, offers_count: project.offers_count + 1 });
      }
    }

    setSubmitting(false);
  };

  const handleAcceptOffer = async (offerId: string) => {
    if (!confirm('Ești sigur că vrei să accepți această ofertă? Celelalte oferte vor fi respinse automat.')) return;
    
    const supabase = createClient();
    
    // Accept this offer
    await (supabase as any)
      .from('project_offers')
      .update({ status: 'accepted' })
      .eq('id', offerId);

    // Reject all other offers
    await (supabase as any)
      .from('project_offers')
      .update({ status: 'rejected' })
      .eq('project_id', project!.id)
      .neq('id', offerId)
      .eq('status', 'pending');

    // Update project status
    await (supabase as any)
      .from('projects')
      .update({ status: 'in_progress', accepted_offer_id: offerId })
      .eq('id', project!.id);

    toast.success('Ofertă acceptată! Specialistul va fi notificat.');
    
    // Reload page
    window.location.reload();
  };

  const handleRejectOffer = async (offerId: string) => {
    if (!confirm('Ești sigur că vrei să respingi această ofertă?')) return;
    
    const supabase = createClient();
    
    await (supabase as any)
      .from('project_offers')
      .update({ status: 'rejected' })
      .eq('id', offerId);

    toast.success('Ofertă respinsă.');
    setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: 'rejected' as any } : o));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">MiniJob</span>
            </Link>
          </div>
        </header>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Proiect negăsit</h1>
          <p className="text-slate-600 mb-6">Acest proiect nu există sau a fost șters.</p>
          <Button asChild>
            <Link href="/projects">Vezi toate proiectele</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isOwner = user && project.client_id === user.id;

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
            <Link href="/projects">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Înapoi la proiecte
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="flex items-center gap-1 border-slate-200">
                    {CATEGORY_ICONS[project.category?.slug || '']}
                    {project.category?.name}
                  </Badge>
                  <Badge className={
                    project.urgency === 'urgent' 
                      ? 'bg-red-100 text-red-700 border-red-200' 
                      : project.urgency === 'flexible'
                      ? 'bg-slate-100 text-slate-600 border-slate-200'
                      : 'bg-blue-100 text-blue-700 border-blue-200'
                  }>
                    {URGENCY_LABELS[project.urgency]}
                  </Badge>
                  <Badge className="bg-teal-50 text-teal-600 border-teal-200 ml-auto">
                    {project.offers_count} oferte primite
                  </Badge>
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-4">{project.title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {project.location_city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Postat {formatDate(project.created_at)}
                  </span>
                  {project.deadline && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Deadline: {formatDate(project.deadline)}
                    </span>
                  )}
                </div>

                <Separator className="my-6" />

                <h3 className="font-semibold text-slate-900 mb-3">Descriere</h3>
                <p className="text-slate-600 whitespace-pre-wrap">{project.description}</p>

                {/* Photos with Lightbox */}
                {project.photos && project.photos.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Fotografii ({project.photos.length})
                      <span className="text-xs text-slate-400 font-normal ml-1">Click pentru zoom</span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {project.photos.map((photo, i) => (
                        <button
                          key={i}
                          onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                          className="group relative aspect-video rounded-lg overflow-hidden bg-slate-100 cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        >
                          <img src={photo} alt={`Foto ${i + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                          </div>
                        </button>
                      ))}
                    </div>
                    <Lightbox
                      open={lightboxOpen}
                      close={() => setLightboxOpen(false)}
                      index={lightboxIndex}
                      slides={project.photos.map((photo) => ({ src: photo }))}
                      plugins={[Zoom]}
                      zoom={{ maxZoomPixelRatio: 5 }}
                      carousel={{ finite: project.photos.length <= 1 }}
                      styles={{ container: { backgroundColor: 'rgba(0, 0, 0, 0.9)' } }}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            {/* Offers List (only for project owner) */}
            {isOwner && offers.length > 0 && (
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-teal-500" />
                    Oferte primite ({offers.length})
                  </CardTitle>
                  <CardDescription>
                    Compară ofertele și alege specialistul potrivit
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {offers.map((offer) => (
                    <div key={offer.id} className="p-4 border border-slate-200 rounded-xl hover:border-teal-200 transition-colors">
                      <div className="flex items-start gap-4">
                        {/* Provider Avatar */}
                        <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                          {offer.provider?.profile?.avatar_url ? (
                            <img src={offer.provider.profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <User className="w-6 h-6 text-teal-600" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Provider Info */}
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-slate-900">
                              {offer.provider?.profile?.full_name || 'Specialist'}
                            </span>
                            {offer.provider?.verified && (
                              <CheckCircle2 className="w-4 h-4 text-teal-500" />
                            )}
                            {offer.provider_skill?.level && (
                              <Badge variant="outline" className={`text-xs ${SKILL_LEVEL_COLORS[offer.provider_skill.level]}`}>
                                {SKILL_LEVEL_LABELS[offer.provider_skill.level]}
                              </Badge>
                            )}
                          </div>

                          {/* Rating & Jobs */}
                          <div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
                            {offer.provider?.rating ? (
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                {offer.provider.rating}
                              </span>
                            ) : null}
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              {offer.provider?.total_bookings || 0} lucrări
                            </span>
                          </div>

                          {/* Offer Message */}
                          <p className="text-slate-600 text-sm mb-3">{offer.message}</p>

                          {/* Offer Details */}
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <span className="font-semibold text-lg text-orange-500">
                              {offer.price} lei
                            </span>
                            {offer.estimated_duration && (
                              <span className="text-slate-500">
                                Durată: {offer.estimated_duration}
                              </span>
                            )}
                            {offer.available_from && (
                              <span className="text-slate-500">
                                Disponibil din: {formatDate(offer.available_from)}
                              </span>
                            )}
                            {offer.includes_materials && (
                              <Badge variant="outline" className="border-green-200 text-green-700">
                                Include materiale
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Accept/Reject Buttons */}
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          {offer.status === 'pending' && project.status === 'open' ? (
                            <>
                              <Button
                                size="sm"
                                className="bg-orange-500 hover:bg-orange-600"
                                onClick={() => handleAcceptOffer(offer.id)}
                              >
                                Acceptă
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-slate-500 hover:text-red-500"
                                onClick={() => handleRejectOffer(offer.id)}
                              >
                                Respinge
                              </Button>
                            </>
                          ) : (
                            <Badge className={
                              offer.status === 'accepted'
                                ? 'bg-green-100 text-green-700'
                                : offer.status === 'rejected'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-slate-100 text-slate-600'
                            }>
                              {offer.status === 'accepted' ? '✓ Acceptată' :
                               offer.status === 'rejected' ? '✗ Respinsă' :
                               offer.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Budget Card */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Buget</CardTitle>
              </CardHeader>
              <CardContent>
                {project.budget_min || project.budget_max ? (
                  <div className="text-3xl font-bold text-slate-900">
                    {project.budget_min && project.budget_max 
                      ? <>{project.budget_min} - {project.budget_max} <span className="text-lg">lei</span></>
                      : project.budget_max 
                        ? <>Max {project.budget_max} <span className="text-lg">lei</span></>
                        : <>De la {project.budget_min} <span className="text-lg">lei</span></>
                    }
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-semibold text-orange-500">Aștept oferte</p>
                    <p className="text-sm text-slate-500 mt-1">Clientul așteaptă propunerile specialiștilor</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Client Card */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    {project.client?.avatar_url ? (
                      <img src={project.client.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {project.client?.full_name || 'Client'}
                    </p>
                    <p className="text-sm text-slate-500">{project.location_city}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sealed bid info */}
            {!isOwner && project.status === 'open' && (
              <Card className="border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{project.offers_count} oferte depuse</p>
                      <p className="text-xs text-slate-500">Ofertele sunt sigilate — doar clientul le vede</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Already offered message */}
            {hasOffered && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-green-800 mb-1">Ofertă trimisă!</h3>
                  <p className="text-sm text-green-600">
                    Clientul va fi notificat și te va contacta dacă acceptă.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* ═══ OFFER FORM — visible to EVERYONE (except owner & already offered) ═══ */}
            {!isOwner && !hasOffered && project.status === 'open' && (
              <Card className="border-teal-200 bg-teal-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Send className="w-5 h-5 text-teal-600" />
                    Fă o ofertă
                  </CardTitle>
                  <CardDescription>
                    {!user 
                      ? 'Completează oferta — la trimitere vei fi redirecționat să te înscrii'
                      : !isProvider
                      ? 'Completează oferta — la trimitere vei finaliza profilul de specialist'
                      : 'Trimite o ofertă sigilată către client'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitOffer} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Prețul tău (RON) *</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="Ex: 1500"
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Mesaj către client *</Label>
                      <Textarea
                        id="message"
                        placeholder="Descrie experiența ta și de ce ești potrivit pentru acest proiect..."
                        value={offerMessage}
                        onChange={(e) => setOfferMessage(e.target.value)}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Durată estimată</Label>
                      <Input
                        id="duration"
                        placeholder="Ex: 2-3 zile"
                        value={offerDuration}
                        onChange={(e) => setOfferDuration(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="availableFrom">Disponibil din</Label>
                      <Input
                        id="availableFrom"
                        type="date"
                        value={offerAvailableFrom}
                        onChange={(e) => setOfferAvailableFrom(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="materials"
                        checked={includesMaterials}
                        onCheckedChange={(checked) => setIncludesMaterials(checked as boolean)}
                      />
                      <Label htmlFor="materials" className="text-sm cursor-pointer">
                        Prețul include materialele
                      </Label>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-base font-semibold"
                      disabled={submitting}
                    >
                      {submitting ? 'Se trimite...' : !user ? '🔒 Înscrie-te și trimite oferta' : !isProvider ? '📋 Completează profilul și trimite' : '📨 Trimite oferta'}
                    </Button>

                    {!user && (
                      <p className="text-xs text-center text-slate-500">
                        Nu ai cont? La click vei fi ghidat să te înscrii rapid, apoi oferta se trimite automat.
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Owner actions */}
            {isOwner && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Acesta este proiectul tău</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Ai primit {project.offers_count} oferte. Verifică-le și alege specialistul potrivit!
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/edit-project?id=${project.id}`}>
                      Editează proiectul
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
