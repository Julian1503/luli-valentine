import MemoriesClient from "./MemoriesClient";
import { getMemories } from "@/server/memories";

function toStringArray(value: unknown): string[] | null {
    if (!value) return null;
    if (Array.isArray(value) && value.every((v) => typeof v === "string")) return value;
    return null;
}

export default async function MemoriesPage() {
    const raw = await getMemories();

    const memories = raw.map((m) => ({
        ...m,
        imageUrls: toStringArray(m.imageUrls),
        descriptions: toStringArray(m.descriptions),
    }));

    return <MemoriesClient memories={memories} />;
}
