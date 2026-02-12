'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/search-bar';
import { createClient } from '@/lib/supabase/client';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; user_metadata?: Record<string, any> } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    
    // Initial check
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">MiniJob</span>
          </Link>

          {/* Search - Desktop */}
          <div className="hidden md:block flex-1 max-w-xl">
            <SearchBar size="sm" />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/categories">Categorii</Link>
            </Button>
            {user ? (
              <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                <Link href="/dashboard" className="flex items-center gap-2">
                  {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                    <img 
                      src={user.user_metadata.avatar_url || user.user_metadata.picture} 
                      alt="" 
                      className="w-5 h-5 rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  {user.user_metadata?.full_name?.split(' ')[0] || user.user_metadata?.name?.split(' ')[0] || 'Contul meu'}
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Intră în cont</Link>
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                  <Link href="/devino-specialist">Devino specialist</Link>
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Search - Mobile */}
        <div className="md:hidden pb-3">
          <SearchBar size="sm" showSuggestions={false} />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4 space-y-2">
          <Link 
            href="/categories" 
            className="block py-3 px-4 rounded-lg hover:bg-slate-50"
            onClick={() => setIsMenuOpen(false)}
          >
            Categorii
          </Link>
          {user ? (
            <Link 
              href="/dashboard" 
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-orange-500 text-white font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                <img 
                  src={user.user_metadata.avatar_url || user.user_metadata.picture} 
                  alt="" 
                  className="w-5 h-5 rounded-full"
                />
              ) : (
                <User className="w-4 h-4" />
              )}
              {user.user_metadata?.full_name?.split(' ')[0] || user.user_metadata?.name?.split(' ')[0] || 'Contul meu'}
            </Link>
          ) : (
            <>
              <Link 
                href="/auth/login" 
                className="block py-3 px-4 rounded-lg hover:bg-slate-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Intră în cont
              </Link>
              <Link 
                href="/devino-specialist" 
                className="block py-3 px-4 rounded-lg bg-orange-500 text-white text-center font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Devino specialist
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
