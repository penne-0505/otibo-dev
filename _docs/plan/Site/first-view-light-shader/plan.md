---
title: "Plan: First View light shader local production foundation"
status: active
draft_status: n/a
created_at: 2026-07-10
updated_at: 2026-07-10
references:
  - "_docs/draft/Site/otibo-light-shader-handoff/notes.md"
  - "_docs/intent/Site/first-view-light-shader/decision.md"
  - "_docs/qa/Site/first-view-light-shader/test-plan.md"
  - "_docs/draft/Site/top-page-exhibition/notes.md"
  - "_docs/reference/Site/visual-canon/reference.md"
  - "_docs/intent/Site/otibo-dev-site-purpose/decision.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/plan/Site/first-view-light-shader/plan.md -->

## Overview

`prototypes/otibo-light-shader/index.html` の `layered-v5` は、オーナー判断により光表現の PoC として
完了した。比較基準を保ったまま、Next.jsのproduction-quality component、lifecycle、fallback、
height texture assetへ再構成し、トップページ再設計前のshader-onlyローカル制作基盤とする。

## Scope

- Server-rendered First View と client-side canvas の責務分離。
- material、主要 light contribution、final composite を切り替えられる開発時 named diagnostic view。
- 通常時、reduced motion、非表示タブにおける animation loop の lifecycle。
- 初期描画、WebGL2 取得失敗、compile/link error、context loss の fallback。
- 1440x900 / 390x844 を中心とした文字位置・文字濃度・構図・motion の比較。
- shader 初期化が CSS fallback と `otibo` の初期描画を妨げない構造。
- runtime procedural generation を precomputed height texture asset へ置換する。
- Next.js static export と Cloudflare Workers Static Assets dry-run。
- browser default marginを除去し、shaderをviewport全面へ表示する。
- 旧Products / About / Contact / Footerをローカル制作基盤から外す。

## Non-Goals

- shader の新しい美観方向や image generation 探索を始めない。
- `layered-v5` を visual canon 全体の代替として扱わない。
- tagline、説明、product、UI component、CTA を First View に追加しない。
- First Viewより下のinformation architecture、copy、section designは`Site-Feat-17`で扱う。
- 診断 UI や shader parameter を公開プロダクト API にしない。
- shader-only状態をproduction deployしない。

## Requirements

- **Functional**:
  - 通常表示は光の場と `otibo` のみで成立する。
  - 明示的な開発時 opt-in で named diagnostic view を選択できる。
  - fallback は shader の準備前から表示可能で、失敗後も `otibo` を読める。
  - context loss で animation loop を停止し、fallback へ移行する。
  - `app/page.tsx` は Server Component のまま、canvas lifecycle だけを Client Component に閉じる。
- **Non-Functional**:
  - `prefers-reduced-motion: reduce` では一枚を描画した後に連続描画しない。
  - `document.visibilityState === "hidden"` では animation loop を継続しない。
  - 現行の同期 1024x2048 height texture 生成を既定経路の初期描画 blocker として残さない。
  - `powerPreference: "high-performance"` を前提にせず、実測上必要な場合だけ採用する。
  - light layer を単一の淡い帯へ縮退させず、暗部を黒落ちさせない。
  - `output: "export"` と Wrangler Static Assets の asset-only deployment を維持する。
  - shader-only状態はdeploy candidateとして扱わない。

## Tasks

1. `App-Enhance-15` の Next.js 16 / Workers Static Assets baseline を完了する。
2. prototype の shader contribution を production module へ分離し、開発時 diagnostic mode を残す。
3. Server-rendered fallback / heading と Client canvas を分け、first frame 後だけ canvas を表示する。
4. render loop、reduced motion、page visibility、context loss / restore の lifecycle を実装する。
5. procedural height texture を build-time に生成した precomputed asset へ置換する。
6. `app/page.tsx`をFirst Viewだけのlocal baselineへ縮退し、browser default marginを除去する。
7. unit / build / Workers dry-run と desktop/mobile browser QA を実施する。
8. verificationにvisual canon照合、local-only境界、次taskへのhandoffを記録する。

## QA Plan

- QA document: `_docs/qa/Site/first-view-light-shader/test-plan.md`
- Risk level: Medium
- Test strategy:
  - Unit: diagnostic view の mode 解決と lifecycle state が分離された場合に対象化する。
  - Integration: WebGL 初期化、fallback、context loss、render loop の接続を browser で確認する。
  - E2E: 指定 viewport と motion preference で DOM・screenshot・console error を確認する。
  - Manual QA: visual canon、文字位置・濃度、motion 量をオーナーが判定する。
  - Validator / static check: `scripts/check-docs.sh` と prototype 対象の lint/static review。

## Deployment / Rollout

- shader-only状態の本番deployは行わず、static exportとWrangler dry-runは技術互換確認に限定する。
- deploy source は `out/` のまま維持し、Worker script や runtime binding を追加しない。
- 回帰時は First View component と asset の差分を戻せる単位に保つ。既存 prototype や途中成果物は削除しない。
- 完成ページへの展開は`Site-Feat-17`で行う。
