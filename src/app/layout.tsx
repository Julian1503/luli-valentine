import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { HeartBackground } from "@/components/HeartBackground";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "My Love - Valentine's Day Special",
  description: "A special place created just for you, my love",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Dancing+Script:wght@400;700&family=Great+Vibes&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 font-sans relative overflow-x-hidden">
        <Providers>
          {/* Romantic background pattern */}
          <div className="fixed inset-0 z-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,64,122,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,182,193,0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,192,203,0.15),transparent_50%)]" />
          </div>
          
          <HeartBackground />
          <Navigation />
          <main className="relative z-10">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
