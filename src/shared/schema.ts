// Type definitions for the Valentine's app
import { z } from "zod";

export type Settings = {
    id: number;
    heroImageUrl?: string | null;
    heroImageUrl2?: string | null;
    heroTitle?: string | null;
    togetherDate?: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export type Memory = {
    id: number;
    title: string;
    description: string;
    imageUrl?: string | null;
    imageUrls?: any | null;  // JSON field containing string[]
    descriptions?: any | null;  // JSON field containing string[]
    date: string;
    order: number;
    createdAt: Date;
};

export type Quiz = {
    id: number;
    question: string;
    correctAnswer: string;
    options: string[];
    successMessage?: string | null;
    createdAt: Date;
};

export type Secret = {
    id: number;
    title?: string | null;
    content?: string | null;
    imageUrl?: string | null;
    code: string;
    createdAt: Date;
};

// Insert schemas (for API validation)
export type InsertMemory = Omit<Memory, 'id' | 'createdAt'>;
export type InsertQuiz = Omit<Quiz, 'id' | 'createdAt'>;
export type InsertSecret = Omit<Secret, 'id' | 'createdAt'>;
export type InsertSettings = Partial<Omit<Settings, 'id' | 'createdAt' | 'updatedAt'>>;

// Zod schemas for validation
export const insertMemorySchema = z.object({
    title: z.string(),
    description: z.string(),
    imageUrl: z.string().nullable().optional(),
    imageUrls: z.array(z.string()).nullable().optional(),
    descriptions: z.array(z.string()).nullable().optional(),
    date: z.string(),
    order: z.number().optional(),
});

export const insertQuizSchema = z.object({
    question: z.string(),
    correctAnswer: z.string(),
    options: z.array(z.string()),
    successMessage: z.string().nullable().optional(),
});

export const insertSecretSchema = z.object({
    title: z.string().nullable().optional(),
    content: z.string().nullable().optional(),
    imageUrl: z.string().nullable().optional(),
    code: z.string(),
});

export const insertSettingsSchema = z.object({
    heroImageUrl: z.string().nullable().optional(),
    heroImageUrl2: z.string().nullable().optional(),
    heroTitle: z.string().nullable().optional(),
    togetherDate: z.string().nullable().optional(),
});

// Mock Drizzle-like table references for compatibility with routes.ts
export const memories = {
    $inferSelect: {} as Memory,
};

export const quizzes = {
    $inferSelect: {} as Quiz,
};

export const secrets = {
    $inferSelect: {} as Secret,
};

export const settings = {
    $inferSelect: {} as Settings,
};

