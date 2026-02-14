"use client";

import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check, HelpCircle, Loader2 } from "lucide-react";
import ReactConfetti from "react-confetti";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

type Quiz = {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    successMessage: string | null;
};

export default function GamesClient({ quizzes }: { quizzes: Quiz[] }) {
    const { toast } = useToast();

    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [results, setResults] = useState<Record<number, boolean>>({});
    const [showConfetti, setShowConfetti] = useState(false);
    const [submittingId, setSubmittingId] = useState<number | null>(null);

    const handleAnswer = async (quizId: number, answer: string) => {
        setSelectedAnswer(answer);
        setSubmittingId(quizId);

        try {
            const res = await fetch(`/api/quizzes/${quizId}/solve`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answer }),
            });

            if (!res.ok) throw new Error("Failed to submit answer");

            const result = (await res.json()) as { correct: boolean; message?: string };

            setResults((prev) => ({ ...prev, [quizId]: result.correct }));

            if (result.correct) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);

                toast({
                    title: "¡Correcto! ❤️",
                    description: result.message || "¡Me conocés muy bien!",
                    variant: "success",
                });
            } else {
                toast({
                    title: "No del todo...",
                    description: "¡Intentá de nuevo, mi amor!",
                    variant: "error",
                });
            }

            setTimeout(() => setSelectedAnswer(null), 1500);
        } catch {
            toast({
                title: "Error",
                description: "Algo salió mal al enviar tu respuesta.",
                variant: "error",
            });
        } finally {
            setSubmittingId(null);
        }
    };

    return (
        <PageTransition>
            {showConfetti && (
                <ReactConfetti numberOfPieces={200} recycle={false} />
            )}

            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-display text-foreground mb-4">
                    Quiz de amor
                </h1>
                <p className="text-muted-foreground">¿Qué tan bien te acordás de nuestra historia? 😈</p>
            </header>

            <div className="max-w-2xl mx-auto space-y-8">
                {quizzes.map((quiz) => {
                    const solved = !!results[quiz.id];
                    const pending = submittingId === quiz.id;

                    return (
                        <motion.div
                            key={quiz.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="p-8 border-none shadow-xl bg-white/80 backdrop-blur-sm relative overflow-hidden">
                                {solved && (
                                    <div className="absolute top-0 right-0 p-4">
                                        <div className="bg-green-100 text-green-600 rounded-full p-2">
                                            <Check className="w-6 h-6" />
                                        </div>
                                    </div>
                                )}

                                <h3 className="text-2xl font-display font-bold mb-6 text-foreground flex items-start gap-3">
                                    <HelpCircle className="w-6 h-6 text-primary mt-1 shrink-0" />
                                    {quiz.question}
                                </h3>

                                <div className="grid grid-cols-1 gap-3">
                                    {quiz.options.map((option) => (
                                        <Button
                                            key={option}
                                            variant="outline"
                                            className={`
                        justify-start h-auto py-4 px-6 text-lg font-normal transition-all
                        ${selectedAnswer === option ? "bg-primary/10 border-primary text-primary" : "hover:bg-primary/5 hover:border-primary/50"}
                        ${solved && quiz.correctAnswer === option ? "bg-green-100 border-green-300 text-green-700" : ""}
                      `}
                                            disabled={solved || pending}
                                            onClick={() => handleAnswer(quiz.id, option)}
                                        >
                                            {option}
                                            {pending && selectedAnswer === option && (
                                                <Loader2 className="ml-2 w-4 h-4 animate-spin" />
                                            )}
                                        </Button>
                                    ))}
                                </div>

                                {solved && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="mt-6 p-4 bg-green-50 text-green-800 rounded-xl border border-green-100"
                                    >
                                        <p className="font-medium">✨ {quiz.successMessage}</p>
                                    </motion.div>
                                )}
                            </Card>
                        </motion.div>
                    );
                })}

                {quizzes.length === 0 && (
                    <div className="text-center text-muted-foreground py-12">
                        Nada por acá.
                    </div>
                )}
            </div>
        </PageTransition>
    );
}
