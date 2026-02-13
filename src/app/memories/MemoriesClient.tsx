"use client";

import { PageTransition } from "@/components/PageTransition";
import { motion } from "framer-motion";

type Memory = {
    id: number;
    title: string;
    description: string;
    imageUrl: string | null;
    date: string;
    order: number;
};

export default function MemoriesClient({ memories }: { memories: Memory[] }) {
    const sortedMemories = [...(memories ?? [])].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );

    return (
        <PageTransition>
            <header className="text-center mb-16 space-y-4">
                <h1 className="text-4xl md:text-6xl font-display text-foreground">
                    Memory Lane
                </h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    Every picture tells a story of us. Here are some of my absolute favorites.
                </p>
            </header>

            {sortedMemories.length === 0 ? (
                <div className="text-center py-20 bg-white/50 rounded-2xl border border-dashed border-primary/20">
                    <p className="text-lg text-muted-foreground">
                        No memories yet. Add some in the Admin panel!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sortedMemories.map((memory, index) => (
                        <motion.div
                            key={memory.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="group relative"
                        >
                            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-white shadow-xl shadow-black/5 border-4 border-white transform transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-1">
                                <img
                                    src={
                                        memory.imageUrl ??
                                        "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop&q=60"
                                    }
                                    alt={memory.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                  <span className="font-handwriting text-2xl text-primary-foreground/90">
                    {memory.date}
                  </span>
                                    <p className="text-sm opacity-90 mt-1 line-clamp-3">
                                        {memory.description}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 text-center">
                                <h3 className="font-display text-xl font-bold text-foreground">
                                    {memory.title}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </PageTransition>
    );
}
