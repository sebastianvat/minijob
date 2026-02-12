'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap, ArrowLeft, Star, MapPin, Clock, Calendar,
  CheckCircle2, Share2, Heart, Shield, Award, ThumbsUp,
  Sparkles, MessageCircle, Phone, Briefcase, Camera,
  Home, Hammer, Car, Laptop, PawPrint, Baby, ChevronRight, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/client';

const CATEGORY_ICONS: Record<string, typeof Home> = {
  casa: Home, constructii: Hammer, auto: Car, tech: Laptop,
  pets: PawPrint, kids: Baby, altceva: Sparkles,
};

const SKILL_LEVEL_LABELS: Record<string, string> = {
  new: 'Nou', experienced: 'Experimentat', expert: 'Expert',
  master: 'Master', top_pro: 'Top Pro',
};

const SKILL_LEVEL_COLORS: Record<string, string> = {
  new: 'bg-slate-100 text-slate-600',
  experienced: 'bg-blue-100 text-blue-600',
  expert: 'bg-amber-100 text-amber-700',
  master: 'bg-purple-100 text-purple-700',
  top_pro: 'bg-orange-100 text-orange-700',
};

interface ProviderData {
  id: string;
  user_id: string;
  business_name: string | null;
  business_type: string;
  bio: string | null;
  rating: number;
  total_reviews: number;
  total_bookings: number;
  verified: boolean;
  categories: string[];
  service_radius_km: number;
  created_at: string;
  profile: {
    full_name: string | null;
    avatar_url: string | null;
    location_city: string | null;
    phone: string | null;
    email: string;
  } | null;
  services: {
    id: string;
    title: string;
    description: string | null;
    price: number;
    price_type: string;
    photos: string[];
    duration_minutes: number | null;
  }[];
}

interface ProviderSkillData {
  id: string;
  skill_id: string;
  price: number;
  price_type: string;
  jobs_completed: number;
  rating: number;
  reviews_count: number;
  level: string;
  skill: {
    name: string;
    slug: string;
    price_unit: string;
    category_id: string;
  } | null;
}

export function ProviderProfileContent({ id }: { id: string }) {
  const params = { id };
  const [provider, setProvider] = useState<ProviderData | null>(null);
  const [providerSkills, setProviderSkills] = useState<ProviderSkillData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();

      // Check auth
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);

      // Load provider data
      const { data, error } = await (supabase as any)
        .from('providers')
        .select(`
          id, user_id, business_name, business_type, bio, rating, total_reviews,
          total_bookings, verified, categories, service_radius_km, created_at,
          profile:profiles!user_id(full_name, avatar_url, location_city, phone, email),
          services(id, title, description, price, price_type, photos, duration_minutes)
        `)
        .eq('id', params.id)
        .single();

      if (data) {
        setProvider(data);

        // Load provider skills
        const { data: skillsData } = await (supabase as any)
          .from('provider_skills')
          .select(`
            id, skill_id, price, price_type, jobs_completed, rating, reviews_count, level,
            skill:skills!skill_id(name, slug, price_unit, category_id)
          `)
          .eq('provider_id', data.id)
          .eq('available', true)
          .order('rating', { ascending: false });

        if (skillsData) setProviderSkills(skillsData);
      }

      setLoading(false);
    };
    load();
  }, [params.id]);

  const handleContact = () => {
    if (!isLoggedIn) {
      window.location.href = `/auth/login?redirect=/providers/${params.id}`;
      return;
    }
    alert('Mesageria va fi disponibilă în curând!');
  };

  const handleBook = (serviceId?: string) => {
    if (!isLoggedIn) {
      window.location.href = `/auth/login?redirect=/providers/${params.id}`;
      return;
    }
    window.location.href = `/book/${params.id}${serviceId ? `?service=${serviceId}` : ''}`;
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-100 h-16" />
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="w-24 h-24 bg-slate-200 rounded-full" />
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-slate-200 rounded w-1/3" />
                      <div className="h-4 bg-slate-200 rounded w-1/4" />
                      <div className="h-4 bg-slate-200 rounded w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="animate-pulse h-64" />
          </div>
        </div>
      </div>
    );
  }

  // Not found
  if (!provider) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Specialist negăsit</h2>
          <p className="text-slate-500 mb-4">Acest profil nu există sau nu este activ.</p>
          <Button asChild><Link href="/categories">Caută specialiști</Link></Button>
        </div>
      </div>
    );
  }

  const displayName = provider.profile?.full_name || provider.business_name || 'Specialist';
  const avatarUrl = provider.profile?.avatar_url;
  const city = provider.profile?.location_city;
  const memberSince = new Date(provider.created_at).toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' });
  const lowestPrice = provider.services?.length
    ? Math.min(...provider.services.map(s => s.price))
    : providerSkills.length
      ? Math.min(...providerSkills.filter(s => s.price > 0).map(s => s.price))
      : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/categories"><ArrowLeft className="w-5 h-5" /></Link>
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">MiniJob</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSaved(!isSaved)}>
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {
              if (navigator.share) navigator.share({ title: displayName, url: window.location.href });
            }}>
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* ═══ MAIN CONTENT ═══ */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-5">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex-shrink-0 overflow-hidden bg-orange-100 flex items-center justify-center">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl md:text-3xl font-bold text-orange-600">{displayName[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h1 className="text-xl md:text-2xl font-bold text-slate-900">{displayName}</h1>
                      {provider.verified && (
                        <Badge className="bg-teal-100 text-teal-700 border-teal-200">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Verificat
                        </Badge>
                      )}
                      {provider.business_type !== 'individual' && (
                        <Badge variant="outline" className="text-xs">
                          {provider.business_type.toUpperCase()}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-3 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-slate-900">{provider.rating.toFixed(1)}</span>
                        <span>({provider.total_reviews} review-uri)</span>
                      </span>
                      {city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> {city}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" /> {provider.total_bookings} lucrări
                      </span>
                    </div>

                    {/* Category badges */}
                    <div className="flex flex-wrap gap-2">
                      {provider.categories?.map((catSlug) => {
                        const Icon = CATEGORY_ICONS[catSlug] || Sparkles;
                        return (
                          <Badge key={catSlug} variant="outline" className="border-orange-200 text-orange-600 capitalize">
                            <Icon className="w-3 h-3 mr-1" />
                            {catSlug}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                  <p className="text-xl font-bold text-slate-900">{provider.total_bookings}</p>
                  <p className="text-xs text-slate-500">Lucrări</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                  <p className="text-xl font-bold text-slate-900">{provider.rating.toFixed(1)}</p>
                  <p className="text-xs text-slate-500">Rating</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-xl font-bold text-slate-900">&lt; 2h</p>
                  <p className="text-xs text-slate-500">Răspuns</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <MapPin className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <p className="text-xl font-bold text-slate-900">{provider.service_radius_km} km</p>
                  <p className="text-xs text-slate-500">Rază</p>
                </CardContent>
              </Card>
            </div>

            {/* About */}
            {provider.bio && (
              <Card>
                <CardHeader><CardTitle className="text-lg">Despre</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed">{provider.bio}</p>
                  <Separator className="my-4" />
                  <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Membru din {memberSince}
                    </span>
                    {provider.verified && (
                      <span className="flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Identitate verificată
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ═══ SKILLS ═══ */}
            {providerSkills.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-lg">Skill-uri</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {providerSkills.map((ps) => (
                      <div key={ps.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium text-slate-900">{ps.skill?.name || 'Skill'}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`text-xs ${SKILL_LEVEL_COLORS[ps.level] || 'bg-slate-100 text-slate-600'}`}>
                                {SKILL_LEVEL_LABELS[ps.level] || ps.level}
                              </Badge>
                              {ps.reviews_count > 0 && (
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                  {ps.rating.toFixed(1)} ({ps.reviews_count})
                                </span>
                              )}
                              {ps.jobs_completed > 0 && (
                                <span className="text-xs text-slate-500">{ps.jobs_completed} lucrări</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {ps.price > 0 && (
                            <p className="font-semibold text-orange-500">
                              {ps.price} lei<span className="text-xs text-slate-400">/{ps.skill?.price_unit || 'ora'}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ═══ SERVICES ═══ */}
            {provider.services?.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-lg">Servicii oferite</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {provider.services.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900">{service.title}</h4>
                          {service.description && (
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{service.description}</p>
                          )}
                          {service.duration_minutes && (
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> ~{service.duration_minutes} min
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold text-orange-500 text-lg">{service.price} lei</p>
                          <p className="text-xs text-slate-400">
                            {service.price_type === 'hourly' ? '/oră' : service.price_type === 'fixed' ? 'fix' : ''}
                          </p>
                          <Button
                            size="sm"
                            className="mt-2 bg-orange-500 hover:bg-orange-600"
                            onClick={() => handleBook(service.id)}
                          >
                            Rezervă
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ═══ PORTFOLIO GALLERY ═══ */}
            {provider.services?.some(s => s.photos?.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Camera className="w-5 h-5 text-orange-500" /> Portofoliu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {provider.services.flatMap(s => s.photos || []).slice(0, 9).map((photo, i) => (
                      <div key={i} className="aspect-square rounded-xl overflow-hidden bg-slate-100">
                        <img src={photo} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ═══ SIDEBAR ═══ */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Contact / Booking Card */}
              <Card className="border-orange-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Contactează specialist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {lowestPrice && (
                    <div className="p-4 bg-orange-50 rounded-xl">
                      <p className="text-sm text-slate-500 mb-1">Prețuri de la</p>
                      <p className="text-3xl font-bold text-orange-500">
                        {lowestPrice} <span className="text-base font-normal text-slate-400">lei</span>
                      </p>
                    </div>
                  )}

                  <Button
                    className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-base"
                    onClick={() => handleBook()}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    {isLoggedIn ? 'Rezervă acum' : 'Loghează-te pt rezervare'}
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="h-11" onClick={handleContact}>
                      <MessageCircle className="w-4 h-4 mr-2" /> Mesaj
                    </Button>
                    <Button variant="outline" className="h-11" onClick={() => {
                      if (provider.profile?.phone) {
                        window.location.href = `tel:${provider.profile.phone}`;
                      } else {
                        alert('Numărul de telefon nu este disponibil.');
                      }
                    }}>
                      <Phone className="w-4 h-4 mr-2" /> Sună
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      Răspunde în medie sub 2 ore
                    </div>
                    {provider.verified && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Shield className="w-4 h-4 text-teal-500 flex-shrink-0" />
                        Identitate verificată
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      Anulare gratuită cu 24h înainte
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick info */}
              <Card>
                <CardContent className="p-5 space-y-3 text-sm">
                  {city && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Locație</span>
                      <span className="font-medium text-slate-900">{city}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Membru din</span>
                    <span className="font-medium text-slate-900 capitalize">{memberSince}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Tip</span>
                    <span className="font-medium text-slate-900">
                      {provider.business_type === 'individual' ? 'Persoană fizică' : provider.business_type.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Se deplasează</span>
                    <span className="font-medium text-slate-900">{provider.service_radius_km} km</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
