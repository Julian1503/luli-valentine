import { prisma } from "@/lib/prisma";

export type InsertSettings = Partial<{
    theme: "light" | "dark";
    language: "en" | "fr";
}>;

export type Settings = Awaited<ReturnType<PrismaStorage["getSettings"]>>;

export type InsertMemory = {
    title?: string | null;
    content: string;
    order?: number;
};

export type InsertQuiz = {
    question: string;
    correctAnswer: string;
};

export type InsertSecret = {
    title?: string | null;
    content?: string | null;
    code: string;
};

export interface IStorage {
    // Settings
    getSettings(): Promise<{ id: number; createdAt: Date; updatedAt: Date } & Record<string, any>>;
    updateSettings(settings: InsertSettings): Promise<any>;

    // Memories
    getMemories(): Promise<any[]>;
    createMemory(memory: InsertMemory): Promise<any>;
    deleteMemory(id: number): Promise<void>;

    // Quizzes
    getQuizzes(): Promise<any[]>;
    getQuiz(id: number): Promise<any | null>;
    createQuiz(quiz: InsertQuiz): Promise<any>;
    solveQuiz(id: number, answer: string): Promise<boolean>;
    deleteQuiz(id: number): Promise<void>;

    // Secrets
    getSecrets(): Promise<any[]>;
    createSecret(secret: InsertSecret): Promise<any>;
    unlockSecret(code: string): Promise<any | null>;
    deleteSecret(id: number): Promise<void>;
}

export class PrismaStorage implements IStorage {
    // Settings
    async getSettings() {
        const existing = await prisma.settings.findFirst();
        if (existing) return existing;
        return prisma.settings.create({ data: {} });
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

    async createMemory(memory: InsertMemory) {
        return prisma.memory.create({
            data: {
                title: memory.title ?? null,
                content: memory.content,
                order: memory.order ?? 0,
            },
        });
    }

    async deleteMemory(id: number) {
        await prisma.memory.delete({ where: { id } });
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

    // Secrets
    async getSecrets() {
        return prisma.secret.findMany({ orderBy: { id: "desc" } });
    }

    async createSecret(secret: InsertSecret) {
        return prisma.secret.create({
            data: {
                title: secret.title ?? null,
                content: secret.content ?? null,
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
}

export const storage = new PrismaStorage();
