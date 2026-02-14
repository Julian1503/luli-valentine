import { prisma } from "@/lib/prisma";

export async function getMemories() {
    return prisma.memory.findMany({
        orderBy: [{ date: "asc" }, { id: "asc" }],
    });
}
