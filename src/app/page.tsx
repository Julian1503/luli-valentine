import HomeClient from "./HomeClient";
import { getSettings } from "@/server/settings";

export default async function Home() {
  const settings = await getSettings();

  const startDate = new Date(settings.togetherDate ?? "2023-02-14");
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return <HomeClient settings={settings} diffDays={diffDays} />;
}
