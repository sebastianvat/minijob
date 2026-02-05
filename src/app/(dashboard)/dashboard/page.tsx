'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Zap, Calendar, MessageCircle, Star, Settings, LogOut,
  Plus, Clock, CheckCircle2, Users, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [profile, setProfile] = useState<{ full_name?: string; role?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        window.location.href = '/auth/login';
        return;
      }

      setUser(user);

      // Get profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);
      setLoading(false);
    };

    getUser();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const isProvider = profile?.role === 'provider';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">MiniJob</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <MessageCircle className="w-5 h-5 text-slate-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-orange-600 font-semibold">
                  {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || '?'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-slate-900">{profile?.full_name || 'Utilizator'}</p>
                <p className="text-xs text-slate-500">{isProvider ? 'Prestator' : 'Client'}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Bună, {profile?.full_name?.split(' ')[0] || 'Utilizator'}! 👋
          </h1>
          <p className="text-slate-500">
            {isProvider 
              ? 'Gestionează rezervările și serviciile tale'
              : 'Găsește servicii sau vezi rezervările tale'
            }
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isProvider ? (
            <>
              <Card className="bg-gradient-to-br from-orange-400 to-orange-500 border-0 text-white">
                <CardContent className="p-6">
                  <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
                  <p className="text-3xl font-bold">0 lei</p>
                  <p className="text-orange-100">Venituri luna aceasta</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Calendar className="w-8 h-8 mb-3 text-orange-500" />
                  <p className="text-3xl font-bold text-slate-900">0</p>
                  <p className="text-slate-500">Rezervări noi</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <CheckCircle2 className="w-8 h-8 mb-3 text-green-500" />
                  <p className="text-3xl font-bold text-slate-900">0</p>
                  <p className="text-slate-500">Finalizate</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Star className="w-8 h-8 mb-3 text-yellow-500" />
                  <p className="text-3xl font-bold text-slate-900">-</p>
                  <p className="text-slate-500">Rating mediu</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Link href="/#servicii">
                <Card className="bg-gradient-to-br from-orange-400 to-orange-500 border-0 text-white hover:shadow-xl transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <Plus className="w-8 h-8 mb-3" />
                    <p className="text-lg font-semibold">Caută servicii</p>
                    <p className="text-orange-100 text-sm">Găsește prestatori</p>
                  </CardContent>
                </Card>
              </Link>
              <Card>
                <CardContent className="p-6">
                  <Clock className="w-8 h-8 mb-3 text-orange-500" />
                  <p className="text-3xl font-bold text-slate-900">0</p>
                  <p className="text-slate-500">Rezervări active</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <CheckCircle2 className="w-8 h-8 mb-3 text-green-500" />
                  <p className="text-3xl font-bold text-slate-900">0</p>
                  <p className="text-slate-500">Finalizate</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Users className="w-8 h-8 mb-3 text-blue-500" />
                  <p className="text-3xl font-bold text-slate-900">0</p>
                  <p className="text-slate-500">Prestatori salvați</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Bookings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">
                  {isProvider ? 'Rezervări recente' : 'Rezervările mele'}
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-orange-500">
                  Vezi toate
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="font-medium">Nu ai rezervări încă</p>
                  <p className="text-sm">
                    {isProvider 
                      ? 'Rezervările vor apărea aici când primești comenzi'
                      : 'Caută un serviciu pentru a face prima rezervare'
                    }
                  </p>
                  {!isProvider && (
                    <Button asChild className="mt-4 bg-orange-500 hover:bg-orange-600">
                      <Link href="/#servicii">Caută servicii</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Completează profilul</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Progres</span>
                    <span className="text-sm font-medium text-orange-500">30%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <ul className="space-y-2 mt-4">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-slate-600">Email verificat</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 border-2 border-slate-300 rounded-full"></div>
                      <span className="text-slate-400">Adaugă număr telefon</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 border-2 border-slate-300 rounded-full"></div>
                      <span className="text-slate-400">Adaugă adresă</span>
                    </li>
                    {isProvider && (
                      <li className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 border-2 border-slate-300 rounded-full"></div>
                        <span className="text-slate-400">Adaugă servicii</span>
                      </li>
                    )}
                  </ul>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Settings className="w-4 h-4 mr-2" />
                  Editează profil
                </Button>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Link-uri rapide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Setări cont
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Mesaje
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Deconectare
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
