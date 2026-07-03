---
title: "Plan: Initial otibo.dev top page implementation"
status: proposed
draft_status: n/a
created_at: 2026-06-21
updated_at: 2026-06-21
references:
  - "_docs/intent/App/top-page-initial/decision.md"
  - "_docs/qa/App/top-page-initial/test-plan.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/plan/App/top-page-initial/plan.md -->

## Overview

otibo.dev の `/` を屋号 page として立ち上げる。理念.md の正本タグライン(`誰かのひと手間に、ぴったりの道具を。`)を hero に asymmetric 配置で据え、Medo / Sarae / @otibo/ui の 3 product を asymmetric grid で並べ、about preview を後段に配置する。`/works` `/about` `/contact` の stub page を同時に立て、link が dead にならない state に整える。font は `gen-interface-jp`、motion は library motion-grammar 準拠 + hero に ambient breathing(新規)を追加。`prefers-reduced-motion` 尊重。

## Scope

- `gen-interface-jp` install + Next.js `next/font` の loader で全 page に適用
- Panda の `semanticTokens` / `fonts` を gen-interface-jp で上書き(library token の base は維持)
- `app/page.tsx` を hero + product list + about preview に書き換え
- `app/works/page.tsx` `app/about/page.tsx` `app/contact/page.tsx` の stub 作成
- `app/_components/` 配下に必要なら hero / product-card / footer 等の component を切り出し
- ambient breathing motion(CSS のみ、JS なし、`prefers-reduced-motion` 尊重)
- footer に屋号名 / 各 route link / 著作表記
- `<title>` / `<meta description>` の最小 SEO 追加
- dev / build / lint / typecheck / hot reload 検証
- a11y verification(`prefers-reduced-motion` / keyboard / focus visible)

## Non-Goals

- t2i コンセプトビジュアル(hero 背景画像)── 別 task
- dark mode / theme switching
- OG 画像 / Twitter Card / JSON-LD
- 多言語(英語版タグライン、i18n 構造)
- `/tokushoho`(Legal-Feat-9)
- `/works/[slug]` 個別作品 page
- contact form / cta / newsletter / analytics
- portfolio asset(プロダクト写真 / ロゴ / illustration)── 別 task または手元素材
- `/works` `/about` `/contact` の本実装(stub のみ)

## Requirements

### Functional

- F-001: `/` で hero(タグライン + 屋号名 + breathing)/ product list(3 件)/ about preview / footer が描画される。
- F-002: product link がそれぞれ正しい飛び先(Medo / Sarae → `/works`、@otibo/ui → npm 外部 URL)に動く。
- F-003: `/works` `/about` `/contact` がそれぞれ HTTP 200 で stub page を返す。
- F-004: `gen-interface-jp` font が全 page に適用される(devtools の computed font-family 確認、または body の rendered font check)。
- F-005: hover / focus / tap が library motion-grammar 通りに動く(button / link / card)。
- F-006: hero のタグラインが ambient breathing で微細に揺らぐ(0.94 ↔ 1.00 opacity、4s 周期)。
- F-007: `prefers-reduced-motion: reduce` で ambient breathing が完全停止する。

### Non-Functional

- NF-001: dev / build / lint / typecheck が全て exit 0。
- NF-002: hot reload が引き続き動作する(scaffold + App-Feat-11 で確立した dev 体験を壊さない)。
- NF-003: `app/page.tsx` は Server Component のまま(library directive を信頼)。
- NF-004: 新規 component は必要最小限に切り出す(over-abstraction を避ける、AGENTS.md grain)。
- NF-005: `<title>` / `<meta description>` が page 別に設定されている(otibo.dev top / works / about / contact)。
- NF-006: secret / 個人情報が新規 file に混入していない。
- NF-007: template 既存ファイル(`_docs/standards/` / `AGENTS.md` 等)が無変更。

## Tasks

1. **font 導入**:
   - `npm install gen-interface-jp`
   - Next.js `next/font/local` 経由で適用(`gen-interface-jp` の woff2 path を package から resolve)
   - `app/layout.tsx` で全 page に適用、`<body>` の className に font variable を渡す
   - Panda の `panda.config.ts` の `theme.extend.fonts.body` を gen-interface-jp で上書き(`fonts.body` token 経由で library が拾えるように)、または semanticTokens 経由
2. **layout.tsx 更新**:
   - font 適用
   - `<title>` / `<meta description>` の base 設定
   - meta description = 理念.md 短い版「ひと手間に、ぴったりの道具を。」
3. **`/` 実装**:
   - `app/_components/Hero.tsx`(or page.tsx 内に直書き):タグライン + 屋号名 + breathing
   - `app/_components/ProductCard.tsx` または ad-hoc:Medo / Sarae / @otibo/ui の 3 件
   - `app/_components/AboutPreview.tsx` または ad-hoc:見出し + 短い 1〜2 段落 + `/about` link
   - `app/_components/Footer.tsx` または ad-hoc:屋号 + route link + 著作
   - asymmetric grid(CSS Grid)で配置、library の Card / Link recipe を活用
4. **`/works` stub**:`app/works/page.tsx`、「準備中」+ 戻りリンク
5. **`/about` stub(軽い試案)**:`app/about/page.tsx`、理念.md タグライン「ひとつのために、ひとつ。それが、いちばん。」+ 短い 1〜2 段落
6. **`/contact` stub**:`app/contact/page.tsx`、現状の contact channel(github / npm)を最小限明示
7. **ambient breathing CSS**:
   - `@keyframes` を `panda.config` の `theme.extend.keyframes` に追加(`breathing`、0.94 ↔ 1.00 opacity)、または `globals.css` に直書き
   - `animation: breathing 4s ease-in-out infinite` を hero タイトルに
   - `@media (prefers-reduced-motion: reduce)` で animation 停止
8. **regression / static check**:
   - `npm run typecheck`
   - `npm run lint`
9. **build 検証**:
   - `npm run build` で 5 routes(`/`, `/_not-found`, `/works`, `/about`, `/contact`)が prerender
   - `.next/static/css/*.css` に新規 token(`gen-interface-jp` font-face、ambient `@keyframes`)が含まれる
10. **dev / runtime 検証**:
    - `npm run dev` 起動
    - `curl /` `/works` `/about` `/contact` 全て HTTP 200
    - hero に library class + breathing class が乗る
    - hot reload 動作確認(`app/page.tsx` 編集 → curl 反映)
11. **a11y 検証**:
    - `prefers-reduced-motion: reduce` で breathing 停止(CSS の media query を直接検証 or curl で確認)
    - keyboard navigation で focus が visible(library の focus ring が effective)
12. **Verification 残し** + TODO から削除

## QA Plan

- QA document: `_docs/qa/App/top-page-initial/test-plan.md`
- Risk level: **Medium**
- Test strategy:
  - Unit:なし(top page、unit 対象なし)
  - Integration:`npm run build` の通過で Next + font + Panda + library + ambient motion の integration を確認
  - E2E:`curl /` `/works` `/about` `/contact` の 200 + 期待 HTML 構造
  - Manual QA:
    - dev で page を browser で観察(font 反映、breathing 微細さ、hover / focus 動作)── headless 環境では curl で代用
    - `prefers-reduced-motion` の挙動確認
  - Validator / static check:`biome check .` / `tsc --noEmit`
- AC ↔ confirmation:
  - AC-001(hero asymmetric)→ curl で hero HTML 構造確認 + Plan に従った class 配置
  - AC-002(product 3 件)→ curl で 3 件の product card 確認、各 link href 確認
  - AC-003(font 適用)→ `<head>` の font preload 確認、body className に font variable
  - AC-004(stub page 200)→ 全 route 200 + 期待 HTML
  - AC-005(dev/build/lint/typecheck 通過)→ 各 exit 0
  - AC-006(理念整合)→ コピー文言を理念.md と grep で照合
  - AC-007(motion library 準拠)→ ambient breathing 以外の transition が library token(`durations.*` / `easings.*`)を参照していること
  - AC-008(prefers-reduced-motion)→ `@media (prefers-reduced-motion: reduce)` block の存在、animation: none / paused 設定

## Deployment / Rollout

- 本 task は実装のみ。deploy 設定は別 task(`/tokushoho` 等の法務 page と同時期が grain)。
- rollback:`jj` / `git` で revert 可能。新規 file は app/page.tsx 書き換え + 3 stub + components + panda.config 更新 + package.json + font asset。
- 既存 template の `_docs/standards/` / `AGENTS.md` / `LICENSE.txt` / `QUICKSTART.md` / `README.md` 等は本 task で触らない。

## 関連

- TODO: `App-Feat-12`
- Intent: `_docs/intent/App/top-page-initial/decision.md`
- QA: `_docs/qa/App/top-page-initial/test-plan.md`
- 上流: `App-Feat-10`(scaffold)、`App-Feat-11`(DS 統合)
- 正本:理念.md
- DS grain:`otibo-ui/_docs/reference/DesignSystem/`
