'use client';

import Link from 'next/link';
import { Zap, Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-900">MiniJob</span>
        </Link>

        {/* 404 */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-orange-500 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
            Pagina nu a fost găsită
          </h2>
          <p className="text-slate-600">
            Ne pare rău, pagina pe care o cauți nu există sau a fost mutată.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-orange-500 hover:bg-orange-600">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Pagina principală
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/categories">
              <Search className="w-4 h-4 mr-2" />
              Caută servicii
            </Link>
          </Button>
        </div>

        {/* Back link */}
        <button 
          onClick={() => window.history.back()}
          className="mt-8 text-sm text-slate-500 hover:text-orange-500 inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Înapoi la pagina anterioară
        </button>
      </div>
    </div>
  );
}
