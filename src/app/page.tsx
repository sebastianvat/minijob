import Link from "next/link";
import { Sparkles, Hammer, Wrench, Leaf, Clock, Shield, Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  { name: "Curățenie", icon: Sparkles, color: "bg-pink-500", price: "de la 50 lei/h" },
  { name: "Montaj Mobilă", icon: Hammer, color: "bg-amber-500", price: "de la 100 lei" },
  { name: "Reparații", icon: Wrench, color: "bg-blue-500", price: "de la 80 lei/h" },
  { name: "Grădinărit", icon: Leaf, color: "bg-green-500", price: "de la 50 lei/h" },
];

const benefits = [
  { icon: Clock, title: "Booking în 60 secunde", description: "Alegi serviciul, prestator și ora. Gata!" },
  { icon: Shield, title: "Prestatori verificați", description: "Identitate verificată, reviews reale" },
  { icon: Star, title: "Garanție satisfacție", description: "Nu ești mulțumit? Îți returnăm banii" },
];

const stats = [
  { value: "500+", label: "Prestatori activi" },
  { value: "10k+", label: "Servicii finalizate" },
  { value: "4.8★", label: "Rating mediu" },
  { value: "60s", label: "Timp booking" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MiniJob</span>
            <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
              beta
            </Badge>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#categorii" className="text-slate-400 hover:text-white transition-colors">
              Servicii
            </Link>
            <Link href="#cum-functioneaza" className="text-slate-400 hover:text-white transition-colors">
              Cum funcționează
            </Link>
            <Link href="/auth/login" className="text-slate-400 hover:text-white transition-colors">
              Intră în cont
            </Link>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
              Devino prestator
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-indigo-300 text-sm">Acum disponibil în Sibiu</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Servicii la domiciliu
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              în 60 de secunde
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Curățenie, montaj mobilă, reparații — găsești prestatori verificați și rezervi instant. 
            Fără așteptare, fără bătăi de cap.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-lg h-14 px-8">
              Găsește prestator
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800 text-lg h-14 px-8">
              Vezi cum funcționează
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categorii" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ce serviciu cauți?
            </h2>
            <p className="text-slate-400">Alege categoria și găsește prestatori disponibili acum</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {categories.map((cat) => (
              <Card 
                key={cat.name} 
                className="bg-slate-900/50 border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group hover:scale-105"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <cat.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{cat.name}</h3>
                  <p className="text-sm text-slate-500">{cat.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="link" className="text-indigo-400 hover:text-indigo-300">
              Vezi toate categoriile →
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="cum-functioneaza" className="py-20 px-4 bg-slate-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simplu ca 1-2-3
            </h2>
            <p className="text-slate-400">Booking instant, fără așteptare</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Alege serviciul", desc: "Selectezi categoria și ce ai nevoie" },
              { step: "2", title: "Alege prestator", desc: "Vezi disponibilitate, reviews și preț" },
              { step: "3", title: "Confirmare instant", desc: "Rezervi și primești confirmare" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-slate-400">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 border-0 max-w-4xl mx-auto overflow-hidden">
            <CardContent className="p-10 md:p-16 text-center relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ești meseriaș?
                </h2>
                <p className="text-xl text-indigo-100 mb-8 max-w-xl mx-auto">
                  Înscrie-te ca prestator și primește clienți noi în fiecare zi. Fără abonament, plătești doar per job.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-slate-100 text-lg h-14 px-8">
                    Înscrie-te gratuit
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-6 mt-8 text-indigo-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>0% comision primele 30 zile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Fără abonament</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-800">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MiniJob</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <Link href="/terms" className="hover:text-slate-300">Termeni și condiții</Link>
              <Link href="/privacy" className="hover:text-slate-300">Confidențialitate</Link>
              <Link href="/contact" className="hover:text-slate-300">Contact</Link>
            </div>
            <div className="text-sm text-slate-600">
              © 2026 MiniJob.ro - Transilvania Business Suite
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
