---
title: "Plan: Initial Next.js + Panda scaffold for otibo.dev"
status: superseded
draft_status: n/a
created_at: 2026-06-21
updated_at: 2026-07-17
references:
  - "_docs/plan/App/workers-static-export-next16/plan.md"
  - "_docs/intent/App/scaffold/decision.md"
  - "_docs/qa/App/scaffold/test-plan.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/plan/App/scaffold/plan.md -->

## Overview

otibo.dev を Next.js App Router + Panda CSS + TypeScript strict + biome で立ち上げる。空のトップ(`/`)が SSR/SSG で描画され、Panda が style を emit し、`npm run dev` / `npm run build` / `npm run lint` の三点が通る state を作る。後続の `App-Feat-11`(@otibo/ui 統合)・`Legal-Feat-9`(legal pages)の前提。

## Scope

- `package.json` を新規作成(scope 名は使わず `otibo-dev` ローカル package、private:true)
- Next.js 14 系 App Router で minimal scaffold(`app/layout.tsx` / `app/page.tsx`)
- Panda CSS を build pipeline に統合(postcss / `styled-system/` 生成、空に近い preset で開始)
- TypeScript strict 設定
- biome を lint / format に設定(otibo-ui の config を grain として参照)
- `.gitignore` で `styled-system/` / `.next/` / `node_modules/` 等を除外
- `engines.node: ">=20"` を package.json に明記
- `npm run dev` / `npm run build` / `npm run lint` / `npm run typecheck` が通ることを確認

## Non-Goals

- `@otibo/ui` の install / preset 統合(App-Feat-11)
- portfolio の情報設計、URL 構造、page 実装(別 task)
- 法的 page の実装(Legal-Feat-9)
- deployment target(Cloudflare Pages 等)の設定
- font 導入(otibo-ui の `gen-interface-jp` 等):App-Feat-11 以降
- 認証 / API route / DB 連携
- test framework(vitest / playwright)導入:現段階では lint + typecheck + build 通過で十分

## Requirements

### Functional

- F-001: `npm run dev` で localhost:3000 が起動し、`/` が 200 で返る。
- F-002: `app/page.tsx` の内容を編集すると hot reload が反映される。
- F-003: `npm run build` が成功し、`.next/` に build 成果物が生成される。
- F-004: `app/page.tsx` で Panda CSS の utility(`css()` / token)を使うと、emit された CSS が反映される。

### Non-Functional

- NF-001: `tsconfig.json` の `strict: true` / `noUncheckedIndexedAccess: true` が有効。
- NF-002: `biome check .` がエラー 0 で通る。
- NF-003: secret / 個人情報を含むファイルが repo に存在しない。
- NF-004: `styled-system/` は git ignore されている(panda codegen 出力)。

## Tasks

1. **package.json 作成**:`name`/`version: 0.0.0`/`private: true`/`type: module`/`scripts`/`engines`/`dependencies`/`devDependencies` を整える
2. **`next.config.mjs` 作成**:最小設定(react strict mode、TS path)
3. **`tsconfig.json` 作成**:Next.js 推奨 + strict 強化
4. **`postcss.config.cjs` 作成**:`@pandacss/dev` plugin を有効化
5. **`panda.config.ts` 作成**:空に近い preset(`preflight: true` / `include: ["./app/**/*.{ts,tsx}"]` / `outdir: "styled-system"`)
6. **`biome.json` 作成**:otibo-ui の config を参照しつつ Next.js 構造に合わせる(`app/` を対象、`.next/` `styled-system/` を ignore)
7. **`app/layout.tsx` 作成**:html / body の minimum 構造、`<html lang="ja">`
8. **`app/page.tsx` 作成**:Panda の `css()` を 1 箇所使った "hello otibo.dev" を表示(emit 確認のため)
9. **`app/globals.css` 作成**:Panda の `@layer` directive(`@layer reset, base, tokens, recipes, utilities;` + `@import ...`)を入れて layout から読み込む
10. **`.gitignore` 更新**:`node_modules/` / `.next/` / `styled-system/` / `.env*.local` / `*.log` を除外(template 既存内容に追記)
11. **`npm install` 実行**:依存解決
12. **`npm run prepare`(panda codegen)実行**:`styled-system/` 生成
13. **`npm run dev` / `npm run build` / `npm run lint` / `npm run typecheck`** を順に実行して通過確認
14. **Verification 残し** + TODO から削除

## QA Plan

- QA document: `_docs/qa/App/scaffold/test-plan.md`
- Risk level: **Medium**
- Test strategy:
  - Unit:なし(scaffold には unit 対象なし)
  - Integration:`npm run build` の通過で next + panda の統合を確認
  - E2E:`npm run dev` 起動 → curl で `/` HTTP 200 + emit CSS が response に乗ることを確認
  - Manual QA:ブラウザで `/` を開き hot reload 動作を確認(headless 環境では curl で代用)
  - Validator / static check:`biome check .` / `tsc --noEmit`
- AC ↔ confirmation:
  - AC-001(`/` 描画)→ `curl localhost:3000/` で 200 + HTML 確認
  - AC-002(Panda CSS emit)→ build 後の `.next/static/css/*.css` 存在 + page response に Panda クラス名が含まれる
  - AC-003(TS strict)→ `tsconfig.json` の値 grep + `tsc --noEmit` 通過
  - AC-004(dev/build/lint 通過)→ それぞれのコマンド exit 0
- INV-derived:
  - Stack 選定の why(framework / pm / lint / Node baseline)が Intent に明記されていて、実装と矛盾しない(diff 比較で確認)

## Deployment / Rollout

- 本 task は scaffold のみ。deploy 設定は別 task。
- rollback:`jj` / `git` で revert 可能。破壊対象は新規生成ファイルのみ(template 元ファイルは保持)。
- 既存 template の `_docs/` / `LICENSE.txt` / `AGENTS.md` 等は変更しない(scaffold が触るのは追加ファイル + `.gitignore` 追記のみ)。

## 関連

- TODO: `App-Feat-10`
- Intent: `_docs/intent/App/scaffold/decision.md`
- QA: `_docs/qa/App/scaffold/test-plan.md`
- 後続: `App-Feat-11` / `Legal-Feat-9`
