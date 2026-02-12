'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Zap, ArrowLeft, Calendar, Clock, MapPin, Star,
  CheckCircle2, CreditCard, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface ProviderInfo {
  id: string;
  user_id: string;
  business_name: string | null;
  rating: number;
  total_reviews: number;
  verified: boolean;
  categories: string[];
  profile: {
    full_name: string | null;
    avatar_url: string | null;
    location_city: string | null;
  } | null;
  services: {
    id: string;
    title: string;
    price: number;
    price_type: string;
    duration_minutes: number | null;
  }[];
}

// Generate next 14 days
const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
};

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const dayNames = ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'];

export default function BookingPage() {
  const params = useParams();
  const providerId = params.providerId as string;

  const [provider, setProvider] = useState<ProviderInfo | null>(null);
  const [step, setStep] = useState(1);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Booking data
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');

  const dates = generateDates();
  const selectedServiceData = provider?.services?.find(s => s.id === selectedService);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();

      // Check auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = `/auth/login?redirect=/book/${providerId}`;
        return;
      }
      setUser({ id: user.id });

      // Load provider
      const { data } = await (supabase as any)
        .from('providers')
        .select(`
          id, user_id, business_name, rating, total_reviews, verified, categories,
          profile:profiles!user_id(full_name, avatar_url, location_city),
          services(id, title, price, price_type, duration_minutes)
        `)
        .eq('id', providerId)
        .single();

      if (data) setProvider(data);
      setLoading(false);
    };
    init();
  }, [providerId]);

  const handleSubmit = async () => {
    if (!user || !provider || !selectedDate || !selectedTime || !address) return;

    setSubmitting(true);
    const supabase = createClient();

    // Find a category_id from provider's categories
    let categoryId = null;
    if (provider.categories?.length) {
      const { data: catData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', provider.categories[0])
        .single();
      if (catData) categoryId = (catData as any).id;
    }

    const { error } = await (supabase as any).from('bookings').insert({
      client_id: user.id,
      provider_id: provider.id,
      service_id: selectedService || null,
      category_id: categoryId,
      scheduled_date: selectedDate.toISOString().split('T')[0],
      scheduled_time: selectedTime,
      address: address,
      notes: notes || null,
      price: selectedServiceData?.price || 0,
      payment_method: paymentMethod,
      status: 'pending',
    });

    if (error) {
      toast.error(`Eroare: ${error.message}`);
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setSubmitting(false);
    toast.success('Rezervare creată!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Specialist negăsit</h2>
          <Button asChild><Link href="/categories">Caută specialiști</Link></Button>
        </div>
      </div>
    );
  }

  const displayName = provider.profile?.full_name || provider.business_name || 'Specialist';

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b h-16 flex items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">MiniJob</span>
          </Link>
        </header>
        <div className="container mx-auto px-4 py-16 text-center max-w-lg">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Rezervare trimisă!</h1>
          <p className="text-slate-600 mb-6">
            {displayName} va confirma rezervarea în curând. Vei fi notificat.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" asChild><Link href="/dashboard">Dashboard</Link></Button>
            <Button className="bg-orange-500 hover:bg-orange-600" asChild><Link href="/">Acasă</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/providers/${providerId}`}><ArrowLeft className="w-5 h-5" /></Link>
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">MiniJob</span>
            </Link>
          </div>
          <span className="text-sm text-slate-500">Pas {step}/3</span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="md:col-span-2 space-y-6">
            {/* Step 1: Select service + date */}
            {step === 1 && (
              <Card>
                <CardHeader><CardTitle>1. Alege serviciul și data</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  {/* Services */}
                  {provider.services?.length > 0 && (
                    <div>
                      <Label className="mb-3 block">Serviciu</Label>
                      <div className="space-y-2">
                        {provider.services.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setSelectedService(s.id)}
                            className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between
                              ${selectedService === s.id ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-slate-300'}`}
                          >
                            <div>
                              <p className="font-medium text-slate-900">{s.title}</p>
                              {s.duration_minutes && <p className="text-xs text-slate-500">~{s.duration_minutes} min</p>}
                            </div>
                            <span className="font-semibold text-orange-500">{s.price} lei</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Date picker */}
                  <div>
                    <Label className="mb-3 block">Data</Label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {dates.map((date) => {
                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                        const isToday = date.toDateString() === new Date().toDateString();
                        return (
                          <button
                            key={date.toISOString()}
                            onClick={() => setSelectedDate(date)}
                            className={`flex flex-col items-center p-3 rounded-xl border-2 min-w-[65px] transition-all
                              ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-slate-300'}`}
                          >
                            <span className="text-xs text-slate-500">{dayNames[date.getDay()]}</span>
                            <span className="text-lg font-bold text-slate-900">{date.getDate()}</span>
                            {isToday && <span className="text-[10px] text-orange-500 font-medium">Azi</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time slots */}
                  {selectedDate && (
                    <div>
                      <Label className="mb-3 block">Ora</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 rounded-lg border-2 text-sm font-medium transition-all
                              ${selectedTime === time ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-200 hover:border-slate-300'}`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => setStep(2)}
                    disabled={!selectedDate || !selectedTime}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    Continuă
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Address + notes */}
            {step === 2 && (
              <Card>
                <CardHeader><CardTitle>2. Adresa și detalii</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label>Adresa completă *</Label>
                    <Input placeholder="Strada, nr, bloc, ap, etc." value={address} onChange={(e) => setAddress(e.target.value)} className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label>Note / instrucțiuni speciale</Label>
                    <Textarea placeholder="Ex: interfon 5, etaj 3, acces din spate..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Înapoi</Button>
                    <Button onClick={() => setStep(3)} disabled={!address} className="flex-1 bg-orange-500 hover:bg-orange-600">Continuă</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <Card>
                <CardHeader><CardTitle>3. Confirmare</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
                    {selectedServiceData && <p><strong>Serviciu:</strong> {selectedServiceData.title}</p>}
                    <p><strong>Data:</strong> {selectedDate?.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    <p><strong>Ora:</strong> {selectedTime}</p>
                    <p><strong>Adresa:</strong> {address}</p>
                    {notes && <p><strong>Note:</strong> {notes}</p>}
                  </div>

                  <div>
                    <Label className="mb-3 block">Metodă de plată</Label>
                    <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'cash' | 'card')}>
                      <div className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer
                        ${paymentMethod === 'cash' ? 'border-orange-500 bg-orange-50' : 'border-slate-200'}`}>
                        <Label htmlFor="cash" className="flex items-center gap-3 cursor-pointer">
                          <span className="text-lg">💵</span>
                          <div><p className="font-medium">Cash</p><p className="text-xs text-slate-500">Plată la finalizare</p></div>
                        </Label>
                        <RadioGroupItem value="cash" id="cash" />
                      </div>
                      <div className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer mt-2
                        ${paymentMethod === 'card' ? 'border-orange-500 bg-orange-50' : 'border-slate-200'}`}>
                        <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer">
                          <CreditCard className="w-5 h-5 text-slate-600" />
                          <div><p className="font-medium">Card</p><p className="text-xs text-slate-500">Prin platformă (în curând)</p></div>
                        </Label>
                        <RadioGroupItem value="card" id="card" disabled />
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Înapoi</Button>
                    <Button onClick={handleSubmit} disabled={submitting} className="flex-1 bg-orange-500 hover:bg-orange-600">
                      {submitting ? 'Se trimite...' : 'Confirmă rezervarea'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - provider info */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center">
                    {provider.profile?.avatar_url ? (
                      <img src={provider.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-orange-600">{displayName[0]}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{displayName}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      {provider.rating.toFixed(1)} ({provider.total_reviews})
                    </div>
                  </div>
                </div>
                {selectedServiceData && (
                  <div className="border-t pt-3 mt-3 text-sm space-y-2">
                    <div className="flex justify-between"><span className="text-slate-500">Serviciu</span><span className="font-medium">{selectedServiceData.title}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Preț</span><span className="font-bold text-orange-500">{selectedServiceData.price} lei</span></div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
