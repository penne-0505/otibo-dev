"use client";

import {
  Badge,
  CardDescription,
  CardHeader,
  CardRoot,
  CardTitle,
  Link,
  MediaFrameImage,
  MediaFrameRoot,
  textStyle,
} from "@otibo/ui";
import styles from "./top-page.module.css";

type Product = {
  name: string;
  status: string;
  description: string;
  media?: {
    src: string;
    alt: string;
  };
};

// intent-invariant: INV-009 (Site/top-page-rebuild) — visible product facts remain centralized for owner review before publication.
const products: Record<"medo" | "sarae" | "stash", Product> = {
  medo: {
    name: "Medo",
    status: "テスト中",
    description: "目標時刻から逆算して、行動の流れを組み立てるアプリ。",
    media: {
      src: "/products/medo/ss-home.png",
      alt: "Medoのホーム画面。目標時刻から逆算して行動の流れが並んでいる。",
    },
  },
  sarae: {
    name: "Sarae",
    status: "構想中",
    description:
      "読んで理解できる英語表現を、自分の英文で使える語彙へ育てるアプリ。",
  },
  stash: {
    name: "Stash",
    status: "開発中",
    description:
      "私的な画像を端末内に保管し、片手で閲覧・整理する画像管理アプリ。",
  },
};

export function TopPageContent() {
  return (
    <div className={styles.pageBody}>
      <section className={styles.principle} aria-labelledby="principle-title">
        <div className={styles.principleInner}>
          <h2 className={textStyle("display.sm")} id="principle-title">
            <span className={styles.headingLine1}>
              <span className={styles.headingLine1Text}>誰かのひと手間に</span>
              <span className={styles.headingLine1Comma}>、</span>
            </span>
            <span className={styles.headingLine2}>ぴったりの道具を</span>
          </h2>
          <p className={textStyle("body")}>
            otiboは
            <br />
            誰かのひと手間を
            <br />
            専用のアプリケーションへと変える
            <br />
            プロダクトブランドです。
          </p>
          <p className={textStyle("body")}>
            少しの手間をかければできることを
            <br />
            手間なく、自然にできるようにするための
            <br />
            アプリケーションを
            <br className={styles.mobileBreak} />
            作りたいと考えています。
          </p>
        </div>
      </section>

      <section className={styles.products} aria-labelledby="products-title">
        <header className={styles.sectionHeading}>
          {/* intent: DEC-013 (Site/top-page-rebuild/products-bento) — 見出しはh2のみ。
              eyebrow / lede / kicker を埋め草で置かない（INV-007 / copy restraint）。 */}
          <h2 className={textStyle("heading.lg")} id="products-title">
            Products
          </h2>
        </header>

        {/* intent: DEC-013 (Site/top-page-rebuild/products-bento) —
            Medo tall left column + Sarae / Stash stacked right column の asymmetric bento。
            Card variant は 3枚同一（surface="paper" / padding="md"）で、hierarchy は
            grid cell size が担う。 */}
        <div className={styles.productsBento}>
          {/* Medo — tall left column */}
          <CardRoot
            surface="paper"
            padding="md"
            className={`${styles.bentoCard} ${styles.medoCard}`}
          >
            <CardHeader>
              <Badge className={styles.status} tone="neutral">
                {products.medo.status}
              </Badge>
              <CardTitle>{products.medo.name}</CardTitle>
              <CardDescription>{products.medo.description}</CardDescription>
            </CardHeader>
            {/*
              intent: DEC-013 (Site/top-page-rebuild/products-bento) —
              CardBody は使わず専用 wrapper で MediaFrame を配置する。CardBody の recipe は
              body-adjacent の text slot であり、画像だけを載せると空 text style が悪影響する。
              deferred bento-in-bento: 将来 Medo に2〜3枚目の image asset が加わった場合、
              `.medoMedia > *` を grid item として並べ替えるだけで nested grid へ育てられるよう、
              画像 wrapper を single grid-container point に保っている。今は1枚のみ。
            */}
            {products.medo.media ? (
              <div className={styles.medoMedia}>
                <MediaFrameRoot aspect="auto" fit="contain">
                  <MediaFrameImage
                    src={products.medo.media.src}
                    alt={products.medo.media.alt}
                  />
                </MediaFrameRoot>
              </div>
            ) : null}
          </CardRoot>

          {/* Sarae — top-right cell */}
          <CardRoot
            surface="paper"
            padding="md"
            className={`${styles.bentoCard} ${styles.saraeCard}`}
          >
            <CardHeader>
              <Badge className={styles.status} tone="neutral">
                {products.sarae.status}
              </Badge>
              <CardTitle>{products.sarae.name}</CardTitle>
              <CardDescription>{products.sarae.description}</CardDescription>
            </CardHeader>
          </CardRoot>

          {/* Stash — bottom-right cell */}
          <CardRoot
            surface="paper"
            padding="md"
            className={`${styles.bentoCard} ${styles.stashCard}`}
          >
            <CardHeader>
              <Badge className={styles.status} tone="neutral">
                {products.stash.status}
              </Badge>
              <CardTitle>{products.stash.name}</CardTitle>
              <CardDescription>{products.stash.description}</CardDescription>
            </CardHeader>
          </CardRoot>
        </div>
      </section>

      <section className={styles.contact} aria-labelledby="contact-title">
        <h2 className={textStyle("eyebrow")} id="contact-title">
          Contact
        </h2>
        <Link href="mailto:contact@otibo.dev">contact@otibo.dev</Link>
      </section>

      <footer className={styles.footer}>
        <span>© otibo</span>
        <nav aria-label="法務">
          <Link href="/tokushoho/">特定商取引法に基づく表記</Link>
          <Link href="/medo/privacy/">Privacy</Link>
          <Link href="/medo/terms/">Terms</Link>
          <Link href="/medo/account-deletion/">Account deletion</Link>
        </nav>
      </footer>
    </div>
  );
}
