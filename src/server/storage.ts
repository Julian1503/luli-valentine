import { prisma } from "@/lib/prisma";

export type InsertSettings = Partial<{
    heroImageUrl: string | null;
    heroImageUrl2: string | null;
    heroTitle: string | null;
    togetherDate: string | null;
}>;

export type Settings = Awaited<ReturnType<PrismaStorage["getSettings"]>>;

export type InsertMemory = {
    title: string;
    description: string;
    imageUrl?: string | null;
    imageUrls?: string[] | null;  // Multiple images
    descriptions?: string[] | null;  // Multiple descriptions (one per image or single for all)
    date: string;
    order?: number;
};

export type InsertQuiz = {
    question: string;
    correctAnswer: string;
    options: string[];
    successMessage?: string | null;
};

export type InsertSecret = {
    title?: string | null;
    content?: string | null;
    imageUrl?: string | null;
    code: string;
};

export interface IStorage {
    // Settings
    getSettings(): Promise<{
        id: number;
        heroImageUrl: string | null;
        heroImageUrl2: string | null;
        heroTitle: string | null;
        togetherDate: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateSettings(settings: InsertSettings): Promise<any>;

    // Memories
    getMemories(): Promise<any[]>;
    getMemory(id: number): Promise<any | null>;
    createMemory(memory: InsertMemory): Promise<any>;
    updateMemory(id: number, memory: Partial<InsertMemory>): Promise<any>;
    deleteMemory(id: number): Promise<void>;

    // Quizzes
    getQuizzes(): Promise<any[]>;
    getQuiz(id: number): Promise<any | null>;
    createQuiz(quiz: InsertQuiz): Promise<any>;
    updateQuiz(id: number, quiz: Partial<InsertQuiz>): Promise<any>;
    solveQuiz(id: number, answer: string): Promise<boolean>;
    deleteQuiz(id: number): Promise<void>;

    // Secrets
    getSecrets(): Promise<any[]>;
    getSecret(id: number): Promise<any | null>;
    createSecret(secret: InsertSecret): Promise<any>;
    updateSecret(id: number, secret: Partial<InsertSecret>): Promise<any>;
    unlockSecret(code: string): Promise<any | null>;
    deleteSecret(id: number): Promise<void>;
}

export class PrismaStorage implements IStorage {
    // Settings
    async getSettings() {
        const existing = await prisma.settings.findFirst();
        if (existing) return existing;
        return prisma.settings.create({ 
            data: {
                heroImageUrl: null,
                heroImageUrl2: null,
                heroTitle: null,
                togetherDate: null,
            }
        });
    }

    async updateSettings(update: InsertSettings) {
        const s = await this.getSettings();
        return prisma.settings.update({
            where: { id: s.id },
            data: update,
        });
    }

    // Memories
    async getMemories() {
        return prisma.memory.findMany({
            orderBy: [{ order: "desc" }, { id: "desc" }],
        });
    }

    async getMemory(id: number) {
        return prisma.memory.findUnique({ where: { id } });
    }

    async createMemory(memory: InsertMemory) {
        return prisma.memory.create({
            data: {
                title: memory.title,
                description: memory.description,
                imageUrl: memory.imageUrl ?? null,
                imageUrls: memory.imageUrls ? JSON.parse(JSON.stringify(memory.imageUrls)) : null,
                descriptions: memory.descriptions ? JSON.parse(JSON.stringify(memory.descriptions)) : null,
                date: memory.date,
                order: memory.order ?? 0,
            },
        });
    }

    async deleteMemory(id: number) {
        await prisma.memory.delete({ where: { id } });
    }

    async updateMemory(id: number, memory: Partial<InsertMemory>) {
        return prisma.memory.update({
            where: { id },
            data: {
                ...(memory.title !== undefined && { title: memory.title }),
                ...(memory.description !== undefined && { description: memory.description }),
                ...(memory.imageUrl !== undefined && { imageUrl: memory.imageUrl }),
                ...(memory.imageUrls !== undefined && { imageUrls: memory.imageUrls ? JSON.parse(JSON.stringify(memory.imageUrls)) : null }),
                ...(memory.descriptions !== undefined && { descriptions: memory.descriptions ? JSON.parse(JSON.stringify(memory.descriptions)) : null }),
                ...(memory.date !== undefined && { date: memory.date }),
                ...(memory.order !== undefined && { order: memory.order }),
            },
        });
    }

    // Quizzes
    async getQuizzes() {
        return prisma.quiz.findMany({ orderBy: { id: "desc" } });
    }

    async getQuiz(id: number) {
        return prisma.quiz.findUnique({ where: { id } });
    }

    async createQuiz(quiz: InsertQuiz) {
        return prisma.quiz.create({
            data: {
                question: quiz.question,
                correctAnswer: quiz.correctAnswer,
                options: JSON.parse(JSON.stringify(quiz.options)),
                successMessage: quiz.successMessage ?? null,
            },
        });
    }

    async solveQuiz(id: number, answer: string) {
        const quiz = await this.getQuiz(id);
        if (!quiz) return false;
        return quiz.correctAnswer.toLowerCase().trim() === answer.toLowerCase().trim();
    }

    async deleteQuiz(id: number) {
        await prisma.quiz.delete({ where: { id } });
    }

    async updateQuiz(id: number, quiz: Partial<InsertQuiz>) {
        return prisma.quiz.update({
            where: { id },
            data: {
                ...(quiz.question !== undefined && { question: quiz.question }),
                ...(quiz.correctAnswer !== undefined && { correctAnswer: quiz.correctAnswer }),
                ...(quiz.options !== undefined && { options: JSON.parse(JSON.stringify(quiz.options)) }),
                ...(quiz.successMessage !== undefined && { successMessage: quiz.successMessage }),
            },
        });
    }

    // Secrets
    async getSecrets() {
        return prisma.secret.findMany({ orderBy: { id: "desc" } });
    }

    async createSecret(secret: InsertSecret) {
        return prisma.secret.create({
            data: {
                title: secret.title ?? null,
                content: secret.content ?? null,
                imageUrl: secret.imageUrl ?? null,
                code: secret.code,
            },
        });
    }

    async unlockSecret(code: string) {
        return prisma.secret.findUnique({ where: { code } });
    }

    async deleteSecret(id: number) {
        await prisma.secret.delete({ where: { id } });
    }

    async getSecret(id: number) {
        return prisma.secret.findUnique({ where: { id } });
    }

    async updateSecret(id: number, secret: Partial<InsertSecret>) {
        return prisma.secret.update({
            where: { id },
            data: {
                ...(secret.title !== undefined && { title: secret.title }),
                ...(secret.content !== undefined && { content: secret.content }),
                ...(secret.imageUrl !== undefined && { imageUrl: secret.imageUrl }),
                ...(secret.code !== undefined && { code: secret.code }),
            },
        });
    }
}

export const storage = new PrismaStorage();
