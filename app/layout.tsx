import type { Metadata } from "next";
import "@otibo/ui/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "otibo",
  description: "ひと手間に、ぴったりの道具を。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
