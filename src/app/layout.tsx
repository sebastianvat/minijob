import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MiniJob.ro | Servicii la domiciliu în 60 de secunde",
  description: "Platformă marketplace pentru servicii la domiciliu - curățenie, montaj mobilă, reparații. Găsește prestatori verificați și rezervă instant.",
  keywords: ["servicii la domiciliu", "curățenie", "montaj mobilă", "reparații", "Sibiu", "prestatori"],
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
    <html lang="ro" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${dmSans.variable} font-body antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
