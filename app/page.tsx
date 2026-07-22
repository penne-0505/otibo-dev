import type { Metadata } from "next";
import { FirstView } from "./_components/first-view/FirstView";
import { TopPageContent } from "./_components/top-page/TopPageContent";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "otibo",
  description: "ひと手間に、ぴったりの道具を。",
};

export default function HomePage() {
  return (
    <main>
      <div className={styles.firstViewScroll}>
        <FirstView />
      </div>
      <TopPageContent />
    </main>
  );
}
