import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MiniJob.ro | Servicii la domiciliu în 60 de secunde",
  description: "Platformă marketplace pentru servicii la domiciliu - curățenie, montaj mobilă, reparații. Găsește prestatori verificați și rezervă instant în Sibiu.",
  keywords: ["servicii la domiciliu", "curățenie", "montaj mobilă", "reparații", "Sibiu", "prestatori", "booking instant"],
  openGraph: {
    title: "MiniJob.ro | Servicii la domiciliu în 60 de secunde",
    description: "Găsește prestatori verificați și rezervă instant. Curățenie, montaj mobilă, reparații.",
    url: "https://minijob.ro",
    siteName: "MiniJob.ro",
    locale: "ro_RO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body
        className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased`}
        style={{ fontFamily: 'var(--font-body), system-ui, sans-serif' }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
