import GamesClient from "./SolveQuizClient";
import { getQuizzes } from "@/server/quizzes";

export default async function GamesPage() {
    const quizzes = await getQuizzes();
    return <GamesClient quizzes={quizzes} />;
}
