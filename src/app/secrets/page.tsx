"use client"
import { PageTransition } from "@/components/PageTransition";
import { useUnlockSecret } from "@/hooks/use-secrets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Loader2, Sparkles, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Secret } from "@/shared/schema";
import Confetti from "react-confetti";
import useWindowSize from "@/hooks/use-window-size";
import {useState} from "react";

export default function Secrets() {
    const [code, setCode] = useState("");
    const [unlockedSecrets, setUnlockedSecrets] = useState<Secret[]>([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const { width, height } = useWindowSize();
    const unlockMutation = useUnlockSecret();
    const { toast } = useToast();

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        try {
            const result = await unlockMutation.mutateAsync(code);
            if (result.success && result.secret) {
                setUnlockedSecrets((prev) => [...prev, result.secret!]);
                setCode("");
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 5000);

                toast({
                    title: "Secret Unlocked! 🔓",
                    description: "A new memory has been revealed.",
                    className: "bg-primary text-primary-foreground",
                });
            } else {
                toast({
                    title: "Locked",
                    description: "That code doesn't seem to work. Try again!",
                    variant: "error",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Invalid code or connection error." + error,
                variant: "error",
            });
        }
    };

    return (
        <PageTransition>
            {showConfetti && <Confetti width={width} height={height} numberOfPieces={200} colors={['#ff69b4', '#ff1493', '#ffc0cb']} />}
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-display text-foreground mb-4">Boveda de los secretos</h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Ingresá los códigos secretos que escondi en tus regalos en la vida real para desbloquear mensajes especiales aca
                </p>
            </header>

            <div className="max-w-md mx-auto mb-16">
                <Card className="p-6 bg-white/80 backdrop-blur shadow-xl border-primary/20">
                    <form onSubmit={handleUnlock} className="space-y-4">
                        <div className="text-center mb-2">
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                Modo Desafio
              </span>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Ingresa la respuesta o el codigo secreto..."
                                className="pl-9 bg-white"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={unlockMutation.isPending}>
                            {unlockMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Desbloquear secreto"}
                        </Button>
                    </form>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                    {unlockedSecrets.map((secret, i) => (
                        <motion.div
                            key={secret.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                        >
                            <Card className="overflow-hidden border-none shadow-xl bg-white/90 group">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                />
                                {secret.imageUrl && (
                                    <div className="h-48 overflow-hidden relative">
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.6 }}
                                            className="w-full h-full"
                                        >
                                            <img src={secret.imageUrl} alt={secret.title ?? "Secret"} className="w-full h-full object-cover" />
                                        </motion.div>
                                        <div className="absolute top-2 right-2">
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                            >
                                                <Heart className="w-6 h-6 text-primary fill-primary opacity-80" />
                                            </motion.div>
                                        </div>
                                    </div>
                                )}
                                <div className="p-6 relative">
                                    <div className="flex items-center gap-2 mb-4 text-primary">
                                        <Sparkles className="w-5 h-5 animate-pulse" />
                                        <span className="text-sm font-bold uppercase tracking-wider">Unlocked</span>
                                    </div>
                                    <h3 className="text-2xl font-display font-bold mb-3">{secret.title}</h3>
                                    <motion.p
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-muted-foreground leading-relaxed whitespace-pre-line"
                                    >
                                        {secret.content}
                                    </motion.p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {unlockedSecrets.length === 0 && (
                    <div className="col-span-full text-center py-20 opacity-50">
                        <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-lg text-muted-foreground">La boveda esta vacia. Encontra un codigo para empezar.</p>
                    </div>
                )}
            </div>
        </PageTransition>
    );
}
