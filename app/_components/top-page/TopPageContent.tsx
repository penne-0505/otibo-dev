"use client";

import {
  Badge,
  Link,
  LogoFrameFallback,
  LogoFrameImage,
  LogoFrameRoot,
  MediaFrameEmpty,
  MediaFrameImage,
  MediaFrameRoot,
  ScrollAreaRoot,
  ScrollAreaViewport,
  textStyle,
} from "@otibo/ui";
import styles from "./top-page.module.css";

type Product = {
  name: string;
  status: string;
  description: string;
  logo?: string;
  media: readonly { label: string; src?: string }[];
};

// intent: INV-009 (Site/top-page-rebuild) — visible product facts remain centralized for owner review before publication.
const products: readonly Product[] = [
  {
    name: "Medo",
    status: "プロトタイプ",
    description: "目標時刻から逆算して、行動の流れを組み立てるアプリ。",
    logo: "/products/medo/icon.png",
    media: [{ label: "Preview 01" }, { label: "Preview 02" }],
  },
  {
    name: "Sarae",
    status: "プロトタイプ",
    description:
      "読んで理解できる英語表現を、自分の英文で使える語彙へ育てるアプリ。",
    media: [{ label: "Preview 01" }],
  },
  {
    name: "Stash",
    status: "開発中",
    description:
      "私的な画像を端末内に保管し、片手で閲覧・整理する画像管理アプリ。",
    media: [{ label: "Preview 01" }, { label: "Preview 02" }],
  },
];

function ProductMedia({ media }: Pick<Product, "media">) {
  return (
    <ScrollAreaRoot className={styles.productMedia}>
      <ScrollAreaViewport className={styles.mediaViewport}>
        <div className={styles.mediaTrack} data-count={media.length}>
          {media.map(({ label, src }) => (
            <div className={styles.mediaItem} key={label}>
              <MediaFrameRoot
                aspect="auto"
                className={styles.mediaFrame}
                fit="contain"
              >
                {src ? (
                  <MediaFrameImage alt={`${label} screen`} src={src} />
                ) : (
                  <MediaFrameEmpty>UI image</MediaFrameEmpty>
                )}
              </MediaFrameRoot>
            </div>
          ))}
        </div>
      </ScrollAreaViewport>
    </ScrollAreaRoot>
  );
}

export function TopPageContent() {
  return (
    <div className={styles.pageBody}>
      <section className={styles.principle} aria-labelledby="principle-title">
        <div className={styles.principleInner}>
          <h2 className={textStyle("display")} id="principle-title">
            誰かのひと手間に、
            <br className={styles.mobileBreak} />
            ぴったりの道具を
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
            アプリケーションを作りたいと考えています。
          </p>
        </div>
      </section>

      <section className={styles.products} aria-labelledby="products-title">
        <header className={styles.sectionHeading}>
          <p className={textStyle("eyebrow")}>What otibo makes</p>
          <h2 className={textStyle("display")} id="products-title">
            Products
          </h2>
        </header>

        <div className={styles.productList}>
          {products.map((product) => (
            <article className={styles.product} key={product.name}>
              <div className={styles.productCopy}>
                <Badge className={styles.status} tone="neutral">
                  {product.status}
                </Badge>
                <div className={styles.identity}>
                  <LogoFrameRoot size="lg">
                    {product.logo ? (
                      <LogoFrameImage alt="" src={product.logo} />
                    ) : null}
                    <LogoFrameFallback aria-hidden="true">
                      {product.name.slice(0, 1)}
                    </LogoFrameFallback>
                  </LogoFrameRoot>
                  <h3 className={textStyle("display")}>{product.name}</h3>
                </div>
                <p className={textStyle("body")}>{product.description}</p>
              </div>
              <ProductMedia media={product.media} />
            </article>
          ))}
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
