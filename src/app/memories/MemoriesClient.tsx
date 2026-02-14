"use client";

import { PageTransition } from "@/components/PageTransition";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Memory = {
    id: number;
    title: string;
    description: string;
    imageUrl: string | null;
    imageUrls?: string[] | null;
    descriptions?: string[] | null;
    date: string;
    order: number;
};

function MemoryCard({ memory, index, onClick }: { memory: Memory; index: number; onClick: () => void }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

    // Get images array
    const images = memory.imageUrls && Array.isArray(memory.imageUrls) && memory.imageUrls.length > 0
        ? memory.imageUrls
        : memory.imageUrl
            ? [memory.imageUrl]
            : ["https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop&q=60"];

    const hasMultipleImages = images.length > 1;

    // Auto-cycle images on hover
    useEffect(() => {
        if (isHovering && hasMultipleImages) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % images.length);
            }, 2500); // Change every 2.5 seconds
            return () => clearInterval(interval);
        }
        // Don't reset to 0 synchronously in effect
    }, [isHovering, hasMultipleImages, images.length]);

    // Reset to first image when hover ends
    useEffect(() => {
        if (!isHovering && currentImageIndex !== 0) {
            const timer = setTimeout(() => setCurrentImageIndex(0), 100);
            return () => clearTimeout(timer);
        }
    }, [isHovering, currentImageIndex]);

    // Get current description
    const descriptions = memory.descriptions && Array.isArray(memory.descriptions) && memory.descriptions.length > 0
        ? memory.descriptions
        : [memory.description];

    const currentDescription = descriptions.length === 1
        ? descriptions[0]
        : descriptions[currentImageIndex] || descriptions[0] || memory.description;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative cursor-pointer"
            onClick={onClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-white shadow-xl shadow-black/5 border-4 border-white transform transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-1">
                <img
                    src={images[currentImageIndex]}
                    alt={memory.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                    <span className="font-handwriting text-2xl text-primary-foreground/90">
                        {memory.date}
                    </span>
                    <p className="text-sm opacity-90 mt-1 line-clamp-3">
                        {currentDescription}
                    </p>
                    {hasMultipleImages && (
                        <div className="flex gap-1 mt-2">
                            {images.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 w-1.5 rounded-full transition-all ${
                                        i === currentImageIndex ? "bg-white w-4" : "bg-white/50"
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 text-center">
                <h3 className="font-display text-xl font-bold text-foreground">
                    {memory.title}
                </h3>
            </div>
        </motion.div>
    );
}

function MemoryDialog({ memory, open, onClose }: { memory: Memory | null; open: boolean; onClose: () => void }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!memory) return null;

    // Get images array
    const images = memory.imageUrls && Array.isArray(memory.imageUrls) && memory.imageUrls.length > 0
        ? memory.imageUrls
        : memory.imageUrl
            ? [memory.imageUrl]
            : ["https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop&q=60"];

    const hasMultipleImages = images.length > 1;

    // Get descriptions
    const descriptions = memory.descriptions && Array.isArray(memory.descriptions) && memory.descriptions.length > 0
        ? memory.descriptions
        : [memory.description];

    const currentDescription = descriptions.length === 1
        ? descriptions[0]
        : descriptions[currentImageIndex] || descriptions[0] || memory.description;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-display">{memory.title}</DialogTitle>
                    <DialogDescription className="text-lg font-handwriting text-primary">
                        {memory.date}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Image gallery */}
                    <div className="relative">
                        <img
                            src={images[currentImageIndex]}
                            alt={memory.title}
                            className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                        />
                        {hasMultipleImages && (
                            <>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                                    onClick={prevImage}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                                    onClick={nextImage}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 px-3 py-2 rounded-full">
                                    {images.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentImageIndex(i)}
                                            className={`h-2 w-2 rounded-full transition-all ${
                                                i === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Description */}
                    <div className="prose prose-sm max-w-none">
                        <p className="text-base leading-relaxed whitespace-pre-wrap">
                            {currentDescription}
                        </p>
                    </div>

                    {hasMultipleImages && descriptions.length > 1 && (
                        <p className="text-xs text-muted-foreground text-center">
                            Imagen {currentImageIndex + 1} de {images.length}
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function MemoriesClient({ memories }: { memories: Memory[] }) {
    const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Sort by date (oldest to newest)
    const sortedMemories = [...(memories ?? [])].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
    });

    const openMemory = (memory: Memory) => {
        setSelectedMemory(memory);
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setTimeout(() => setSelectedMemory(null), 300);
    };

    return (
        <PageTransition>
            <header className="text-center mb-16 space-y-4">
                <h1 className="text-4xl md:text-6xl font-display text-foreground">
                    Recuerditos de nosotros
                </h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    Cada foto cuenta una historia nuestra. Acá están algunas de mis favoritas, lejos.
                </p>
            </header>

            {sortedMemories.length === 0 ? (
                <div className="text-center py-20 bg-white/50 rounded-2xl border border-dashed border-primary/20">
                    <p className="text-lg text-muted-foreground">
                        Todavía no hay recuerdos. ¡Agrega algunos en el panel de admin!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sortedMemories.map((memory, index) => (
                        <MemoryCard
                            key={memory.id}
                            memory={memory}
                            index={index}
                            onClick={() => openMemory(memory)}
                        />
                    ))}
                </div>
            )}

            <MemoryDialog
                memory={selectedMemory}
                open={dialogOpen}
                onClose={closeDialog}
            />
        </PageTransition>
    );
}
