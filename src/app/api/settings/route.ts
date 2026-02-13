import { NextResponse } from "next/server";
import { storage } from "@/server/storage";

export async function GET() {
    const s = await storage.getSettings();
    return NextResponse.json(s);
}

export async function PATCH(req: Request) {
    const body = await req.json();
    const updated = await storage.updateSettings(body);
    return NextResponse.json(updated);
}
