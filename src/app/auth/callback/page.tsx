'use client';

import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();

      // Supabase automatically picks up the tokens from the URL hash
      // We just need to check if we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Auth callback error:', sessionError);
        setError('Eroare la autentificare. Te rugăm să încerci din nou.');
        setTimeout(() => {
          window.location.href = '/auth/login/';
        }, 3000);
        return;
      }

      if (session) {
        // Check role from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const role = urlParams.get('role') || 'client';
        const isProvider = role === 'provider';

        // Check if this is a new user (no profile yet) and create one
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('id', session.user.id)
          .single();

        if (!profile) {
          // Create profile for new Google user
          const meta = session.user.user_metadata;
          await (supabase as any).from('profiles').insert({
            id: session.user.id,
            full_name: meta?.full_name || meta?.name || null,
            avatar_url: meta?.avatar_url || meta?.picture || null,
            email: session.user.email,
            role: isProvider ? 'provider' : 'client',
          });
        }

        // Redirect providers to onboarding, clients to dashboard
        window.location.href = isProvider ? '/onboarding/' : '/dashboard/';
      } else {
        // No session found, might need to wait for hash processing
        // Try listening for auth state change
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
              subscription.unsubscribe();
              window.location.href = '/dashboard/';
            }
          }
        );

        // Timeout fallback - if no auth event in 5 seconds, redirect to login
        setTimeout(() => {
          subscription.unsubscribe();
          setError('Autentificarea a expirat. Te rugăm să încerci din nou.');
          setTimeout(() => {
            window.location.href = '/auth/login/';
          }, 2000);
        }, 5000);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-white flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 mx-auto mb-6">
          <Zap className="w-7 h-7 text-white" />
        </div>
        
        {error ? (
          <>
            <h2 className="text-xl font-semibold text-red-600 mb-2">Eroare</h2>
            <p className="text-slate-500">{error}</p>
            <p className="text-sm text-slate-400 mt-2">Redirecționare...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Se autentifică...</h2>
            <p className="text-slate-500">Te redirecționăm către dashboard</p>
          </>
        )}
      </div>
    </div>
  );
}
