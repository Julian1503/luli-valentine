"use client";

import { useState } from "react";
import type { Secret } from "@/shared/schema";

export function useSecrets() {
    const [secrets, setSecrets] = useState<Secret[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchSecrets = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/secrets");
            if (!response.ok) throw new Error("Failed to fetch secrets");
            const data = await response.json();
            setSecrets(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        secrets,
        isLoading,
        error,
        fetchSecrets,
    };
}

export function useUnlockSecret() {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const mutateAsync = async (code: string): Promise<{ success: boolean; secret?: Secret }> => {
        setIsPending(true);
        setError(null);
        try {
            const response = await fetch("/api/secrets/unlock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to unlock secret");
            }
            
            const data = await response.json();
            return data;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setIsPending(false);
        }
    };

    return {
        mutateAsync,
        isPending,
        error,
    };
}
