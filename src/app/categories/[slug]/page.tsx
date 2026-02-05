import Link from 'next/link';
import { 
  Zap, Sparkles, Hammer, Wrench, PaintBucket, 
  Zap as ZapIcon, Leaf, Truck, ArrowLeft, Star,
  MapPin, Clock, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Generate static paths for all categories
export function generateStaticParams() {
  return [
    { slug: 'curatenie' },
    { slug: 'montaj-mobila' },
    { slug: 'reparatii' },
    { slug: 'zugravit' },
    { slug: 'instalatii' },
    { slug: 'gradinarit' },
    { slug: 'mutari' },
  ];
}

const categoryData: Record<string, { 
  name: string; 
  icon: typeof Sparkles; 
  color: string;
  description: string;
}> = {
  'curatenie': { name: 'Curățenie', icon: Sparkles, color: 'bg-pink-500', description: 'Curățenie generală, detaliată sau după renovare' },
  'montaj-mobila': { name: 'Montaj Mobilă', icon: Hammer, color: 'bg-amber-500', description: 'Montaj mobilier IKEA, Jysk, Dedeman' },
  'reparatii': { name: 'Reparații', icon: Wrench, color: 'bg-blue-500', description: 'Reparații mici în casă' },
  'zugravit': { name: 'Zugrăvit', icon: PaintBucket, color: 'bg-purple-500', description: 'Zugrăvit și vopsit pereți' },
  'instalatii': { name: 'Instalații', icon: ZapIcon, color: 'bg-yellow-500', description: 'Instalații sanitare și electrice' },
  'gradinarit': { name: 'Grădinărit', icon: Leaf, color: 'bg-green-500', description: 'Întreținere grădină și curte' },
  'mutari': { name: 'Mutări', icon: Truck, color: 'bg-slate-600', description: 'Transport și mutare mobilier' },
};

// Mock providers for demo
const mockProviders = [
  {
    id: '1',
    name: 'Ana Maria P.',
    rating: 4.9,
    reviews: 48,
    price: '60 lei/h',
    verified: true,
    avatar: 'A',
    city: 'Sibiu',
    responseTime: '< 1 oră',
    completedJobs: 156,
    description: 'Curățenie profesională cu atenție la detalii. Experiență 5+ ani.'
  },
  {
    id: '2',
    name: 'Ion Munteanu',
    rating: 4.8,
    reviews: 32,
    price: '55 lei/h',
    verified: true,
    avatar: 'I',
    city: 'Sibiu',
    responseTime: '< 2 ore',
    completedJobs: 98,
    description: 'Servicii de curățenie pentru apartamente și case.'
  },
  {
    id: '3',
    name: 'Elena Radu',
    rating: 4.7,
    reviews: 24,
    price: '50 lei/h',
    verified: false,
    avatar: 'E',
    city: 'Sibiu',
    responseTime: '< 3 ore',
    completedJobs: 45,
    description: 'Curățenie generală și după renovare.'
  },
  {
    id: '4',
    name: 'Maria Ionescu',
    rating: 5.0,
    reviews: 18,
    price: '70 lei/h',
    verified: true,
    avatar: 'M',
    city: 'Sibiu',
    responseTime: '< 1 oră',
    completedJobs: 67,
    description: 'Servicii premium de curățenie. Produse eco.'
  },
];

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  
  const category = categoryData[slug] || { 
    name: 'Categorie', 
    icon: Sparkles, 
    color: 'bg-orange-500',
    description: 'Descriere categorie'
  };

  const IconComponent = category.icon;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/categories">
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
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Intră în cont</Link>
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600" asChild>
              <Link href="/auth/register">Devino prestator</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Category Hero */}
      <section className="bg-white border-b border-slate-100 py-8 px-4">
        <div className="container mx-auto">
          <div className="flex items-start gap-6">
            <div className={`w-20 h-20 ${category.color} rounded-2xl flex items-center justify-center shadow-lg`}>
              <IconComponent className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{category.name}</h1>
              <p className="text-slate-600 mb-3">{category.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <Badge variant="outline" className="border-slate-200">
                  <MapPin className="w-3 h-3 mr-1" />
                  Sibiu
                </Badge>
                <span className="text-slate-500">{mockProviders.length} prestatori disponibili</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-6 px-4">
        <div className="container mx-auto">
          {/* Filter Bar */}
          <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="cursor-pointer hover:bg-orange-50 hover:border-orange-300">
                Verificați
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-orange-50 hover:border-orange-300">
                Disponibili azi
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-orange-50 hover:border-orange-300">
                Rating 4.5+
              </Badge>
            </div>
            <span className="text-sm text-slate-500">Sortare: Recomandat</span>
          </div>

          {/* Provider Cards */}
          <div className="space-y-4">
            {mockProviders.map((provider) => (
              <Link key={provider.id} href={`/providers/${provider.id}`}>
                <Card className="group border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                          <span className="text-2xl font-bold text-orange-600">{provider.avatar}</span>
                        </div>
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold text-slate-900">{provider.name}</h3>
                              {provider.verified && (
                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Verificat
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="font-medium text-slate-900">{provider.rating}</span>
                                <span>({provider.reviews} reviews)</span>
                              </span>
                              <span>•</span>
                              <span>{provider.completedJobs} servicii</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-orange-500">{provider.price}</p>
                          </div>
                        </div>
                        
                        <p className="text-slate-600 mb-3">{provider.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-slate-500">
                            <MapPin className="w-4 h-4" />
                            {provider.city}
                          </span>
                          <span className="flex items-center gap-1 text-slate-500">
                            <Clock className="w-4 h-4" />
                            Răspunde {provider.responseTime}
                          </span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex-shrink-0 flex items-center">
                        <Button className="bg-orange-500 hover:bg-orange-600">
                          Vezi profil
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Încarcă mai mulți prestatori
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
