import type { Metadata } from "next";
import { FirstView } from "./_components/first-view/FirstView";
import { TopPageContent } from "./_components/top-page/TopPageContent";

export const metadata: Metadata = {
  title: "otibo",
  description: "ひと手間に、ぴったりの道具を。",
};

export default function HomePage() {
  return (
    <main>
      <FirstView />
      <TopPageContent />
    </main>
  );
}
