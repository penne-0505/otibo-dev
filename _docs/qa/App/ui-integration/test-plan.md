---
title: "QA Test Plan: Integrate @otibo/ui design system into otibo.dev"
status: superseded
draft_status: n/a
qa_status: planned
risk: Medium
created_at: 2026-06-21
updated_at: 2026-07-17
references:
  - "_docs/qa/App/otibo-ui-0-3-migration/test-plan.md"
  - "_docs/intent/App/ui-integration/decision.md"
  - "_docs/plan/App/ui-integration/plan.md"
related_issues: []
related_prs: []
---

# QA Test Plan: `App-Feat-11` — Integrate @otibo/ui

## Source of Intent

- TODO: `App-Feat-11`
- Plan: `_docs/plan/App/ui-integration/plan.md`
- Intent: `_docs/intent/App/ui-integration/decision.md`
- 上流 canonical: `otibo-ui/_docs/intent/Pkg/initial-public-publish/decision.md` §I(Approach 4)

## Quality Goal

`@otibo/ui@0.1.1` を otibo-dev に **canonical な Approach 4 設定で** 統合し、Server Component のまま Button + Field が `/` で描画される state を担保する。これは two-track 構造の最初の接続点で、後続の portfolio page 実装が「library を import するだけで DS の手触りが乗る」ことを前提できる土台を作る。同時に、library 側が AC-007(consumer integration、`otibo-ui/Pkg-Feat-5` の deferred 項)を **end-to-end で verify** する場でもある。

## Acceptance Criteria

- AC-001: `npm install @otibo/ui@^0.1.1 @base-ui-components/react` が peer warning なしで成功する。
- AC-002: `panda codegen` が preset / buildinfo を反映した `styled-system/` を生成し、build 後の CSS に Button + Field 由来の class 定義が含まれる(library 内部の usage が hydrate されている)。
- AC-003: `app/page.tsx`(Server Component)から `import { Button, Field } from "@otibo/ui"` で import + 描画でき、`curl /` で HTTP 200 + 期待 HTML が返る。
- AC-004: `npm run dev` / `build` / `lint` / `typecheck` が全て exit 0。

## Intent-derived Invariants

- INV-001: Server Component 境界が崩れていない ── consumer の `app/page.tsx` に `"use client"` directive が書かれておらず、それでも Button / Field が動作する(library 側 directive が機能している)。
- INV-002: Approach 4 設定が canonical 通り ── `panda.config.ts` に `presets: [otiboPreset]`、`include` に `panda.buildinfo.json` path、`importMap: "@otibo/ui/styled-system"` が含まれる。
- INV-003: staticCss が canonical 一致 ── `toast` / `pagination` / `combobox` / `navigationMenu` / `numberField` / `toggle` / `chip` の 7 recipe が `["*"]` で設定されている。
- INV-004: `@otibo/ui` の version pin が `^0.1.1`(prototype-era の patch を取り込む grain)。
- INV-005: import 形式が `import { Button, Field } from "@otibo/ui"`(top-level export を使用、`@otibo/ui/dist/...` のような internal path を直接叩かない)。
- INV-006: hot reload が引き続き動作する(scaffold で確立した dev 体験を壊さない)。
- INV-007: secret / 個人情報が新規 file に混入していない。
- INV-008: template 既存ファイル(`_docs/standards/` / `AGENTS.md` / `LICENSE.txt` / `QUICKSTART.md` / `README.md` 等)が無変更。

## Risk Assessment

- **Risk level**: Medium
- **Risk rationale**: 統合の grain が後続の portfolio page 実装全てに波及する。staticCss / preset / buildinfo の設定がずれると、見た目では動いていても本番でだけ CSS が欠ける failure mode に陥りやすい(memory `panda-dynamic-component-staticcss` の趣旨)。
- **Regression risk**:
  - scaffold で確立した `/` の挙動(HTTP 200 / `<html lang="ja">` / hot reload)を壊す可能性。
  - panda.config の `presets: []` を上書きする際に既存 `preflight: true` 等を消す事故。
- **Data safety risk**: なし(DB / 永続化なし)。
- **Security / privacy risk**:
  - 新規 dep の install で transitive 脆弱性が増える可能性。`npm audit` の結果は記録のみ、本 task では fix しない(別 task に倒す)。
- **UX risk**: 本 task では試験描画のみ、UX 評価は portfolio page 実装で行う。
- **Agent misbehavior risk**:
  - agent が `"use client"` を consumer 側に書いてしまう(library directive を信頼しない)。
  - agent が staticCss を独自判断で削る(canonical を破壊)。
  - agent が `git commit` / `jj` 操作を勝手に実行する。
  - agent が `@otibo/ui` の internal path(`/dist/...`)を直接 import する。

## Test Strategy

- **Unit**: なし(統合 task)。
- **Integration**: `npm run build` の exit 0 + build CSS 内の Button / Field class 検出。
- **E2E**: `npm run dev` 起動後 `curl /` で 200 + 期待 HTML、build 後 production server でも同様に curl 可。
- **Manual QA**:
  - dev で `app/page.tsx` を編集 → curl で diff 反映 → revert で hot reload 確認。
  - consumer code に `"use client"` を書かずに Button が動作することを確認(grep + curl の組み合わせ)。
- **Validator / static check**: `biome check .` / `tsc --noEmit` / `grep` で intent invariant を検証。
- **Diff review**: `git diff --stat` で本 task が template 既存ファイル(`_docs/standards/` 等)を変更していないこと。

## Test Matrix

| ID | Source | Requirement / Invariant | Test Type | Command / File | Expected Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AC-001 | TODO | install 成功 | Integration | `npm install @otibo/ui@^0.1.1 @base-ui-components/react` | exit 0、peer warning なし | planned |
| AC-002 | TODO | preset 継承 + emit | Integration | `npm run build` 後 `grep -r 'button\|field' .next/static/css/` | recipe class 名(Panda emit)が含まれる | planned |
| AC-003 | TODO | Button + Field 描画 | E2E | `curl localhost:3000/` | HTTP 200、Button + Field の expected HTML 構造 | planned |
| AC-004 | TODO | dev/build/lint/typecheck 通過 | CI-equivalent | 各コマンド | 全 exit 0 | planned |
| INV-001 | intent | Server Component 境界 | Static check + E2E | `grep '"use client"' app/page.tsx` で 0 hit + curl で Button 動作 | grep 0 件 + curl 200 + library class 検出 | planned |
| INV-002 | intent | Approach 4 設定 canonical | Static check | `panda.config.ts` を grep | `presets`、`buildinfo.json` 含む include、`importMap` 一致 | planned |
| INV-003 | intent | staticCss canonical | Static check | `panda.config.ts` の staticCss block | 7 recipe `["*"]` が一致 | planned |
| INV-004 | intent | version pin | Static check | `package.json` deps | `"@otibo/ui": "^0.1.1"` | planned |
| INV-005 | intent | import 形式 | Static check | `grep "@otibo/ui/dist" app/` | 0 hit(internal path 直叩きなし) | planned |
| INV-006 | intent | hot reload | Manual QA | dev + sed 編集 + curl + revert | 編集が反映、revert で元に戻る | planned |
| INV-007 | intent | secret なし | Static check | `grep -rEi 'api[_-]?key\|token\|...'` on new files | 0 hit | planned |
| INV-008 | intent | template 無変更 | Diff review | `git diff --stat` on `_docs/standards/` / `AGENTS.md` / `LICENSE.txt` / `QUICKSTART.md` / `README.md` / `.github/` / `scripts/` | 変更行 0 | planned |

## Manual QA Checklist

- [ ] dev server 起動状態で `app/page.tsx` の Field label を変更すると、curl で diff 即時反映。
- [ ] `app/page.tsx` に `"use client"` が無い state で Button / Field が動く。
- [ ] `npm run build` の First Load JS を記録(reference のみ、上限なし)。
- [ ] build 後の production server(`npm start`)でも `curl /` が 200 + 期待 HTML。

## Regression Checklist

- [ ] scaffold で確立した `/` の HTTP 200、`<html lang="ja">`、hot reload が壊れていない。
- [ ] `panda.config.ts` の `preflight: true` / `outdir` / `jsxFramework` 等 scaffold が立てた既存 key が消えていない。
- [ ] `tsconfig.json` / `next.config.mjs` / `postcss.config.cjs` / `biome.json` / `.gitignore` の既存内容が本 task で変更されていない(統合は panda.config + page.tsx + package.json のみ)。
- [ ] template 既存ファイル(`_docs/standards/` / `AGENTS.md` / `LICENSE.txt` / `QUICKSTART.md` / `README.md` 等)が無変更。

## High-risk Checklist

本 task は Risk Medium のため適用しない。

## Agent misbehavior checks

- [ ] agent が `app/page.tsx` に `"use client"` を書いていない(library directive を信頼している)。
- [ ] agent が staticCss を canonical 7 recipe から削っていない / 追加していない(library の意図を尊重)。
- [ ] agent が `@otibo/ui/dist/...` のような internal path を直接 import していない。
- [ ] agent が `git commit` / `git push` / `jj describe` / `jj new` を勝手に実行していない。
- [ ] agent が `rm` / `git rm` / `mv` で既存ファイルを削除 / 移動していない。
- [ ] agent が `.env*` / API key / secret を file に書き込んでいない。
- [ ] agent が `styled-system/` を git tracking 対象に入れていない。
- [ ] agent が verification.md に実際の secret 値を書き込んでいない。

## Out of Scope

- portfolio page 実装、theme override、font 導入、Link / Toast / Dialog 等の追加 component 描画
- deployment 設定
- test framework 導入
- otibo-ui README の glob 表記訂正(別 task で otibo-ui 側に)
- `npm audit` の fix(別 task)

## Open Questions

- なし(設定は canonical Intent §I 通り、user 同意済)。
