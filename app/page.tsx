import type { Metadata } from "next";
import { css } from "styled-system/css";

export const metadata: Metadata = {
  title: "otibo",
  description: "ひと手間に、ぴったりの道具を。",
};

// 製品カードのデータ
// intent: INV-003 — 現在の実ステータスを率直に表示、実物のない未来を宣言的に語らない
const products = [
  {
    name: "Medo",
    description: "考えごとを書き出すための、静かな場所。",
    status: "開発中・クローズドテスト準備中",
    href: null,
  },
  {
    name: "Sarae",
    description: "日々の取りこぼしを、すくい上げる。",
    status: "開発中",
    href: null,
  },
  {
    name: "Stash",
    description: "手元に置いておきたいものを、手元に。",
    status: "開発中",
    href: null,
  },
] as const;

export default function HomePage() {
  return (
    <main
      className={css({
        minH: "100vh",
        fontFamily: "body",
        color: "fg.default",
        bg: "bg.canvas",
      })}
    >
      {/* ── Hero ── */}
      <section
        className={css({
          display: "grid",
          gridTemplateColumns: {
            base: "1fr",
            md: "repeat(8, 1fr)",
          },
          gap: { base: "6", md: "6" },
          px: { base: "6", md: "10" },
          pt: { base: "16", md: "24" },
          pb: { base: "12", md: "20" },
        })}
      >
        <div
          className={css({
            gridColumn: { md: "1 / 7" },
          })}
        >
          <h1
            className={`ambient-breathing ${css({
              fontSize: { base: "2xl", md: "4xl" },
              fontFamily: "display",
              fontWeight: "medium",
              lineHeight: "tight",
              letterSpacing: "tight",
              color: "fg.default",
              mb: "6",
            })}`}
          >
            誰かのひと手間に、
            <br />
            ぴったりの道具を。
          </h1>
          <p
            className={css({
              fontSize: { base: "sm", md: "md" },
              color: "fg.muted",
              lineHeight: "normal",
              maxW: "48ch",
            })}
          >
            otibo は個人が作るプロダクトブランドです。
            <br />
            日常の小さな「やりにくい」を、静かに解くことを考えています。
          </p>
        </div>
      </section>

      {/* ── Products ── */}
      <section
        className={css({
          px: { base: "6", md: "10" },
          pb: { base: "12", md: "20" },
        })}
      >
        <h2
          className={css({
            fontSize: { base: "xs", md: "sm" },
            fontWeight: "medium",
            color: "fg.subtle",
            letterSpacing: "wide",
            textTransform: "uppercase",
            mb: "8",
          })}
        >
          Products
        </h2>
        <ul
          className={css({
            listStyle: "none",
            p: "0",
            m: "0",
            display: "grid",
            gridTemplateColumns: {
              base: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: "6",
          })}
        >
          {products.map((product) => (
            <li
              key={product.name}
              className={css({
                p: "6",
                border: "1px solid",
                borderColor: "border.subtle",
                borderRadius: "md",
                bg: "bg.surface",
              })}
            >
              <div
                className={css({
                  display: "flex",
                  flexDirection: "column",
                  gap: "3",
                })}
              >
                <span
                  className={css({
                    fontSize: "lg",
                    fontWeight: "medium",
                    fontFamily: "display",
                    color: "fg.default",
                  })}
                >
                  {product.name}
                </span>
                <span
                  className={css({
                    fontSize: "sm",
                    color: "fg.default",
                    lineHeight: "normal",
                  })}
                >
                  {product.description}
                </span>
                <span
                  className={css({
                    fontSize: "xs",
                    color: "fg.muted",
                    fontWeight: "medium",
                  })}
                >
                  {product.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── About ── */}
      <section
        className={css({
          px: { base: "6", md: "10" },
          pb: { base: "12", md: "20" },
          borderTop: "1px solid",
          borderColor: "border.subtle",
          pt: { base: "12", md: "16" },
        })}
      >
        <h2
          className={css({
            fontSize: { base: "lg", md: "xl" },
            fontFamily: "display",
            fontWeight: "medium",
            lineHeight: "tight",
            color: "fg.default",
            mb: "6",
            maxW: { md: "6 / 8" },
          })}
        >
          ひとつのために、ひとつ。それが、いちばん。
        </h2>
        <p
          className={css({
            fontSize: { base: "sm", md: "md" },
            color: "fg.muted",
            lineHeight: "normal",
            maxW: "52ch",
            mb: "4",
          })}
        >
          万能ツールを作ろうとするとき、たいてい何かを犠牲にしている。 otibo
          は、ひとつの用途にひとつのプロダクトで応えることを選んでいます。
        </p>
        <p
          className={css({
            fontSize: { base: "sm", md: "md" },
            color: "fg.muted",
            lineHeight: "normal",
            maxW: "52ch",
          })}
        >
          「やればできる」ではなく、「気づけば終わっている」。
          そういう手触りを、地道に作り続けています。
        </p>
      </section>

      {/* ── Contact ── */}
      <section
        className={css({
          px: { base: "6", md: "10" },
          pb: { base: "12", md: "20" },
        })}
      >
        <h2
          className={css({
            fontSize: "xs",
            fontWeight: "medium",
            color: "fg.subtle",
            letterSpacing: "wide",
            textTransform: "uppercase",
            mb: "4",
          })}
        >
          Contact
        </h2>
        <a
          href="mailto:contact@otibo.dev"
          className={css({
            fontSize: { base: "sm", md: "md" },
            color: "fg.default",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            _hover: {
              color: "accent.default",
            },
          })}
        >
          contact@otibo.dev
        </a>
      </section>

      {/* ── Footer ── */}
      <footer
        className={css({
          px: { base: "6", md: "10" },
          py: "8",
          borderTop: "1px solid",
          borderColor: "border.subtle",
          display: "flex",
          flexDirection: { base: "column", md: "row" },
          gap: "4",
          alignItems: { md: "center" },
          justifyContent: { md: "space-between" },
        })}
      >
        <span
          className={css({
            fontSize: "xs",
            color: "fg.subtle",
          })}
        >
          © otibo
        </span>
        <nav
          aria-label="法務"
          className={css({
            display: "flex",
            gap: "6",
            flexWrap: "wrap",
          })}
        >
          {[
            { label: "特定商取引法に基づく表記", href: "/tokushoho/" },
            { label: "Medo プライバシーポリシー", href: "/medo/privacy/" },
            { label: "Medo 利用規約", href: "/medo/terms/" },
            { label: "Medo アカウント削除", href: "/medo/account-deletion/" },
          ].map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className={css({
                fontSize: "xs",
                color: "fg.subtle",
                textDecoration: "underline",
                textUnderlineOffset: "2px",
                _hover: {
                  color: "fg.muted",
                },
              })}
            >
              {label}
            </a>
          ))}
        </nav>
      </footer>
    </main>
  );
}
