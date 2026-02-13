import { NextResponse } from "next/server";
import { storage } from "@/server/storage";

export async function POST(req: Request) {
    const { code } = await req.json();
    const secret = await storage.unlockSecret(String(code ?? ""));
    if (!secret) return NextResponse.json({ message: "Invalid code" }, { status: 404 });
    return NextResponse.json(secret);
}
