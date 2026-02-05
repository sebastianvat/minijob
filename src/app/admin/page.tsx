'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Zap, Users, Calendar, TrendingUp, DollarSign,
  UserCheck, UserX, Clock, CheckCircle2, XCircle,
  ArrowUpRight, ArrowDownRight, BarChart3, Activity,
  Shield, Settings, LogOut, ChevronRight, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createClient } from '@/lib/supabase/client';

interface Stats {
  totalUsers: number;
  totalProviders: number;
  totalClients: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
}

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  phone: string | null;
  created_at: string;
}

interface Booking {
  id: string;
  status: string;
  scheduled_date: string;
  scheduled_time: string;
  address: string;
  price: number;
  created_at: string;
  client_id: string;
  provider_id: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  pending: 'În așteptare',
  confirmed: 'Confirmată',
  in_progress: 'În desfășurare',
  completed: 'Finalizată',
  cancelled: 'Anulată',
};

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProviders: 0,
    totalClients: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      
      // Check if user is admin
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/auth/login';
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if ((profile as any)?.role !== 'admin') {
        window.location.href = '/dashboard';
        return;
      }

      setAuthorized(true);

      // Fetch all profiles
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      const profiles = (profilesData || []) as User[];
      setUsers(profiles);

      // Fetch all bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      const allBookings = (bookingsData || []) as Booking[];
      setBookings(allBookings);

      // Calculate stats
      setStats({
        totalUsers: profiles.length,
        totalProviders: profiles.filter(p => p.role === 'provider').length,
        totalClients: profiles.filter(p => p.role === 'client').length,
        totalBookings: allBookings.length,
        pendingBookings: allBookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length,
        completedBookings: allBookings.filter(b => b.status === 'completed').length,
        cancelledBookings: allBookings.filter(b => b.status === 'cancelled').length,
        totalRevenue: allBookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price, 0),
      });

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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MiniJob</span>
            </Link>
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
              <Shield className="w-3 h-3 mr-1" />
              Admin Panel
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" asChild>
              <Link href="/dashboard">
                <Eye className="w-4 h-4 mr-2" />
                View Site
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Utilizatori</p>
                  <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 text-sm">
                <span className="text-slate-400">{stats.totalClients} clienți</span>
                <span className="text-slate-400">{stats.totalProviders} prestatori</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Rezervări</p>
                  <p className="text-3xl font-bold text-white">{stats.totalBookings}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Badge className="bg-yellow-500/20 text-yellow-400 border-0">
                  {stats.pendingBookings} active
                </Badge>
                <Badge className="bg-green-500/20 text-green-400 border-0">
                  {stats.completedBookings} finalizate
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Venituri Totale</p>
                  <p className="text-3xl font-bold text-white">{stats.totalRevenue} lei</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-sm text-green-400">
                <ArrowUpRight className="w-4 h-4" />
                <span>Din {stats.completedBookings} rezervări finalizate</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Rată Succes</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.totalBookings > 0 
                      ? Math.round((stats.completedBookings / stats.totalBookings) * 100) 
                      : 0}%
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-sm text-red-400">
                <XCircle className="w-4 h-4" />
                <span>{stats.cancelledBookings} anulate</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-orange-500">
              <Users className="w-4 h-4 mr-2" />
              Utilizatori ({stats.totalUsers})
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-orange-500">
              <Calendar className="w-4 h-4 mr-2" />
              Rezervări ({stats.totalBookings})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Utilizatori Recenți</CardTitle>
                  <CardDescription className="text-slate-400">Ultimele înregistrări</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                            <span className="text-orange-400 font-semibold">
                              {user.full_name?.[0] || user.email[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{user.full_name || 'Fără nume'}</p>
                            <p className="text-sm text-slate-400">{user.email}</p>
                          </div>
                        </div>
                        <Badge className={user.role === 'provider' ? 'bg-purple-500/20 text-purple-400' : user.role === 'admin' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}>
                          {user.role === 'admin' ? '👑 Admin' : user.role === 'provider' ? 'Prestator' : 'Client'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Bookings */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Rezervări Recente</CardTitle>
                  <CardDescription className="text-slate-400">Ultimele rezervări</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookings.length === 0 ? (
                      <p className="text-slate-400 text-center py-8">Nu există rezervări încă</p>
                    ) : (
                      bookings.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge className={statusColors[booking.status]}>
                                {statusLabels[booking.status]}
                              </Badge>
                              <span className="text-sm text-slate-400">
                                #{booking.id.slice(0, 8)}
                              </span>
                            </div>
                            <p className="text-sm text-slate-400 mt-1">
                              {new Date(booking.scheduled_date).toLocaleDateString('ro-RO')} • {booking.scheduled_time}
                            </p>
                          </div>
                          <p className="text-white font-semibold">{booking.price} lei</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Statistici Rapide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                      <UserCheck className="w-5 h-5" />
                      <span className="font-medium">Clienți</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.totalClients}</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-400 mb-2">
                      <UserCheck className="w-5 h-5" />
                      <span className="font-medium">Prestatori</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.totalProviders}</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-400 mb-2">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">În așteptare</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.pendingBookings}</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium">Finalizate</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.completedBookings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Toți Utilizatorii</CardTitle>
                <CardDescription className="text-slate-400">
                  {stats.totalUsers} utilizatori înregistrați
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left p-3 text-slate-400 font-medium">Utilizator</th>
                        <th className="text-left p-3 text-slate-400 font-medium">Email</th>
                        <th className="text-left p-3 text-slate-400 font-medium">Telefon</th>
                        <th className="text-left p-3 text-slate-400 font-medium">Rol</th>
                        <th className="text-left p-3 text-slate-400 font-medium">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                                <span className="text-orange-400 text-sm font-semibold">
                                  {user.full_name?.[0] || user.email[0].toUpperCase()}
                                </span>
                              </div>
                              <span className="text-white">{user.full_name || '-'}</span>
                            </div>
                          </td>
                          <td className="p-3 text-slate-300">{user.email}</td>
                          <td className="p-3 text-slate-300">{user.phone || '-'}</td>
                          <td className="p-3">
                            <Badge className={
                              user.role === 'admin' ? 'bg-orange-500/20 text-orange-400' :
                              user.role === 'provider' ? 'bg-purple-500/20 text-purple-400' : 
                              'bg-blue-500/20 text-blue-400'
                            }>
                              {user.role === 'admin' ? '👑 Admin' : user.role === 'provider' ? 'Prestator' : 'Client'}
                            </Badge>
                          </td>
                          <td className="p-3 text-slate-400 text-sm">
                            {new Date(user.created_at).toLocaleDateString('ro-RO')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Toate Rezervările</CardTitle>
                <CardDescription className="text-slate-400">
                  {stats.totalBookings} rezervări totale
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <p className="text-slate-400 text-center py-12">Nu există rezervări încă</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left p-3 text-slate-400 font-medium">ID</th>
                          <th className="text-left p-3 text-slate-400 font-medium">Status</th>
                          <th className="text-left p-3 text-slate-400 font-medium">Data</th>
                          <th className="text-left p-3 text-slate-400 font-medium">Ora</th>
                          <th className="text-left p-3 text-slate-400 font-medium">Adresă</th>
                          <th className="text-left p-3 text-slate-400 font-medium">Preț</th>
                          <th className="text-left p-3 text-slate-400 font-medium">Creat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                            <td className="p-3 text-slate-300 font-mono text-sm">
                              #{booking.id.slice(0, 8)}
                            </td>
                            <td className="p-3">
                              <Badge className={statusColors[booking.status]}>
                                {statusLabels[booking.status]}
                              </Badge>
                            </td>
                            <td className="p-3 text-slate-300">
                              {new Date(booking.scheduled_date).toLocaleDateString('ro-RO')}
                            </td>
                            <td className="p-3 text-slate-300">{booking.scheduled_time}</td>
                            <td className="p-3 text-slate-300 max-w-[200px] truncate">
                              {booking.address}
                            </td>
                            <td className="p-3 text-white font-semibold">{booking.price} lei</td>
                            <td className="p-3 text-slate-400 text-sm">
                              {new Date(booking.created_at).toLocaleDateString('ro-RO')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
