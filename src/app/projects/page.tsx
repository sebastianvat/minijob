'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Zap, MapPin, Calendar, DollarSign, Clock, Filter, Search,
  Home, Hammer, Car, Laptop, PawPrint, Baby, ArrowRight, ArrowUpDown,
  FileText, Eye, MessageCircle, Sparkles, Grid3x3, Flame, X,
  SlidersHorizontal, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/header';
import { getProjectUrl, formatBudget } from '@/lib/utils';
import { Project, Category, URGENCY_LABELS } from '@/types/database';

// Category icons mapping
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  casa: <Home className="w-4 h-4" />,
  constructii: <Hammer className="w-4 h-4" />,
  auto: <Car className="w-4 h-4" />,
  tech: <Laptop className="w-4 h-4" />,
  pets: <PawPrint className="w-4 h-4" />,
  kids: <Baby className="w-4 h-4" />,
};

const CATEGORY_ICON_COMPONENTS: Record<string, typeof Home> = {
  casa: Home, constructii: Hammer, auto: Car, tech: Laptop,
  pets: PawPrint, kids: Baby, altceva: Sparkles,
};

const CITIES = ['Sibiu', 'Cluj-Napoca', 'București', 'Brașov', 'Timișoara', 'Iași', 'Constanța'];

interface ProjectWithCategory extends Project {
  category: Category;
  client: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('');
  const [selectedBudget, setSelectedBudget] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .order('sort_order');
      
      if (categoriesData) setCategories(categoriesData);

      const { data: projectsData, error } = await (supabase as any)
        .from('projects')
        .select(`
          *,
          category:categories(*),
          client:profiles!client_id(full_name, avatar_url)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (!error && projectsData) {
        setProjects(projectsData as ProjectWithCategory[]);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  // Active filter count
  const activeFilters = [selectedCategory, selectedCity, selectedUrgency, selectedBudget, searchQuery].filter(Boolean).length;

  // Filter + sort projects
  const filteredProjects = useMemo(() => {
    let result = projects.filter(project => {
      if (selectedCategory && project.category?.slug !== selectedCategory) return false;
      if (selectedCity && project.location_city !== selectedCity) return false;
      if (selectedUrgency && project.urgency !== selectedUrgency) return false;
      if (selectedBudget === 'has_budget' && !project.budget_min && !project.budget_max) return false;
      if (selectedBudget === 'no_budget' && (project.budget_min || project.budget_max)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const inTitle = project.title.toLowerCase().includes(q);
        const inDesc = project.description?.toLowerCase().includes(q);
        const inCity = project.location_city?.toLowerCase().includes(q);
        if (!inTitle && !inDesc && !inCity) return false;
      }
      return true;
    });

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'budget_high':
        result.sort((a, b) => (b.budget_max || 0) - (a.budget_max || 0));
        break;
      case 'budget_low':
        result.sort((a, b) => (a.budget_max || 99999) - (b.budget_max || 99999));
        break;
      case 'most_offers':
        result.sort((a, b) => b.offers_count - a.offers_count);
        break;
    }

    return result;
  }, [projects, selectedCategory, selectedCity, selectedUrgency, selectedBudget, searchQuery, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedCity('');
    setSelectedUrgency('');
    setSelectedBudget('');
    setSearchQuery('');
    setSortBy('newest');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Acum câteva minute';
    if (diffHours < 24) return `Acum ${diffHours} ore`;
    if (diffHours < 48) return 'Ieri';
    return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* ═══ SEARCH HERO ═══ */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 pt-8 pb-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
            Proiecte Disponibile
          </h1>
          <p className="text-slate-400 text-center mb-6 text-sm">
            Găsește proiecte care se potrivesc cu expertiza ta și trimite oferte
          </p>

          {/* ═══ SEARCH BAR ═══ */}
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 p-2 md:p-3">
            <div className="flex flex-col md:flex-row gap-2">
              {/* Category selector */}
              <div className="flex-1 min-w-0">
                <Select value={selectedCategory || '_all'} onValueChange={(v) => setSelectedCategory(v === '_all' ? '' : v)}>
                  <SelectTrigger className="h-12 md:h-14 border-0 bg-slate-50 rounded-xl text-base font-medium pl-4">
                    <div className="flex items-center gap-2">
                      <Grid3x3 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <SelectValue placeholder="Categorie" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_all">Toate categoriile</SelectItem>
                    {categories.map((cat) => {
                      const Icon = CATEGORY_ICON_COMPONENTS[cat.slug] || Sparkles;
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
                    {CITIES.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Urgency selector */}
              <div className="md:w-44 flex-shrink-0">
                <Select value={selectedUrgency || '_all'} onValueChange={(v) => setSelectedUrgency(v === '_all' ? '' : v)}>
                  <SelectTrigger className="h-12 md:h-14 border-0 bg-slate-50 rounded-xl text-base font-medium pl-4">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <SelectValue placeholder="Urgență" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_all">Orice urgență</SelectItem>
                    <SelectItem value="urgent">🔥 Urgent</SelectItem>
                    <SelectItem value="normal">📅 Normal</SelectItem>
                    <SelectItem value="flexible">🕐 Flexibil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search button */}
              <Button
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
                placeholder="Caută după titlu, descriere sau locație..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 border-0 bg-slate-50 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ QUICK CATEGORY CHIPS ═══ */}
      <div className="container mx-auto px-4 -mt-4 mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all
              ${!selectedCategory 
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300 hover:text-orange-600'}`}
          >
            Toate
          </button>
          {categories.map((cat) => {
            const Icon = CATEGORY_ICON_COMPONENTS[cat.slug] || Sparkles;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5
                  ${selectedCategory === cat.slug 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300 hover:text-orange-600'}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {/* ═══ RESULTS BAR ═══ */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">
              <strong className="text-slate-900">{filteredProjects.length}</strong> proiecte găsite
            </span>
            {activeFilters > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                <X className="w-3.5 h-3.5" />
                Resetează filtre ({activeFilters})
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Budget filter */}
            <Select value={selectedBudget || '_all'} onValueChange={(v) => setSelectedBudget(v === '_all' ? '' : v)}>
              <SelectTrigger className="w-[160px] h-9 text-sm">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                  <SelectValue placeholder="Buget" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">Orice buget</SelectItem>
                <SelectItem value="has_budget">Cu buget definit</SelectItem>
                <SelectItem value="no_budget">Așteaptă oferte</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[170px] h-9 text-sm">
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Cele mai noi</SelectItem>
                <SelectItem value="oldest">Cele mai vechi</SelectItem>
                <SelectItem value="budget_high">Buget descrescător</SelectItem>
                <SelectItem value="budget_low">Buget crescător</SelectItem>
                <SelectItem value="most_offers">Cele mai ofertate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active filter tags */}
        {activeFilters > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategory && (
              <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1 text-sm bg-orange-50 text-orange-700 border-orange-200">
                {categories.find(c => c.slug === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory('')} className="ml-1 hover:bg-orange-200 rounded-full p-0.5"><X className="w-3 h-3" /></button>
              </Badge>
            )}
            {selectedCity && (
              <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1 text-sm bg-blue-50 text-blue-700 border-blue-200">
                <MapPin className="w-3 h-3" />{selectedCity}
                <button onClick={() => setSelectedCity('')} className="ml-1 hover:bg-blue-200 rounded-full p-0.5"><X className="w-3 h-3" /></button>
              </Badge>
            )}
            {selectedUrgency && (
              <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1 text-sm bg-red-50 text-red-700 border-red-200">
                {URGENCY_LABELS[selectedUrgency as keyof typeof URGENCY_LABELS]}
                <button onClick={() => setSelectedUrgency('')} className="ml-1 hover:bg-red-200 rounded-full p-0.5"><X className="w-3 h-3" /></button>
              </Badge>
            )}
            {selectedBudget && (
              <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1 text-sm bg-green-50 text-green-700 border-green-200">
                {selectedBudget === 'has_budget' ? 'Cu buget' : 'Fără buget'}
                <button onClick={() => setSelectedBudget('')} className="ml-1 hover:bg-green-200 rounded-full p-0.5"><X className="w-3 h-3" /></button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1 text-sm bg-purple-50 text-purple-700 border-purple-200">
                &quot;{searchQuery}&quot;
                <button onClick={() => setSearchQuery('')} className="ml-1 hover:bg-purple-200 rounded-full p-0.5"><X className="w-3 h-3" /></button>
              </Badge>
            )}
          </div>
        )}

        {/* ═══ PROJECTS GRID ═══ */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-5">
                  <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                  <div className="h-16 bg-slate-100 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Nu sunt proiecte disponibile
            </h3>
            <p className="text-slate-500 mb-6">
              {activeFilters > 0 
                ? 'Încearcă să modifici filtrele pentru a vedea mai multe proiecte.'
                : 'Momentan nu există proiecte deschise. Revino mai târziu!'}
            </p>
            {activeFilters > 0 && (
              <Button variant="outline" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Resetează filtrele
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Link key={project.id} href={getProjectUrl(project)}>
                <Card className="bg-white border-slate-200 hover:border-orange-300 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer h-full">
                  <CardContent className="p-5">
                    {/* Category & Urgency */}
                    <div className="flex items-center justify-between mb-3">
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
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                      {project.title}
                    </h3>

                    {/* Description preview */}
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Photos preview (filter out old placeholder URLs) */}
                    {(() => {
                      const validPhotos = (project.photos || []).filter((url: string) => 
                        url && !url.includes('picsum.photos') && !url.includes('placeholder') && url.startsWith('http')
                      );
                      return validPhotos.length > 0 ? (
                        <div className="flex gap-2 mb-4">
                          {validPhotos.slice(0, 3).map((photo: string, i: number) => (
                            <div key={i} className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden">
                              <img src={photo} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                          {validPhotos.length > 3 && (
                            <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-sm text-slate-500">
                              +{validPhotos.length - 3}
                            </div>
                          )}
                        </div>
                      ) : null;
                    })()}

                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {project.location_city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(project.created_at)}
                      </span>
                    </div>

                    {/* Budget & Offers */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div>
                        {(() => {
                          const b = formatBudget(project.budget_min, project.budget_max);
                          return b.hasValue ? (
                            <span className="font-semibold text-slate-900">{b.text}</span>
                          ) : (
                            <span className="text-orange-500 font-medium">{b.text}</span>
                          );
                        })()}
                      </div>
                      <Badge className="bg-teal-50 text-teal-600 border-teal-200">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {project.offers_count} oferte
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* ═══ CTA ═══ */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Ai nevoie de un serviciu?
              </h3>
              <p className="text-slate-600 mb-4">
                Postează un proiect și primește oferte de la specialiști verificați
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                <Link href="/post-project">
                  <Plus className="w-4 h-4 mr-2" />
                  Postează un proiect
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
