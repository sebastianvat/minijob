export const siteConfig = {
  name: "MiniJob.ro",
  description: "Platformă marketplace pentru servicii la domiciliu - Booking în 60 secunde",
  slogan: "Bolt pentru servicii acasă",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://minijob.ro",
  
  // Contact
  email: "contact@minijob.ro",
  phone: "+40 XXX XXX XXX",
  
  // Social
  social: {
    facebook: "https://facebook.com/minijob.ro",
    instagram: "https://instagram.com/minijob.ro",
  },
  
  // Location (initial launch)
  defaultCity: "Sibiu",
  
  // Business
  commission: 0.15, // 15%
  minBookingValue: 50, // RON
  maxBookingValue: 10000, // RON
  
  // Links
  links: {
    terms: "/terms",
    privacy: "/privacy",
    help: "/help",
    blog: "/blog",
  },

  // Categories icons (Lucide)
  categoryIcons: {
    'curatenie': 'Sparkles',
    'montaj-mobila': 'Hammer',
    'reparatii': 'Wrench',
    'zugravit': 'PaintBucket',
    'instalatii': 'Zap',
    'gradinarit': 'Leaf',
    'mutari': 'Truck',
  } as Record<string, string>,
}

export type SiteConfig = typeof siteConfig
