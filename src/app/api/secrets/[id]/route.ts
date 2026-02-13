import { NextResponse } from "next/server";
import { storage } from "@/server/storage";

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
    const params = await ctx.params;
    await storage.deleteSecret(Number(params.id));
    return new NextResponse(null, { status: 204 });
}
