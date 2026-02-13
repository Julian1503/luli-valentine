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
      <body className="antialiased min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 font-sans">
        <Providers>
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
