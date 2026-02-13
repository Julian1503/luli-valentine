import { prisma } from "@/lib/prisma";

export async function getSecrets() {
    return prisma.secret.findMany({
        orderBy: { id: "asc" },
    });
}

export async function unlockSecret(code: string) {
    const secret = await prisma.secret.findUnique({
        where: { code: code.trim() },
    });
    
    return secret;
}
