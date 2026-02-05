'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, MapPin, Calendar, Clock, ArrowRight, Plus,
  FileText, MessageCircle, CheckCircle2, XCircle, Eye,
  Home, Hammer, Car, Laptop, PawPrint, Baby
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/header';
import { 
  Project, Category, ProjectOffer, Provider, Profile,
  URGENCY_LABELS, PROJECT_STATUS_LABELS, ProjectStatus
} from '@/types/database';

// Category icons
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  casa: <Home className="w-4 h-4" />,
  constructii: <Hammer className="w-4 h-4" />,
  auto: <Car className="w-4 h-4" />,
  tech: <Laptop className="w-4 h-4" />,
  pets: <PawPrint className="w-4 h-4" />,
  kids: <Baby className="w-4 h-4" />,
};

interface ProjectWithOffers extends Project {
  category: Category;
  offers: (ProjectOffer & {
    provider: Provider & {
      profile: Profile;
    };
  })[];
}

export default function MyProjectsPage() {
  const [projects, setProjects] = useState<ProjectWithOffers[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('open');

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        window.location.href = '/auth/login?redirect=/my-projects';
        return;
      }
      
      setUser(user);

      // Load user's projects with offers
      console.log('Loading projects for user:', user.id);
      const { data: projectsData, error } = await (supabase as any)
        .from('projects')
        .select(`
          *,
          category:categories(*),
          offers:project_offers(
            *,
            provider:providers(
              *,
              profile:profiles(*)
            )
          )
        `)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      console.log('Projects loaded:', { projectsData, error });

      if (error) {
        console.error('Error loading projects:', error);
      } else {
        setProjects(projectsData as ProjectWithOffers[] || []);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Deschis</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">În desfășurare</Badge>;
      case 'completed':
        return <Badge className="bg-slate-100 text-slate-700 border-slate-200">Finalizat</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Anulat</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Filter projects by status
  const openProjects = projects.filter(p => p.status === 'open');
  const activeProjects = projects.filter(p => p.status === 'in_progress');
  const completedProjects = projects.filter(p => p.status === 'completed' || p.status === 'cancelled');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            <div className="h-64 bg-slate-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Proiectele Mele</h1>
            <p className="text-slate-600">
              Gestionează proiectele tale și vezi ofertele primite
            </p>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600" asChild>
            <Link href="/post-project">
              <Plus className="w-4 h-4 mr-2" />
              Proiect nou
            </Link>
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card className="border-slate-200">
            <CardContent className="py-16 text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Nu ai niciun proiect
              </h3>
              <p className="text-slate-500 mb-6">
                Postează primul tău proiect și primește oferte de la specialiști
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                <Link href="/post-project">
                  <Plus className="w-4 h-4 mr-2" />
                  Postează un proiect
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="open" className="relative">
                Deschise
                {openProjects.length > 0 && (
                  <Badge className="ml-2 bg-green-500 text-white text-xs">
                    {openProjects.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="active">
                În desfășurare
                {activeProjects.length > 0 && (
                  <Badge className="ml-2 bg-blue-500 text-white text-xs">
                    {activeProjects.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed">
                Finalizate
              </TabsTrigger>
            </TabsList>

            <TabsContent value="open" className="space-y-4">
              {openProjects.length === 0 ? (
                <Card className="border-slate-200">
                  <CardContent className="py-8 text-center">
                    <p className="text-slate-500">Nu ai proiecte deschise</p>
                  </CardContent>
                </Card>
              ) : (
                openProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} formatDate={formatDate} />
                ))
              )}
            </TabsContent>

            <TabsContent value="active" className="space-y-4">
              {activeProjects.length === 0 ? (
                <Card className="border-slate-200">
                  <CardContent className="py-8 text-center">
                    <p className="text-slate-500">Nu ai proiecte în desfășurare</p>
                  </CardContent>
                </Card>
              ) : (
                activeProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} formatDate={formatDate} />
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedProjects.length === 0 ? (
                <Card className="border-slate-200">
                  <CardContent className="py-8 text-center">
                    <p className="text-slate-500">Nu ai proiecte finalizate</p>
                  </CardContent>
                </Card>
              ) : (
                completedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} formatDate={formatDate} />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

// Project Card Component
function ProjectCard({ project, formatDate }: { project: ProjectWithOffers; formatDate: (date: string) => string }) {
  const [expanded, setExpanded] = useState(false);
  const newOffersCount = project.offers?.filter(o => o.status === 'pending').length || 0;

  return (
    <Card className="border-slate-200 hover:border-teal-200 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="flex items-center gap-1 border-slate-200">
                {CATEGORY_ICONS[project.category?.slug || '']}
                {project.category?.name}
              </Badge>
              {project.status === 'open' ? (
                <Badge className="bg-green-100 text-green-700 border-green-200">Deschis</Badge>
              ) : project.status === 'in_progress' ? (
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">În desfășurare</Badge>
              ) : project.status === 'completed' ? (
                <Badge className="bg-slate-100 text-slate-700 border-slate-200">Finalizat</Badge>
              ) : (
                <Badge className="bg-red-100 text-red-700 border-red-200">Anulat</Badge>
              )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-lg text-slate-900 mb-2">{project.title}</h3>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {project.location_city}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(project.created_at)}
              </span>
              {project.budget_min && project.budget_max && (
                <span className="font-medium text-slate-900">
                  {project.budget_min} - {project.budget_max} lei
                </span>
              )}
            </div>
          </div>

          {/* Offers Count */}
          <div className="text-right">
            <Link href={`/project?id=${project.id}`}>
              <Button variant="outline" size="sm" className="mb-2">
                <Eye className="w-4 h-4 mr-2" />
                Vezi detalii
              </Button>
            </Link>
            <div className="flex items-center justify-end gap-2">
              <Badge className="bg-teal-50 text-teal-600 border-teal-200">
                <MessageCircle className="w-3 h-3 mr-1" />
                {project.offers_count} oferte
              </Badge>
              {newOffersCount > 0 && (
                <Badge className="bg-orange-500 text-white">
                  {newOffersCount} noi
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Offers Preview */}
        {project.offers && project.offers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
            >
              {expanded ? 'Ascunde ofertele' : `Vezi ${project.offers.length} oferte`}
              <ArrowRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            </button>

            {expanded && (
              <div className="mt-4 space-y-3">
                {project.offers.slice(0, 5).map((offer) => (
                  <div key={offer.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                        <span className="text-teal-600 font-semibold text-sm">
                          {offer.provider?.profile?.full_name?.[0] || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">
                          {offer.provider?.profile?.full_name || 'Specialist'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {offer.provider?.rating ? `⭐ ${offer.provider.rating}` : ''} 
                          {offer.estimated_duration ? ` • ${offer.estimated_duration}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-orange-500">{offer.price} lei</p>
                      <Link href={`/project?id=${project.id}`}>
                        <Button size="sm" variant="ghost" className="text-xs text-teal-600 hover:text-teal-700 h-6 px-2">
                          Detalii →
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                {project.offers.length > 5 && (
                  <Link href={`/project?id=${project.id}`} className="block text-center">
                    <Button variant="link" className="text-teal-600">
                      Vezi toate cele {project.offers.length} oferte
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
