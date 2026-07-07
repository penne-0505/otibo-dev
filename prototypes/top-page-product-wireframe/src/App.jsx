// intent why-not: INV-010 (Site/top-page-rebuild) — placeholders are isolated wireframe material and must not enter the production page.
const products = [
  {
    name: "Medo",
    status: "開発中",
    description: "目標時刻から逆算して、行動の流れを組み立てるアプリ。",
    links: ["Product page", "Store"],
    media: ["timeline", "share card"],
  },
  {
    name: "Sarae",
    status: "プロトタイプ",
    description:
      "読んで理解できる英語表現を、自分の英文で使える語彙へ育てるアプリ。",
    links: ["Product page"],
    media: ["writing lab"],
  },
  {
    name: "Stash",
    status: "開発中",
    description: "私的な画像を端末内で保管し、片手で閲覧・整理するアプリ。",
    links: [],
    media: ["viewer", "organize"],
  },
];

function ProductModule({ product }) {
  return (
    <article className="product-module">
      <div className="product-copy">
        <span className="status-badge">{product.status}</span>

        <div className="identity">
          <div className="logo-placeholder" aria-label={`${product.name} logo placeholder`}>
            logo
          </div>
          <h2>{product.name}</h2>
        </div>

        <p>{product.description}</p>

        {product.links.length > 0 ? (
          <div className="destination-links" aria-label={`${product.name} destinations`}>
            {product.links.map((link) => (
              <a href="#prototype-note" key={link}>
                {link}
              </a>
            ))}
          </div>
        ) : (
          <p className="no-destination">公開先なし</p>
        )}
      </div>

      <div className={`product-media media-count-${product.media.length}`}>
        {product.media.map((label) => (
          <figure className="ui-placeholder" key={label}>
            <div className="placeholder-label">UI image</div>
            <figcaption>{label} / UI image placeholder</figcaption>
          </figure>
        ))}
      </div>
    </article>
  );
}

export function App() {
  return (
    <main>
      <header className="prototype-note" id="prototype-note">
        <p>Structure wireframe</p>
        <span>copy / logo / UI image / destination are not final</span>
      </header>

      <section className="products-frame" aria-labelledby="products-title">
        <div className="section-heading">
          <p>What otibo makes</p>
          <h1 id="products-title">Products</h1>
        </div>

        <div className="product-list">
          {products.map((product) => (
            <ProductModule key={product.name} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
