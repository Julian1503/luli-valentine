import { NextResponse } from "next/server";
import { storage } from "@/server/storage";

export async function DELETE(_: Request, ctx: { params: { id: string } }) {
    await storage.deleteQuiz(Number(ctx.params.id));
    return new NextResponse(null, { status: 204 });
}
