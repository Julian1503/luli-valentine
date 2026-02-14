import { prisma } from "@/lib/prisma";

export async function getSettings() {
    const s = await prisma.settings.findFirst();
    if (s) return s;
    // Create with default values to ensure all fields are present
    return prisma.settings.create({ 
        data: {
            heroImageUrl: null,
            heroImageUrl2: null,
            heroTitle: null,
            togetherDate: null,
        } 
    });
}
