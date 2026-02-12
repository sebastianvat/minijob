'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { 
  ArrowRight, CheckCircle2, Users, Zap, Heart, MapPin, Search,
  Star, Home as HomeIcon, Hammer, Car, Laptop, PawPrint, Baby, 
  FileText, Shield, Briefcase, TrendingUp, Clock, ChevronRight,
  Sparkles, Award, Eye, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { createClient } from '@/lib/supabase/client';
import { getProjectUrl } from '@/lib/utils';

// Skill Zones config
const skillZones = [
  { name: "Casă", icon: HomeIcon, gradient: "from-teal-500 to-teal-600", skills: "Curățenie, gătit, organizare", slug: "casa", emoji: "🏠" },
  { name: "Construcții", icon: Hammer, gradient: "from-amber-500 to-amber-600", skills: "Zugrăvit, parchet, renovări", slug: "constructii", emoji: "🔨" },
  { name: "Auto", icon: Car, gradient: "from-blue-500 to-blue-600", skills: "Detailing, polish, transport", slug: "auto", emoji: "🚗" },
  { name: "Tech Jobs", icon: Laptop, gradient: "from-purple-500 to-purple-600", skills: "Social media, data entry", slug: "tech", emoji: "💻" },
  { name: "Pet Care", icon: PawPrint, gradient: "from-green-500 to-green-600", skills: "Plimbat câini, pet sitting", slug: "pets", emoji: "🐾" },
  { name: "Kids & Learning", icon: Baby, gradient: "from-pink-500 to-pink-600", skills: "Bonă, meditații, skill-uri", slug: "kids", emoji: "👶" },
];

// Popular searches
const popularSearches = [
  "Curățenie apartament", "Zugrăvit", "Detailing auto", 
  "Montaj mobilă", "Bonă", "Instalații sanitare"
];

interface ProjectPreview {
  id: string;
  title: string;
  location_city: string;
  budget_min: number | null;
  budget_max: number | null;
  offers_count: number;
  created_at: string;
  category: { name: string; slug: string } | null;
}

export default function Home() {
  const [projects, setProjects] = useState<ProjectPreview[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadProjects = async () => {
      const supabase = createClient();
      const { data } = await (supabase as any)
        .from('projects')
        .select('id, title, location_city, budget_min, budget_max, offers_count, created_at, category:categories(name, slug)')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(9);
      
      if (data) setProjects(data);
    };
    loadProjects();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/categories?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Acum câteva minute';
    if (hours < 24) return `Acum ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Ieri';
    return `Acum ${days} zile`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* HERO - "Ce trebuie să faci?" - direct, fara jargon        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-orange-50/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative container mx-auto px-4 pt-12 pb-16 md:pt-16 md:pb-24">
          <div className="max-w-3xl mx-auto text-center">
            {/* Location pill */}
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 text-sm text-slate-600 mb-8 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <MapPin className="w-3.5 h-3.5" />
              Disponibil în Sibiu, Cluj, București
            </div>
            
            {/* Main headline */}
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4 leading-tight tracking-tight">
              Găsește pe cineva<br />
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                care știe ce face
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-xl mx-auto">
              Meșteri, specialiști și freelanceri verificați. Postezi ce ai nevoie, primești oferte, alegi tu.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
              <div className="flex items-center bg-white border-2 border-slate-200 rounded-2xl p-2 shadow-xl shadow-slate-200/50 focus-within:border-orange-400 focus-within:shadow-orange-100/50 transition-all">
                <Search className="w-5 h-5 text-slate-400 ml-4" />
                <input
                  type="text"
                  placeholder="Ce serviciu cauți? (ex: zugrăvit, curățenie, detailing...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 bg-transparent text-slate-900 placeholder:text-slate-400 outline-none text-base"
                />
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 h-12 px-6 rounded-xl text-base">
                  Caută
                </Button>
              </div>
            </form>

            {/* Popular searches */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              <span className="text-xs text-slate-400">Populare:</span>
              {popularSearches.map((term) => (
                <Link 
                  key={term} 
                  href={`/categories?q=${encodeURIComponent(term)}`}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>

            {/* Dual CTA - Split */}
            <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              <Link href="/post-project">
                <div className="group bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-5 text-white text-left hover:shadow-xl hover:shadow-orange-200/50 transition-all hover:-translate-y-0.5">
                  <FileText className="w-8 h-8 mb-3 opacity-80" />
                  <h3 className="font-bold text-lg mb-1">Postează un proiect</h3>
                  <p className="text-orange-100 text-sm">Descrie ce ai nevoie și primești oferte de la specialiști</p>
                  <ArrowRight className="w-5 h-5 mt-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              <Link href="/categories">
                <div className="group bg-white border-2 border-slate-200 rounded-2xl p-5 text-left hover:border-teal-300 hover:shadow-xl hover:shadow-teal-100/50 transition-all hover:-translate-y-0.5">
                  <Eye className="w-8 h-8 mb-3 text-teal-600" />
                  <h3 className="font-bold text-lg text-slate-900 mb-1">Caută un specialist</h3>
                  <p className="text-slate-500 text-sm">Browse prin categorii și alege direct pe cineva</p>
                  <ArrowRight className="w-5 h-5 mt-3 text-slate-400 group-hover:translate-x-1 group-hover:text-teal-600 transition-all" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SKILL ZONES - Categories grid                              */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 px-4 bg-slate-50/50">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Ce trebuie să faci?
            </h2>
            <p className="text-slate-500">
              Alege o categorie și găsește specialistul potrivit
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
            {skillZones.map((zone) => (
              <Link key={zone.slug} href={`/categories/${zone.slug}`}>
                <Card className="group bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all cursor-pointer h-full">
                  <CardContent className="p-5 text-center">
                    <div className={`w-14 h-14 bg-gradient-to-br ${zone.gradient} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <zone.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 text-sm mb-1">{zone.name}</h3>
                    <p className="text-xs text-slate-400 leading-snug">{zone.skills}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* PROIECTE ACTIVE - SECTIUNE PRINCIPALA                        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-600">Live</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                Proiecte care așteaptă oferte
              </h2>
              <p className="text-slate-500">Clienți reali care caută specialiști chiar acum</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/projects">
                  Vezi toate proiectele
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                <Link href="/post-project">
                  <FileText className="w-4 h-4 mr-2" />
                  Postează proiect
                </Link>
              </Button>
            </div>
          </div>
          
          {projects.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <Link key={project.id} href={getProjectUrl(project)}>
                    <Card className="bg-white border-slate-200 hover:border-orange-300 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer h-full">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline" className="text-xs border-slate-200">
                            {project.category?.name || 'Altceva'}
                          </Badge>
                          <span className="text-xs text-slate-400">{timeAgo(project.created_at)}</span>
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-3 line-clamp-2 min-h-[2.5rem]">{project.title}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm text-slate-500">
                            <MapPin className="w-3.5 h-3.5" />
                            {project.location_city}
                          </div>
                          <span className="font-semibold text-sm">
                            {project.budget_min && project.budget_max 
                              ? <span className="text-slate-900">{project.budget_min}-{project.budget_max} lei</span>
                              : <span className="text-orange-500">Așteaptă oferte</span>
                            }
                          </span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <Badge className="bg-teal-50 text-teal-600 border-teal-200 text-xs">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            {project.offers_count} oferte
                          </Badge>
                          <span className="text-xs text-orange-500 font-medium flex items-center gap-1">
                            Fă o ofertă <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-8">
                <Button size="lg" variant="outline" asChild>
                  <Link href="/projects">
                    Vezi toate proiectele active
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <Card className="border-slate-200 border-dashed">
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Fii primul care postează!</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  Descrie ce ai nevoie și specialiștii îți vor trimite oferte cu prețul lor.
                </p>
                <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                  <Link href="/post-project">
                    <FileText className="w-4 h-4 mr-2" />
                    Postează primul proiect
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* CUM FUNCTIONEAZA - compact, 3 pasi                         */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-14 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Cum funcționează?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center h-full hover:shadow-lg transition-shadow">
                <div className="w-11 h-11 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 text-white text-lg font-bold">1</div>
                <h3 className="font-bold text-slate-900 mb-1">Postezi proiectul</h3>
                <p className="text-slate-500 text-sm">Descrii ce ai nevoie, cu sau fără buget. 2 minute.</p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-3 text-slate-300"><ChevronRight className="w-5 h-5" /></div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center h-full hover:shadow-lg transition-shadow">
                <div className="w-11 h-11 bg-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 text-white text-lg font-bold">2</div>
                <h3 className="font-bold text-slate-900 mb-1">Primești oferte</h3>
                <p className="text-slate-500 text-sm">Specialiștii fac oferte sigilate cu prețul lor.</p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-3 text-slate-300"><ChevronRight className="w-5 h-5" /></div>
            </div>
            <div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center h-full hover:shadow-lg transition-shadow">
                <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4 text-white text-lg font-bold">3</div>
                <h3 className="font-bold text-slate-900 mb-1">Alegi și gata</h3>
                <p className="text-slate-500 text-sm">Compari preț, rating, portofoliu. Tu decizi.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* DE CE MINIJOB - Trust elements                             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              De ce MiniJob?
            </h2>
            <p className="text-slate-500">Transparență și încredere la fiecare pas</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            <Card className="bg-white border-slate-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Rating per skill</h3>
                <p className="text-sm text-slate-500">Nu rating general. Fiecare skill are propriul rating și review-uri.</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Portofoliu real</h3>
                <p className="text-sm text-slate-500">Poze din lucrări anterioare. Vezi ce a făcut, nu doar ce promite.</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Tu alegi</h3>
                <p className="text-sm text-slate-500">Primești mai multe oferte. Compari preț, calitate și alegi tu.</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Verificați</h3>
                <p className="text-sm text-slate-500">Specialiști verificați cu identitate confirmată și istoric vizibil.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* TESTIMONIALE                                               */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 px-4 bg-slate-50/50">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Ce spun utilizatorii
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              { name: "Maria P.", role: "Client din Sibiu", text: "Am postat că am nevoie de zugrăvit și în 2 ore aveam 5 oferte. Am ales pe cel cu cel mai bun portofoliu!" },
              { name: "Ion M.", role: "Specialist zugrăvit", text: "Îmi place că pot face oferte la proiecte. Am un rating de 4.9 pe zugrăvit și clienții mă aleg pentru asta." },
              { name: "Elena D.", role: "Client din Cluj", text: "Am comparat 3 oferte pentru detailing auto. Am ales-o pe cea cu poze din lucrări similare. Perfect!" },
            ].map((t, i) => (
              <Card key={i} className="bg-white border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm mb-5 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{t.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* CTA MESERIAS - "Esti specialist? Inscrie-te"               */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-slate-900 border-0 max-w-5xl mx-auto overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                {/* Left - Text */}
                <div className="p-8 md:p-12">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 mb-5">
                    Pentru specialiști
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    Ai un skill?<br />Câștigă bani cu el.
                  </h2>
                  <p className="text-slate-400 mb-6">
                    Înscrie-te gratuit, adaugă skill-urile tale și primește cereri de la clienți din zona ta.
                  </p>
                  
                  <div className="space-y-3 mb-8">
                    {[
                      "Primești proiecte potrivite skill-urilor tale",
                      "Tu faci oferta la prețul tău",
                      "Rating per skill = clienții te aleg pentru calitate",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white h-12 px-8" asChild>
                    <Link href="/devino-specialist">
                      Înscrie-te gratuit
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </div>

                {/* Right - Mock Dashboard */}
                <div className="hidden md:flex items-center justify-center p-8 bg-slate-800/50">
                  <div className="w-full max-w-xs space-y-3">
                    {/* Mock stat cards */}
                    <div className="bg-slate-700/50 rounded-xl p-4 flex items-center gap-4 border border-slate-600/50">
                      <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                        <Star className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">Rating 4.9 pe Zugrăvit</p>
                        <p className="text-xs text-slate-400">Din 48 review-uri</p>
                      </div>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4 flex items-center gap-4 border border-slate-600/50">
                      <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">+4.850 lei luna aceasta</p>
                        <p className="text-xs text-slate-400">12 lucrări finalizate</p>
                      </div>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4 flex items-center gap-4 border border-slate-600/50">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">3 proiecte noi azi</p>
                        <p className="text-xs text-slate-400">Așteaptă oferta ta</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-teal-500/20 to-teal-600/20 rounded-xl p-4 flex items-center gap-4 border border-teal-500/30">
                      <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-teal-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">Top Pro verificat</p>
                        <p className="text-xs text-teal-300">Badge de încredere activ</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* FOOTER                                                     */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <footer className="py-12 px-4 bg-slate-900">
        <div className="container mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">MiniJob</span>
              </Link>
              <p className="text-slate-400 text-sm">
                Găsește pe cineva care știe ce face. Meșteri și specialiști verificați.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Categorii</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                {skillZones.map(z => (
                  <li key={z.slug}><Link href={`/categories/${z.slug}`} className="hover:text-teal-400 transition-colors">{z.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Platformă</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/post-project" className="hover:text-teal-400 transition-colors">Postează proiect</Link></li>
                <li><Link href="/devino-specialist" className="hover:text-teal-400 transition-colors">Devino specialist</Link></li>
                <li><Link href="/projects" className="hover:text-teal-400 transition-colors">Proiecte active</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/terms" className="hover:text-teal-400 transition-colors">Termeni și condiții</Link></li>
                <li><Link href="/privacy" className="hover:text-teal-400 transition-colors">Politica de confidențialitate</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © 2026 MiniJob.ro - Transilvania Business Suite
            </p>
            <Badge variant="outline" className="border-slate-700 text-slate-400">
              🇷🇴 Made in Sibiu
            </Badge>
          </div>
        </div>
      </footer>
    </div>
  );
}
