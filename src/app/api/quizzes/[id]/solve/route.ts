import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
    const { answer } = await req.json();
    const params = await ctx.params;
    const id = Number(params.id);

    const quiz = await prisma.quiz.findUnique({ where: { id } });
    if (!quiz) return NextResponse.json({ message: "Quiz not found" }, { status: 404 });

    const correct =
        quiz.correctAnswer.toLowerCase().trim() === String(answer ?? "").toLowerCase().trim();

    return NextResponse.json({
        correct,
        message: correct ? quiz.successMessage : undefined,
    });
}
