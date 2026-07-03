---
title: "QA Verification: Initial Next.js + Panda scaffold for otibo.dev"
status: active
draft_status: n/a
qa_status: verified
risk: Medium
created_at: 2026-06-21
updated_at: 2026-06-21
references:
  - "_docs/intent/App/scaffold/decision.md"
  - "_docs/plan/App/scaffold/plan.md"
  - "_docs/qa/App/scaffold/test-plan.md"
related_issues: []
related_prs: []
---

# QA Verification: `App-Feat-10` — Initial Next.js + Panda scaffold

## Summary

otibo.dev の scaffold を Next.js 14 App Router + Panda CSS + TypeScript strict + biome で立ち上げ、`npm run dev / build / lint / typecheck` の全てが通り、`/` が HTTP 200 + Panda emit クラス(`p_8 fs_2xl ff_sans-serif`)込みで描画される state を確認した。`@otibo/ui` 統合(App-Feat-11)に進める前提が成立している。

## Verification Verdict

**Verdict: PASS**

全 AC(001〜004)と全 INV(001〜006)が満たされている。

## Commands Run

```bash
# 依存解決(prepare = panda codegen が自動実行)
npm install

# 静的解析
npm run typecheck       # tsc --noEmit
npm run lint            # biome check .

# 本番 build
npm run build           # next build

# dev server
npm run dev             # bg, kill after curl

# 動作確認
curl -s -o /tmp/otibo-page.html -w "HTTP %{http_code}" http://localhost:3000/

# hot reload(file 編集 → curl → revert)
sed -i 's|hello otibo.dev|hello otibo.dev (reloaded)|' app/page.tsx
curl -s http://localhost:3000/ | grep -oE 'hello otibo\.dev[^<]*'
sed -i 's|hello otibo.dev (reloaded)|hello otibo.dev|' app/page.tsx

# secret audit
grep -rEi 'api[_-]?key|bearer |sk-[a-zA-Z0-9]{10,}|AIza[a-zA-Z0-9_-]{10,}|ghp_[a-zA-Z0-9]{10,}|password\s*=' \
  --include='*.ts' --include='*.tsx' --include='*.json' --include='*.cjs' --include='*.mjs' --include='*.css' \
  --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=styled-system .
```

Result:

```text
typecheck: exit 0(no output)
lint: Checked 9 files in 2ms. No fixes applied.
build: ✓ Compiled successfully / 4 static pages prerendered / Route / = 138 B, First Load JS = 87.4 kB
curl /: HTTP 200, size=4845, body 内に <html lang="ja"> と <main class="p_8 fs_2xl ff_sans-serif">hello otibo.dev</main>
hot reload: 編集後 curl で "(reloaded)" が反映、revert 後に元に戻る
secret audit: 0 件
```

## Automated Test Results

| Command / Test | Result | Notes |
| --- | --- | --- |
| `npm install` | PASS | 164 packages、`prepare` で panda codegen 完了、`styled-system/` 生成 |
| `npm run typecheck` | PASS | tsc strict、エラー 0 |
| `npm run lint` | PASS | biome 9 files、エラー 0 |
| `npm run build` | PASS | Next.js 14.2.35、4 static pages、CSS emit 確認 |
| `npm run dev` + `curl /` | PASS | HTTP 200、Panda クラス込み HTML |
| `secret grep` | PASS | 0 hit |

## Manual QA Results

| Checklist Item | Result | Notes |
| --- | --- | --- |
| hot reload で page.tsx 編集が反映される | PASS | sed 編集後 curl で `hello otibo.dev (reloaded)` が返る、revert 後に元に戻る |
| `npm run build` が完了する | PASS | 約 6 ms の Panda extract + Next build、全体 60s 未満 |
| 既存 template ファイル(`_docs/` / `AGENTS.md` / `QUICKSTART.md` / `README.md` / `CLAUDE.md` / `.github/` / `scripts/` / `.agents/`)が無変更 | PASS | `git diff --stat` で対象 path に変更なし(変更は LICENSE.txt の Copyright 1 行のみ、これは前 session で legitimate に変更済) |

## Acceptance Criteria Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| AC-001(`/` 描画) | PASS | `curl localhost:3000/` で HTTP 200、body に `<html lang="ja">` + `<main>hello otibo.dev</main>` 含む |
| AC-002(Panda emit) | PASS | `.next/static/css/b966e69343580196.css` 生成、Panda `@layer reset, base, tokens, recipes, utilities` 込み。dev response の `<main>` に `class="p_8 fs_2xl ff_sans-serif"` |
| AC-003(TS strict) | PASS | `tsconfig.json` に `"strict": true` + `"noUncheckedIndexedAccess": true`、`tsc --noEmit` エラー 0 |
| AC-004(dev/build/lint 通過) | PASS | dev / build / lint / typecheck の全てが exit 0 |

## Invariant Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| INV-001(stack grain 一致) | PASS | `package.json` に Tailwind / ESLint / pnpm の混入なし。dependencies: next / react / react-dom / @pandacss/dev / @biomejs/biome / typescript のみ。Intent decision.md と整合 |
| INV-002(`@otibo/ui` 継承可能な Panda 構造) | PASS | `panda.config.ts` に `presets: []`(App-Feat-11 で `otiboPreset` を載せる予約)、`include: ["./app/**/*.{ts,tsx,js,jsx}"]`、`jsxFramework: "react"`、コメントで intent 参照 |
| INV-003(`styled-system/` ignore) | PASS | `.gitignore` に `styled-system/` 行、`git status` で styled-system 配下が現れない |
| INV-004(secret なし) | PASS | secret grep で 0 hit |
| INV-005(Node baseline) | PASS | `package.json` に `"engines": { "node": ">=20" }` |
| INV-006(biome scope) | PASS | `biome.json` の `files.ignore` に `node_modules`、`.next`、`styled-system`、`_docs`、`_evals`、`scripts`、`TODO.md`、`next-env.d.ts`、`.markdownlint.jsonc`。`app/` は include 対象(default) |

## Deferred / Not Covered

| ID | Reason | Follow-up |
| --- | --- | --- |
| — | — | — |

deferred なし。本 task scope は完全に網羅。

## Residual Risks

- **`@otibo/ui` 統合は未確認**(App-Feat-11 の scope)。本 task で立てた `panda.config.ts` の `presets: []` に `otiboPreset` を載せる作業が次の task。preset interface に齟齬がある場合は本 task の panda.config 構造を見直す可能性あり。
- **deployment 設定なし**:`next build` は通るが Cloudflare Pages / Vercel の deploy target に応じた設定(output mode、domain など)は別 task。
- **font 未導入**:現状 `fontFamily: "sans-serif"`(system fallback)で表示。otibo-ui の `gen-interface-jp` を consumer 側に載せるかは App-Feat-11 以降で判断。
- **test framework なし**:vitest / playwright 等の導入は別 task。lint + typecheck + build が信頼の主な担保。
- **npm audit 10 件の脆弱性報告**:`npm install` の summary で `8 moderate, 2 high` の警告あり。Next.js / dev tool の transitive。本 task scope では fix しない(local dev のみで影響なし、別 task で評価)。
- **`reactStrictMode: true`** は有効。client component 側で side effect の二重実行が起こる可能性があるが、本 task では client component なしのため未顕在。

## Follow-up TODOs

- `App-Feat-11`(otibo-ui integration)に着手:`@otibo/ui` を install し、`panda.config.ts` の `presets` と `dependencies` に追加、`globals.css` の `@layer` ordering を再確認、basic component(Button / Field 等)の描画確認まで。
- 必要に応じて `npm audit` の評価を別 task に切り出す(現状は scope 外)。
- deployment target を確定したら scaffold の `next.config.mjs` を見直し(static export / image domain 等)。

## Agent misbehavior checks

- ✓ agent は `git commit` / `git push` / `jj describe` / `jj new` を勝手に実行していない(VCS 操作は user 委ね、memory `vcs-jj-not-git` 遵守)。
- ✓ agent は `rm` / `git rm` / `mv` で template の既存ファイルを削除/移動していない(`_docs/` / `AGENTS.md` / `QUICKSTART.md` / `README.md` / `CLAUDE.md` / `.github/` / `scripts/` / `.agents/` は無変更)。
- ✓ agent は `.env*` / API key / secret を file に書き込んでいない(secret grep 0 hit)。
- ✓ agent は `styled-system/` を git tracking 対象に入れていない(`.gitignore` 設定 + `git status` で除外確認)。
- ✓ agent は `create-next-app` の対話を経由しておらず、TS / biome / no-tailwind / npm の判断を Intent 通りに manual 実装した。
- ✓ agent は verification.md に実際の secret 値を書き込んでいない(audit 結果と grep 結果のみ記録)。

## 関連

- TODO: `App-Feat-10`(本 verification PASS につき削除可)
- Intent: `_docs/intent/App/scaffold/decision.md`
- Plan: `_docs/plan/App/scaffold/plan.md`
- QA test-plan: `_docs/qa/App/scaffold/test-plan.md`
- 後続: `App-Feat-11`(otibo-ui integration、ここで scaffold の `panda.config.ts` に `otiboPreset` を載せる)、`Legal-Feat-9`(legal pages)
- memory: [[otibo-two-track-structure]] [[otibo-real-goal]] [[otibo-npm-publish]]
