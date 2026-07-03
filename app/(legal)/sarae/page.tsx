import type { Metadata } from "next";

// intent: INV-005 (Legal/legal-pages) — noindex は明示的決定
// intent: INV-007 — placeholder ページは「準備中」を明示し、完成済みの体裁を取らない
// 判断: 未実装 placeholder は noindex。検索流入させる意味がない状態。
export const metadata: Metadata = {
  title: "Sarae 法務ページ | otibo",
  description: "Sarae の法務ページは準備中です。",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SaraeLegalPage() {
  return (
    <>
      <h1>Sarae — 準備中</h1>

      <p>Sarae の法務ページは現在準備中です。</p>

      <p>
        Sarae
        はただいま開発中です。プライバシーポリシーや利用規約は、リリースの前に公開します。
      </p>

      <p>
        お問い合わせは <a href="mailto:contact@otibo.dev">contact@otibo.dev</a>{" "}
        までご連絡ください。
      </p>
    </>
  );
}
