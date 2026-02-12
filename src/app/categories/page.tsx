'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import {
  Search, SlidersHorizontal, Star, MapPin, Clock, CheckCircle2,
  Heart, Shield, Briefcase, Zap, ChevronDown, X, ArrowRight,
  Home, Hammer, Car, Laptop, PawPrint, Baby, Sparkles,
  Image as ImageIcon, FileText, Users, Filter, Grid3x3, List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Header } from '@/components/header';
import { createClient } from '@/lib/supabase/client';
import { Category, Skill } from '@/types/database';

// ═══ CONFIG ═══
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

const CATEGORY_BG: Record<string, string> = {
  casa: 'bg-teal-500',
  constructii: 'bg-amber-500',
  auto: 'bg-blue-500',
  tech: 'bg-purple-500',
  pets: 'bg-green-500',
  kids: 'bg-pink-500',
  altceva: 'bg-slate-500',
};

const PORTFOLIO_GRADIENTS = [
  'from-teal-100 to-cyan-100',
  'from-orange-100 to-amber-100',
  'from-violet-100 to-purple-100',
  'from-blue-100 to-indigo-100',
  'from-rose-100 to-pink-100',
  'from-emerald-100 to-green-100',
];

const CITIES = ['Toate', 'Sibiu', 'Cluj-Napoca', 'București', 'Brașov', 'Timișoara', 'Iași', 'Constanța'];

interface ProviderResult {
  id: string;
  user_id: string;
  business_name: string | null;
  bio: string | null;
  rating: number;
  total_reviews: number;
  total_bookings: number;
  verified: boolean;
  active: boolean;
  categories: string[];
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

function CategoriesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL params
  const initialCategory = searchParams?.get('cat') || '';
  const initialSkill = searchParams?.get('skill') || '';
  const initialCity = searchParams?.get('city') || '';
  const initialQ = searchParams?.get('q') || '';

  // Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [providers, setProviders] = useState<ProviderResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSkill, setSelectedSkill] = useState(initialSkill);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [sortBy, setSortBy] = useState('recommended');
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterRating, setFilterRating] = useState('all');
  const [hasSearched, setHasSearched] = useState(false);

  // Load categories on mount
  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
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

  // Load skills when category changes
  useEffect(() => {
    const loadSkills = async () => {
      if (!selectedCategory) {
        setSkills([]);
        return;
      }
      const supabase = createClient();
      const cat = categories.find(c => c.slug === selectedCategory);
      if (!cat) return;

      const { data } = await (supabase as any)
        .from('skills')
        .select('*')
        .eq('category_id', cat.id)
        .eq('active', true)
        .order('sort_order');
      if (data) setSkills(data);
    };
    if (categories.length > 0) loadSkills();
  }, [selectedCategory, categories]);

  // Auto-search if URL has params
  useEffect(() => {
    if (initialCategory && categories.length > 0) {
      searchProviders();
    }
  }, [categories]); // eslint-disable-line react-hooks/exhaustive-deps

  const searchProviders = async () => {
    setSearchLoading(true);
    setHasSearched(true);
    const supabase = createClient();

    let query = (supabase as any)
      .from('providers')
      .select(`
        id, user_id, business_name, bio, rating, total_reviews, total_bookings, verified, active, categories,
        profile:profiles!user_id(full_name, avatar_url, location_city),
        services(title, price, price_type, photos)
      `)
      .eq('active', true);

    // Filter by category
    if (selectedCategory) {
      query = query.contains('categories', [selectedCategory]);
    }

    // Filter by city
    if (selectedCity && selectedCity !== 'Toate') {
      // We need to filter by profile location - do it client-side after fetch
    }

    query = query.order('rating', { ascending: false });

    const { data } = await query;

    let results: ProviderResult[] = data || [];

    // Client-side city filter (since we can't filter by joined table in Supabase easily)
    if (selectedCity && selectedCity !== 'Toate') {
      results = results.filter(p => 
        p.profile?.location_city?.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }

    // Client-side search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(p =>
        (p.profile?.full_name || '').toLowerCase().includes(q) ||
        (p.business_name || '').toLowerCase().includes(q) ||
        (p.bio || '').toLowerCase().includes(q) ||
        p.services?.some(s => s.title.toLowerCase().includes(q))
      );
    }

    setProviders(results);
    setSearchLoading(false);

    // Update URL
    const params = new URLSearchParams();
    if (selectedCategory) params.set('cat', selectedCategory);
    if (selectedSkill) params.set('skill', selectedSkill);
    if (selectedCity && selectedCity !== 'Toate') params.set('city', selectedCity);
    if (searchQuery) params.set('q', searchQuery);
    const qs = params.toString();
    window.history.replaceState({}, '', qs ? `/categories?${qs}` : '/categories');
  };

  // Filtered + sorted providers
  const filteredProviders = useMemo(() => {
    return providers
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
          const aPrice = a.services?.[0]?.price || 9999;
          const bPrice = b.services?.[0]?.price || 9999;
          return aPrice - bPrice;
        }
        return (b.rating * Math.log(b.total_reviews + 1)) - (a.rating * Math.log(a.total_reviews + 1));
      });
  }, [providers, filterVerified, filterRating, sortBy]);

  // Track pending search trigger
  const [pendingSearch, setPendingSearch] = useState(false);

  const handleCategoryClick = (slug: string) => {
    if (selectedCategory === slug) {
      setSelectedCategory('');
      setSelectedSkill('');
      setSkills([]);
    } else {
      setSelectedCategory(slug);
      setSelectedSkill('');
      setPendingSearch(true);
    }
  };

  // Trigger search after category state update
  useEffect(() => {
    if (pendingSearch) {
      setPendingSearch(false);
      searchProviders();
    }
  }, [pendingSearch, selectedCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    searchProviders();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedSkill('');
    setSelectedCity('');
    setSearchQuery('');
    setFilterVerified(false);
    setFilterRating('all');
    setSortBy('recommended');
    setProviders([]);
    setHasSearched(false);
    window.history.replaceState({}, '', '/categories');
  };

  const activeCat = categories.find(c => c.slug === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ═══ SEARCH HERO ═══ */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 pt-8 pb-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
            Caută un specialist
          </h1>
          <p className="text-slate-400 text-center mb-6 text-sm">
            Alege categoria, serviciul și orașul — vezi instant specialiștii disponibili
          </p>

          {/* ═══ COMPLEX SEARCH BAR ═══ */}
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 p-2 md:p-3">
            <div className="flex flex-col md:flex-row gap-2">
              {/* Category selector */}
              <div className="flex-1 min-w-0">
                <Select value={selectedCategory || '_all'} onValueChange={(v) => handleCategoryClick(v === '_all' ? '' : v)}>
                  <SelectTrigger className="h-12 md:h-14 border-0 bg-slate-50 rounded-xl text-base font-medium pl-4">
                    <div className="flex items-center gap-2">
                      <Grid3x3 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <SelectValue placeholder="Ce categorie?" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_all">Toate categoriile</SelectItem>
                    {categories.map((cat) => {
                      const Icon = CATEGORY_ICONS[cat.slug] || Sparkles;
                      return (
                        <SelectItem key={cat.slug} value={cat.slug}>
                          <span className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {cat.name}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Skill selector - appears when category is selected */}
              {skills.length > 0 && (
                <div className="flex-1 min-w-0">
                  <Select value={selectedSkill || '_all'} onValueChange={(v) => setSelectedSkill(v === '_all' ? '' : v)}>
                    <SelectTrigger className="h-12 md:h-14 border-0 bg-slate-50 rounded-xl text-base font-medium pl-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <SelectValue placeholder="Ce serviciu?" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_all">Toate serviciile</SelectItem>
                      {skills.map((skill) => (
                        <SelectItem key={skill.slug} value={skill.slug}>{skill.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* City selector */}
              <div className="md:w-48 flex-shrink-0">
                <Select value={selectedCity || '_all'} onValueChange={(v) => setSelectedCity(v === '_all' ? '' : v)}>
                  <SelectTrigger className="h-12 md:h-14 border-0 bg-slate-50 rounded-xl text-base font-medium pl-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <SelectValue placeholder="Oraș" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_all">Orice oraș</SelectItem>
                    {CITIES.filter(c => c !== 'Toate').map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search button */}
              <Button
                onClick={() => handleSearch()}
                className="h-12 md:h-14 px-6 md:px-8 bg-orange-500 hover:bg-orange-600 rounded-xl text-base font-semibold flex-shrink-0"
              >
                <Search className="w-5 h-5 md:mr-2" />
                <span className="hidden md:inline">Caută</span>
              </Button>
            </div>

            {/* Text search row */}
            <div className="mt-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Caută după nume, serviciu sau cuvânt cheie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 h-11 border-0 bg-slate-50 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ QUICK CATEGORY CHIPS ═══ */}
      <section className="border-b border-slate-100 bg-white sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.slug] || Sparkles;
              const isActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border
                    ${isActive
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </button>
              );
            })}
            {(selectedCategory || selectedCity || searchQuery || filterVerified || filterRating !== 'all') && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium text-red-500 hover:bg-red-50 transition-colors ml-2 flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
                Resetează
              </button>
            )}
          </div>

          {/* Skill sub-tabs when category selected */}
          {selectedCategory && skills.length > 0 && (
            <div className="flex items-center gap-1.5 pb-3 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setSelectedSkill('')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all
                  ${!selectedSkill
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
              >
                Toate
              </button>
              {skills.map((skill) => (
                <button
                  key={skill.slug}
                  onClick={() => setSelectedSkill(skill.slug)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all
                    ${selectedSkill === skill.slug
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                >
                  {skill.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ RESULTS AREA ═══ */}
      <div className="bg-slate-50/50 min-h-[60vh]">
        {/* Filters bar */}
        {hasSearched && (
          <div className="bg-white border-b border-slate-100">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center gap-3 overflow-x-auto">
                <div className="flex items-center gap-2 text-sm text-slate-500 flex-shrink-0">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="font-medium text-slate-700">{filteredProviders.length} specialiști</span>
                </div>

                <div className="h-4 w-px bg-slate-200 flex-shrink-0" />

                {/* Rating Filter */}
                <Select value={filterRating} onValueChange={setFilterRating}>
                  <SelectTrigger className="w-auto h-8 text-xs border-slate-200 bg-white rounded-lg">
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex-shrink-0
                    ${filterVerified
                      ? 'bg-teal-50 text-teal-700 border-teal-200'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  <Shield className="w-3 h-3" />
                  Verificați
                </button>

                {/* Sort */}
                <div className="ml-auto flex-shrink-0">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-auto h-8 text-xs border-slate-200 bg-white rounded-lg">
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
        )}

        <div className="container mx-auto px-4 py-6">
          {/* Loading */}
          {searchLoading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Card key={i} className="animate-pulse overflow-hidden border-slate-200">
                  <div className="h-44 bg-slate-200" />
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 bg-slate-200 rounded-full" />
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
          )}

          {/* No search yet - show category quick picks */}
          {!hasSearched && !searchLoading && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <p className="text-slate-500">Alege o categorie sau caută direct pentru a vedea specialiștii disponibili</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat.slug] || Sparkles;
                  const gradient = CATEGORY_COLORS[cat.slug] || 'from-slate-500 to-slate-600';
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setPendingSearch(true);
                      }}
                      className="text-left group"
                    >
                      <Card className="border-slate-200 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/5 transition-all h-full">
                        <CardContent className="p-5">
                          <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="font-bold text-slate-900 mb-1">{cat.name}</h3>
                          <p className="text-sm text-slate-500 mb-3">{cat.description}</p>
                          <span className="text-xs text-orange-500 font-medium group-hover:text-orange-600 flex items-center gap-1">
                            Vezi specialiști <ArrowRight className="w-3 h-3" />
                          </span>
                        </CardContent>
                      </Card>
                    </button>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="mt-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full text-sm text-orange-600 mb-4">
                  <FileText className="w-4 h-4" />
                  Sau postează un proiect și primește oferte
                </div>
                <br />
                <Button className="bg-orange-500 hover:bg-orange-600 mt-2" asChild>
                  <Link href="/post-project">
                    Postează un proiect gratuit
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Results - empty */}
          {hasSearched && !searchLoading && filteredProviders.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Nu am găsit specialiști
              </h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                {selectedCategory
                  ? `Încă nu sunt specialiști în ${activeCat?.name || selectedCategory}${selectedCity ? ` din ${selectedCity}` : ''}. Fii primul!`
                  : 'Încearcă alte filtre sau postează un proiect și specialiștii vor veni la tine.'
                }
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                  <Link href="/post-project">Postează un proiect</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/devino-specialist">Devino specialist</Link>
                </Button>
                <Button variant="ghost" onClick={clearFilters}>
                  Resetează filtrele
                </Button>
              </div>
            </div>
          )}

          {/* Results - grid */}
          {hasSearched && !searchLoading && filteredProviders.length > 0 && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProviders.map((provider, index) => {
                  const mainService = provider.services?.[0];
                  const hasPhotos = mainService?.photos && mainService.photos.length > 0;
                  const gradientBg = PORTFOLIO_GRADIENTS[index % PORTFOLIO_GRADIENTS.length];
                  const displayName = provider.profile?.full_name || provider.business_name || 'Specialist';
                  const catSlug = provider.categories?.[0] || '';
                  const CatIcon = CATEGORY_ICONS[catSlug] || Sparkles;

                  return (
                    <Link key={provider.id} href={`/providers/${provider.id}`}>
                      <Card className="group border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden h-full flex flex-col bg-white">
                        {/* Portfolio Image */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                          {hasPhotos ? (
                            <img
                              src={mainService!.photos[0]}
                              alt={mainService!.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${gradientBg} flex flex-col items-center justify-center`}>
                              <CatIcon className="w-12 h-12 text-slate-300 mb-2" />
                              <span className="text-xs text-slate-400">Fără poze încă</span>
                            </div>
                          )}

                          {/* Wishlist */}
                          <button
                            className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                            onClick={(e) => { e.preventDefault(); }}
                          >
                            <Heart className="w-4 h-4 text-slate-600" />
                          </button>

                          {/* Verified badge */}
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
                          {/* Provider info */}
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
                            {mainService?.title || provider.bio || 'Servicii profesionale'}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    }>
      <CategoriesContent />
    </Suspense>
  );
}
