import Link from 'next/link';
import { 
  Zap, ArrowLeft, Star, MapPin, Clock, Calendar,
  CheckCircle2, Share2, Heart,
  Sparkles, Shield, Award, ThumbsUp
} from 'lucide-react';
import { BookingCard } from '@/components/booking-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Generate static paths for demo providers
export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
  ];
}

// Mock provider data
const mockProviders: Record<string, {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  verified: boolean;
  city: string;
  memberSince: string;
  responseTime: string;
  completedJobs: number;
  bio: string;
  categories: string[];
  services: { name: string; price: string; duration: string }[];
  availability: string[];
  reviews_list: { id: number; author: string; rating: number; date: string; text: string; service: string }[];
}> = {
  '1': {
    id: '1',
    name: 'Ana Maria Popescu',
    avatar: 'A',
    rating: 4.9,
    reviews: 48,
    verified: true,
    city: 'Sibiu',
    memberSince: 'Ianuarie 2025',
    responseTime: '< 1 oră',
    completedJobs: 156,
    bio: 'Bună! Sunt Ana și ofer servicii profesionale de curățenie de peste 5 ani. Am experiență în curățenie pentru apartamente, case și birouri. Folosesc doar produse de calitate și sunt foarte atentă la detalii.',
    categories: ['Curățenie', 'Curățenie după renovare'],
    services: [
      { name: 'Curățenie generală apartament', price: '150-250 lei', duration: '2-3 ore' },
      { name: 'Curățenie detaliată', price: '250-400 lei', duration: '4-5 ore' },
      { name: 'Curățenie după renovare', price: '300-500 lei', duration: '5-6 ore' },
    ],
    availability: ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri'],
    reviews_list: [
      { id: 1, author: 'Maria I.', rating: 5, date: '15 Ian 2026', text: 'Foarte mulțumită! Ana a făcut o treabă excelentă.', service: 'Curățenie generală' },
      { id: 2, author: 'Ion P.', rating: 5, date: '10 Ian 2026', text: 'Profesionistă și punctuală.', service: 'Curățenie după renovare' },
    ]
  },
  '2': {
    id: '2',
    name: 'Ion Munteanu',
    avatar: 'I',
    rating: 4.8,
    reviews: 32,
    verified: true,
    city: 'Sibiu',
    memberSince: 'Martie 2025',
    responseTime: '< 2 ore',
    completedJobs: 98,
    bio: 'Montez orice tip de mobilier: IKEA, Jysk, Dedeman. Experiență de 8 ani în domeniu. Calitate garantată.',
    categories: ['Montaj Mobilă', 'Reparații'],
    services: [
      { name: 'Montaj dulap', price: '100-200 lei', duration: '1-2 ore' },
      { name: 'Montaj pat', price: '80-150 lei', duration: '1 oră' },
      { name: 'Montaj bucătărie', price: '300-500 lei', duration: '4-6 ore' },
    ],
    availability: ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'],
    reviews_list: [
      { id: 1, author: 'Elena D.', rating: 5, date: '12 Ian 2026', text: 'Montaj rapid și profesionist.', service: 'Montaj dulap' },
    ]
  },
  '3': {
    id: '3',
    name: 'Elena Radu',
    avatar: 'E',
    rating: 4.7,
    reviews: 24,
    verified: false,
    city: 'Sibiu',
    memberSince: 'Februarie 2025',
    responseTime: '< 3 ore',
    completedJobs: 45,
    bio: 'Curățenie generală și după renovare. Sunt atentă la detalii și folosesc produse eco.',
    categories: ['Curățenie'],
    services: [
      { name: 'Curățenie generală', price: '100-200 lei', duration: '2-3 ore' },
    ],
    availability: ['Luni', 'Miercuri', 'Vineri'],
    reviews_list: [
      { id: 1, author: 'Ana M.', rating: 5, date: '8 Ian 2026', text: 'Foarte mulțumită de servicii.', service: 'Curățenie generală' },
    ]
  },
  '4': {
    id: '4',
    name: 'Maria Ionescu',
    avatar: 'M',
    rating: 5.0,
    reviews: 18,
    verified: true,
    city: 'Sibiu',
    memberSince: 'Decembrie 2024',
    responseTime: '< 1 oră',
    completedJobs: 67,
    bio: 'Servicii premium de curățenie. Folosesc doar produse eco și sunt foarte atentă la detalii.',
    categories: ['Curățenie', 'Curățenie detaliată'],
    services: [
      { name: 'Curățenie premium', price: '200-350 lei', duration: '3-4 ore' },
    ],
    availability: ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri'],
    reviews_list: [
      { id: 1, author: 'George P.', rating: 5, date: '5 Ian 2026', text: 'Cea mai bună curățenie!', service: 'Curățenie premium' },
    ]
  }
};

export default function ProviderPage({ params }: { params: { id: string } }) {
  const provider = mockProviders[params.id] || mockProviders['1'];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/categories">
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
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl font-bold text-orange-600">{provider.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-bold text-slate-900">{provider.name}</h1>
                      {provider.verified && (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verificat
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-slate-900">{provider.rating}</span>
                        <span>({provider.reviews} reviews)</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {provider.city}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {provider.categories.map((cat) => (
                        <Badge key={cat} variant="outline" className="border-orange-200 text-orange-600">
                          <Sparkles className="w-3 h-3 mr-1" />
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{provider.completedJobs}</p>
                  <p className="text-xs text-slate-500">Servicii</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{provider.rating}</p>
                  <p className="text-xs text-slate-500">Rating</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{provider.responseTime}</p>
                  <p className="text-xs text-slate-500">Răspuns</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <ThumbsUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">98%</p>
                  <p className="text-xs text-slate-500">Recomandări</p>
                </CardContent>
              </Card>
            </div>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>Despre</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-6">{provider.bio}</p>
                
                <Separator className="my-4" />
                
                <h4 className="font-semibold text-slate-900 mb-3">Disponibilitate</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {provider.availability.map((day) => (
                    <Badge key={day} variant="outline">{day}</Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Membru din {provider.memberSince}
                  </span>
                  {provider.verified && (
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Identitate verificată
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Servicii oferite</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {provider.services.map((service, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-slate-900">{service.name}</h4>
                        <p className="text-sm text-slate-500">Durată: {service.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-orange-500">{service.price}</p>
                        <Button size="sm" className="mt-2 bg-orange-500 hover:bg-orange-600">
                          Rezervă
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews ({provider.reviews})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {provider.reviews_list.map((review) => (
                    <div key={review.id} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                            <span className="font-medium text-slate-600">{review.author[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{review.author}</p>
                            <p className="text-xs text-slate-500">{review.service} • {review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600">{review.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingCard 
                providerId={provider.id}
                providerName={provider.name}
                responseTime={provider.responseTime}
                startingPrice="60 lei"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
