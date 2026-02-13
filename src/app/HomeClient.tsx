"use client";

import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

type Settings = {
    heroImageUrl?: string | null;
    heroTitle?: string | null;
    togetherDate?: string | null;
};

export default function HomeClient({
                                       settings,
                                       diffDays,
                                   }: {
    settings: Settings;
    diffDays: number;
}) {
    const heroTitle = settings.heroTitle ?? "Mi ninita";

    return (
        <PageTransition>
            <div className="flex flex-col items-center justify-center min-h-[85vh] text-center space-y-12 py-8 relative">
                {/* Decorative elements */}
                <div className="absolute top-20 left-10 md:left-20 text-pink-400 opacity-50">
                    <Heart className="w-8 h-8 fill-current animate-pulse" />
                </div>
                <div className="absolute top-40 right-10 md:right-20 text-rose-400 opacity-50">
                    <Heart className="w-6 h-6 fill-current animate-pulse" style={{ animationDelay: '0.3s' }} />
                </div>

                <div className="space-y-8 relative z-10 px-4">
                    {settings.heroImageUrl && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="w-56 h-56 md:w-72 md:h-72 mx-auto mb-8 rounded-full overflow-hidden border-8 border-white shadow-2xl shadow-pink-300/50"
                        >
                            <img
                                src={settings.heroImageUrl}
                                alt="Us"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    )}

                    <div className="inline-block px-6 py-2 rounded-full romantic-gradient text-white font-semibold text-sm tracking-widest uppercase shadow-lg">
                        ✨ Feliz dia de los enamorados ✨
                    </div>

                    <h1 className="text-6xl md:text-7xl lg:text-9xl font-display font-bold text-foreground leading-tight">
                        <span className="block">{heroTitle.split(" ")[0]}</span>
                        <span className="block romantic-text-gradient text-7xl md:text-8xl lg:text-[10rem] font-elegant mt-4">
                            {heroTitle.split(" ").slice(1).join(" ") || "Love"}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Hice este pequeno regalito para que podamos apreciar lo lindo que es <span className="font-handwriting text-2xl text-primary font-bold">nuestro</span> amor
                        y todos los momentos hermosos que compartimos 💕
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
                    <Link href="/memories" className="block">
                        <Card className="p-8 romantic-card hover-lift cursor-pointer group h-full">
                            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center mb-6 mx-auto shadow-lg">
                                <Calendar className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-display font-bold mb-3 text-foreground">Nuestros recuerdos</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Un viaje hermoso por nuestros momentos favoritos juntos, cada recuerdo es re valioso ❤️
                            </p>
                        </Card>
                    </Link>

                    <div className="flex flex-col items-center justify-center p-8 romantic-card rounded-2xl shadow-xl">
                        <span className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
                            Estuvimos juntos por
                        </span>
                        <span className="text-6xl md:text-7xl font-display font-bold romantic-text-gradient">
                            {diffDays}
                        </span>
                        <span className="text-sm text-muted-foreground mt-2 font-handwriting text-lg">
                            Hermosos dias y estoy feliz por tener mas
                        </span>
                    </div>

                    <Link href="/games" className="block">
                        <Card className="p-8 romantic-card hover-lift cursor-pointer group h-full">
                            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center mb-6 mx-auto shadow-lg">
                                <Heart className="w-7 h-7 text-white fill-white" />
                            </div>
                            <h3 className="text-2xl font-display font-bold mb-3 text-foreground">Preguntitas</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Que tan bien nos conoces 💝 pruebita sorpresa
                            </p>
                        </Card>
                    </Link>
                </div>

                <Link href="/memories">
                    <Button
                        size="lg"
                        className="romantic-gradient rounded-full px-10 h-16 text-lg font-semibold shadow-2xl text-white border-2 border-white/50 hover:scale-105 transition-transform duration-300"
                    >
                        Comenzar nuestro viajecito <ArrowRight className="ml-2 w-6 h-6" />
                    </Button>
                </Link>

                <div className="max-w-xl mx-auto mt-8 px-4">
                    <p className="font-elegant text-2xl md:text-3xl text-primary/80 italic">
                        &quot;Desde que estas en mi vida, entendi que el amor no es prometerlo todo, sino elegirte cada dia en las cosas pequeñas… y ahi es donde siempre te encuentro.&quot;
                    </p>
                </div>
            </div>
        </PageTransition>
    );
}
