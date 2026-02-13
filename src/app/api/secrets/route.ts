import { NextResponse } from "next/server";
import { storage } from "@/server/storage";

export async function GET() {
    const data = await storage.getSecrets();
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    const body = await req.json();
    const created = await storage.createSecret(body);
    return NextResponse.json(created, { status: 201 });
}
