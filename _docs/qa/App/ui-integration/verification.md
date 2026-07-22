---
title: "QA Verification: Integrate @otibo/ui design system into otibo.dev"
status: superseded
draft_status: n/a
qa_status: verified
risk: Medium
created_at: 2026-06-21
updated_at: 2026-07-17
references:
  - "_docs/qa/App/otibo-ui-0-3-migration/verification.md"
  - "_docs/intent/App/ui-integration/decision.md"
  - "_docs/plan/App/ui-integration/plan.md"
  - "_docs/qa/App/ui-integration/test-plan.md"
related_issues: []
related_prs: []
---

# QA Verification: `App-Feat-11` — Integrate @otibo/ui

## Summary

`@otibo/ui@0.1.1` を otibo-dev に Approach 4(Ship Build Info File)consumer 設定 canonical 通り統合し、`app/page.tsx`(Server Component)から Button + Field の試験描画が動作することを確認した。production build CSS に **154 種類の recipe class** が emit され、library の internal usage(buildinfo 由来)+ canonical staticCss(toast / pagination / combobox / navigationMenu / numberField / toggle / chip)+ consumer 自身の `css()` usage の 3 系統が同居している。

同時に、library の **namespace export(`Field.Root` 等)が Next.js App Router RSC で trap になる**ことを発見し、Intent に discovered 項として記録。consumer 側では flat export(`FieldRoot` 等)を canonical とした。

## Verification Verdict

Verdict: PASS

全 AC(001〜004)と全 INV(001〜008)が満たされている。**library 側 `Pkg-Feat-5` の AC-007(consumer integration)も本 verification で end-to-end 確認済**(library Intent 通りに動作することが consumer 側で確証された)。

## Commands Run

```bash
# install
npm install @otibo/ui@^0.1.1 @base-ui-components/react

# preset / buildinfo を反映した styled-system 再生成
npm run prepare

# 静的解析(lint:fix で format 警告 2 件を自動修正)
npm run typecheck
npm run lint:fix
npm run lint

# 本番 build
npm run build

# dev server + curl
npm run dev      # bg
curl -s http://localhost:3000/

# hot reload(編集 → curl → revert)
sed -i 's|@otibo/ui integration smoke test|reloaded text|' app/page.tsx
curl -s http://localhost:3000/ | grep -oE 'reloaded text'
sed -i 's|reloaded text|@otibo/ui integration smoke test|' app/page.tsx

# CSS 検証
find .next -name "*.css" -type f
find .next -name "*.css" -type f -exec grep -hoE '\.otibo-[a-zA-Z_-]+' {} \; | sort -u | wc -l

# secret audit
grep -rEi 'api[_-]?key|bearer |sk-[a-zA-Z0-9]{20,}|AIza[a-zA-Z0-9_-]{20,}|ghp_[a-zA-Z0-9]{20,}|password\s*=' app/ panda.config.ts package.json

# consumer 'use client' check
grep -l '"use client"' app/page.tsx app/layout.tsx

# template untouched
git diff --stat HEAD -- '_docs/standards/' 'AGENTS.md' 'QUICKSTART.md' 'README.md' 'CLAUDE.md' '.github/' 'scripts/' '.agents/'
```

Result:

```text
install: 11 vulnerabilities (informational; npm audit fix は別 task)、peer warning なし
prepare: styled-system/css, /tokens, /patterns, /recipes, /jsx 再生成(preset 反映)
typecheck: exit 0
lint: 9 files、Found 4 errors → lint:fix で 2 file 自動修正後 0 errors
build: ✓ Compiled successfully、4 static pages、/ route = 30 kB、First Load JS = 117 kB
curl /: HTTP 200 size=7049、HTML に library class (otibo-button / otibo-field__root 等)
hot reload: 編集→反映、revert→元に戻る、両方とも curl で diff 確認
build CSS: .next/static/css/96cc1c6eafebc1c0.css、recipe class 154 種類
secret audit: 0 hit
consumer 'use client' check: app/page.tsx / app/layout.tsx に 'use client' なし
template diff: LICENSE.txt 1 line のみ(前 session で legitimate に変更済)、それ以外無変更
```

## Automated Test Results

| Command / Test | Result | Notes |
| --- | --- | --- |
| `npm install @otibo/ui@^0.1.1 @base-ui-components/react` | PASS | exit 0、peer warning なし。Base UI は `^1.0.0-rc.0` を npm が install(library peer `^1.0.0-beta.6` の caret 内 ── pre-release tag 進行) |
| `npm run prepare` | PASS | preset / buildinfo を反映した styled-system 再生成(`recipes` / `tokens` が新規追加 ← 前回 scaffold 時は preset 無しで非生成) |
| `npm run typecheck` | PASS | tsc strict、エラー 0 |
| `npm run lint` | PASS | biome、lint:fix で format 警告 2 件(panda.config 配列 inline / page.tsx h1 折りたたみ)自動修正後 0 errors |
| `npm run build` | PASS | Next 14.2.35、4 static pages prerender、`/` = 30 kB / First Load JS 117 kB |
| `npm run dev` + curl | PASS | HTTP 200、HTML に library 由来 class + consumer 由来 css() class が混在 |
| Production CSS emit | PASS | `.next/static/css/96cc1c6eafebc1c0.css` に recipe class 154 種類(`otibo-button` / `otibo-button--intent_primary`/secondary/ghost / `otibo-field__root` / `otibo-input` / `otibo-chip__*` / `otibo-combobox__*` 等) |
| secret audit | PASS | 0 hit |
| template untouched | PASS | LICENSE.txt 1 行のみ(前 session の Copyright 変更)、それ以外 0 行 |

## Manual QA Results

| Checklist Item | Result | Notes |
| --- | --- | --- |
| dev hot reload(page.tsx の Field label 編集 → curl で diff 即時反映) | PASS | `sed` で `@otibo/ui integration smoke test` → `reloaded text` → revert、両方 curl で確認 |
| `app/page.tsx` に `"use client"` 無し state で Button / Field 動作 | PASS | `grep '"use client"' app/page.tsx` 0 hit、build / curl で動作 |
| First Load JS 記録 | PASS(reference) | **117 kB**(scaffold 時 87.4 kB から +30 kB ── Button + Field + Base UI 内部 hook 含む)。上限なし(reference のみ) |
| production server(`npm start`)で `curl /` 200 + 期待 HTML | PASS | 別途確認、HTML に library class 確認 |

## Acceptance Criteria Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| AC-001(install 成功 + peer warning なし) | PASS | `npm install @otibo/ui@^0.1.1 @base-ui-components/react` exit 0、peer warning 0、`package.json` に `"@otibo/ui": "^0.1.1"` + `"@base-ui-components/react": "^1.0.0-rc.0"` |
| AC-002(preset 継承 + emit) | PASS | `panda.config.ts` に `presets: [otiboPreset]`、build CSS に `.otibo-button` / `.otibo-field__root` / `.otibo-input` 等の recipe class 154 種類 emit。`styled-system/recipes` が `panda codegen` で新規生成 |
| AC-003(Button + Field 描画) | PASS | `curl /` HTTP 200、HTML に `<button class="otibo-button otibo-button--intent_secondary otibo-button--size_md">送信する</button>` + `<div class="otibo-field__root otibo-field__root--density_comfortable">...<label for="base-ui-:Rafj6:">メールアドレス</label><input type="email" class="otibo-input otibo-input--size_md">...</div>` |
| AC-004(dev/build/lint/typecheck 通過) | PASS | 全 exit 0(lint は initial 4 errors → lint:fix で 2 file 自動修正後 0) |

## Invariant Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| INV-001(Server Component 境界) | PASS | `app/page.tsx` / `app/layout.tsx` に `"use client"` 無し、`grep` で 0 hit、build / curl で動作。library 側の `"use client"` directive(0.1.1 で追加)が機能している |
| INV-002(Approach 4 設定 canonical) | PASS | `panda.config.ts` に `presets: [otiboPreset]`、`include` に `./node_modules/@otibo/ui/dist/panda.buildinfo.json`、`importMap: "@otibo/ui/styled-system"` が含まれる |
| INV-003(staticCss canonical) | PASS | `panda.config.ts` の `staticCss.recipes` に `toast` / `pagination` / `combobox` / `navigationMenu` / `numberField` / `toggle` / `chip` が `["*"]` で設定(canonical Intent §I 完全一致)。build CSS に `.otibo-chip__*` / `.otibo-combobox__*` 等の常時 emit クラス確認 |
| INV-004(version pin) | PASS | `package.json` に `"@otibo/ui": "^0.1.1"` |
| INV-005(import 形式) | PASS | `grep "@otibo/ui/dist" app/` 0 hit、import は `import { Button, FieldDescription, FieldInput, FieldLabel, FieldRoot } from "@otibo/ui"` のみ |
| INV-006(hot reload) | PASS | 編集→反映、revert→元に戻る、両方 curl で確認 |
| INV-007(secret なし) | PASS | grep 0 hit |
| INV-008(template 無変更) | PASS | `_docs/standards/` / `AGENTS.md` / `QUICKSTART.md` / `README.md` / `CLAUDE.md` / `.github/` / `scripts/` / `.agents/` は無変更。LICENSE.txt は前 session で legitimate に Copyright 変更済(本 task では touch せず) |

## Deferred / Not Covered

| ID | Reason | Follow-up |
| --- | --- | --- |
| — | — | — |

deferred なし。本 task scope に対して完全網羅。`Pkg-Feat-5/AC-007`(library 側の deferred)も本 verification で実質的に PASS。

### Historical follow-up context (not residual to scoped PASS)

- **Discovered during implementation:Field 等 namespace export trap**(Intent §Discovered):`<Field.Root>` のような namespace property 経由は Next.js RSC bundler が Client Manifest で resolve できず build 失敗。consumer は flat export(`FieldRoot` 等)を使う grain で確定。**otibo-ui 側 README + 他 namespace export(`Card.Root` / `Tabs.Root` / `Toast.Root` 等)の docs 改訂が follow-up 別 task**。
- **Base UI version drift**:otibo-ui peer は `@base-ui-components/react@^1.0.0-beta.6` だが、npm が `^1.0.0-rc.0` を install。pre-release tag(beta → rc)の caret 解釈で、API breaking が起こり得る。本 task では Button + Field の試験描画は問題なく動作したが、Toast / Dialog / Combobox 等のより複雑な component で hook signature の差異が顕在化する可能性。**実 page 実装で問題が出たら別 task で評価**。
- **npm audit 11 件の脆弱性**(`9 moderate, 2 high`):`@otibo/ui` + Base UI 追加で +1 件増加。transitive dep。本 task scope では fix しない、別 task で評価する。
- **font 未導入**:現状 sans-serif system fallback。`gen-interface-jp` 等の日本語 font を consumer 側に載せるかは portfolio page 実装で判断。
- **First Load JS = 117 kB**:scaffold +30 kB。Button + Field + Base UI の最小 footprint としては妥当だが、portfolio page で component を追加するたびに増える。tree-shaking が library 側で機能しているかは別途確認(現状の `sideEffects: false` + ESM export + tsup 出力で OK と想定)。
- **dark mode / theme switching 未確認**:default(light)のみ。
- 上記は当時の実装scope外に置いた後続候補であり、検証済みのconsumer
  integrationに対する未達条件ではない。現行のCSS消費契約は
  後継`App/otibo-ui-0-3-migration`を正本とする。

## Residual Risks

None

## Follow-up TODOs

- **otibo-ui 側 follow-up**(別 task):
  - README の Usage 例(`<Field.Root>` namespace 形式)に **Next.js App Router RSC consumer 向けの flat export 推奨 note** を追加。
  - `Card` / `Tabs` / `Toast` / `Combobox` / `NavigationMenu` 等の namespace export を持つ component すべてに同じ note を当てる、または namespace export 自体を deprecate するかを設計判断。
  - README の `include` glob 表記(`./node_modules/@otibo/ui/dist/**/*.{js,cjs}`)を Approach 4 canonical(`./node_modules/@otibo/ui/dist/panda.buildinfo.json`)に訂正。
  - Base UI peer の caret を `^1.0.0-rc.0` に上げるか、`>=1.0.0-beta.6 <2` の range に書き換えるか別 task で評価。
- **otibo-dev 側 follow-up**:
  - portfolio page 実装(未起票、本 task 完了後に Inbox 起票)── 実 page で DS の手触りを確かめる next phase。
  - `npm audit` の fix を別 task で評価(現状 0.1.1 / Base UI rc.0 の dep が固まったので、まとめて評価可)。
  - dark mode / theme switching を実装するかは別 task(portfolio page の design 判断に依る)。

## Agent misbehavior checks

- ✓ agent は `app/page.tsx` に `"use client"` を書いていない(library directive を信頼し、Server Component 境界を保つ)。
- ✓ agent は staticCss canonical(7 recipe `["*"]`)を削っていない / 追加していない。library 側の意図を尊重。
- ✓ agent は `@otibo/ui/dist/...` 等の internal path を直接 import していない。top-level export(`@otibo/ui` / `@otibo/ui/preset`)のみ使用。
- ✓ agent は `git commit` / `git push` / `jj describe` / `jj new` を勝手に実行していない(memory `vcs-jj-not-git` 遵守)。
- ✓ agent は `rm` / `git rm` / `mv` で既存ファイルを削除 / 移動していない。
- ✓ agent は `.env*` / API key / secret を file に書き込んでいない。
- ✓ agent は `styled-system/` を git tracking 対象に入れていない(`.gitignore` 設定 + `git status` で除外確認)。
- ✓ agent は verification.md に実際の secret 値を書き込んでいない(audit 結果と grep 結果のみ記録)。

## 関連

- TODO: `App-Feat-11`(本 verification PASS につき削除可)
- Intent: `_docs/intent/App/ui-integration/decision.md`
- Plan: `_docs/plan/App/ui-integration/plan.md`
- QA test-plan: `_docs/qa/App/ui-integration/test-plan.md`
- 上流: `App-Feat-10`(scaffold)、`otibo-ui/Pkg-Feat-5`(initial publish)、`otibo-ui/Pkg-Bug-6`(use client hotfix)
- canonical(library 側): `otibo-ui/_docs/intent/Pkg/initial-public-publish/decision.md` §I
- memory: [[otibo-two-track-structure]] [[otibo-real-goal]] [[otibo-npm-publish]] [[panda-dynamic-component-staticcss]] [[otibo-accent-direction]] [[otibo-color-layering]]
