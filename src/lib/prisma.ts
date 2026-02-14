import { PrismaClient } from "@prisma/client";
import { PrismaPostgresAdapter } from "@prisma/adapter-ppg";

declare global {
    var prisma: PrismaClient | undefined;
}

export const prisma =
    global.prisma ??
    new PrismaClient({
        adapter: new PrismaPostgresAdapter({
            connectionString: process.env.DATABASE_URL || "file:./dev.db",
        })
    });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
