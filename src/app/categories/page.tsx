import Link from 'next/link';
import { 
  Zap, Sparkles, Hammer, Wrench, PaintBucket, 
  Zap as ZapIcon, Leaf, Truck, ArrowRight, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const categories = [
  { 
    slug: 'curatenie', 
    name: 'Curățenie', 
    icon: Sparkles, 
    color: 'bg-pink-500',
    bgLight: 'bg-pink-50',
    description: 'Curățenie generală, detaliată sau după renovare',
    priceRange: '50-150 lei/h',
    providers: 45,
    popular: true
  },
  { 
    slug: 'montaj-mobila', 
    name: 'Montaj Mobilă', 
    icon: Hammer, 
    color: 'bg-amber-500',
    bgLight: 'bg-amber-50',
    description: 'Montaj mobilier IKEA, Jysk, Dedeman',
    priceRange: '100-500 lei',
    providers: 32,
    popular: true
  },
  { 
    slug: 'reparatii', 
    name: 'Reparații', 
    icon: Wrench, 
    color: 'bg-blue-500',
    bgLight: 'bg-blue-50',
    description: 'Reparații mici în casă, obiecte sanitare',
    priceRange: '80-200 lei/h',
    providers: 28,
    popular: true
  },
  { 
    slug: 'zugravit', 
    name: 'Zugrăvit', 
    icon: PaintBucket, 
    color: 'bg-purple-500',
    bgLight: 'bg-purple-50',
    description: 'Zugrăvit și vopsit pereți, tencuială',
    priceRange: '500-5000 lei',
    providers: 18,
    popular: false
  },
  { 
    slug: 'instalatii', 
    name: 'Instalații', 
    icon: ZapIcon, 
    color: 'bg-yellow-500',
    bgLight: 'bg-yellow-50',
    description: 'Instalații sanitare și electrice',
    priceRange: '100-300 lei/h',
    providers: 15,
    popular: false
  },
  { 
    slug: 'gradinarit', 
    name: 'Grădinărit', 
    icon: Leaf, 
    color: 'bg-green-500',
    bgLight: 'bg-green-50',
    description: 'Întreținere grădină, gazon, plante',
    priceRange: '50-150 lei/h',
    providers: 12,
    popular: false
  },
  { 
    slug: 'mutari', 
    name: 'Mutări', 
    icon: Truck, 
    color: 'bg-slate-600',
    bgLight: 'bg-slate-50',
    description: 'Transport și mutare mobilier',
    priceRange: '200-2000 lei',
    providers: 8,
    popular: false
  },
];

export default function CategoriesPage() {
  const popularCategories = categories.filter(c => c.popular);
  const otherCategories = categories.filter(c => !c.popular);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">MiniJob</span>
          </Link>
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

      {/* Hero */}
      <section className="bg-gradient-to-b from-orange-50/50 to-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Ce serviciu cauți?
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Alege categoria și găsește prestatori verificați disponibili în zona ta
          </p>
          
          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              placeholder="Caută serviciu (ex: curățenie, montaj pat)"
              className="pl-12 h-14 text-lg border-slate-200 shadow-lg shadow-slate-200/50"
            />
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Cele mai căutate</h2>
              <p className="text-slate-500">Servicii populare în Sibiu</p>
            </div>
            <Badge className="bg-orange-100 text-orange-600 border-orange-200">
              🔥 Trending
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {popularCategories.map((cat) => (
              <Link key={cat.slug} href={`/categories/${cat.slug}`}>
                <Card className="group h-full border-slate-200 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 transition-all cursor-pointer overflow-hidden">
                  <CardContent className="p-0">
                    <div className={`${cat.bgLight} p-6`}>
                      <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                        <cat.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.name}</h3>
                      <p className="text-slate-600 text-sm mb-4">{cat.description}</p>
                    </div>
                    <div className="p-4 bg-white flex items-center justify-between">
                      <div>
                        <p className="text-orange-500 font-semibold">{cat.priceRange}</p>
                        <p className="text-sm text-slate-500">{cat.providers} prestatori</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                        <ArrowRight className="w-5 h-5 text-orange-500 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Categories */}
      <section className="py-12 px-4 bg-slate-50">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Toate categoriile</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/categories/${cat.slug}`}>
                <Card className="group border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <cat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{cat.name}</h3>
                      <p className="text-sm text-slate-500">{cat.providers} prestatori</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-orange-500 transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Nu găsești ce cauți?
          </h2>
          <p className="text-slate-600 mb-6">
            Spune-ne ce serviciu ai nevoie și te ajutăm să găsești prestatori
          </p>
          <Button className="bg-orange-500 hover:bg-orange-600">
            Solicită serviciu personalizat
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-200">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">MiniJob</span>
          </Link>
          <p className="text-sm text-slate-500">© 2026 MiniJob.ro</p>
        </div>
      </footer>
    </div>
  );
}
