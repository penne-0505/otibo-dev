---
title: "Plan: Workers static export and Next.js 16 baseline"
status: active
draft_status: n/a
created_at: 2026-07-10
updated_at: 2026-07-10
references:
  - "_docs/intent/App/workers-static-export-next16/decision.md"
  - "_docs/qa/App/workers-static-export-next16/test-plan.md"
  - "_docs/plan/Site/first-view-light-shader/plan.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/plan/App/workers-static-export-next16/plan.md -->

## Overview

First View を本番ページへ統合する前に、Next.js 14 / React 18 / Panda CSS 0.53 の基盤を、
`@otibo/ui@0.2.0` が対応する Next.js 16 / React 19 / Panda CSS 1.11 へ更新する。deploy 方式は
Cloudflare Workers Static Assets とし、Next.js server runtime を導入しない。

## Scope

- Next.js 16、React 19、`@otibo/ui@0.2.0`、Base UI 1.6、Panda CSS 1.11 への更新。
- Biome、TypeScript、型定義、Vitest、Wrangler の互換 baseline 更新。
- Node.js 22 以上を開発・build 条件として明示する。
- `next build` の `out/` を Wrangler Static Assets で配布する構成を検証する。
- build-time 環境変数と Workers runtime binding の境界を文書化する。

## Non-Goals

- OpenNext、Workers adapter、SSR、Server Actions、Route Handlers を導入しない。
- KV、D1、R2、Durable Objects、Workers AI などの binding を追加しない。
- Cloudflare への本番 deploy は行わない。dry-run までを本タスクの範囲とする。
- First View の視覚実装は `Site-Enhance-14` で扱う。

## Requirements

- **Functional**:
  - 既存 route が静的 export される。
  - `@otibo/ui` の preset と generated styled-system が consumer build で利用できる。
  - `npm run deploy:dry-run` が `out/` を asset bundle として受理する。
- **Non-Functional**:
  - Node.js 22 以上で install、codegen、test、build を再現できる。
  - runtime API を必要としない構成を維持する。
  - deploy tooling は lockfile に固定し、global Wrangler に依存しない。

## Tasks

1. package baseline と scripts を更新し、旧 Base UI package を現行 package へ置換する。
2. Panda CSS / Biome / Next.js の設定を現行 schema に合わせる。
3. lint、typecheck、test、static export を実行し、upgrade regression を修正する。
4. Wrangler schema と static asset upload の dry-run を検証する。
5. Node version、Cloudflare build variables、deploy boundary を利用文書へ反映する。
6. verification に AC / INV の証跡と残リスクを記録する。

## QA Plan

- QA document: `_docs/qa/App/workers-static-export-next16/test-plan.md`
- Risk level: Medium
- Test strategy:
  - Dependency: `npm ls` で peer dependency と重複を確認する。
  - Static: lint、typecheck、設定 schema を確認する。
  - Integration: Panda codegen と Next.js production build を実行する。
  - Deployment: lockfile の Wrangler で `deploy --dry-run` を実行する。
  - Regression: export route と既存ページの browser smoke test を行う。

## Deployment / Rollout

- production deploy は行わず、`wrangler deploy --dry-run` までに限定する。
- deploy source は `out/` のみ。Worker script と runtime binding は持たない。
- 基盤更新に失敗した場合は本ブランチの dependency / config 差分を戻せる単位に保つ。
