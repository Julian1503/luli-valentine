"use client";

import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Calendar, ArrowRight } from "lucide-react";
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
    const heroTitle = settings.heroTitle ?? "My Love";

    return (
        <PageTransition>
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-6"
                >
                    {settings.heroImageUrl && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-8 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl"
                        >
                            <img
                                src={settings.heroImageUrl}
                                alt="Us"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    )}

                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm tracking-wide uppercase">
            Happy Valentine&apos;s Day
          </span>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-display text-foreground leading-tight">
                        {heroTitle.split(" ")[0]} <br />
                        <span className="text-primary italic font-handwriting">
              {heroTitle.split(" ").slice(1).join(" ") || "Love"}
            </span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
                        I created this little corner of the internet just for you, to celebrate us and all
                        the beautiful moments we share.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                    <Link href="/memories">
                        <Card className="p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group bg-white/60 backdrop-blur-sm border-white/50">
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-red-500">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 font-display">Our Memories</h3>
                            <p className="text-sm text-muted-foreground">
                                A journey through our favorite moments together.
                            </p>
                        </Card>
                    </Link>

                    <div className="flex flex-col items-center justify-center p-6 bg-primary/5 rounded-xl border border-primary/10">
            <span className="text-sm font-medium text-primary uppercase tracking-widest mb-2">
              Together For
            </span>
                        <span className="text-5xl font-bold font-display text-primary">{diffDays}</span>
                        <span className="text-sm text-muted-foreground mt-1">Wonderful Days</span>
                    </div>

                    <Link href="/games">
                        <Card className="p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group bg-white/60 backdrop-blur-sm border-white/50">
                            <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-pink-500">
                                <Heart className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 font-display">Love Quiz</h3>
                            <p className="text-sm text-muted-foreground">
                                How well do you know us? Take the quiz!
                            </p>
                        </Card>
                    </Link>
                </div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/memories">
                        <Button
                            size="lg"
                            className="rounded-full px-8 h-14 text-lg shadow-xl shadow-primary/20 bg-gradient-to-r from-primary to-pink-500 hover:opacity-90 transition-opacity"
                        >
                            Start the Journey <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </PageTransition>
    );
}
