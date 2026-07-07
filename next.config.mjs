/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // intent: INV-001 (App/workers-static-export-next16) — Workers Static Assets の out/ 配下で route を完結させる
  // 静的 export では trailing slash を有効化
  trailingSlash: true,
  // 画像最適化は static export で無効化必須
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
