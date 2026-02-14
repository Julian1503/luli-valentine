import { NextResponse } from "next/server";
import { storage } from "@/server/storage";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
    const params = await ctx.params;
    const secret = await storage.getSecret(Number(params.id));
    if (!secret) {
        return new NextResponse(null, { status: 404 });
    }
    return NextResponse.json(secret);
}

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
    const params = await ctx.params;
    await storage.deleteSecret(Number(params.id));
    return new NextResponse(null, { status: 204 });
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
    const params = await ctx.params;
    const body = await req.json();
    const updated = await storage.updateSecret(Number(params.id), body);
    return NextResponse.json(updated);
}
