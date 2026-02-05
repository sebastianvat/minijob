'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, MapPin, Calendar, DollarSign, Clock, Filter,
  Home, Hammer, Car, Laptop, PawPrint, Baby, ArrowRight,
  FileText, Eye, MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/header';
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      
      // Load categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .order('sort_order');
      
      if (categoriesData) {
        setCategories(categoriesData);
      }

      // Load open projects
      let query = (supabase as any)
        .from('projects')
        .select(`
          *,
          category:categories(*),
          client:profiles!client_id(full_name, avatar_url)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      const { data: projectsData, error } = await query;

      if (error) {
        console.error('Error loading projects:', error);
      } else if (projectsData) {
        setProjects(projectsData as ProjectWithCategory[]);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  // Filter projects
  const filteredProjects = projects.filter(project => {
    if (selectedCategory !== 'all' && project.category?.slug !== selectedCategory) {
      return false;
    }
    if (selectedCity !== 'all' && project.location_city !== selectedCity) {
      return false;
    }
    return true;
  });

  // Get unique cities from projects
  const cities = [...new Set(projects.map(p => p.location_city))].filter(Boolean);

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

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Proiecte Disponibile</h1>
          <p className="text-slate-600">
            Proiecte postate de clienți care așteaptă oferte de la specialiști
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">Filtrează:</span>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toate categoriile</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Oraș" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toate orașele</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="ml-auto text-sm text-slate-500">
              {filteredProjects.length} proiecte găsite
            </div>
          </div>
        </div>

        {/* Projects List */}
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
              {selectedCategory !== 'all' || selectedCity !== 'all' 
                ? 'Încearcă să modifici filtrele pentru a vedea mai multe proiecte.'
                : 'Momentan nu există proiecte deschise. Revino mai târziu!'}
            </p>
            <Button variant="outline" onClick={() => { setSelectedCategory('all'); setSelectedCity('all'); }}>
              Resetează filtrele
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="bg-white border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all cursor-pointer h-full">
                  <CardContent className="p-5">
                    {/* Category & Urgency */}
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="flex items-center gap-1 border-slate-200">
                        {CATEGORY_ICONS[project.category?.slug || '']}
                        {project.category?.name}
                      </Badge>
                      {project.urgency !== 'normal' && (
                        <Badge className={
                          project.urgency === 'urgent' 
                            ? 'bg-red-100 text-red-700 border-red-200' 
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }>
                          {URGENCY_LABELS[project.urgency]}
                        </Badge>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                      {project.title}
                    </h3>

                    {/* Description preview */}
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Photos preview */}
                    {project.photos && project.photos.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        {project.photos.slice(0, 3).map((photo, i) => (
                          <div key={i} className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden">
                            <img src={photo} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {project.photos.length > 3 && (
                          <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-sm text-slate-500">
                            +{project.photos.length - 3}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {project.location_city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(project.created_at)}
                      </span>
                    </div>

                    {/* Budget & Offers */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div>
                        {project.budget_min && project.budget_max ? (
                          <span className="font-semibold text-slate-900">
                            {project.budget_min} - {project.budget_max} lei
                          </span>
                        ) : (
                          <span className="text-slate-500">Buget nedefinit</span>
                        )}
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

        {/* CTA for posting */}
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
                  <FileText className="w-4 h-4 mr-2" />
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
