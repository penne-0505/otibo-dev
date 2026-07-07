import { Link } from "@otibo/ui";
import type { ReactNode } from "react";
import styles from "./legal-layout.module.css";

/**
 * 法務ページ共通 layout — 長文読書面
 *
 * intent: _docs/intent/Legal/legal-pages/decision.md §3
 * typography: 16px body (base) + lineHeight.normal (1.55)
 * otibo-ui commit 839c11f: "Long-form reading surface uses 16px body"
 * — app 本体・portfolio は md(18px)、法務 / 長文は base(16px)で見出しとの比を開く
 */
export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.page}>
      {/* header */}
      <header className={styles.header}>
        <Link className={styles.homeLink} href="/">
          otibo
        </Link>
      </header>

      {/* prose area */}
      <main className={styles.prose}>{children}</main>

      {/* footer */}
      <footer className={styles.footer}>
        <Link className={styles.footerLink} href="/">
          ← otibo トップへ
        </Link>
      </footer>
    </div>
  );
}
