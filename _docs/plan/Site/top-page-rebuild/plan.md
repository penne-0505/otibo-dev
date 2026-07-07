---
title: "Plan: Rebuild the top page from the light shader foundation"
status: active
draft_status: n/a
created_at: 2026-07-10
updated_at: 2026-07-13
references:
  - "_docs/intent/Site/top-page-rebuild/decision.md"
  - "_docs/qa/Site/top-page-rebuild/test-plan.md"
  - "_docs/draft/Site/top-page-exhibition/notes.md"
  - "_docs/intent/Site/otibo-dev-site-purpose/decision.md"
  - "_docs/reference/Site/visual-canon/reference.md"
  - "_docs/plan/Site/first-view-light-shader/plan.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/plan/Site/top-page-rebuild/plan.md -->

## Overview

production-quality の First View light shader を唯一の確定済み visual element とし、旧
Products / About / Contact / Footer の構成と実装を互換条件にせず、トップページをゼロから再設計する。
ページの上位情報骨格は「First View → principle 的な短文 → product 紹介 → contact / 所在」とする。
これは各領域の責務と読む順序を定めるものであり、固定 section template や card layout は強制しない。
shader-only 状態はローカル制作ベースに限定し、サイトパーパスを満たす一枚トップが完成するまで
production deploy しない。

## Scope

- First View 以降で訪問者に渡す情報と証拠の優先順位を再定義する。
- 「見る → 読む → 確認する → 所在」の責務を、First View、短い principle、product 紹介、
  contact / 所在の順に割り当てる。
- principle は otibo が何の場所かを短く伝え、product 紹介は実在する制作物によってその説明を裏付ける。
- product 紹介は複数 product の追加を前提とするが、card、UI 断片、一覧 grid のいずれも必須形式にしない。
- 上位情報骨格の確定後に各領域の表現、responsive behavior、motion、legal / contact 導線を統合する。
- Cloudflare Workers Static Assets の static export 条件を維持する。
- `@otibo/ui@0.4.0` の typography role、LogoFrame、MediaFrameを、対応するproduct表現へ採用する。

## Non-Goals

- shader の美観探索を再開しない。
- 旧 Products / About / Contact / Footer の見た目を修復して再利用することを目的にしない。
- `hero → cards → about → footer` を既定の骨格として採用しない。
- product 紹介を product card や UI 断片の展示へ固定しない。
- オーナー未執筆のブランド copy を生成して完成扱いにしない。
- 展示のためだけに新しい `@otibo/ui` component family を作らない。
- shader-only 状態を production deploy しない。
- 法務 route の内容や URL を変更しない。

## Requirements

- **Functional**:
  - First View は光と `otibo` だけを維持する。
  - First View の直後に、otibo が何の場所かを伝える短い principle を置く。
  - principle の後で、Medo を含む実在 product を紹介し、今後 product を追加できる。
  - 最後に contact、制作者の所在、必要な legal 導線へ到達できる。
  - 30秒以内に、otibo が何の場所で、現時点で何を作っているかを実在する材料から確認できる。
  - 未公開 product は実ステータスを表示し、完成を装わない。
- **Non-Functional**:
  - 3秒の印象と30秒の理解を別の表示責務として設計する。
  - visual canon の質感を、汎用的な「上品なミニマル」や装飾記号へ縮退させない。
  - default page に制作上の placeholder や diagnostic control を残さない。
  - static export、reduced motion、responsive、fallback、accessibility を維持する。
  - page compositionとresponsive layoutはsite側に残し、汎用的なlogo / media frameとtypography roleはdesign systemを正本にする。

## Content Contract

この contract は公開copyそのものではなく、各段階が渡す情報、正本、未確定値の扱いを定める。

### 1. First View — 見る

- **渡すもの**: 光の場と`otibo`という名前による一瞥の印象。
- **正本**: First View component、first-view intent、承認済みvisual baseline。
- **必須要素**: 光、`otibo`。
- **置かないもの**: tagline、説明、product、CTA、操作要素。

### 2. Principle — 読む

- **渡すもの**: otiboが何の場所かを、次のproduct確認へ進める長さで伝える短文。
- **正本**: オーナーが執筆・承認したcopy。
- **必須要素**: 見出しと2段落程度の本文。First Viewから「読む」状態へ切り替わる分量を持ち、個人ブランドの実体と矛盾しないこと。
- **未確定値の扱い**: copy未執筆の間は制作上の未確定事項として扱い、生成文で公開可能状態を作らない。
- **置かないもの**: 長いmanifesto、抽象的な理念の反復、product一覧、`@otibo/ui`の説明。

### 3. Products — 確認する

- **渡すもの**: otiboが現在作っている実在productと、その現況。
- **正本**: 各product repoの現行実装・公開情報と、公開直前のオーナー確認。
- **productごとの必須情報**:
  - 公開可能なproduct名。
  - 何をするものかを示す、オーナー確認済みの短いdescription。
  - `公開中`、`テスト中`、`開発中`、`構想中`等の、確認時点に即したstatus。
- **任意情報**:
  - 実在するlogo / icon。
  - 現行実装から取得したUIや画像。
  - 実在し、公開可能なstore、product詳細、関連routeへのlink。
- **未確定値の扱い**: 任意情報がないproductも掲載可能とする。存在しないlogo、画面、link、完成度を補作しない。
- **構成条件**: Medoを初期掲載対象とし、product数の増加に対応する。card、UI断片、一覧gridは表現候補でありcontent要件ではない。
- **除外**: `@otibo/ui`はproduct一覧の必須項目にしない。未公開名や公開許可のないproductは掲載しない。

### 4. Contact / Where — 所在

- **渡すもの**: otiboへ連絡し、公開上必要な実在routeへ進む手段。
- **正本**: 現行route、公開設定、オーナー確認済みの連絡先。
- **必須要素**:
  - `contact@otibo.dev`への連絡導線。
  - `/tokushoho/`と、掲載productに必要な既存legal routeへの到達手段。
- **任意情報**: 実在し、掲載理由のある外部profile / store / product link。
- **置かないもの**: 未運用SNS、数合わせの外部link、不要なcontact form、強い再CTA、First Viewの再演。

### Publication Gate

- owner-authored principle copyが確定している。
- 掲載する各productのname / description / statusが公開直前に再確認されている。
- 任意assetとlinkは実在し、現在のproduct状態と一致している。
- contact / legal routeが到達可能である。
- 未確定値をplaceholderや生成copyで完成済みに見せていない。

## Product Module Wireframe Hypothesis

2026-07-11のオーナースケッチをsource visualとして、次の構造を低忠実度prototypeで確認する。
これはvisual review前の採用候補であり、production componentの確定仕様ではない。

- 大きな外枠はProducts領域全体を示し、各productは枠内の反復可能な一行として扱う。
- productの情報列は、`status badge → logo / product name → description → destination links`の順に読む。
- statusは小さなbadgeとしてlogo / product nameの上に置き、store / product pageへのlinkと混同させない。
- button状の要素は実在するstore linkまたはproduct page linkだけに使う。公開先がなければ置かない。
- media領域はUI画像を1枚以上受け取れる。1枚なら単独、2枚以上ならdesktopで横に並べる。
- mobileでは情報列の後にmedia領域を縦積みし、product単位のreading orderを維持する。
- wireframeではasset未確定箇所に明示的なplaceholderを使えるが、production deploy candidateには残さない。
- prototypeは`prototypes/top-page-product-wireframe/`に隔離し、Next.jsのrouteやstatic exportへ含めない。
- editable composition sourceはFigma working fileの
  [desktop full-page frame](https://www.figma.com/design/wqG33y2prMZnHzoyADKv8D?node-id=4-3)と
  [mobile full-page frame](https://www.figma.com/design/wqG33y2prMZnHzoyADKv8D?node-id=4-93)とし、HTML prototypeは
  responsive behaviorとinteraction確認に使う。Productsのimported captureはraw frameであり、production
  componentやdesign system componentの正本ではない。
- mobile full-page frameはFirst Viewを一画面高として扱い、Principleをowner copyの読書区間へ拡張する。
- Contact本文は`contact@otibo.dev`のmailtoだけとし、required legal routesはページ末尾の補助導線へ分離する。
- 2026-07-11のNext.js初版はcomposition判定用であり、logo / UI image placeholderが残る間はdeploy candidateにしない。
- UI image placeholderは、将来の[Google Play preview asset要件](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)に合わせてportrait `9:16`を使う。制作基準は推奨最小解像度`1080 × 1920px`とし、実画面が存在するまでpreview内容を補作しない。

### Product source inventory — 2026-07-11

| Product | Description source | Initial status | Logo | UI image | Destination |
| --- | --- | --- | --- | --- | --- |
| Medo | `/home/penne/dev/active/backcast/README.md` | `プロトタイプ` | `assets/images/medo_icon.png` | 保存済み実画面なし | 未確認 |
| Sarae | `/home/penne/dev/active/sarae/README.md` | `プロトタイプ` | 製品固有assetなし | 掲載用assetなし | 未確認 |
| Stash | `/home/penne/dev/active/stash/README.md` | `開発中` | 現行AppIconはFlutter標準で不採用 | 保存済み実画面なし | 未確認 |

現段階ではMedo iconと3製品のrepo根拠付き文言だけをNext.js初版へ取り込む。SaraeのQA screenshotは
検証証跡であり掲載用assetには転用しない。StashのFlutter標準AppIconを製品logoと誤認させず、
未確認destinationを仮linkで補わない。

## Tasks

1. `Site-Enhance-14` の shader-only local baseline と verification を完了する。
2. 4段階それぞれが渡す情報を content contract として定義する。
3. owner copy、掲載product、product status、asset、link、contact / legal 導線をcontractへ充足する。
4. 「First View → principle → products → contact / 所在」の全体 composition を設計する。
5. product 紹介を特定形式へ固定せず、複数 product に耐える表現を試作・視覚判定する。
6. desktop / mobile、通常 / reduced motion、keyboard / semantic structure を実装する。
7. static build、Wrangler dry-run、browser QA、オーナー visual review を実施する。
8. verification が PASS になるまで shader-only baseline をdeployしない。
9. `@otibo/ui@0.4.0`へ更新し、productのlogo / mediaと各文言のtypography roleをsystem primitiveへ移行する。

## QA Plan

- QA document: `_docs/qa/Site/top-page-rebuild/test-plan.md`
- Risk level: Medium
- Test strategy:
  - Content contract: 公開事実と owner-authored copy の source を確認する。
  - Prototype: 4段階の順序と product 紹介の候補表現を screenshot / visual canon と比較する。
  - Integration: First View から必要情報・導線までの体験順序を確認する。
  - Automated: lint、typecheck、unit、static build、Wrangler dry-run。
  - Manual: desktop / mobile と3秒 / 30秒のオーナー判定。

## Deployment / Rollout

- shader-only baseline と部分的な構成試作は production deploy しない。
- 一枚トップの必須責務、法務導線、QA が揃った時点だけ deploy candidate とする。
- rollback は First View foundation を保持し、下流 composition を独立して戻せる構造にする。
