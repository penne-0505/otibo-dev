---
title: "Intent: First View light shader local foundation boundary"
status: active
draft_status: n/a
created_at: 2026-07-10
updated_at: 2026-07-10
references:
  - "_docs/plan/Site/first-view-light-shader/plan.md"
  - "_docs/qa/Site/first-view-light-shader/test-plan.md"
  - "_docs/draft/Site/otibo-light-shader-handoff/notes.md"
  - "_docs/draft/Site/top-page-exhibition/notes.md"
  - "_docs/reference/Site/visual-canon/reference.md"
  - "_docs/intent/Site/otibo-dev-site-purpose/decision.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/intent/Site/first-view-light-shader/decision.md -->

## Context

First View は、光の場と `otibo` を結びつけ、一瞥の印象を作る入口である。`layered-v5` はオーナーに
よって光表現の PoC 完了と判断された。残る課題は美観探索ではなく、同期 texture 生成、render loop、
WebGL failure lifecycle を本番ページに適した責務へ分離することである。

## Decision

- `layered-v5` を光表現の production baseline とするが、visual canon 全体の代替にはしない。
- 次の作業は美観探索ではなく First View production integration とする。
- 通常表示は光の場と `otibo` のみに保ち、diagnostic view は明示的な開発時 opt-in に限定する。
- diagnostic view は parameter editor ではなく、named contribution を比較するための手段とする。
- fallback は初期描画の一部とし、WebGL2 不在、compile/link error、context loss を同じ契約で扱う。
- reduced motion では時間を固定するだけでなく連続描画を停止する。非表示タブでも描画を停止する。
- `powerPreference: "high-performance"` は既定の要件にしない。採用には実測上の根拠を要求する。
- runtime procedural texture は build-time に生成した precomputed asset へ置換し、fallback と `otibo` の初期描画を待たせない。
- `app/page.tsx` は Server Component のまま維持し、WebGL lifecycle だけを Client Component へ閉じる。
- React state を frame ごとに更新せず、engine state は canvas lifecycle 内に保持する。
- Next.js static export と Cloudflare Workers Static Assets の asset-only deployment を維持する。
- 旧下流sectionを外したshader-only状態をlocal制作基盤とし、production deployしない。
- 下流の再設計は`Site-Feat-17`へ分離し、旧sectionを互換条件にしない。

## Alternatives

- **shader の美観探索を続ける**: 不採用。比較基準が得られた後も変数を動かすと、First View の成立条件を検証できない。
- **prototype を production iframe として埋め込む**: 不採用。document、font、lifecycle、fallback がページ本体と分断される。
- **常設の debug panel と自由な parameter editor を作る**: 不採用。調整面が新しい制作対象になり、通常表示へ漏れる危険がある。
- **静止画像だけを First View にする**: 現時点では不採用。web 固有の緩やかな motion を検証する余地を残す。
- **`high-performance` GPU を常に要求する**: 不採用。背景で失われやすい context と消費電力を増やす可能性があり、必要性は未計測である。

## Rationale

診断表示を最終表示から分離すると、material と light を同時に動かさず、各 contribution の役割を
比較できる。fallback を Server-rendered initial view として先に成立させれば、GPU 能力や texture load
に First View 全体を依存させずに済む。engine を React rendering から分離すると、animation frame
ごとの reconciliation を避けながら context lifecycle を局所化できる。

## Consequences / Impact

- shader source、resource 初期化、render loop を production module として責務分離する。
- context loss 後の resource 再構築を採る場合は、texture、buffer、program を全て再生成する必要がある。
- reduced motion と非表示タブでは GPU 描画回数を減らせる。
- initial fallback が baseline と大きく異なる場合、切替時の視覚差が新しい QA 対象になる。
- localの`/`は一時的にshader-onlyとなり、サイトパーパスを満たす完成ページではなくなる。
- 下流sectionは`Site-Feat-17`でゼロから再構成する。
- build-time asset が増える一方、初回表示時の大規模な同期 CPU 処理はなくなる。

## Quality Implications

- default と diagnostic の境界漏れを regression として扱う。
- visual canon の判定は画像と reference に遡り、guide の項目充足を完成条件にしない。
- fallback は障害表示ではなく、First View の最小責務を満たす表示として検収する。
- motion preference の見た目だけでなく、連続描画が止まることを確認する。
- performance は特定端末の数値だけでなく、初期描画を同期生成に依存させない構造で確認する。
- static export と Wrangler dry-run を page integration の deployment gate にする。

## Intent-derived Invariants

- INV-001: 通常の First View には光の場と `otibo` 以外の説明、product、UI component、CTA、diagnostic control を置かない。
- INV-002: `layered-v5` の局所的な白い芯、境界膜、暖色層、青い散乱を単一の淡い帯へ縮退させず、暗部を黒落ちさせない。
- INV-003: diagnostic view は明示的な開発時 opt-in なしに通常表示へ現れない。
- INV-004: reduced motion と非表示タブでは連続する animation frame を実行しない。
- INV-005: WebGL2 不在、shader error、context loss のいずれでも fallback と `otibo` が表示される。
- INV-006: fallback と `otibo` の初期描画は procedural height texture の準備完了を待たない。
- INV-007: page 本体は Server Component のまま、WebGL lifecycle だけを Client Component に閉じる。
- INV-008: default routeはstatic export可能で、Workers Static AssetsにWorker scriptを要求しない。
- INV-009: shader-only状態をproduction deployしない。
- INV-010: 旧Products / About / Contact / Footerをlocal baselineから外し、後続設計の互換条件にしない。
- INV-011: browser default marginを残さず、First Viewがviewport全面を占める。

## Enforced in (optional)

- INV-001 / INV-003: First View component の default / diagnostic mode 境界。
- INV-004 / INV-005 / INV-006: light engine の initialization / render lifecycle / fallback。
- INV-007 / INV-010 / INV-011: component boundary、`app/page.tsx`、global CSSのdiff review。
- INV-008: `next.config.mjs`、`wrangler.jsonc`、build / dry-run。
- INV-009: TODO、Plan、verificationのdeploy boundary。

## Rollback / Follow-ups

- First View component と asset 単位で戻せる変更に保つ。
- local baselineのvisual review後、`Site-Feat-17`へ進む。
- working baseline assetのreference昇格は完成ページのvisual review後に判断する。
