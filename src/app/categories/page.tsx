import Link from 'next/link';
import { 
  Zap, Home, Hammer, Car, Laptop, PawPrint, Baby,
  ArrowRight, Search, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/header';

const skillZones = [
  { 
    slug: 'casa', 
    name: 'Casă', 
    icon: Home, 
    color: 'bg-teal-500',
    bgLight: 'bg-teal-50',
    description: 'Curățenie, gătit, organizare, menaj',
    skills: ['Curățenie generală', 'Curățenie după renovare', 'Gătit', 'Călcat'],
    popular: true
  },
  { 
    slug: 'constructii', 
    name: 'Construcții', 
    icon: Hammer, 
    color: 'bg-amber-500',
    bgLight: 'bg-amber-50',
    description: 'Zugrăvit, parchet, renovări, reparații',
    skills: ['Zugrăvit', 'Montaj parchet', 'Montaj mobilă', 'Instalații sanitare'],
    popular: true
  },
  { 
    slug: 'auto', 
    name: 'Auto', 
    icon: Car, 
    color: 'bg-blue-500',
    bgLight: 'bg-blue-50',
    description: 'Detailing, polish, mecanică ușoară',
    skills: ['Detailing interior', 'Polish exterior', 'Spălătorie la domiciliu'],
    popular: true
  },
  { 
    slug: 'tech', 
    name: 'Tech Jobs', 
    icon: Laptop, 
    color: 'bg-purple-500',
    bgLight: 'bg-purple-50',
    description: 'Social media, data entry, tech support',
    skills: ['Social media management', 'Răspuns mesaje', 'Tech support', 'Data entry'],
    popular: false
  },
  { 
    slug: 'pets', 
    name: 'Pet Care', 
    icon: PawPrint, 
    color: 'bg-green-500',
    bgLight: 'bg-green-50',
    description: 'Plimbat câini, pet sitting, îngrijire',
    skills: ['Plimbat câini', 'Pet sitting', 'Îngrijire animale'],
    popular: false
  },
  { 
    slug: 'kids', 
    name: 'Kids & Learning', 
    icon: Baby, 
    color: 'bg-pink-500',
    bgLight: 'bg-pink-50',
    description: 'Bonă, meditații, skill-uri noi',
    skills: ['Bonă', 'Meditații matematică', 'Lecții de muzică', 'Învățare limbă străină'],
    popular: false
  },
  { 
    slug: 'altceva', 
    name: 'Altceva', 
    icon: Zap, 
    color: 'bg-slate-500',
    bgLight: 'bg-slate-50',
    description: 'Ai nevoie de altceva? Spune-ne!',
    skills: ['Orice alt skill', 'Proiecte speciale', 'Idei noi'],
    popular: false
  },
];

export default function CategoriesPage() {
  const popularZones = skillZones.filter(c => c.popular);

  return (
    <div className="min-h-screen bg-white">
      {/* Header with mobile menu */}
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-10 md:py-16 px-4">
        <div className="container mx-auto text-center">
          <Badge className="bg-teal-50 text-teal-700 border-teal-200 mb-4">
            Skill Zones
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
            Ce skill cauți?
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-6 md:mb-8 max-w-2xl mx-auto">
            Găsește specialiști verificați sau postează un proiect și primește oferte
          </p>
          
          {/* Search */}
          <div className="max-w-xl mx-auto relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              placeholder="Caută skill (ex: zugrăvit, curățenie)"
              className="pl-12 h-12 md:h-14 text-base md:text-lg border-slate-200 shadow-lg shadow-slate-200/50"
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto" asChild>
              <Link href="/post-project">
                <FileText className="w-5 h-5 mr-2" />
                Postează un proiect
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/projects">Vezi proiecte active</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Skill Zones */}
      <section className="py-8 md:py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">Cele mai căutate</h2>
              <p className="text-sm md:text-base text-slate-500">Skill Zones populare</p>
            </div>
            <Badge className="bg-orange-100 text-orange-600 border-orange-200 text-xs md:text-sm">
              🔥 Trending
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {popularZones.map((zone) => (
              <Link key={zone.slug} href={`/categories/${zone.slug}`}>
                <Card className="group h-full border-slate-200 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-500/10 transition-all cursor-pointer overflow-hidden">
                  <CardContent className="p-0">
                    <div className={`${zone.bgLight} p-6`}>
                      <div className={`w-16 h-16 ${zone.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                        <zone.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{zone.name}</h3>
                      <p className="text-slate-600 text-sm mb-3">{zone.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {zone.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs border-slate-300 text-slate-600">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-white flex items-center justify-between">
                      <p className="text-sm text-slate-500">Vezi specialiști disponibili</p>
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                        <ArrowRight className="w-5 h-5 text-teal-500 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Skill Zones */}
      <section className="py-8 md:py-12 px-4 bg-slate-50">
        <div className="container mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 md:mb-8">Toate Skill Zones</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {skillZones.map((zone) => (
              <Link key={zone.slug} href={`/categories/${zone.slug}`}>
                <Card className="group border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className={`w-14 h-14 ${zone.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                      <zone.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 text-lg">{zone.name}</h3>
                      <p className="text-sm text-slate-500">{zone.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-orange-500 transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Post Project */}
      <section className="py-10 md:py-16 px-4 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">
            Nu găsești exact ce cauți?
          </h2>
          <p className="text-orange-100 mb-6 md:mb-8 text-base md:text-lg max-w-xl mx-auto">
            Postează un proiect cu detaliile tale și primește oferte de la specialiști verificați
          </p>
          <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 w-full sm:w-auto" asChild>
            <Link href="/post-project">
              <FileText className="w-5 h-5 mr-2" />
              Postează un proiect gratuit
            </Link>
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
          <p className="text-sm text-slate-500">© 2026 MiniJob.ro - Rent a Skill</p>
        </div>
      </footer>
    </div>
  );
}
