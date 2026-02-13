import { prisma } from "@/lib/prisma";

export async function getQuizzes() {
    const quizzes = await prisma.quiz.findMany({ orderBy: { id: "asc" } });
    return quizzes.map(quiz => ({
        ...quiz,
        options: Array.isArray(quiz.options) ? quiz.options as string[] : []
    }));
}
