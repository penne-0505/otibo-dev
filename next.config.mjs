/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // intent-invariant: INV-001 (App/workers-static-export-next16) — production routes remain complete in the static out/ artifact.
  // 静的 export では trailing slash を有効化
  trailingSlash: true,
  // 画像最適化は static export で無効化必須
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
