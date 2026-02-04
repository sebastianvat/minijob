'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-slate-200 shadow-xl">
          <CardContent className="pt-10 pb-10 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Verifică email-ul!</h2>
            <p className="text-slate-500 mb-6">
              Am trimis instrucțiuni pentru resetarea parolei la<br />
              <span className="font-medium text-slate-700">{email}</span>
            </p>
            <Button asChild variant="outline">
              <Link href="/auth/login">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Înapoi la login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-900">MiniJob</span>
        </Link>

        <Card className="border-slate-200 shadow-xl shadow-slate-200/50">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Ai uitat parola?</CardTitle>
            <CardDescription>
              Introdu email-ul și îți trimitem instrucțiuni
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nume@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-slate-200"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white shadow-lg shadow-orange-500/25"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Se trimite...
                  </span>
                ) : (
                  'Trimite instrucțiuni'
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              <Link href="/auth/login" className="text-orange-500 hover:text-orange-600 font-medium flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Înapoi la login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
