---
title: "Draft: otibo first view light shader handoff"
status: proposed
draft_status: paused
created_at: 2026-07-10
updated_at: 2026-07-13
references:
  - "_docs/draft/Site/top-page-exhibition/notes.md"
  - "_docs/reference/Site/visual-canon/reference.md"
  - "_docs/guide/Site/visual-canon/usage.md"
  - "_docs/intent/Site/otibo-dev-site-purpose/decision.md"
  - "_docs/intent/App/top-page-initial/decision.md"
  - "_docs/intent/Site/first-view-light-shader/decision.md"
  - "_docs/intent/Site/top-page-rebuild/decision.md"
  - "_docs/intent/Site/design-system-full-adoption/decision.md"
  - "_docs/qa/Site/top-page-rebuild/verification.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/draft/Site/otibo-light-shader-handoff/notes.md -->
<!-- first view light shader prototype のセッション handoff。 -->

## Purpose

現在の first view 方針:

**光の場の中に `otibo` だけを置き、一瞥の印象を作る。**

目的は、光そのものを作品化することではない。光は、説明やプロダクト確認へ進む前に、
`otibo` という名前を記憶させるための first view の装置である。

## Current Prototype

- Prototype file: `prototypes/otibo-light-shader/index.html`
- Current visual baseline: `layered-v5`
- Working comparison image: `_docs/draft/Site/otibo-light-shader-handoff/assets/layered-v5-comparison.png`
- Working desktop capture: `_docs/draft/Site/otibo-light-shader-handoff/assets/layered-v5-desktop.jpg`
- Working mobile capture: `_docs/draft/Site/otibo-light-shader-handoff/assets/layered-v5-mobile.jpg`

これらの画像は production integration の比較基準であり、visual canon 全体の代替ではない。`tmp/`
消失時にも再開できるよう handoff 配下へ複製した。reference への昇格は統合後の visual review で判断する。

この prototype は探索履歴と比較基準として保持する。本番実装は prototype を iframe 化せず、
Next.js の First View component と standalone WebGL engine へ移植する。

ローカル確認:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

その後、次を開く:

```text
http://127.0.0.1:8765/prototypes/otibo-light-shader/index.html
```

## Current Judgment

光表現そのものは、主 blocker として扱う段階を一度抜けてよい。

2026-07-10 にオーナーが「光の表現」としての PoC 完了を判断した。次は `layered-v5` を比較基準として、
本番 First View の component boundary、lifecycle、fallback、static deployment を成立させる。

- `otibo` の位置と濃度は適切か。
- desktop / mobile の画面比率で first view が成立するか。
- motion は過剰ではないか。
- first view の責務だけに留まっているか。
- shader を一回限りの絵ではなく、調整可能な部品として扱えるか。

## Light Baseline Notes

最後の探索で重要だった補正:

**dynamic range を広げて解決しない。黒落ちを避けながら、光の層を保つ。**

`layered-v5` では、一度単純化で失われた光の層を戻している。

- `hotCore` / `apertureSpark`: 局所的な白い芯。
- `outerContactSkin`: 光境界の外側にある冷たい接触膜。
- `upperApertureSkin`: 上端境界の内側にある暖かい薄膜。
- `innerWarmShelf`: 光帯内部の広い暖色層。
- `warmVeil`: 光全体にかかる cream 色の拡散膜。
- `lowerBlueVeil`: 下側に残る青い散乱。

変数名自体は実装詳細だが、意図は重要。光を単一の淡い帯に戻さない。

## Do Not Reopen Yet

次セッションで避けること:

- first view 検証の前に、広い image generation 探索へ戻らない。
- shader は改善余地があるという理由だけで触り続けない。
- 「光感」を戻すために暗部を黒く落とさない。これは dynamic range 過多として一度退けた。
- 内部の光層を削って、単一の滑らかな帯へ戻さない。
- 比較対象を明確にせず、material と light を同時に動かさない。
- first view に tagline / product name / CTA / UI component / 説明文を追加しない。

## First View Responsibilities

first view の責務:

- 一瞥で「ここには視覚的な質がある」と感じさせる。
- `otibo` という名前を光の場と結びつける。
- 下の説明へ進むための余韻を残す。

first view の非責務:

- otibo が何かを説明する。
- プロダクトを見せる。
- 機能を広告する。
- UI component を実演する。
- brand manifesto として完結させる。

## Production Integration Decision (2026-07-10)

- `@otibo/ui@0.2.0` の公開と React 19 peer 対応を確認した。
- Next.js 16 / React 19 / Panda CSS 1.11 へ先に更新する。
- Cloudflare Workers Static Assets を変更不可の deployment invariant とする。
- framework baseline を検証後、First View を `app/page.tsx` へ統合する。
- First View より下の copy / information architecture はこの作業で再設計しない。

## Next Action

次の有効な作業は、光探索の継続ではなく production integration。

推奨順序:

1. Next.js 16 / React 19 / Panda CSS 1.11 / Wrangler の Workers static export baseline を閉じる。
2. 軽量な shader debug mode と WebGL engine を production module として分離する。
3. 同期 height texture 生成を precomputed asset に置換し、animation lifecycle と fallback を整える。
4. First View を本番 page component として統合する。
5. desktop/mobile、motion、failure、static export、Workers dry-run を検証する。

実装準備の正本:

- TODO: `Site-Enhance-14`
- Plan: `_docs/plan/Site/first-view-light-shader/plan.md`
- Intent: `_docs/intent/Site/first-view-light-shader/decision.md`
- QA: `_docs/qa/Site/first-view-light-shader/test-plan.md`

## Restart Audit (2026-07-10)

現行 prototype と保存画像を再確認した結果:

- 1440x900 / 390x844 とも `layered-v5` 相当の描画を再現した。shader 由来の error はなかった。
- 通常時は時間差で描画が変化する。`prefers-reduced-motion: reduce` では時間差 screenshot が一致し、見た目は静止する。
- reduced motion 時も `requestAnimationFrame` 自体は継続する。page visibility と context loss の処理はない。
- WebGL2 取得失敗と shader compile/link error 向けの gradient fallback は既に実装済み。旧 Next Action の fallback は新規作成ではなく拡張として扱う。
- 390x844 の再読込は in-app browser の参照環境で約 4.4 秒だった。1024x2048 の height texture を main thread で同期生成してから最初の shader frame へ進む構造が主因と推論する。
- repo は `4a75bf6` (`origin/dev`) の detached HEAD で、shader 以外を含む既存の未コミット変更がある。再開時も既存差分を保護する。

## Open Questions

- working baseline は handoff 配下へ複製済み。オーナー判定後、durable な reference へ昇格するか。
- named diagnostic view の選択方式は実装詳細とし、通常表示や公開 API には露出しない。
- product / about / contact flow は現状を維持し、First View の integration と分離する。

## Verification So Far

セッション内で最後に確認したこと:

- `layered-v5` は in-app browser で desktop / mobile ともに描画された。
- v5 capture 後、shader / page 由来の relevant error / warning はなかった。
- `layered-v5` は bounded dynamic range を保っていた。screenshot metrics 上、黒落ちした dark region は出ていない。

これは観測ベースの確認である。次セッションでは、screenshots を current truth として扱う前に再確認する。

## Current Handoff — 2026-07-13

この節を再開時の入口とする。上記の2026-07-10時点の記録は探索履歴として保持しているが、
`Production Integration Decision`と`Next Action`の一部は既に完了しており、現在状態の説明ではない。

### Repository / runtime state

- Working branch: `codex/first-view-production`
- Base commit: `4a75bf6`
- worktreeには本作業全体と、それ以前からの未コミット差分がある。現状はcommit済みの完成状態ではない。
- Next.js `16.2.10`、React `19.2.7`、`@otibo/ui@0.4.0`へ更新済み。
- page compositionはCSS Modules、共通primitive / semantic token / typography roleは`@otibo/ui`を使用する。
- Cloudflare Workers Static Assetsをdeployment invariantとして維持している。
- `/`は`FirstView`と`TopPageContent`を順にrenderする。shader-only baselineやwireframe prototypeは
  production routeへ含めない。

主要ファイル:

- `app/page.tsx`
- `app/_components/first-view/FirstView.tsx`
- `app/_components/first-view/LightShader.client.tsx`
- `app/_components/first-view/light-engine.ts`
- `app/_components/first-view/first-view.module.css`
- `app/_components/top-page/TopPageContent.tsx`
- `app/_components/top-page/top-page.module.css`

### Confirmed page structure

上位構成は次の順で合意済み。ここから構造を再考するのではなく、各部のvisual tuningを行う。

1. First View: light shaderと`otibo`のみ。
2. Principle: 読むフェーズへ切り替えるowner-authored copy。
3. Products: status、logo / fallback、name、description、UI image rail。
4. Contact / footer: `mailto:contact@otibo.dev`とlegal route。

section / product境界は余白、surface、typographyで示す。外枠やdivider lineを反復しない。
product mediaはGoogle Play phone screenshotの仮合わせとしてportrait `9:16`を使い、可視captionは置かない。
画像は1枚を必須とし、2枚以上ある場合だけhorizontal railとして並べる。

### Product content / assets

- Medo、Sarae、Stashのname / description / statusを初版へ入れているが、公開値としての最終承認は未完了。
- Medo iconだけ実assetを使用している: `public/products/medo/icon.png`。
- Sarae / Stash logoは`LogoFrameFallback`。全productのUI imageは`MediaFrameEmpty` placeholder。
- アプリ本体が未完成であるため、UI screenshotを推測生成してproduction asset扱いしない。
- destination / store linkは未充足。説明下の導線はstoreまたはproduct pageへのlinkを想定している。

### Design-system boundary

- 通常UIのcolor、spacing、size、radius、typographyはsystem token / primitiveを第一選択とする。
- `Badge`、`LogoFrame`、`MediaFrame`、`ScrollArea`、`Link`、`textStyle`を適用済み。
- shaderとfallbackの光学色、page composition固有値はsite CSSに残す。
- 2026-07-13の色彩監査では、shader / fallback以外に未整理の独自色は見つかっていない。

### Open visual issue: First View wordmark

現在のworking valueは`app/_components/first-view/first-view.module.css`の
`--first-view-wordmark: rgb(235 217 180 / 42%)`。これは承認済みのvisualではない。

調整履歴:

1. systemの濃色`fg` + element opacity `0.58`: 暗いshader背景へ沈み、視認性が低かった。
2. 光から拾った暖色`rgb(235 217 180 / 78%)`: 文字の主張が強く、graphicを主役にするFirst Viewと競合した。
3. 同色を`42%`へ低下: 依然としてオーナーのvisual approvalを得ていない。

次の担当は`42%`を基準値や決定事項と見なさない。wordmarkは「読ませる主役」ではなく、graphicを
先に見せたあと認識される補助要素である。暖色低alphaの再調整、暗色系への回帰、位置・サイズを含む
別解をlive shader上で比較し、オーナー判断を取る。

### Verification state

- `@otibo/ui@0.4.0`移行後にlint / typecheck / Vitest / static build / Workers dry-runをPASS済み。
- 2026-07-13に`npm run build`を再実行し、9 static routesの生成をPASSした。
- wordmark `42%`反映後、localhostでcomputed color
  `rgba(235, 217, 180, 0.42)`を確認し、対象CSSのBiome checkをPASSした。
- Top page全体のverification verdictは`PARTIAL`。実UI asset、product destination、reduced-motion / 全keyboard
  QA、production visualと3秒 / 30秒体験のowner approvalが残っている。

### Resume order

1. `localhost:3000`のlive shader上でFirst View wordmarkのvisual directionを決める。
2. Principle → Products → Contactのsurface / spacing / typographyを一つずつvisual reviewする。
3. productの公開文言、status、destinationをオーナー確認し、実在assetができた時点でplaceholderを置換する。
4. desktop / mobile、reduced motion、keyboard、static build、Workers dry-runを再検証する。
5. オーナーのproduction visual approval後にのみ`Site-Feat-17`をPASS / deploy candidateとする。
