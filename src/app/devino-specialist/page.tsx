import Link from 'next/link';
import {
  Zap, ArrowRight, CheckCircle2, Star, TrendingUp, Shield,
  Briefcase, Users, Clock, MapPin, Award, Eye, MessageCircle,
  Home, Hammer, Car, Laptop, PawPrint, Baby, ChevronRight, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const categories = [
  { name: 'Casă', icon: Home, skills: 'Curățenie, gătit, organizare', color: 'from-teal-500 to-teal-600' },
  { name: 'Construcții', icon: Hammer, skills: 'Zugrăvit, parchet, renovări', color: 'from-amber-500 to-amber-600' },
  { name: 'Auto', icon: Car, skills: 'Detailing, polish, mecanică', color: 'from-blue-500 to-blue-600' },
  { name: 'Tech Jobs', icon: Laptop, skills: 'Social media, data entry', color: 'from-purple-500 to-purple-600' },
  { name: 'Pet Care', icon: PawPrint, skills: 'Plimbat câini, pet sitting', color: 'from-green-500 to-green-600' },
  { name: 'Kids & Learning', icon: Baby, skills: 'Bonă, meditații', color: 'from-pink-500 to-pink-600' },
];

const benefits = [
  {
    icon: Briefcase,
    title: 'Primești proiecte',
    desc: 'Clienții postează ce au nevoie. Tu vezi proiectele din zona ta și faci oferte.',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    icon: TrendingUp,
    title: 'Tu setezi prețul',
    desc: 'Faci oferta la prețul tău. Nu acceptă clientul? Ofertezi altceva. Fără comision la început.',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: Award,
    title: 'Rating per skill',
    desc: 'Ai rating separat pe fiecare skill. Ești bun la zugrăvit? Asta se vede. Nu se amestecă cu altele.',
    color: 'bg-amber-100 text-amber-600'
  },
  {
    icon: Eye,
    title: 'Portofoliu vizibil',
    desc: 'Adaugi poze din lucrări. Clienții te aleg pentru ce ai făcut, nu doar pentru ce promiti.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Shield,
    title: 'Badge verificat',
    desc: 'Verificăm identitatea. Badge-ul "Verificat" te pune în fața celor neverificați.',
    color: 'bg-teal-100 text-teal-600'
  },
  {
    icon: MapPin,
    title: 'Clienți din zona ta',
    desc: 'Vezi doar proiecte din orașul tău. Nu pierzi timp cu cereri din alte zone.',
    color: 'bg-purple-100 text-purple-600'
  },
];

const steps = [
  { step: '1', title: 'Creezi cont', desc: 'Email sau Google. 30 secunde.', time: '30 sec' },
  { step: '2', title: 'Alegi skill-urile', desc: 'Ce știi să faci? Alege categoriile și skill-urile.', time: '2 min' },
  { step: '3', title: 'Setezi prețuri', desc: 'Prețul tău per oră, mp sau proiect.', time: '1 min' },
  { step: '4', title: 'Adaugi portofoliu', desc: 'Poze din lucrări anterioare. Opțional dar recomandat.', time: '3 min' },
];

const testimonials = [
  {
    name: 'Marius T.',
    skill: 'Zugrăvit • Sibiu',
    text: 'Am 15 ani experiență și acum primesc cereri direct pe telefon. Luna trecută am câștigat 6.200 lei doar de pe platformă.',
    rating: '4.9',
    jobs: 89,
  },
  {
    name: 'Alexandra N.',
    skill: 'Curățenie • Cluj',
    text: 'Am început part-time pe lângă serviciu. Acum am 3 angajați și lucrez doar cu clienți de pe MiniJob.',
    rating: '5.0',
    jobs: 156,
  },
  {
    name: 'Cristian D.',
    skill: 'Detailing auto • București',
    text: 'Portofoliul face diferența. Când clienții văd pozele mele, mă aleg chiar dacă nu sunt cel mai ieftin.',
    rating: '4.8',
    jobs: 67,
  },
];

const faqs = [
  { q: 'Cât costă să mă înscriu?', a: 'Nimic. Înscrierea este 100% gratuită. Nu avem taxe lunare sau abonamente.' },
  { q: 'Ce comision luați?', a: 'În perioada de lansare, comisionul este 0%. După lansarea completă, va fi 15% din tranzacțiile prin platformă.' },
  { q: 'Trebuie să am firmă (PFA/SRL)?', a: 'Nu obligatoriu. Poți lucra ca persoană fizică. Dar dacă ai PFA/SRL, poți afișa asta în profil pentru mai multă credibilitate.' },
  { q: 'Cum primesc plata?', a: 'Inițial, plata se face direct între tine și client (cash sau transfer). Vom adăuga plata prin platformă în curând.' },
  { q: 'Pot lucra în mai multe categorii?', a: 'Da! Poți adăuga oricâte skill-uri ai. Fiecare va avea propriul rating și portofoliu.' },
];

export default function DevinoSpecialistPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav minimal */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">MiniJob</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Am deja cont</Link>
            </Button>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600" asChild>
              <Link href="/auth/register?type=provider">Înscrie-te gratuit</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - text */}
            <div>
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 mb-6">
                Înscriere gratuită • 0% comision la lansare
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Transformă-ți skill-ul<br />
                <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  în bani
                </span>
              </h1>
              <p className="text-lg text-slate-300 mb-8 max-w-lg">
                Ești meșter, specialist sau freelancer? Primește cereri de la clienți din zona ta. Tu faci oferta, tu setezi prețul.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white h-14 px-8 text-base" asChild>
                  <Link href="/auth/register?type=provider">
                    Începe acum — e gratuit
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  Fără abonament
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  Setare în 5 minute
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  Anulezi oricând
                </div>
              </div>
            </div>

            {/* Right - mock earnings card */}
            <div className="hidden md:block">
              <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm mx-auto rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">M</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Marius T.</p>
                    <p className="text-xs text-slate-500">Zugrăvit • Sibiu</p>
                  </div>
                  <Badge className="ml-auto bg-teal-100 text-teal-700 border-teal-200 text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Verificat
                  </Badge>
                </div>
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500 mb-1">Venituri luna aceasta</p>
                    <p className="text-3xl font-bold text-slate-900">6.240 <span className="text-base font-normal text-slate-400">lei</span></p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-slate-900">4.9</p>
                      <p className="text-xs text-slate-500">Rating</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-slate-900">89</p>
                      <p className="text-xs text-slate-500">Lucrări</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-orange-500">3</p>
                      <p className="text-xs text-slate-500">Oferte noi</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                    <span className="text-xs text-slate-500 ml-1">"Lucrare impecabilă, revenim!"</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CATEGORII ═══ */}
      <section className="py-16 px-4 bg-slate-50/50">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              În ce ești bun?
            </h2>
            <p className="text-slate-500">Alege una sau mai multe categorii</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-4xl mx-auto">
            {categories.map((cat) => (
              <div key={cat.name} className="bg-white rounded-2xl border border-slate-200 p-4 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className={`w-12 h-12 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <cat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-slate-900 text-sm">{cat.name}</p>
                <p className="text-xs text-slate-400 mt-1">{cat.skills}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BENEFICII ═══ */}
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              De ce MiniJob?
            </h2>
            <p className="text-slate-500">Ce primești ca specialist pe platformă</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {benefits.map((b) => (
              <Card key={b.title} className="border-slate-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-2xl ${b.color} flex items-center justify-center mb-4`}>
                    <b.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{b.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CUM FUNCTIONEAZA ═══ */}
      <section className="py-16 md:py-20 px-4 bg-slate-50/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Gata în 5 minute
            </h2>
            <p className="text-slate-500">4 pași simpli să începi să primești cereri</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {steps.map((s, i) => (
              <div key={s.step} className="relative">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center h-full hover:shadow-lg transition-shadow">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 text-white font-bold">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{s.title}</h3>
                  <p className="text-sm text-slate-500 mb-3">{s.desc}</p>
                  <Badge variant="outline" className="text-xs border-slate-200">
                    <Clock className="w-3 h-3 mr-1" />
                    {s.time}
                  </Badge>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 text-slate-300">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 h-14 px-8 text-base" asChild>
              <Link href="/auth/register?type=provider">
                Începe acum — e gratuit
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALE ═══ */}
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Specialiști care câștigă deja
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <Card key={i} className="border-slate-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm mb-5 leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{t.name[0]}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.skill}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{t.rating} ⭐</p>
                      <p className="text-xs text-slate-500">{t.jobs} lucrări</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-16 md:py-20 px-4 bg-slate-50/50">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Întrebări frecvente
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Gata să începi?
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Înscrierea durează 5 minute. Fără costuri ascunse. Primele proiecte pot veni chiar azi.
          </p>
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white h-14 px-10 text-lg" asChild>
            <Link href="/auth/register?type=provider">
              Creează cont gratuit
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <p className="text-xs text-slate-500 mt-4">
            Ai deja cont?{' '}
            <Link href="/auth/login" className="text-orange-400 hover:text-orange-300 underline">
              Intră în cont
            </Link>
          </p>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="py-8 px-4 bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">MiniJob</span>
          </Link>
          <p className="text-xs text-slate-500">© 2026 MiniJob.ro</p>
        </div>
      </footer>
    </div>
  );
}
