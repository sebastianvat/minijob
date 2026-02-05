'use client';

import { useState, useEffect } from 'react';
import { Calendar, MessageCircle, Phone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/client';

interface BookingCardProps {
  providerId: string;
  providerName: string;
  responseTime: string;
  startingPrice?: string;
}

export function BookingCard({ providerId, providerName, responseTime, startingPrice = '60 lei' }: BookingCardProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkAuth();
  }, []);

  const handleBooking = () => {
    if (!isLoggedIn) {
      window.location.href = `/auth/login?redirect=/book/${providerId}`;
      return;
    }
    // Go to booking page
    window.location.href = `/book/${providerId}`;
  };

  return (
    <>
      <Card className="border-orange-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Rezervă acest prestator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-slate-600 mb-1">Prețuri de la</p>
            <p className="text-3xl font-bold text-orange-500">{startingPrice}<span className="text-lg">/h</span></p>
          </div>

          <Button 
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-lg"
            onClick={handleBooking}
          >
            <Calendar className="w-5 h-5 mr-2" />
            {isLoggedIn ? 'Rezervă acum' : 'Loghează-te pentru rezervare'}
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="h-12" onClick={() => alert('Mesagerie în curând!')}>
              <MessageCircle className="w-5 h-5 mr-2" />
              Mesaj
            </Button>
            <Button variant="outline" className="h-12" onClick={() => alert('Apelare în curând!')}>
              <Phone className="w-5 h-5 mr-2" />
              Sună
            </Button>
          </div>

          <Separator />

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Răspunde în {responseTime}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Garanție satisfacție</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Anulare gratuită cu 24h înainte</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
