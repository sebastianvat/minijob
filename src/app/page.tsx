import Link from "next/link";
import { 
  Sparkles, Hammer, Wrench, Leaf, Clock, Shield, Star, 
  ArrowRight, CheckCircle2, Users, Zap, Heart, MapPin,
  Phone, Calendar, CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";

const categories = [
  { name: "Curățenie", icon: Sparkles, color: "bg-orange-500", price: "de la 50 lei/h", desc: "Curățenie generală sau detaliată", slug: "curatenie" },
  { name: "Montaj Mobilă", icon: Hammer, color: "bg-orange-500", price: "de la 100 lei", desc: "IKEA, Jysk, Dedeman", slug: "montaj-mobila" },
  { name: "Reparații", icon: Wrench, color: "bg-orange-500", price: "de la 80 lei/h", desc: "Reparații mici în casă", slug: "reparatii" },
  { name: "Grădinărit", icon: Leaf, color: "bg-orange-500", price: "de la 50 lei/h", desc: "Întreținere grădină", slug: "gradinarit" },
];

const steps = [
  { 
    step: "1", 
    title: "Alegi serviciul", 
    desc: "Selectezi ce ai nevoie din categoriile disponibile",
    icon: Calendar
  },
  { 
    step: "2", 
    title: "Găsești prestator", 
    desc: "Vezi disponibilitate, reviews și prețuri",
    icon: Users
  },
  { 
    step: "3", 
    title: "Confirmi instant", 
    desc: "Rezervi în 60 de secunde, fără așteptare",
    icon: CheckCircle2
  },
];

const benefits = [
  { icon: Clock, title: "60 secunde", description: "Booking instant, nu aștepți oferte" },
  { icon: Shield, title: "Verificați", description: "Prestatori cu identitate verificată" },
  { icon: Star, title: "4.8★ rating", description: "Doar prestatori de calitate" },
  { icon: Heart, title: "Garanție", description: "Satisfacție sau banii înapoi" },
];

const testimonials = [
  {
    name: "Maria P.",
    role: "Client din Sibiu",
    text: "Am găsit o femeie de serviciu în 5 minute! Foarte mulțumită de curățenie.",
    rating: 5
  },
  {
    name: "Andrei M.",
    role: "Prestator montaj",
    text: "Primesc comenzi constant. Platforma e foarte ușor de folosit.",
    rating: 5
  },
  {
    name: "Elena D.",
    role: "Client din Sibiu",
    text: "Montaj mobilă IKEA rapid și profesionist. Recomand!",
    rating: 5
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero */}
      <section className="pt-8 pb-20 px-4 bg-gradient-to-b from-orange-50/50 to-white">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-orange-100 text-orange-600 border-orange-200 mb-6 px-4 py-2">
                <MapPin className="w-4 h-4 mr-2" />
                Acum disponibil în Sibiu
              </Badge>
              
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Servicii la domiciliu
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600"> în 60 de secunde</span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Curățenie, montaj mobilă, reparații — găsești prestatori verificați și rezervi instant. 
                Fără așteptare, fără bătăi de cap.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white text-lg h-14 px-8 shadow-xl shadow-orange-500/25" asChild>
                  <Link href="/categories">
                    Găsește prestator
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-50 text-lg h-14 px-8">
                  <Phone className="mr-2 w-5 h-5" />
                  0700 000 000
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>500+ prestatori verificați</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>10.000+ servicii finalizate</span>
                </div>
              </div>
            </div>

            {/* Hero Mockup */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-6">
                {/* Phone mockup */}
                <div className="bg-slate-900 rounded-2xl p-4 max-w-[280px] mx-auto">
                  <div className="bg-white rounded-xl overflow-hidden">
                    {/* Status bar */}
                    <div className="bg-slate-50 px-4 py-2 flex justify-between items-center text-xs text-slate-500">
                      <span>9:41</span>
                      <span>●●●●○</span>
                    </div>
                    {/* App content */}
                    <div className="p-4">
                      <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Sparkles className="w-6 h-6 text-orange-500" />
                        </div>
                        <p className="font-semibold text-slate-900">Curățenie generală</p>
                        <p className="text-sm text-slate-500">2 ore • 100 lei</p>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                          <div className="w-8 h-8 bg-orange-100 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Ana M. ⭐ 4.9</p>
                            <p className="text-xs text-slate-500">Disponibilă azi</p>
                          </div>
                          <Badge className="bg-green-100 text-green-700 text-xs">Online</Badge>
                        </div>
                      </div>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-sm">
                        Rezervă acum
                      </Button>
                    </div>
                  </div>
                </div>
                {/* Floating elements */}
                <div className="absolute -right-4 top-1/4 bg-white rounded-xl shadow-lg p-3 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">Rezervare confirmată!</span>
                  </div>
                </div>
                <div className="absolute -left-4 bottom-1/4 bg-white rounded-xl shadow-lg p-3 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">4.9 rating mediu</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="servicii" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-orange-100 text-orange-600 border-orange-200 mb-4">
              Servicii disponibile
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Ce serviciu cauți?
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Alege categoria și găsește prestatori disponibili acum în zona ta
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {categories.map((cat) => (
              <Link key={cat.name} href={`/categories/${cat.slug}`}>
                <Card className="group bg-white border-slate-200 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 transition-all cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/25`}>
                      <cat.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{cat.name}</h3>
                    <p className="text-sm text-slate-500 mb-3">{cat.desc}</p>
                    <p className="text-orange-500 font-semibold">{cat.price}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50" asChild>
              <Link href="/categories">
                Vezi toate categoriile
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="cum-functioneaza" className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-600 border-orange-200 mb-4">
              Simplu și rapid
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Cum funcționează?
            </h2>
            <p className="text-slate-600 text-lg">
              3 pași simpli până la serviciul perfect
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((item, index) => (
              <div key={item.step} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-orange-200"></div>
                )}
                <div className="relative bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg shadow-orange-500/25">
                    {item.step}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center p-6">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{benefit.title}</h3>
                <p className="text-slate-500 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimoniale" className="py-20 px-4 bg-gradient-to-b from-white to-orange-50/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-orange-100 text-orange-600 border-orange-200 mb-4">
              Testimoniale
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Ce spun clienții noștri
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
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-orange-500 font-semibold">{t.name[0]}</span>
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
          <Card className="bg-gradient-to-br from-orange-400 to-orange-500 border-0 max-w-4xl mx-auto overflow-hidden shadow-2xl shadow-orange-500/25">
            <CardContent className="p-10 md:p-16">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Ești meseriaș?
                  </h2>
                  <p className="text-xl text-orange-100 mb-6">
                    Înscrie-te ca prestator și primește clienți noi în fiecare zi. Fără abonament!
                  </p>
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-white">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>0% comision primele 30 zile</span>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Clienți verificați din zona ta</span>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Plată sigură și la timp</span>
                    </div>
                  </div>
                  <Button size="lg" className="bg-white text-orange-500 hover:bg-orange-50 text-lg h-14 px-8 shadow-lg" asChild>
                    <Link href="/auth/register">
                      Înscrie-te gratuit
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </div>
                <div className="hidden md:block">
                  <div className="bg-white/20 backdrop-blur rounded-2xl p-6">
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">+2.500 lei</p>
                          <p className="text-sm text-slate-500">Venituri luna aceasta</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">12 rezervări</p>
                          <p className="text-sm text-slate-500">Săptămâna aceasta</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Star className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">4.9 rating</p>
                          <p className="text-sm text-slate-500">Din 48 recenzii</p>
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
              <p className="text-slate-400 text-sm">
                Platformă marketplace pentru servicii la domiciliu. Booking în 60 de secunde.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Servicii</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/categories/curatenie" className="hover:text-orange-400">Curățenie</Link></li>
                <li><Link href="/categories/montaj-mobila" className="hover:text-orange-400">Montaj mobilă</Link></li>
                <li><Link href="/categories/reparatii" className="hover:text-orange-400">Reparații</Link></li>
                <li><Link href="/categories/gradinarit" className="hover:text-orange-400">Grădinărit</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Companie</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-orange-400">Despre noi</Link></li>
                <li><Link href="/auth/register" className="hover:text-orange-400">Devino prestator</Link></li>
                <li><Link href="#" className="hover:text-orange-400">Blog</Link></li>
                <li><Link href="#" className="hover:text-orange-400">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-orange-400">Termeni și condiții</Link></li>
                <li><Link href="#" className="hover:text-orange-400">Politica de confidențialitate</Link></li>
                <li><Link href="#" className="hover:text-orange-400">GDPR</Link></li>
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
