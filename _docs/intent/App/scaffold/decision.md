---
title: "Intent: Initial Next.js + Panda scaffold for otibo.dev"
status: active
draft_status: n/a
created_at: 2026-06-21
updated_at: 2026-06-21
references:
  - "_docs/plan/App/scaffold/plan.md"
  - "_docs/qa/App/scaffold/test-plan.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/intent/App/scaffold/decision.md -->

## Context

otibo.dev は otibo の企業/portfolio site であり、ここからすべての app(`/medo/*`, `/sarae/*`, `/tokushoho`, 制作物 portfolio)が枝分かれする。旧 otibo-dev repo は破棄して新規 clone した DDD template から再スタートする(2026-06-21)。本 task はその scaffold を立てるためのもので、全 App / Legal タスクの土台となる。

two-track 構造(otibo-dev は consumer、`@otibo/ui` は published library。memory: `otibo-two-track-structure`)を前提とし、otibo-ui で確立した ecosystem(Panda CSS + Base UI + biome + TS strict)を **何の摩擦もなく consumer 側に乗せる** ことが第一目的。`@otibo/ui@0.1.0` は既に npm public に publish 済(memory: `otibo-npm-publish`)。

## Decision

採用する stack を以下に固定する。

| 領域 | 採用 | 備考 |
| --- | --- | --- |
| Web framework | **Next.js (App Router)** | 14 系の latest stable。RSC + 静的 export 可。 |
| Language | **TypeScript strict** | `strict: true`、`noUncheckedIndexedAccess: true`。 |
| Styling | **Panda CSS** | otibo-ui との preset 互換が App-Feat-11 で必要。 |
| Lint / Format | **biome** | otibo-ui と同じ ecosystem。ESLint / Prettier は導入しない。 |
| Package manager | **npm** | otibo-ui と同じ。pnpm 移行は将来検討可だが本 task では入れない。 |
| Node baseline | **Node 20 LTS 以上**(`engines.node: ">=20"`) | volta 環境を想定。実環境は node 24 を確認(2026-06-21)。 |
| UI primitive | (App-Feat-10 では未導入) | `@base-ui-components/react` は `@otibo/ui` の peerDep として App-Feat-11 で入る。 |

## Alternatives

### Framework

- **Astro + React island**: portfolio 中心の純静的サイトには合うが、`@otibo/ui`(Base UI / state を持つ component)を載せた瞬間に island 境界の設計コストが乗る。後の管理画面 / API も視野に入ると framework 二重持ちのリスク。**不採用**。
- **Vite + React SPA**: SEO/法務 page の SSG/ISR と相性が悪い。`/medo/privacy` 等は crawler から見えるべき。**不採用**。
- **Remix**: SPA 寄りで SSR は強いが、static export の柔軟さ・ecosystem 量で Next.js を上回る決定打がない。**不採用**。

### Package manager

- **pnpm**: workspace / store の利点はあるが、本 repo は single-package で workspace 化の予定なし(otibo-ui は別 repo)。**不採用**。
- **bun**: 速度は魅力だが Panda / Next.js plugin 互換の検証コストを今支払いたくない。**不採用**。

### Lint

- **ESLint (+ next/eslint-config)**: Next.js default だが、otibo-ui で biome に統一済み。同じ ecosystem に揃えて grain を一致させる。**不採用**。

### CSS

- **Tailwind CSS**: Next.js default だが、otibo-ui の primitive を載せた瞬間に Panda preset を必須化する設計なので **混在は弊害のみ**。**不採用**。
- **vanilla-extract / styled-components**: token 共有を `@otibo/ui` から継承する仕組みが Panda の `presets` 経由しか整っていない。**不採用**。

### Node version

- **Node 18 LTS**: otibo-ui は `>=18` 互換だが、Next.js 14 系の minimum は 18.17。otibo-dev 側で 20 LTS を baseline にしておくと将来の Next.js 上げで詰まらない。**20 を採用**。

## Rationale

- **Next.js App Router**: portfolio(SSG)+ 法務 page(static)+ 将来の動的化(API route / 管理 UI)の全てを一つの framework に収められる。RSC は `@otibo/ui` の client component 境界と矛盾しない(library 側で `"use client"` を持つ component が必要に応じて client に落ちる)。
- **npm**: otibo-ui と同じ。複数 PM の混在は agent / 人間どちらにも読解負荷を増やすだけで、本 project の規模では利点が出ない。
- **Panda CSS**: App-Feat-11 で `@otibo/ui` の preset を `presets: [otiboPreset]` で継承する必要があり、最初から Panda で立てる以外の選択肢が事実上ない。Approach 4(buildinfo)に基づく consumer 統合は memory `otibo-npm-publish` 参照。
- **biome**: otibo-ui と config grain を揃える。lint rule の差異が PR 横断で揺れることを避ける。
- **TS strict**: otibo-ui が strict なので、consumer 側が緩いと型の意図が伝わらず実害が出る。最初から strict。

## Consequences / Impact

- **`@otibo/ui` 導入(App-Feat-11)** は scaffold 完了直後に必ず実行する前提。本 task では preset 統合まではやらず、Panda が build pipeline に乗っていることだけを確認する(空 preset / minimal token)。
- **biome は ESLint を置き換える**。Next.js default の `eslint-config-next` は導入しない。Next.js の lint rule(unused export 警告等)は biome では拾えないものがあるが、現状は許容する(将来必要なら別 task で検討)。
- **Node 20 LTS baseline**:CI / Vercel deploy で node version を pin する必要が出てきたら別 task。
- **Tailwind を入れない**:Next.js の `create-next-app` default UI は使えないので、manual scaffold で立てる。
- **app router の動的化路線は将来開く**。本 task は静的に倒した state(`/` だけ)を出すまでが scope。
- **`.gitignore` / `.npmrc`**:Panda の `styled-system/` を ignore する(library 側と同じ grain)。

## Non-decisions(本 task で決めないこと)

- portfolio の URL 設計(`/works/*`, `/penne/*` 等):App-Feat-10 では `/` のみ。情報設計は別 task。
- deployment target(Cloudflare Pages / Vercel / 自前):scaffold 段階では未確定で良い。`next build` が通ることだけ確認。
- accent / theme の最終確定:`otibo-accent-direction` で oklch(0.40 0.11 265) は決まっているが、App-Feat-10 では Panda preset を空に近い state で立てるので影響しない。

## 関連

- TODO: `App-Feat-10`
- Plan: `_docs/plan/App/scaffold/plan.md`
- QA: `_docs/qa/App/scaffold/test-plan.md`
- memory: [[otibo-two-track-structure]] [[otibo-real-goal]] [[otibo-npm-publish]]
- 後続: `App-Feat-11`(consumer integration)、`Legal-Feat-9`(legal pages)
