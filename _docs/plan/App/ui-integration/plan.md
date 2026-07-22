---
title: "Plan: Integrate @otibo/ui design system into otibo.dev"
status: superseded
draft_status: n/a
created_at: 2026-06-21
updated_at: 2026-07-17
references:
  - "_docs/plan/App/otibo-ui-0-3-migration/plan.md"
  - "_docs/intent/App/ui-integration/decision.md"
  - "_docs/qa/App/ui-integration/test-plan.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/plan/App/ui-integration/plan.md -->

## Overview

scaffold 済の otibo-dev に `@otibo/ui@0.1.1` を consumer として統合し、`/` で otibo-ui の Button と Field が描画される state まで立てる。Panda preset を継承し、buildinfo を `include` に渡し、staticCss を canonical 通りに設定し、Base UI を peer 解消する。dev / build / lint / typecheck が通り、Server Component 境界が崩れていないことを確認する。

## Scope

- `@otibo/ui@^0.1.1` と peer `@base-ui-components/react` を install
- `panda.config.ts` を Approach 4 仕様に更新(`presets` / `include` / `importMap` / `staticCss`)
- `panda codegen` 再実行(preset 反映)
- `app/page.tsx` を Button + Field の試験描画に書き換え(Server Component のまま)
- `npm run dev` / `build` / `lint` / `typecheck` の通過確認
- response の HTML に library 由来 class が乗っていること + emit CSS にそれが定義されていることを verify
- regression check:`/` の前提(HTTP 200 / `<html lang="ja">` / hot reload)が壊れていない

## Non-Goals

- portfolio の page 実装(別 task で起票予定)
- theme override / accent custom / dark mode
- font 導入(`gen-interface-jp` 等)
- Link / Toast / Dialog 等の Button + Field 以外 component 描画
- otibo-ui README の glob 表記訂正(別 task で otibo-ui 側に PR)
- deployment 設定
- test framework 導入

## Requirements

### Functional

- F-001: `npm install @otibo/ui @base-ui-components/react` で依存解決し、peer warning が出ない。
- F-002: `npm run prepare`(panda codegen)で `styled-system/` が再生成され、otibo-ui の token / recipe が反映される。
- F-003: `app/page.tsx` から `import { Button, Field } from "@otibo/ui"` で import できる。
- F-004: `/` を curl すると Button / Field 由来の class が body に乗っている。
- F-005: build 後の CSS にその class の定義が含まれている。

### Non-Functional

- NF-001: `app/page.tsx` は Server Component のまま(`"use client"` を consumer が書かない)。
- NF-002: staticCss が canonical 通り(`toast` / `pagination` / `combobox` / `navigationMenu` / `numberField` / `toggle` / `chip` 各 `["*"]`)。
- NF-003: `npm run typecheck` / `npm run lint` / `npm run build` / `npm run dev` が全て exit 0。
- NF-004: hot reload が引き続き動作する。
- NF-005: production build の `/` First Load JS が記録される(reference として残す、上限は設けない)。

## Tasks

1. **`@otibo/ui` install**:`npm install @otibo/ui@^0.1.1 @base-ui-components/react`
2. **`panda.config.ts` 更新**:
   - `presets: [otiboPreset]` を import 経由で追加
   - `include` に `"./node_modules/@otibo/ui/dist/panda.buildinfo.json"` を追加
   - `importMap: "@otibo/ui/styled-system"` を追加
   - `staticCss` block を canonical 通り 7 recipe で追加
3. **`npm run prepare`(panda codegen)再実行**:preset / buildinfo を反映した `styled-system/` を再生成
4. **`app/page.tsx` 書き換え**:Button + Field(.Label / .Input / .Description)を Server Component の中に描画
5. **regression / static check**:
   - `npm run typecheck`
   - `npm run lint`
6. **build 検証**:
   - `npm run build`
   - `.next/static/css/*.css` に Button + Field 由来 class が含まれることを grep
   - First Load JS を記録
7. **dev / runtime 検証**:
   - `npm run dev` 起動
   - `curl /` で HTTP 200 + 期待 HTML
   - hot reload 動作確認(page.tsx 編集 → curl 反映 → revert)
   - `"use client"` を consumer に書いていないが Server Component error が出ないことを確認
8. **Verification 残し** + TODO から削除

## QA Plan

- QA document: `_docs/qa/App/ui-integration/test-plan.md`
- Risk level: **Medium**
- Test strategy:
  - Unit:なし(統合 task)
  - Integration:`npm run build` の通過で Next + otibo-ui + Panda + Base UI の integration を確認
  - E2E:`curl /` の 200 + library 由来 class 検出
  - Manual QA:dev server で hot reload + Server Component 境界を curl で確認(headless 環境想定)
  - Validator / static check:`biome check .` / `tsc --noEmit`
- AC ↔ confirmation:
  - AC-001(install 成功)→ `npm install` exit 0 + peer warning なし
  - AC-002(preset 継承 + emit)→ build 後 CSS に Button / Field 由来 class、`@layer recipes` 内に recipe 定義
  - AC-003(Button / Field 描画)→ `curl /` で expected HTML
  - AC-004(dev / build / lint / typecheck 通過)→ exit 0
- INV-derived:
  - Server Component の境界が崩れていない(consumer に `"use client"` 不要)
  - staticCss canonical 一致
  - import 形式が `import { Button, Field } from "@otibo/ui"`(library が export している top-level 名前)

## Deployment / Rollout

- 本 task は consumer 統合のみ。deploy 設定は別 task。
- rollback:`jj` / `git` で revert 可能。`panda.config.ts` / `app/page.tsx` / `package.json` / `package-lock.json` の 4 ファイル変更が主。
- 既存 template の `_docs/` / `AGENTS.md` / `LICENSE.txt` / `QUICKSTART.md` / `README.md` 等は本 task でも触らない。
- `0.1.1` から `0.1.x` への将来の patch update は `npm update @otibo/ui` で取り込み可。

## 関連

- TODO: `App-Feat-11`
- Intent: `_docs/intent/App/ui-integration/decision.md`
- QA: `_docs/qa/App/ui-integration/test-plan.md`
- 上流: `App-Feat-10`(scaffold)
- canonical(library 側): `otibo-ui/_docs/intent/Pkg/initial-public-publish/decision.md` §I
