---
title: "QA Test Plan: Initial Next.js + Panda scaffold for otibo.dev"
status: active
draft_status: n/a
qa_status: planned
risk: Medium
created_at: 2026-06-21
updated_at: 2026-06-21
references:
  - "_docs/intent/App/scaffold/decision.md"
  - "_docs/plan/App/scaffold/plan.md"
related_issues: []
related_prs: []
---

# QA Test Plan: `App-Feat-10` — Initial Next.js + Panda scaffold

## Source of Intent

- TODO: `App-Feat-10`
- Plan: `_docs/plan/App/scaffold/plan.md`
- Intent: `_docs/intent/App/scaffold/decision.md`

## Quality Goal

otibo.dev の土台が、Next.js App Router + Panda CSS + TypeScript strict + biome で **後続 task(`App-Feat-11`, `Legal-Feat-9`)から摩擦なく載せられる** state まで立ち上がっていること。「動く dev server + 通る build + 通る lint」だけでなく、`@otibo/ui` の preset を継承するための前提(Panda が build pipeline に乗っている、styled-system/ が生成される、postcss が機能している)が成立していることを担保する。

## Acceptance Criteria

- AC-001: Next.js App Router で空のトップ(`/`)が描画される(HTTP 200 + HTML 返却)。
- AC-002: Panda CSS が build / dev pipeline に組み込まれ、style が emit される(`styled-system/` 生成、`css()` 利用箇所のクラスが build/dev 出力に存在)。
- AC-003: TypeScript strict が有効である(`strict: true` + `noUncheckedIndexedAccess: true`、`tsc --noEmit` がエラー 0)。
- AC-004: `npm run dev` / `npm run build` / `npm run lint` / `npm run typecheck` が全て通る(exit 0)。

## Intent-derived Invariants

- INV-001: Stack 選定は Intent(`decision.md`)と一致(Next.js App Router / npm / Panda / biome / Node 20+)。実装に Tailwind / ESLint / pnpm が混入していない。
- INV-002: `@otibo/ui` の preset を後で継承できる Panda 構造(`presets: []` が `panda.config.ts` に存在、`include` が `app/` を拾う)。
- INV-003: `styled-system/` が gitignore されており、agent / 人間どちらも codegen 出力を commit しない。
- INV-004: secret / 個人情報が repo に存在しない(scaffold で新規生成されるファイルに `.env*` / API key の混入がない)。
- INV-005: Node baseline が `engines.node: ">=20"` で明記されている(将来の Next.js 上げで詰まらない)。
- INV-006: biome の対象に `app/` が含まれ、`.next/` / `styled-system/` / `node_modules/` が ignore されている(library 側と同じ grain)。

## Risk Assessment

- **Risk level**: Medium
- **Risk rationale**: scaffold は新規 file 生成中心で破壊的影響は小さいが、stack 選定の初手が後続全 task に波及するため、grain がずれた状態で固まると修正コストが大きい。
- **Regression risk**: template の他ファイル(`_docs/`, `AGENTS.md`, `LICENSE.txt`, `QUICKSTART.md`, `TODO.md`)を壊さないこと。本 task は追加のみが基本。
- **Data safety risk**: なし(DB / 永続化なし)。
- **Security / privacy risk**: `.env*` をうっかり commit する余地。`.gitignore` で除外を担保。
- **UX risk**: 本 task では UI は "hello otibo.dev" 程度。UX 評価は別 task。
- **Agent misbehavior risk**:
  - agent が Tailwind / ESLint を default で入れる(create-next-app の挙動)→ manual scaffold で回避。
  - agent が `git commit` を勝手に実行する → memory `vcs-jj-not-git` 遵守、user に委ねる。
  - agent が `styled-system/` を commit する → `.gitignore` で除外、確認。

## Test Strategy

- **Unit**: なし(scaffold に unit 対象なし)。
- **Integration**: `npm run build` の exit 0 をもって Next.js + Panda + biome + TS の integration を確認。
- **E2E**: `npm run dev` 起動後、`curl http://localhost:3000/` で 200 + HTML を確認。emit CSS は build 後の `.next/static/css/*.css` 存在で確認(headless 環境想定)。
- **Manual QA**: dev server 起動状態で `app/page.tsx` を編集して hot reload が反映されることを確認(curl で diff 確認も可)。
- **Validator / static check**: `biome check .` / `tsc --noEmit`。
- **Diff review**: scaffold が template の既存ファイル(`_docs/` / `AGENTS.md` / `LICENSE.txt` / `QUICKSTART.md` / `TODO.md`)を変更していないことを `jj diff` / `git diff` で確認。

## Test Matrix

| ID | Source | Requirement / Invariant | Test Type | Command / File | Expected Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AC-001 | TODO | `/` 描画 | E2E | `npm run dev` → `curl -o - localhost:3000/` | HTTP 200 + `<html lang="ja">` を含む HTML | planned |
| AC-002 | TODO | Panda emit | Integration | `npm run build` 後 `find .next -name "*.css"` / page response | `styled-system/` 存在、build CSS 内に `css()` 由来クラス | planned |
| AC-003 | TODO | TS strict | Static check | `grep '"strict": true' tsconfig.json` + `npm run typecheck` | strict:true 確認 + exit 0 | planned |
| AC-004 | TODO | dev/build/lint 通過 | CI-equivalent | `npm run dev` / `npm run build` / `npm run lint` / `npm run typecheck` | 全 exit 0 | planned |
| INV-001 | intent | Stack の grain 一致 | Diff review | `package.json` / `panda.config.ts` / `biome.json` を Intent と突合 | Tailwind / ESLint / pnpm の混入なし | planned |
| INV-002 | intent | `@otibo/ui` 継承可能な Panda 構造 | Static check | `panda.config.ts` に `presets: []` + `include: ["./app/**/*.{ts,tsx}"]` | 構造一致 | planned |
| INV-003 | intent | `styled-system/` ignore | Static check | `.gitignore` grep | `styled-system/` 行 存在 + `git status` で出ない | planned |
| INV-004 | intent | secret なし | Static check | `grep -rEi 'api[_-]?key\|token\|secret\|password\|bearer\|sk-\|AIza\|ghp_' --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=styled-system .` | hit が false positive(token = panda token 等)のみ | planned |
| INV-005 | intent | Node baseline | Static check | `grep '"node"' package.json` | `"node": ">=20"` 存在 | planned |
| INV-006 | intent | biome scope | Static check | `biome.json` の `files.include` / `files.ignore` | `app/` 含む、`.next/` `styled-system/` ignore | planned |

## Manual QA Checklist

- [ ] dev server 起動状態で `app/page.tsx` の文言を変更すると、curl(または browser)で diff が即時反映される。
- [ ] `npm run build` が完了する(60s 程度の許容)。
- [ ] `_docs/` / `AGENTS.md` / `LICENSE.txt` / `QUICKSTART.md` / `TODO.md` が無変更(template の既存ガイダンスを壊していない)。

## Regression Checklist

- [ ] template 既存の `_docs/` / `AGENTS.md` / `LICENSE.txt` / `QUICKSTART.md` / `TODO.md` が無変更。
- [ ] `.gitignore` 追記が既存行と重複していない。

## High-risk Checklist

本 task は Risk Medium のため適用しない。

## Agent misbehavior checks

- [ ] agent が `git commit` / `git push` / `jj describe` / `jj new` を勝手に実行していない(VCS 操作は user)。
- [ ] agent が `rm` / `git rm` で template ファイルを削除していない(`mv` も使っていない)。
- [ ] agent が `.env*` / API key / secret を commit に含めていない。
- [ ] agent が `styled-system/` を commit に含めようとしていない。
- [ ] agent が `create-next-app` の対話を経由しておらず、TS / biome / no-tailwind の判断を Intent 通りに manual 実装している。
- [ ] agent が verification.md に実際の secret 値を書き込んでいない。

## Out of Scope

- `@otibo/ui` の install / preset 統合(App-Feat-11)
- 法的 page 実装(Legal-Feat-9)
- portfolio 情報設計
- test framework 導入(vitest / playwright)
- deployment 設定(Cloudflare Pages / Vercel)
- font 導入

## Open Questions

- なし(stack は user 同意で確定済 2026-06-21)。
