'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Zap, Calendar, MessageCircle, Star, Settings, LogOut,
  Plus, Clock, CheckCircle2, Users, TrendingUp, MapPin,
  XCircle, AlertCircle, ChevronRight, Briefcase, Eye,
  FileText, Award, Camera, Bell, ArrowRight, Home,
  Search, Shield, Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/client';
import { getProjectUrl, formatBudget } from '@/lib/utils';

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

interface ProviderData {
  id: string;
  rating: number;
  total_reviews: number;
  total_bookings: number;
  verified: boolean;
  categories: string[];
  bio: string | null;
}

interface ProjectData {
  id: string;
  title: string;
  status: string;
  offers_count: number;
  budget_min: number | null;
  budget_max: number | null;
  location_city: string;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'În așteptare', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
  confirmed: { label: 'Confirmată', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle2 },
  in_progress: { label: 'În desfășurare', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: AlertCircle },
  completed: { label: 'Finalizată', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2 },
  cancelled: { label: 'Anulată', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
};

const projectStatusConfig: Record<string, { label: string; color: string }> = {
  open: { label: 'Deschis', color: 'bg-green-100 text-green-700' },
  in_progress: { label: 'În lucru', color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Finalizat', color: 'bg-slate-100 text-slate-600' },
  cancelled: { label: 'Anulat', color: 'bg-red-100 text-red-600' },
};

export default function DashboardPage() {
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: Record<string, any> } | null>(null);
  const [profile, setProfile] = useState<{ full_name?: string; role?: string; phone?: string; avatar_url?: string } | null>(null);
  const [providerData, setProviderData] = useState<ProviderData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'projects' | 'settings'>('overview');

  useEffect(() => {
    const supabase = createClient();

    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/auth/login';
        return;
      }

      setUser(user);

      // Get profile
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      const prof = profileData as any;
      setProfile(prof);

      const isProvider = prof?.role === 'provider';

      // Provider data
      if (isProvider) {
        const { data: pData } = await (supabase as any)
          .from('providers')
          .select('id, rating, total_reviews, total_bookings, verified, categories, bio')
          .eq('user_id', user.id)
          .single();
        if (pData) setProviderData(pData);
      }

      // Bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .eq(isProvider ? 'provider_id' : 'client_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      if (bookingsData) setBookings(bookingsData as Booking[]);

      // Projects (for clients)
      if (!isProvider) {
        const { data: projData } = await (supabase as any)
          .from('projects')
          .select('id, title, status, offers_count, budget_min, budget_max, location_city, created_at')
          .eq('client_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        if (projData) setProjects(projData);
      }

      // Projects (for providers - open ones in their area)
      if (isProvider) {
        const { data: openProjects } = await (supabase as any)
          .from('projects')
          .select('id, title, status, offers_count, budget_min, budget_max, location_city, created_at')
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(10);
        if (openProjects) setProjects(openProjects);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  const isProvider = profile?.role === 'provider';
  const isAdmin = profile?.role === 'admin';
  const firstName = profile?.full_name?.split(' ')[0] || 'Utilizator';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const stats = {
    pending: bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    total: bookings.length,
    revenue: bookings.filter(b => b.status === 'completed').reduce((s, b) => s + b.price, 0),
  };

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

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-slate-600" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-orange-600 font-semibold">{firstName[0]}</span>
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-slate-900">{firstName}</p>
                <p className="text-xs text-slate-500">
                  {isAdmin ? 'Admin' : isProvider ? 'Specialist' : 'Client'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Welcome + Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Bună, {firstName}!</h1>
            <p className="text-slate-500 text-sm">
              {isProvider ? 'Gestionează profilul și vezi proiectele disponibile' : 'Gestionează proiectele și rezervările tale'}
            </p>
          </div>
          <div className="flex gap-2">
            {isProvider ? (
              <>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600" asChild>
                  <Link href="/projects"><Search className="w-4 h-4 mr-2" />Vezi proiecte</Link>
                </Button>
                {providerData && (
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/providers/${providerData.id}`}><Eye className="w-4 h-4 mr-2" />Profil public</Link>
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600" asChild>
                  <Link href="/post-project"><Plus className="w-4 h-4 mr-2" />Postează proiect</Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/categories"><Search className="w-4 h-4 mr-2" />Caută specialist</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* ═══ PROVIDER DASHBOARD ═══ */}
        {isProvider && (
          <>
            {/* Provider Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
              <Card className="bg-gradient-to-br from-orange-400 to-orange-500 border-0 text-white">
                <CardContent className="p-4">
                  <TrendingUp className="w-6 h-6 mb-2 opacity-80" />
                  <p className="text-2xl font-bold">{stats.revenue} lei</p>
                  <p className="text-orange-100 text-xs">Venituri</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Briefcase className="w-6 h-6 mb-2 text-blue-500" />
                  <p className="text-2xl font-bold text-slate-900">{providerData?.total_bookings || 0}</p>
                  <p className="text-xs text-slate-500">Lucrări totale</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Star className="w-6 h-6 mb-2 text-yellow-500" />
                  <p className="text-2xl font-bold text-slate-900">{providerData?.rating?.toFixed(1) || '—'}</p>
                  <p className="text-xs text-slate-500">Rating</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <MessageCircle className="w-6 h-6 mb-2 text-purple-500" />
                  <p className="text-2xl font-bold text-slate-900">{providerData?.total_reviews || 0}</p>
                  <p className="text-xs text-slate-500">Review-uri</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Shield className="w-6 h-6 mb-2 text-teal-500" />
                  <p className="text-2xl font-bold text-slate-900">{providerData?.verified ? 'Da' : 'Nu'}</p>
                  <p className="text-xs text-slate-500">Verificat</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Open Projects to bid on */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-orange-500" />
                      Proiecte disponibile
                    </CardTitle>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href="/projects">Vezi toate <ChevronRight className="w-4 h-4 ml-1" /></Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {projects.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <FileText className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                        <p className="font-medium">Nu sunt proiecte disponibile</p>
                        <p className="text-sm">Proiectele noi vor apărea aici</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {projects.slice(0, 5).map((project) => {
                          const pStatus = projectStatusConfig[project.status] || projectStatusConfig.open;
                          return (
                            <Link key={project.id} href={getProjectUrl(project)}>
                              <div className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-medium text-slate-900 text-sm line-clamp-1">{project.title}</h4>
                                  <Badge className={`text-xs ${pStatus.color}`}>{pStatus.label}</Badge>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />{project.location_city}
                                  </span>
                                  <span>{formatBudget(project.budget_min, project.budget_max).text}</span>
                                  <span>{project.offers_count} oferte</span>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Bookings */}
                {bookings.length > 0 && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Rezervări recente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {bookings.slice(0, 3).map((booking) => {
                          const status = statusConfig[booking.status] || statusConfig.pending;
                          const StatusIcon = status.icon;
                          return (
                            <div key={booking.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${status.color}`}>
                                <StatusIcon className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <Badge className={`text-xs ${status.color}`}>{status.label}</Badge>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                  <span>{new Date(booking.scheduled_date).toLocaleDateString('ro-RO')}</span>
                                  <span>{booking.scheduled_time}</span>
                                </div>
                              </div>
                              <p className="font-semibold text-orange-500">{booking.price} lei</p>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Profile Card */}
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg font-bold text-orange-600">{firstName[0]}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{profile?.full_name || firstName}</p>
                        <p className="text-xs text-slate-500">Specialist</p>
                      </div>
                    </div>
                    {providerData && (
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href={`/providers/${providerData.id}`}>
                          <Eye className="w-4 h-4 mr-2" /> Vezi profilul public
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <Card>
                  <CardHeader><CardTitle className="text-sm">Acțiuni rapide</CardTitle></CardHeader>
                  <CardContent className="space-y-1">
                    <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                      <Link href="/settings"><Settings className="w-4 h-4 mr-2" />Setări profil</Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                      <Link href="/projects"><Search className="w-4 h-4 mr-2" />Caută proiecte</Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                      <Link href="/my-projects"><FileText className="w-4 h-4 mr-2" />Ofertele mele</Link>
                    </Button>
                    <Separator className="my-2" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />Deconectare
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {/* ═══ CLIENT DASHBOARD ═══ */}
        {!isProvider && !isAdmin && (
          <>
            {/* Client Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <Link href="/post-project">
                <Card className="bg-gradient-to-br from-orange-400 to-orange-500 border-0 text-white hover:shadow-xl transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4">
                    <Plus className="w-6 h-6 mb-2" />
                    <p className="font-semibold">Proiect nou</p>
                    <p className="text-orange-100 text-xs">Postează o cerere</p>
                  </CardContent>
                </Card>
              </Link>
              <Card>
                <CardContent className="p-4">
                  <FileText className="w-6 h-6 mb-2 text-blue-500" />
                  <p className="text-2xl font-bold text-slate-900">{projects.length}</p>
                  <p className="text-xs text-slate-500">Proiecte postate</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Clock className="w-6 h-6 mb-2 text-orange-500" />
                  <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
                  <p className="text-xs text-slate-500">Rezervări active</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <CheckCircle2 className="w-6 h-6 mb-2 text-green-500" />
                  <p className="text-2xl font-bold text-slate-900">{stats.completed}</p>
                  <p className="text-xs text-slate-500">Finalizate</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Projects */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-orange-500" />
                      Proiectele mele
                    </CardTitle>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600" asChild>
                      <Link href="/post-project"><Plus className="w-4 h-4 mr-1" />Proiect nou</Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {projects.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <FileText className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                        <p className="font-medium">Nu ai proiecte încă</p>
                        <p className="text-sm mb-4">Postează primul proiect și primește oferte de la specialiști</p>
                        <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                          <Link href="/post-project">Postează proiect</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {projects.map((project) => {
                          const pStatus = projectStatusConfig[project.status] || projectStatusConfig.open;
                          return (
                            <Link key={project.id} href={getProjectUrl(project)}>
                              <div className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-medium text-slate-900 text-sm">{project.title}</h4>
                                  <Badge className={`text-xs ${pStatus.color}`}>{pStatus.label}</Badge>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />{project.location_city}
                                  </span>
                                  <span>{formatBudget(project.budget_min, project.budget_max).text}</span>
                                  <span className="font-medium text-orange-500">{project.offers_count} oferte</span>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Bookings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Rezervările mele</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bookings.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <Calendar className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                        <p className="font-medium">Nu ai rezervări încă</p>
                        <p className="text-sm">Caută un specialist pentru a face prima rezervare</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {bookings.map((booking) => {
                          const status = statusConfig[booking.status] || statusConfig.pending;
                          const StatusIcon = status.icon;
                          return (
                            <div key={booking.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${status.color}`}>
                                <StatusIcon className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <Badge className={`text-xs ${status.color}`}>{status.label}</Badge>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                  <span>{new Date(booking.scheduled_date).toLocaleDateString('ro-RO')}</span>
                                  <span>{booking.scheduled_time}</span>
                                  <span className="truncate">{booking.address}</span>
                                </div>
                              </div>
                              <p className="font-semibold text-orange-500">{booking.price} lei</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg font-bold text-orange-600">{firstName[0]}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{profile?.full_name || firstName}</p>
                        <p className="text-xs text-slate-500">Client</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Become provider CTA */}
                <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-0 text-white">
                  <CardContent className="p-5">
                    <Award className="w-8 h-8 text-orange-400 mb-3" />
                    <h3 className="font-bold mb-1">Ai un skill?</h3>
                    <p className="text-sm text-slate-400 mb-3">Câștigă bani oferind servicii pe MiniJob.</p>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600 w-full" asChild>
                      <Link href="/devino-specialist">Devino specialist</Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <Card>
                  <CardHeader><CardTitle className="text-sm">Link-uri rapide</CardTitle></CardHeader>
                  <CardContent className="space-y-1">
                    <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                      <Link href="/settings"><Settings className="w-4 h-4 mr-2" />Setări cont</Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                      <Link href="/categories"><Search className="w-4 h-4 mr-2" />Caută servicii</Link>
                    </Button>
                    <Separator className="my-2" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />Deconectare
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
