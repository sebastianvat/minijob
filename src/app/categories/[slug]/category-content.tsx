'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Star, MapPin, Clock, CheckCircle2, Home, Hammer, Car, 
  Laptop, PawPrint, Baby, Sparkles, SlidersHorizontal,
  Heart, Briefcase, Shield, Zap, Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/header';
import { createClient } from '@/lib/supabase/client';
import { Category, Skill } from '@/types/database';

// Category config
const CATEGORY_ICONS: Record<string, typeof Home> = {
  casa: Home, constructii: Hammer, auto: Car, tech: Laptop, 
  pets: PawPrint, kids: Baby, altceva: Sparkles,
};

const CATEGORY_COLORS: Record<string, string> = {
  casa: 'from-teal-500 to-teal-600',
  constructii: 'from-amber-500 to-amber-600',
  auto: 'from-blue-500 to-blue-600',
  tech: 'from-purple-500 to-purple-600',
  pets: 'from-green-500 to-green-600',
  kids: 'from-pink-500 to-pink-600',
  altceva: 'from-slate-500 to-slate-600',
};

const PORTFOLIO_GRADIENTS = [
  'from-teal-100 to-cyan-100',
  'from-orange-100 to-amber-100',
  'from-violet-100 to-purple-100',
  'from-blue-100 to-indigo-100',
  'from-rose-100 to-pink-100',
  'from-emerald-100 to-green-100',
];

interface ProviderWithDetails {
  id: string;
  user_id: string;
  business_name: string | null;
  bio: string | null;
  rating: number;
  total_reviews: number;
  total_bookings: number;
  verified: boolean;
  active: boolean;
  profile: {
    full_name: string | null;
    avatar_url: string | null;
    location_city: string | null;
  };
  services?: {
    title: string;
    price: number;
    price_type: string;
    photos: string[];
  }[];
}

interface CategoryContentProps {
  slug: string;
}

export function CategoryContent({ slug }: CategoryContentProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [providers, setProviders] = useState<ProviderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterRating, setFilterRating] = useState<string>('all');

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();

      // Load category
      const { data: catData } = await (supabase as any)
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single() as { data: Category | null };

      if (catData) {
        setCategory(catData);

        // Load skills for this category
        const { data: skillsData } = await (supabase as any)
          .from('skills')
          .select('*')
          .eq('category_id', catData.id)
          .eq('active', true)
          .order('sort_order');

        if (skillsData) setSkills(skillsData);

        // Load providers with this category
        const { data: providersData } = await (supabase as any)
          .from('providers')
          .select(`
            id, user_id, business_name, bio, rating, total_reviews, total_bookings, verified, active,
            profile:profiles!user_id(full_name, avatar_url, location_city),
            services(title, price, price_type, photos)
          `)
          .contains('categories', [catData.slug])
          .eq('active', true)
          .order('rating', { ascending: false });

        if (providersData) {
          setProviders(providersData);
        }
      }

      setLoading(false);
    };

    if (slug) loadData();
  }, [slug]);

  // Filter & sort providers
  const filteredProviders = providers
    .filter(p => {
      if (filterVerified && !p.verified) return false;
      if (filterRating === '4.5' && p.rating < 4.5) return false;
      if (filterRating === '4.8' && p.rating < 4.8) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.total_reviews - a.total_reviews;
      if (sortBy === 'price_low') {
        const aPrice = a.services?.[0]?.price || 999;
        const bPrice = b.services?.[0]?.price || 999;
        return aPrice - bPrice;
      }
      // Default: recommended
      return (b.rating * Math.log(b.total_reviews + 1)) - (a.rating * Math.log(a.total_reviews + 1));
    });

  const IconComponent = CATEGORY_ICONS[slug] || Sparkles;
  const colorGradient = CATEGORY_COLORS[slug] || 'from-slate-500 to-slate-600';

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse overflow-hidden">
                <div className="h-48 bg-slate-200" />
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-2/3 mb-1" />
                      <div className="h-3 bg-slate-200 rounded w-1/3" />
                    </div>
                  </div>
                  <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                  <div className="h-6 bg-slate-200 rounded w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Breadcrumb + Category Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm py-3 text-slate-500">
            <Link href="/" className="hover:text-slate-700">Acasă</Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-slate-700">Categorii</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">{category?.name || slug}</span>
          </div>

          {/* Category Hero - compact */}
          <div className="flex items-center gap-4 pb-4">
            <div className={`w-14 h-14 bg-gradient-to-br ${colorGradient} rounded-2xl flex items-center justify-center shadow-lg`}>
              <IconComponent className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{category?.name}</h1>
              <p className="text-slate-500 text-sm">{category?.description}</p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <span className="font-semibold text-slate-900">{filteredProviders.length}</span> specialiști disponibili
            </div>
          </div>

          {/* Skill Tabs - Fiverr style subcategories */}
          {skills.length > 0 && (
            <div className="flex items-center gap-1 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
              <button
                onClick={() => setSelectedSkill('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                  ${selectedSkill === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                Toate
              </button>
              {skills.map((skill) => (
                <button
                  key={skill.slug}
                  onClick={() => setSelectedSkill(skill.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                    ${selectedSkill === skill.slug
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {skill.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filters Bar - sticky */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3 overflow-x-auto">
            <div className="flex items-center gap-2 text-sm text-slate-500 flex-shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
            </div>

            {/* Budget Filter */}
            <Select defaultValue="all">
              <SelectTrigger className="w-auto h-9 text-sm border-slate-200 bg-white">
                <SelectValue placeholder="Buget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Orice buget</SelectItem>
                <SelectItem value="0-50">Sub 50 lei</SelectItem>
                <SelectItem value="50-100">50 - 100 lei</SelectItem>
                <SelectItem value="100-200">100 - 200 lei</SelectItem>
                <SelectItem value="200+">Peste 200 lei</SelectItem>
              </SelectContent>
            </Select>

            {/* Rating Filter */}
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-auto h-9 text-sm border-slate-200 bg-white">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Orice rating</SelectItem>
                <SelectItem value="4.5">4.5+ stele</SelectItem>
                <SelectItem value="4.8">4.8+ stele</SelectItem>
              </SelectContent>
            </Select>

            {/* Verified Toggle */}
            <button
              onClick={() => setFilterVerified(!filterVerified)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border flex-shrink-0
                ${filterVerified 
                  ? 'bg-teal-50 text-teal-700 border-teal-200' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Verificați
            </button>

            {/* Sort */}
            <div className="ml-auto flex-shrink-0">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-auto h-9 text-sm border-slate-200 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recomandat</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="reviews">Cele mai multe review-uri</SelectItem>
                  <SelectItem value="price_low">Preț crescător</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid - Fiverr Style */}
      <div className="container mx-auto px-4 py-6">
        {filteredProviders.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className={`w-20 h-20 bg-gradient-to-br ${colorGradient} rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-30`}>
              <IconComponent className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Încă nu sunt specialiști în această categorie
            </h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Fii primul specialist care se înscrie! Sau postează un proiect și vei fi notificat când apar specialiști.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                <Link href="/post-project">Postează un proiect</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/register">Devino specialist</Link>
              </Button>
            </div>
          </div>
        ) : (
          /* Provider Grid */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProviders.map((provider, index) => {
              const mainService = provider.services?.[0];
              const hasPhotos = mainService?.photos && mainService.photos.length > 0;
              const gradientBg = PORTFOLIO_GRADIENTS[index % PORTFOLIO_GRADIENTS.length];
              const displayName = provider.profile?.full_name || provider.business_name || 'Specialist';

              return (
                <Link key={provider.id} href={`/providers/${provider.id}`}>
                  <Card className="group border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden h-full flex flex-col">
                    {/* Portfolio Image / Hero */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {hasPhotos ? (
                        <img 
                          src={mainService!.photos[0]} 
                          alt={mainService!.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${gradientBg} flex flex-col items-center justify-center`}>
                          <IconComponent className="w-12 h-12 text-slate-300 mb-2" />
                          <span className="text-xs text-slate-400">Fără poze încă</span>
                        </div>
                      )}
                      
                      {/* Wishlist heart */}
                      <button 
                        className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                        onClick={(e) => { e.preventDefault(); }}
                      >
                        <Heart className="w-4 h-4 text-slate-600" />
                      </button>

                      {/* Verified badge overlay */}
                      {provider.verified && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-white/90 backdrop-blur-sm text-teal-700 border-0 shadow-sm text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Verificat
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <CardContent className="p-4 flex-1 flex flex-col">
                      {/* Provider info row */}
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden bg-orange-100 flex items-center justify-center">
                          {provider.profile?.avatar_url ? (
                            <img 
                              src={provider.profile.avatar_url} 
                              alt={displayName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-bold text-orange-600">
                              {displayName[0]?.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate">{displayName}</p>
                          {provider.profile?.location_city && (
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <MapPin className="w-3 h-3" />
                              <span>{provider.profile.location_city}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Service title */}
                      <p className="text-sm text-slate-700 mb-3 line-clamp-2 min-h-[2.5rem] flex-1">
                        {mainService?.title || provider.bio || `Servicii de ${category?.name?.toLowerCase()}`}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mb-3">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-sm text-slate-900">{provider.rating.toFixed(1)}</span>
                        <span className="text-xs text-slate-500">({provider.total_reviews})</span>
                        <span className="text-slate-300 mx-1">|</span>
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs text-slate-500">{provider.total_bookings} servicii</span>
                      </div>

                      {/* Divider + Price */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          Răspunde rapid
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-500">De la</span>
                          <span className="text-lg font-bold text-slate-900 ml-1">
                            {mainService?.price || '—'}
                          </span>
                          <span className="text-xs text-slate-500"> lei</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Nu ai găsit ce cauți?
              </h3>
              <p className="text-slate-600 mb-4">
                Postează un proiect cu detalii și primește oferte de la specialiști
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                <Link href="/post-project">
                  <Zap className="w-4 h-4 mr-2" />
                  Postează un proiect gratuit
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
