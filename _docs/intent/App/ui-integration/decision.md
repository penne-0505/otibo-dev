---
title: "Intent: Integrate @otibo/ui design system into otibo.dev"
status: superseded
draft_status: n/a
created_at: 2026-06-21
updated_at: 2026-07-17
references:
  - "_docs/intent/App/otibo-ui-0-3-migration/decision.md"
  - "_docs/plan/App/ui-integration/plan.md"
  - "_docs/qa/App/ui-integration/test-plan.md"
  - "_docs/intent/App/scaffold/decision.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/intent/App/ui-integration/decision.md -->

## Context

`App-Feat-10` で立てた Next.js scaffold に、別 repo で publish 済の `@otibo/ui@0.1.1` を **consumer として統合する**。これは two-track 構造(memory `otibo-two-track-structure`)の最初の接続点であり、library 側で抽象的に決めた DS の手触り(color / motion / 余白 / grammar)を **portfolio の page 上で答え合わせする最初の機会**(memory `otibo-real-goal` の grain)。

`@otibo/ui` は **Panda CSS の Approach 4(Ship Build Info File)** で publish されている(canonical: `otibo-ui/_docs/intent/Pkg/initial-public-publish/decision.md` §I)。consumer は preset を継承し、`panda.buildinfo.json` を Panda の `include` に渡すことで library 内部の usage を hydrate する。

`0.1.1` で `tsup` の `banner` 経由で `dist/index.{js,cjs}` 先頭に `"use client"` directive が入っている(otibo-ui `Pkg-Bug-6`)。otibo-dev の `app/page.tsx`(Server Component)から直接 import 可能。

## Decision

| 領域 | 採用 |
| --- | --- |
| Pin する @otibo/ui version | `^0.1.1`(初回固定、minor breaking 受容可) |
| Panda preset 継承 | `presets: [otiboPreset]`(`@otibo/ui/preset` から named import) |
| importMap | `"@otibo/ui/styled-system"`(library と一致) |
| Panda include に追加 | `./node_modules/@otibo/ui/dist/panda.buildinfo.json`(Approach 4) |
| staticCss | otibo-ui README + Intent §I が指定する 7 recipe(`toast`, `pagination`, `combobox`, `navigationMenu`, `numberField`, `toggle`, `chip`)を `["*"]` で常時 emit |
| Base UI peer dependency | `@base-ui-components/react` を **dependencies** に install(consumer の app dep として) |
| 試験描画する component | **Button**(最小)+ **Field(.Label / .Input / .Description)**(form の最小単位) |
| `app/page.tsx` の Server / Client 境界 | **Server Component のまま**(library 側で `"use client"` が付与されている、wrap 不要) |
| font 導入 | **本 task では未導入**(system fallback `sans-serif`)。otibo-ui の `gen-interface-jp` を consumer に載せるかは別 task |
| theme / color customization | **本 task では preset default のまま**(accent 確定値 `oklch(0.40 0.11 265)` は preset 側で既に入っている、page 側で上書きしない) |

## Alternatives

### Pin する version

- **`@otibo/ui@0.1.1` の exact pin**:patch 含む全 update を手動で取り込む grain。両 repo を同時メンテしている今は `^0.1.1` の方が「prototype-era の patch を即時取り込む」flow に合う。**`^0.1.1` 採用**。
- **`@otibo/ui@latest` floating**:lock 機構が grain を担保するが、`npm install` 都度の resolve で意外な version が入る余地。SemVer caret 内に絞る方が読みやすい。**不採用**。

### Panda 統合方式

- **buildinfo を `include` に渡さない / preset 継承だけ**:component 内部の Panda usage(recipe / token 利用)が consumer 側 codegen で検出されず、必要な CSS が emit されない。**不採用**(Approach 4 の前提を欠く)。
- **Approach 3(library が src を ship)**:0.1.1 では既に Approach 4 で publish 済、consumer 側で切り替える理由なし。**不採用**。
- **library が styles.css を export(Approach 2 風)**:0.1.1 では未提供、consumer 側 codegen への path に統一されている。**不採用**。

### staticCss

- **otibo-ui の README/Intent §I が指定する 7 recipe をそのまま受け入れる** ← 採用。
- **page で実際に使う component だけに絞る**(本 task では Button + Field のみ):page 実装が増えるたびに staticCss を継ぎ足す flow に。**不採用** ── 「library が canonical な staticCss list を持つ」grain を consumer が破ると memory `panda-dynamic-component-staticcss` の趣旨と擦れる。canonical 通りに常時 emit する。

### Base UI の install 経路

- **`dependencies` に入れる**(採用):otibo-dev は `@otibo/ui` の component を直接使う + 将来 Base UI を直接使う可能性もある(library が wrap していない primitive)。consumer の app dep として install。
- **`devDependencies`**:`@otibo/ui` の peer 解消だけが目的ならこれでも動くが、runtime に必要な hook が含まれるので意味的におかしい。**不採用**。

### 試験描画 component の選択

- **Button + Field**(採用):form の最小単位。Field は composite(Label / Input / Description)で slot + recipe + accessibility(label ↔ input 関連付け)が動いていることを 1 つで確認できる。
- **Button + Field + Link**:Link は Next.js の `next/link` との wrap を考える必要がある(otibo-ui の Link は plain anchor 想定)。本 task では Link を除く ── App-Feat-11 完了直後の page 実装で `<Link render={<NextLink ... />} />` の pattern を立てる予定で、その時に確認する。
- **より多くの component**:scope crawl。本 task は「統合が動く」までで、network 全 component の hover 確認は別 task。

### `app/page.tsx` の境界

- **Server Component のまま**(採用):0.1.1 で directive が library 側にあるので、consumer は `"use client"` を書かない。Server Component の利点(初回 payload 小、SEO)を保つ。
- **page 全体を `"use client"`**:不要。library 側で済んでいる。**不採用**。

### font

- **system fallback で進める**(採用、本 task scope):「動かしてみる」の grain に従い、最小で動く state を先に確認。font は theme の手触りに大きく影響するが、別 task で扱う。
- **`gen-interface-jp` を consumer に install**:otibo-ui で Ladle 用 devDep として入っている。otibo-dev 側にも入れるかは page 実装で grain を見てから判断。**本 task では入れない**。

## Rationale

- **Approach 4 の正本通り**:canonical Intent(`otibo-ui/_docs/intent/Pkg/initial-public-publish/decision.md` §I)の consumer 設定を一字一句そのまま反映する。README の `js/cjs` glob 表記は古いので follow しない(別 task で otibo-ui README を訂正する)。
- **staticCss は library canonical を尊重**:consumer 毎に判断すると ad-hoc になり、`@otibo/ui` を別 consumer から使うとき(将来の penne portfolio 等)に整合性が崩れる。library が「これらは常時 emit」と明示している以上、consumer は素直に倣う。
- **Server Component のままにする**:RSC を捨てる選択は long-term の Next.js path から逸れる。library が境界を担保している前提を活かす。
- **試験描画は最小**:scope を絞って verification を清く保つ。component の網羅確認は portfolio page 実装(別 task)で実使用に晒すのが筋。

## Consequences / Impact

- **`panda.config.ts` の構造変化**:`presets: []` → `presets: [otiboPreset]`、`include` に buildinfo path 追加、`staticCss` block 追加、`importMap` 追加。**App-Feat-10 で立てた空 preset 構造を上書き** ── scaffold が変わるが期待通り。
- **`globals.css` 拡張可能性**:現状 `@layer reset, base, tokens, recipes, utilities;` だけ。otibo-ui の preset が `globalCss` を持つ場合は Panda が自動 emit。consumer 側で `@import "./styled-system/styles.css"` のような明示 import は不要(Panda が postcss 経由で挿入)。
- **bundle size**:`@otibo/ui` + `@base-ui-components/react` が install される。production build の `/` route の First Load JS は scaffold 時点で 87 kB だったが、Button + Field を載せた page では 100 kB 前後に増える見込み。**本 task で測る**(verification 記録)。
- **後続 task への影響**:portfolio page 実装(未起票、App-Feat-11 完了後に起票)では、本 task で確立した import grammar(`import { Button, Field } from "@otibo/ui"` + preset 継承)を踏襲。
- **otibo-ui README の訂正**:`include` の `js/cjs` glob 表記は古い、buildinfo 1 ファイル方式が canonical。本 task の verification で気付いた齟齬を follow-up TODO として記録。

## Discovered during implementation(2026-06-21)

### Field 等 namespace export は Next.js RSC で trap、consumer は flat export を使う

実装中に発見。otibo-ui は **同じ component を 2 形式で export** している:

1. **namespace object**:`Field.Root` / `Field.Label` / `Field.Input` / `Field.Description` / `Field.Error`(README の Usage 例で示される形式)
2. **flat named export**:`FieldRoot` / `FieldLabel` / `FieldInput` / `FieldDescription` / `FieldError`(同じ component を別名で個別 export)

最初 namespace 形式(`<Field.Root>`)で書いたが、`next build` の static page prerender で:

```text
Error: Could not find the module
  "/home/.../node_modules/@otibo/ui/dist/index.js#Field#Root"
  in the React Client Manifest.
```

Next.js App Router の React Server Components bundler は **client component module への property access**(`Field.Root`)を Client Manifest で resolve できない。Server Component が client component に値を渡すには、bundler が client side の symbol を tracking する必要があるが、namespace object のプロパティは static analysis で追えない。

**Decision**:consumer は **flat export を使う**(`FieldRoot` 等)。library 側で両方 export しているので migration cost なし。intent コメントを `app/page.tsx` に残した。

### otibo-ui 側への follow-up(別 task)

- README の Usage 例(`<Field.Root>` namespace)は **Next.js App Router consumer に対して trap**。RSC consumer 向けに「flat export を推奨」の note を README に追加すべき。
- 同様の namespace export がある component(`Card.Root`、`Tabs.Root`、`Toast.Root` 等)も同じ問題を抱える可能性が高い。library 側で全 namespace export に「RSC では flat 推奨」の docs note を入れるか、namespace export 自体を deprecate するか別 task で判断。

## Non-decisions(本 task で決めないこと)

- **font の選定**(`gen-interface-jp` を consumer 側に載せるか、別の日本語 font を選ぶか):portfolio page 実装で grain を見てから決める。
- **theme override / accent custom**:default preset(accent `oklch(0.40 0.11 265)`)で進める。portfolio page で違和感が出たら別 task。
- **どの component を本実装で使うか**:本 task は試験描画。実 page は別 task。
- **deployment(Cloudflare Pages 等)の設定**:scaffold 同様、まだ。
- **dark mode / theme switching**:preset の挙動次第。本 task では一旦 default(light)で動かす。

## 関連

- TODO: `App-Feat-11`
- Plan: `_docs/plan/App/ui-integration/plan.md`
- QA: `_docs/qa/App/ui-integration/test-plan.md`
- 上流 task: `App-Feat-10`(scaffold)
- canonical(library 側 Intent §I): `otibo-ui/_docs/intent/Pkg/initial-public-publish/decision.md`
- memory: [[otibo-two-track-structure]] [[otibo-real-goal]] [[otibo-npm-publish]] [[panda-dynamic-component-staticcss]] [[otibo-accent-direction]] [[otibo-color-layering]]
