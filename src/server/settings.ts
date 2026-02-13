import { prisma } from "@/lib/prisma";

export async function getSettings() {
    const s = await prisma.settings.findFirst();
    if (s) return s;
    return prisma.settings.create({ data: {} });
}
