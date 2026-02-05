import Link from "next/link";
import { 
  Clock, Shield, Star, ArrowRight, CheckCircle2, Users, Zap, Heart, MapPin,
  Phone, Calendar, CreditCard, Home as HomeIcon, Hammer, Car, Laptop, PawPrint, Baby, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";

// New Skill Zones
const skillZones = [
  { 
    name: "Casă", 
    icon: HomeIcon, 
    color: "bg-slate-700", 
    skills: "Curățenie, gătit, organizare",
    providers: 234,
    slug: "casa" 
  },
  { 
    name: "Construcții", 
    icon: Hammer, 
    color: "bg-slate-700", 
    skills: "Zugrăvit, parchet, renovări",
    providers: 156,
    slug: "constructii" 
  },
  { 
    name: "Auto", 
    icon: Car, 
    color: "bg-slate-700", 
    skills: "Detailing, polish, transport",
    providers: 89,
    slug: "auto" 
  },
  { 
    name: "Tech Jobs", 
    icon: Laptop, 
    color: "bg-slate-700", 
    skills: "Social media, data entry",
    providers: 67,
    slug: "tech" 
  },
  { 
    name: "Pet Care", 
    icon: PawPrint, 
    color: "bg-slate-700", 
    skills: "Plimbat câini, pet sitting",
    providers: 45,
    slug: "pets" 
  },
  { 
    name: "Kids & Learning", 
    icon: Baby, 
    color: "bg-slate-700", 
    skills: "Bonă, meditații, skill-uri",
    providers: 78,
    slug: "kids" 
  },
];

const steps = [
  { 
    step: "1", 
    title: "Postezi proiectul", 
    desc: "Descrii ce ai nevoie, adaugi poze și buget",
    icon: FileText
  },
  { 
    step: "2", 
    title: "Primești oferte", 
    desc: "Specialiștii fac oferte cu preț și disponibilitate",
    icon: Users
  },
  { 
    step: "3", 
    title: "Alegi tu", 
    desc: "Compari rating, portofoliu și preț, apoi alegi",
    icon: CheckCircle2
  },
];

const benefits = [
  { icon: Shield, title: "Trust Score", description: "Rating per skill, nu rating general", color: "bg-teal-100 text-teal-600" },
  { icon: Star, title: "Portofoliu", description: "Poze reale din lucrări anterioare", color: "bg-teal-100 text-teal-600" },
  { icon: Users, title: "Compari oferte", description: "Nu accepți prima, alegi tu cel mai bun", color: "bg-teal-100 text-teal-600" },
  { icon: Heart, title: "Garanție", description: "Satisfacție sau banii înapoi", color: "bg-teal-100 text-teal-600" },
];

const testimonials = [
  {
    name: "Maria P.",
    role: "Client din Sibiu",
    text: "Am postat că am nevoie de zugrăvit și în 2 ore aveam 5 oferte. Am ales pe cel cu cel mai bun portofoliu!",
    rating: 5
  },
  {
    name: "Ion M.",
    role: "Prestator zugrăvit",
    text: "Îmi place că pot face oferte la proiecte. Am un rating de 4.9 pe zugrăvit și clienții mă aleg pentru asta.",
    rating: 5
  },
  {
    name: "Elena D.",
    role: "Client din Sibiu",
    text: "Am comparat 3 oferte pentru detailing auto. Am ales-o pe cea cu poze din lucrări similare. Perfect!",
    rating: 5
  },
];

// Recent projects preview
const recentProjects = [
  {
    title: "Zugrăvit 3 camere apartament",
    category: "Construcții",
    budget: "1500-2500",
    offers: 5,
    city: "Sibiu"
  },
  {
    title: "Detailing complet BMW X5",
    category: "Auto",
    budget: "300-500",
    offers: 3,
    city: "Cluj"
  },
  {
    title: "Curățenie după renovare",
    category: "Casă",
    budget: "400-600",
    offers: 8,
    city: "Sibiu"
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero - New "Rent a Skill" */}
      <section className="pt-8 pb-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-teal-50 text-teal-600 border-teal-200 mb-6 px-4 py-2">
              <MapPin className="w-4 h-4 mr-2" />
              Acum disponibil în Sibiu, Cluj, București
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 leading-tight">
              Rent a Skill
            </h1>
            
            <p className="text-2xl text-slate-600 mb-8 leading-relaxed">
              Închiriază skill-ul cuiva pentru câteva ore.
            </p>
            
            {/* Dual CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white text-lg h-14 px-8 shadow-xl shadow-orange-500/25" asChild>
                <Link href="/post-project">
                  <FileText className="mr-2 w-5 h-5" />
                  Postează un proiect
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-50 text-lg h-14 px-8" asChild>
                <Link href="/categories">
                  Caută un skill
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-500" />
                <span>500+ specialiști verificați</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-500" />
                <span>Rating per skill</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-500" />
                <span>Portofoliu cu dovezi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skill Zones */}
      <section id="servicii" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-slate-100 text-slate-600 border-slate-200 mb-4">
              Skill Zones
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Ce skill cauți?
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Alege zona și găsește specialiști cu skill-uri verificate
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {skillZones.map((zone) => (
              <Link key={zone.slug} href={`/categories/${zone.slug}`}>
                <Card className="group bg-white border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all cursor-pointer h-full text-center">
                  <CardContent className="p-4">
                    <div className={`w-14 h-14 ${zone.color} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      <zone.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">{zone.name}</h3>
                    <p className="text-xs text-slate-500 mb-2">{zone.skills}</p>
                    <Badge variant="outline" className="text-xs border-teal-200 text-teal-600">
                      {zone.providers} pro
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-orange-100 text-orange-600 border-orange-200 mb-4">
              Proiecte active
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Proiecte care așteaptă oferte
            </h2>
            <p className="text-slate-600 text-lg">
              Clienții postează, specialiștii fac oferte
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
            {recentProjects.map((project, i) => (
              <Card key={i} className="bg-white border-slate-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <Badge variant="outline" className="mb-3 text-xs border-slate-200">
                    {project.category}
                  </Badge>
                  <h3 className="font-semibold text-slate-900 mb-2">{project.title}</h3>
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {project.city}
                    </span>
                    <span className="font-medium text-slate-900">{project.budget} lei</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-teal-50 text-teal-600 border-teal-200">
                      {project.offers} oferte
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600 hover:bg-orange-50">
                      Vezi detalii →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button className="bg-orange-500 hover:bg-orange-600" asChild>
              <Link href="/post-project">
                <FileText className="mr-2 w-4 h-4" />
                Postează și tu un proiect
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="cum-functioneaza" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-slate-100 text-slate-600 border-slate-200 mb-4">
              Cum funcționează
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Postezi → Primești oferte → Alegi
            </h2>
            <p className="text-slate-600 text-lg">
              Nu accepți primul preț. Tu alegi de la cine cumperi.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((item, index) => (
              <div key={item.step} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-slate-200"></div>
                )}
                <div className="relative bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100">
                  <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                    {item.step}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits - Trust focused */}
      <section className="py-20 px-4 bg-teal-50/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-teal-100 text-teal-600 border-teal-200 mb-4">
              De ce MiniJob?
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Trust prin transparență
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center p-6 bg-white rounded-xl border border-slate-100">
                <div className={`w-14 h-14 rounded-2xl ${benefit.color} flex items-center justify-center mx-auto mb-4`}>
                  <benefit.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{benefit.title}</h3>
                <p className="text-slate-500 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimoniale" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-slate-100 text-slate-600 border-slate-200 mb-4">
              Testimoniale
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Ce spun utilizatorii
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <Card key={i} className="bg-white border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                      <span className="text-teal-600 font-semibold">{t.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{t.name}</p>
                      <p className="text-sm text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Provider */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-slate-900 border-0 max-w-4xl mx-auto overflow-hidden">
            <CardContent className="p-10 md:p-16">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 mb-4">
                    Pentru specialiști
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Ai un skill? Monetizează-l!
                  </h2>
                  <p className="text-xl text-slate-400 mb-6">
                    Înscrie-te, adaugă skill-urile tale cu portofoliu, și primește cereri de ofertă.
                  </p>
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-teal-400" />
                      <span>Rating separat pe fiecare skill</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-teal-400" />
                      <span>Portofoliu cu poze din lucrări</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-teal-400" />
                      <span>Tu faci oferta, nu aștepți</span>
                    </div>
                  </div>
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white text-lg h-14 px-8" asChild>
                    <Link href="/auth/register">
                      Înscrie-te gratuit
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </div>
                <div className="hidden md:block">
                  <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                    <div className="space-y-4">
                      <div className="bg-slate-700/50 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center">
                          <Star className="w-6 h-6 text-teal-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">⭐ 4.9 pe Zugrăvit</p>
                          <p className="text-sm text-slate-400">127 lucrări finalizate</p>
                        </div>
                      </div>
                      <div className="bg-slate-700/50 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">+3.200 lei</p>
                          <p className="text-sm text-slate-400">Venituri luna aceasta</p>
                        </div>
                      </div>
                      <div className="bg-slate-700/50 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                          <FileText className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">5 proiecte noi</p>
                          <p className="text-sm text-slate-400">Așteaptă oferta ta</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">MiniJob</span>
              </Link>
              <p className="text-slate-400 text-sm mb-2">
                <strong className="text-white">Rent a Skill</strong>
              </p>
              <p className="text-slate-400 text-sm">
                Închiriază skill-ul cuiva pentru câteva ore.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Skill Zones</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/categories/casa" className="hover:text-teal-400">Casă</Link></li>
                <li><Link href="/categories/constructii" className="hover:text-teal-400">Construcții</Link></li>
                <li><Link href="/categories/auto" className="hover:text-teal-400">Auto</Link></li>
                <li><Link href="/categories/tech" className="hover:text-teal-400">Tech Jobs</Link></li>
                <li><Link href="/categories/pets" className="hover:text-teal-400">Pet Care</Link></li>
                <li><Link href="/categories/kids" className="hover:text-teal-400">Kids & Learning</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Platformă</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/post-project" className="hover:text-teal-400">Postează proiect</Link></li>
                <li><Link href="/auth/register" className="hover:text-teal-400">Devino specialist</Link></li>
                <li><Link href="#cum-functioneaza" className="hover:text-teal-400">Cum funcționează</Link></li>
                <li><Link href="#" className="hover:text-teal-400">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/terms" className="hover:text-teal-400">Termeni și condiții</Link></li>
                <li><Link href="/privacy" className="hover:text-teal-400">Politica de confidențialitate</Link></li>
                <li><Link href="#" className="hover:text-teal-400">GDPR</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © 2026 MiniJob.ro - Transilvania Business Suite
            </p>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-slate-700 text-slate-400">
                🇷🇴 Made in Sibiu
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
