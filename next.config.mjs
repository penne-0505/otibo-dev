/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // 静的 export では trailing slash を有効化 (Cloudflare Pages 互換)
  trailingSlash: true,
  // 画像最適化は static export で無効化必須
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
