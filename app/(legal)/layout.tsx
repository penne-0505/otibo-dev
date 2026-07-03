import type { ReactNode } from "react";
import { css } from "styled-system/css";

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
    <div
      className={css({
        minH: "100vh",
        bg: "bg.canvas",
        fontFamily: "body",
        color: "fg.default",
      })}
    >
      {/* header */}
      <header
        className={css({
          px: { base: "6", md: "10" },
          py: "6",
          borderBottom: "1px solid",
          borderColor: "border.subtle",
        })}
      >
        <a
          href="/"
          className={css({
            fontSize: "sm",
            color: "fg.muted",
            textDecoration: "none",
            fontWeight: "medium",
            _hover: { color: "fg.default" },
          })}
        >
          otibo
        </a>
      </header>

      {/* prose area */}
      <main
        className={css({
          // prose 幅: 長文読書に適した最大幅
          maxW: "720px",
          mx: "auto",
          px: { base: "6", md: "8" },
          py: { base: "10", md: "14" },
          // 長文読書面: 16px base + lineHeight.normal (1.55)
          fontSize: "base",
          lineHeight: "normal",
          // 見出し
          "& h1": {
            fontSize: "xl",
            fontFamily: "display",
            fontWeight: "medium",
            lineHeight: "tight",
            mb: "8",
            color: "fg.default",
          },
          "& h2": {
            fontSize: "lg",
            fontFamily: "display",
            fontWeight: "medium",
            lineHeight: "tight",
            mt: "10",
            mb: "4",
            color: "fg.default",
          },
          "& h3": {
            fontSize: "md",
            fontWeight: "medium",
            lineHeight: "snug",
            mt: "8",
            mb: "3",
            color: "fg.default",
          },
          // 本文段落
          "& p": {
            mb: "4",
            color: "fg.default",
          },
          // リスト
          "& ul, & ol": {
            mb: "4",
            pl: "6",
            color: "fg.default",
          },
          "& li": {
            mb: "2",
          },
          // テーブル (表セルは sm 据え置き: token-semantic-usage-map.md 839c11f)
          "& table": {
            width: "100%",
            borderCollapse: "collapse",
            mb: "6",
            fontSize: "sm",
          },
          "& th": {
            textAlign: "left",
            fontWeight: "medium",
            borderBottom: "2px solid",
            borderColor: "border.default",
            pb: "2",
            pr: "4",
            color: "fg.default",
          },
          "& td": {
            borderBottom: "1px solid",
            borderColor: "border.subtle",
            py: "2",
            pr: "4",
            verticalAlign: "top",
            color: "fg.default",
          },
          // リンク
          "& a": {
            color: "fg.default",
            textDecoration: "underline",
            textUnderlineOffset: "2px",
            _hover: { color: "accent.default" },
          },
          // 区切り線
          "& hr": {
            border: "none",
            borderTop: "1px solid",
            borderColor: "border.subtle",
            my: "8",
          },
          // 強調
          "& strong": {
            fontWeight: "medium",
            color: "fg.default",
          },
        })}
      >
        {children}
      </main>

      {/* footer */}
      <footer
        className={css({
          px: { base: "6", md: "10" },
          py: "8",
          borderTop: "1px solid",
          borderColor: "border.subtle",
        })}
      >
        <a
          href="/"
          className={css({
            fontSize: "xs",
            color: "fg.subtle",
            textDecoration: "none",
            _hover: { color: "fg.muted" },
          })}
        >
          ← otibo トップへ
        </a>
      </footer>
    </div>
  );
}
