'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Zap, Calendar, MessageCircle, Star, Settings, LogOut,
  Plus, Clock, CheckCircle2, Users, TrendingUp, MapPin,
  XCircle, AlertCircle, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';

interface Booking {
  id: string;
  status: string;
  scheduled_date: string;
  scheduled_time: string;
  address: string;
  price: number;
  notes: string | null;
  created_at: string;
  provider_id: string;
  client_id: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'În așteptare', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
  confirmed: { label: 'Confirmată', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle2 },
  in_progress: { label: 'În desfășurare', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: AlertCircle },
  completed: { label: 'Finalizată', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2 },
  cancelled: { label: 'Anulată', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
};

export default function DashboardPage() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<{ full_name?: string; role?: string; phone?: string } | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, completed: 0, total: 0 });

  useEffect(() => {
    const supabase = createClient();
    
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        window.location.href = '/auth/login';
        return;
      }

      setUser({ id: user.id, email: user.email });

      // Get profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const profileWithRole = profileData as { full_name?: string; role?: string; phone?: string } | null;
      setProfile(profileWithRole);

      // Get bookings based on role
      const isProvider = profileWithRole?.role === 'provider';
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .eq(isProvider ? 'provider_id' : 'client_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (bookingsData) {
        const typedBookings = bookingsData as Booking[];
        setBookings(typedBookings);
        setStats({
          pending: typedBookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length,
          completed: typedBookings.filter(b => b.status === 'completed').length,
          total: typedBookings.length,
        });
      }

      setLoading(false);
    };

    loadData();
  }, []);

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
  const isAdmin = profile?.role === 'admin';

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
                <p className="text-xs text-slate-500">
                  {isAdmin ? '👑 Admin' : isProvider ? 'Prestator' : 'Client'}
                </p>
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
            {isAdmin 
              ? 'Panou de administrare MiniJob'
              : isProvider 
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
                  <p className="text-3xl font-bold">{bookings.reduce((sum, b) => b.status === 'completed' ? sum + b.price : sum, 0)} lei</p>
                  <p className="text-orange-100">Venituri totale</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Calendar className="w-8 h-8 mb-3 text-orange-500" />
                  <p className="text-3xl font-bold text-slate-900">{stats.pending}</p>
                  <p className="text-slate-500">Rezervări active</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <CheckCircle2 className="w-8 h-8 mb-3 text-green-500" />
                  <p className="text-3xl font-bold text-slate-900">{stats.completed}</p>
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
              <Link href="/categories">
                <Card className="bg-gradient-to-br from-orange-400 to-orange-500 border-0 text-white hover:shadow-xl transition-shadow cursor-pointer h-full">
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
                  <p className="text-3xl font-bold text-slate-900">{stats.pending}</p>
                  <p className="text-slate-500">Rezervări active</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <CheckCircle2 className="w-8 h-8 mb-3 text-green-500" />
                  <p className="text-3xl font-bold text-slate-900">{stats.completed}</p>
                  <p className="text-slate-500">Finalizate</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Users className="w-8 h-8 mb-3 text-blue-500" />
                  <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                  <p className="text-slate-500">Total rezervări</p>
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
                {bookings.length > 0 && (
                  <Badge variant="outline">{bookings.length} total</Badge>
                )}
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
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
                        <Link href="/categories">Caută servicii</Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => {
                      const status = statusConfig[booking.status] || statusConfig.pending;
                      const StatusIcon = status.icon;
                      return (
                        <div 
                          key={booking.id} 
                          className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${status.color}`}>
                            <StatusIcon className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={status.color}>{status.label}</Badge>
                              <span className="text-sm text-slate-500">
                                #{booking.id.slice(0, 8)}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(booking.scheduled_date).toLocaleDateString('ro-RO')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {booking.scheduled_time}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500 truncate flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {booking.address}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-orange-500">{booking.price} lei</p>
                            <ChevronRight className="w-5 h-5 text-slate-300 ml-auto" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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
                    <span className="text-sm font-medium text-orange-500">
                      {profile?.phone ? '60%' : '30%'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all" 
                      style={{ width: profile?.phone ? '60%' : '30%' }}
                    ></div>
                  </div>
                  <ul className="space-y-2 mt-4">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-slate-600">Email verificat</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      {profile?.phone ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-slate-300 rounded-full"></div>
                      )}
                      <span className={profile?.phone ? 'text-slate-600' : 'text-slate-400'}>
                        Adaugă număr telefon
                      </span>
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
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Editează profil
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Link-uri rapide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Setări cont
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/categories">
                    <Plus className="w-4 h-4 mr-2" />
                    Caută servicii
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Mesaje (în curând)
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
