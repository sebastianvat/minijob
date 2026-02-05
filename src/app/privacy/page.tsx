import Link from 'next/link';
import { Zap, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Politica de Confidențialitate',
  description: 'Politica de confidențialitate și protecția datelor personale pe MiniJob.ro',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
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
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Politica de Confidențialitate</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 mb-6">
            Ultima actualizare: Februarie 2026
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">1. Introducere</h2>
          <p className="text-slate-600 mb-4">
            MiniJob.ro respectă confidențialitatea datelor dumneavoastră personale. Această politică 
            descrie cum colectăm, utilizăm și protejăm informațiile dumneavoastră.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">2. Date Colectate</h2>
          <p className="text-slate-600 mb-4">
            Colectăm următoarele tipuri de date:
          </p>
          <ul className="list-disc pl-6 text-slate-600 mb-4">
            <li>Informații de identificare: nume, email, telefon</li>
            <li>Informații de localizare: adresa pentru servicii</li>
            <li>Informații de plată: metoda de plată preferată</li>
            <li>Date de utilizare: istoricul rezervărilor, preferințe</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">3. Scopul Colectării</h2>
          <p className="text-slate-600 mb-4">
            Utilizăm datele pentru:
          </p>
          <ul className="list-disc pl-6 text-slate-600 mb-4">
            <li>Furnizarea și îmbunătățirea serviciilor</li>
            <li>Comunicare cu utilizatorii</li>
            <li>Procesarea rezervărilor</li>
            <li>Prevenirea fraudei</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">4. Partajarea Datelor</h2>
          <p className="text-slate-600 mb-4">
            Nu vindem datele dumneavoastră. Partajăm informații doar cu:
          </p>
          <ul className="list-disc pl-6 text-slate-600 mb-4">
            <li>Prestatorii de servicii (pentru efectuarea rezervărilor)</li>
            <li>Furnizori de servicii tehnice (hosting, analytics)</li>
            <li>Autorități, dacă suntem obligați legal</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">5. Securitatea Datelor</h2>
          <p className="text-slate-600 mb-4">
            Implementăm măsuri tehnice și organizatorice pentru protejarea datelor, inclusiv 
            criptare SSL, acces restricționat și backup-uri regulate.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">6. Drepturile Dumneavoastră (GDPR)</h2>
          <p className="text-slate-600 mb-4">
            Aveți dreptul de a:
          </p>
          <ul className="list-disc pl-6 text-slate-600 mb-4">
            <li>Accesa datele dumneavoastră personale</li>
            <li>Rectifica datele incorecte</li>
            <li>Șterge datele ("dreptul de a fi uitat")</li>
            <li>Restricționa procesarea</li>
            <li>Portabilitatea datelor</li>
            <li>Obiecta la procesare</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">7. Cookies</h2>
          <p className="text-slate-600 mb-4">
            Utilizăm cookies pentru funcționarea platformei și analytics. Puteți gestiona 
            preferințele cookies din setările browserului.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">8. Contact DPO</h2>
          <p className="text-slate-600 mb-4">
            Pentru exercitarea drepturilor sau întrebări: dpo@minijob.ro
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <Button asChild>
            <Link href="/">Înapoi la pagina principală</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
