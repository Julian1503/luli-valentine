import MemoriesClient from "./MemoriesClient";
import { getMemories } from "@/server/memories";

export default async function MemoriesPage() {
    const memories = await getMemories();
    return <MemoriesClient memories={memories} />;
}
