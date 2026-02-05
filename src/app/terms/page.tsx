import Link from 'next/link';
import { Zap, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Termeni și Condiții',
  description: 'Termenii și condițiile de utilizare a platformei MiniJob.ro',
};

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Termeni și Condiții</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 mb-6">
            Ultima actualizare: Februarie 2026
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">1. Acceptarea Termenilor</h2>
          <p className="text-slate-600 mb-4">
            Prin accesarea și utilizarea platformei MiniJob.ro, acceptați să respectați acești termeni și condiții. 
            Dacă nu sunteți de acord cu oricare dintre termeni, vă rugăm să nu utilizați platforma.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">2. Descrierea Serviciului</h2>
          <p className="text-slate-600 mb-4">
            MiniJob.ro este o platformă marketplace care conectează clienții cu prestatori de servicii la domiciliu, 
            incluzând dar fără a se limita la: curățenie, montaj mobilă, reparații, grădinărit și mutări.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">3. Conturi de Utilizator</h2>
          <p className="text-slate-600 mb-4">
            Pentru a utiliza serviciile noastre, trebuie să vă creați un cont. Sunteți responsabil pentru 
            menținerea confidențialității contului și parolei dumneavoastră.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">4. Obligațiile Prestatorilor</h2>
          <p className="text-slate-600 mb-4">
            Prestatorii sunt responsabili pentru calitatea serviciilor oferite și trebuie să respecte 
            toate legile aplicabile, inclusiv obligațiile fiscale.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">5. Obligațiile Clienților</h2>
          <p className="text-slate-600 mb-4">
            Clienții trebuie să furnizeze informații corecte și să respecte programările stabilite. 
            Anulările trebuie făcute cu minimum 24 de ore înainte.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">6. Plăți și Comisioane</h2>
          <p className="text-slate-600 mb-4">
            Plățile se efectuează direct între client și prestator. MiniJob.ro poate percepe un comision 
            pentru serviciile de intermediere.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">7. Limitarea Răspunderii</h2>
          <p className="text-slate-600 mb-4">
            MiniJob.ro acționează doar ca intermediar și nu este responsabil pentru calitatea serviciilor 
            prestate sau pentru eventualele dispute între clienți și prestatori.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">8. Contact</h2>
          <p className="text-slate-600 mb-4">
            Pentru întrebări despre acești termeni, ne puteți contacta la: contact@minijob.ro
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
