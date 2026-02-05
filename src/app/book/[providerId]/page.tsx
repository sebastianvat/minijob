'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Zap, ArrowLeft, Calendar, Clock, MapPin, Star,
  CheckCircle2, CreditCard, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { createClient } from '@/lib/supabase/client';

// Mock provider data (în producție vine din Supabase)
const mockProviders: Record<string, {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  city: string;
  services: { id: string; name: string; price: string; priceNum: number; duration: string }[];
}> = {
  '1': {
    id: '1',
    name: 'Ana Maria Popescu',
    avatar: 'A',
    rating: 4.9,
    reviews: 48,
    city: 'Sibiu',
    services: [
      { id: 's1', name: 'Curățenie generală apartament', price: '150-250 lei', priceNum: 150, duration: '2-3 ore' },
      { id: 's2', name: 'Curățenie detaliată', price: '250-400 lei', priceNum: 250, duration: '4-5 ore' },
      { id: 's3', name: 'Curățenie după renovare', price: '300-500 lei', priceNum: 300, duration: '5-6 ore' },
    ],
  },
  '2': {
    id: '2',
    name: 'Ion Munteanu',
    avatar: 'I',
    rating: 4.8,
    reviews: 32,
    city: 'Sibiu',
    services: [
      { id: 's1', name: 'Montaj dulap', price: '100-200 lei', priceNum: 100, duration: '1-2 ore' },
      { id: 's2', name: 'Montaj pat', price: '80-150 lei', priceNum: 80, duration: '1 oră' },
      { id: 's3', name: 'Montaj bucătărie', price: '300-500 lei', priceNum: 300, duration: '4-6 ore' },
    ],
  },
};

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

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

const dayNames = ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'];
const monthNames = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function BookingPage() {
  const params = useParams();
  const providerId = params.providerId as string;
  
  const [step, setStep] = useState(1);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Booking data
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');

  const provider = mockProviders[providerId] || mockProviders['1'];
  const dates = generateDates();
  const selectedServiceData = provider.services.find(s => s.id === selectedService);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        window.location.href = `/auth/login?redirect=/book/${providerId}`;
        return;
      }
      
      setUser({ id: user.id, email: user.email || '' });
      setLoading(false);
    };
    checkAuth();
  }, [providerId]);

  const handleSubmit = async () => {
    if (!user || !selectedService || !selectedDate || !selectedTime || !address) return;
    
    setSubmitting(true);
    
    const supabase = createClient();
    
    // Create booking (folosim type assertion pentru demo data)
    const { error } = await supabase.from('bookings').insert({
      client_id: user.id,
      provider_id: providerId,
      service_id: null, // Demo - în producție ar fi UUID real
      category_id: 'curatenie', // Demo category
      scheduled_date: selectedDate.toISOString().split('T')[0],
      scheduled_time: selectedTime,
      address: address,
      notes: notes,
      price: selectedServiceData?.priceNum || 0,
      payment_method: paymentMethod,
      status: 'pending',
    } as any); // Type assertion pentru demo

    if (error) {
      console.error('Booking error:', error);
      alert('Eroare la creare rezervare. Te rugăm să încerci din nou.');
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-10 pb-10">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Rezervare trimisă!</h1>
            <p className="text-slate-600 mb-6">
              {provider.name} va confirma rezervarea în curând. Vei primi o notificare.
            </p>
            <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-slate-600">
                <strong>Serviciu:</strong> {selectedServiceData?.name}<br/>
                <strong>Data:</strong> {selectedDate?.toLocaleDateString('ro-RO')}<br/>
                <strong>Ora:</strong> {selectedTime}<br/>
                <strong>Adresă:</strong> {address}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button className="flex-1 bg-orange-500 hover:bg-orange-600" asChild>
                <Link href="/categories">Caută alte servicii</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/providers/${providerId}`}>
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">MiniJob</span>
            </Link>
          </div>
          <div className="text-sm text-slate-500">
            Pas {step} din 3
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                s <= step ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <div className={`w-16 h-1 mx-2 ${s < step ? 'bg-orange-500' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Service & Date */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Alege serviciul și data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Service Selection */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">Serviciu</Label>
                    <RadioGroup value={selectedService} onValueChange={setSelectedService}>
                      {provider.services.map((service) => (
                        <div key={service.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:border-orange-300 cursor-pointer">
                          <RadioGroupItem value={service.id} id={service.id} />
                          <Label htmlFor={service.id} className="flex-1 cursor-pointer">
                            <span className="font-medium">{service.name}</span>
                            <span className="text-sm text-slate-500 block">{service.duration}</span>
                          </Label>
                          <span className="font-semibold text-orange-500">{service.price}</span>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">Data</Label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {dates.map((date, idx) => {
                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                        const isToday = date.toDateString() === new Date().toDateString();
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedDate(date)}
                            className={`flex-shrink-0 w-16 p-3 rounded-lg text-center transition-all ${
                              isSelected 
                                ? 'bg-orange-500 text-white' 
                                : 'bg-white border border-slate-200 hover:border-orange-300'
                            }`}
                          >
                            <div className="text-xs opacity-70">{dayNames[date.getDay()]}</div>
                            <div className="text-lg font-bold">{date.getDate()}</div>
                            <div className="text-xs opacity-70">{monthNames[date.getMonth()]}</div>
                            {isToday && <Badge className="mt-1 text-xs px-1 py-0 bg-green-100 text-green-700">Azi</Badge>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Selection */}
                  {selectedDate && (
                    <div>
                      <Label className="text-base font-medium mb-3 block">Ora</Label>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-3 rounded-lg text-sm font-medium transition-all ${
                              selectedTime === time
                                ? 'bg-orange-500 text-white'
                                : 'bg-white border border-slate-200 hover:border-orange-300'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full h-12 bg-orange-500 hover:bg-orange-600"
                    disabled={!selectedService || !selectedDate || !selectedTime}
                    onClick={() => setStep(2)}
                  >
                    Continuă
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Detalii rezervare</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="address">Adresa completă *</Label>
                    <div className="relative mt-2">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <Input
                        id="address"
                        placeholder="Strada, număr, bloc, scară, apartament, oraș"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notițe pentru prestator (opțional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Detalii suplimentare, cod interfon, etc."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="text-base font-medium mb-3 block">Metodă de plată</Label>
                    <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'cash' | 'card')}>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-orange-300 cursor-pointer">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex-1 cursor-pointer">
                          <span className="font-medium">💵 Cash</span>
                          <span className="text-sm text-slate-500 block">Plătești direct prestatorului</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-orange-300 cursor-pointer opacity-50">
                        <RadioGroupItem value="card" id="card" disabled />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          <span className="font-medium">💳 Card online</span>
                          <span className="text-sm text-slate-500 block">În curând</span>
                        </Label>
                        <Badge variant="outline">Coming soon</Badge>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Înapoi
                    </Button>
                    <Button 
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                      disabled={!address}
                      onClick={() => setStep(3)}
                    >
                      Continuă
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Confirmă rezervarea</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-slate-600">Serviciu</span>
                      <span className="font-medium">{selectedServiceData?.name}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-slate-600">Data</span>
                      <span className="font-medium">{selectedDate?.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-slate-600">Ora</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-slate-600">Adresă</span>
                      <span className="font-medium text-right max-w-[200px]">{address}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-slate-600">Plată</span>
                      <span className="font-medium">{paymentMethod === 'cash' ? '💵 Cash' : '💳 Card'}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-lg font-medium">Total estimat</span>
                      <span className="text-xl font-bold text-orange-500">{selectedServiceData?.price}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-700">
                      <strong>Notă:</strong> Prestatorul va confirma rezervarea. Prețul final poate varia în funcție de complexitatea serviciului.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Înapoi
                    </Button>
                    <Button 
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Se trimite...
                        </span>
                      ) : (
                        'Confirmă rezervarea'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Provider Info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-xl font-bold text-orange-600">{provider.avatar}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{provider.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{provider.rating} ({provider.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{provider.city}</span>
                </div>

                {selectedServiceData && (
                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Serviciu selectat:</span>
                    </div>
                    <p className="font-medium text-slate-900 mb-1">{selectedServiceData.name}</p>
                    <p className="text-orange-500 font-semibold">{selectedServiceData.price}</p>
                    <p className="text-sm text-slate-500">{selectedServiceData.duration}</p>
                  </div>
                )}

                {selectedDate && selectedTime && (
                  <div className="pt-4 border-t mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{selectedDate.toLocaleDateString('ro-RO')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{selectedTime}</span>
                    </div>
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
