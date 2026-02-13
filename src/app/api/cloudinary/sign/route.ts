import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
    const apiKey = process.env.CLOUDINARY_API_KEY!;
    const apiSecret = process.env.CLOUDINARY_API_SECRET!;
    const folder = process.env.CLOUDINARY_FOLDER || "uploads";

    if (!cloudName || !apiKey || !apiSecret) {
        return NextResponse.json({ error: "Cloudinary env vars missing" }, { status: 500 });
    }

    const timestamp = Math.floor(Date.now() / 1000);

    // Params that must be signed
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto
        .createHash("sha1")
        .update(paramsToSign + apiSecret)
        .digest("hex");

    return NextResponse.json({ cloudName, apiKey, timestamp, signature, folder });
}
