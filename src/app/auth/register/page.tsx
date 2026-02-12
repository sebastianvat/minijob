'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Zap, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createClient } from '@/lib/supabase/client';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams?.get('type');
  const [userType, setUserType] = useState<'client' | 'provider'>(typeParam === 'provider' ? 'provider' : 'client');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError('Parola trebuie să aibă minim 6 caractere');
      setLoading(false);
      return;
    }

    const supabase = createClient();
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
          role: userType,
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        setError('Există deja un cont cu acest email');
      } else {
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    // Check if email confirmation is required
    if (data?.user?.identities?.length === 0) {
      setError('Există deja un cont cu acest email');
      setLoading(false);
      return;
    }

    // If user is created and session exists, redirect based on type
    if (data?.session) {
      window.location.href = userType === 'provider' ? '/onboarding' : '/dashboard';
      return;
    }

    // Otherwise show success message (email confirmation needed)
    setSuccess(true);
    setLoading(false);
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback/?role=${userType}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      setError('Eroare la autentificarea cu Google. Încearcă din nou.');
      setLoading(false);
    }
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
              Am trimis un link de confirmare la<br />
              <span className="font-medium text-slate-700">{email}</span>
            </p>
            <Button asChild variant="outline">
              <Link href="/auth/login">Înapoi la login</Link>
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
            <CardTitle className="text-2xl">Creează cont</CardTitle>
            <CardDescription>
              Alătură-te comunității MiniJob
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {/* User Type Tabs */}
            <Tabs value={userType} onValueChange={(v) => setUserType(v as 'client' | 'provider')} className="mb-6">
              <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger value="client" className="h-10 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  Caut servicii
                </TabsTrigger>
                <TabsTrigger value="provider" className="h-10 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  Ofer servicii
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Google Register */}
            <Button 
              variant="outline" 
              className="w-full h-12 mb-6 border-slate-200 hover:bg-slate-50"
              onClick={handleGoogleRegister}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuă cu Google
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">sau cu email</span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName">Nume complet</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Ion Popescu"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 h-12 border-slate-200"
                    required
                  />
                </div>
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="07XX XXX XXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 h-12 border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Parolă</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minim 6 caractere"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-slate-200"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {userType === 'provider' && (
                <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                  <p className="text-sm text-orange-700">
                    <strong>Ca prestator:</strong> După înregistrare vei completa profilul cu serviciile oferite, prețuri și disponibilitate.
                  </p>
                </div>
              )}

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
                    Se creează contul...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Creează cont {userType === 'provider' ? 'prestator' : ''}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Ai deja cont?{' '}
              <Link href="/auth/login" className="text-orange-500 hover:text-orange-600 font-medium">
                Intră în cont
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-400 mt-6">
          Prin înregistrare, ești de acord cu{' '}
          <Link href="/terms" className="underline hover:text-slate-600">Termenii și condițiile</Link>
          {' '}și{' '}
          <Link href="/privacy" className="underline hover:text-slate-600">Politica de confidențialitate</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
