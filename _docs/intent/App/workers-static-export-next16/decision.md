---
title: "Intent: Keep Next.js on Workers Static Assets"
status: active
draft_status: n/a
intent_schema: 2
created_at: 2026-07-10
updated_at: 2026-07-17
references:
  - "_docs/plan/App/workers-static-export-next16/plan.md"
  - "_docs/qa/App/workers-static-export-next16/test-plan.md"
  - "_docs/intent/Site/first-view-light-shader/decision.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/intent/App/workers-static-export-next16/decision.md -->

## Context

公開先は Cloudflare Workers から変更できない。現行サイトは Next.js の `output: "export"` と
Wrangler Static Assets によって Worker script なしで配布できる。一方、Next.js 14 と React 18 は
First View の本番統合前に更新が必要であり、`@otibo/ui@0.2.0` は React 19 と Panda CSS 1.11 を
consumer baseline として利用できる。

## Decisions

### DEC-001: production artifactをstatic exportへ閉じる

- **What**: Next.jsの`output: "export"`で生成する`out/`を
  Cloudflare Workers Static Assetsへ配布する。
- **Why**: 固定されたWorkers custom domainとasset deliveryを使いながら、
  静的siteに不要なserver runtimeを持ち込まないため。
- **Change freedom**: framework version、route、asset構成は変更できる。
  artifact形式を変える場合はdeployment判断を更新する。

### DEC-002: server runtimeを要件発生まで導入しない

- **What**: Worker script、OpenNext adapter、runtime bindingを追加しない。
- **Why**: 現在のrouteはstatic export可能で、server runtimeの運用面と
  bundleを増やす理由がないため。
- **Change freedom**: runtime要件が発生した場合は、別Intentとmigration QAを
  作成して変更できる。
- **Why not**: OpenNextの先行導入は、使わないruntimeの保守面を増やす。

### DEC-003: page環境値をbuild-time valueとして扱う

- **What**: `process.env`由来のpage値はNext build時に確定し、
  Workers runtime bindingとは説明しない。
- **Why**: production artifactが静的HTML / assetsであり、request時に
  runtime値を解決しないため。
- **Change freedom**: build valueの供給元は変更できる。runtime bindingへ
  変える場合はDEC-002も更新する。

### DEC-004: frameworkとdeployment toolを再現可能にする

- **What**: Next.js 16 / React 19、Node.js 22以上、lockfile内Wranglerを
  install / build / deploy baselineとする。
- **Why**: First View統合前にframework migrationを閉じて回帰原因を分離し、
  global WranglerとCIのdeploy behavior差を防ぐため。
- **Change freedom**: compatibility gateを満たすversionへ更新できる。
  package version自体は恒久契約にしない。

## Consequences / Impact

- Next.js runtime feature は採用できない。必要になった時点で別の intent と migration QA が必要になる。
- 環境変数の変更は、runtime binding の変更ではなく再 build / 再 deploy を要する。
- Node.js 20 環境は install / build baseline の対象外になる。
- Workers の asset-only deployment には Worker observability や compatibility flag を追加しない。

## Quality Implications

- `next build` 成功だけでなく `out/` と Wrangler dry-run の両方を deployment gate にする。
- dependency tree と Panda codegen を upgrade regression の検査対象にする。
- route が runtime feature を参照していないことを diff review と build output で確認する。

## Intent-derived Invariants

- INV-001 (from DEC-001): production artifactはNext.js static exportの`out/`である。
- INV-002 (from DEC-002): asset-only判断がactiveな間、deploy構成にWorker script、OpenNext adapter、runtime bindingを追加しない。
- INV-003 (from DEC-003): build-time valueをWorkers runtime environment variableとして扱わない。

## Enforced in (optional)

- DEC-001 / INV-001: `next.config.mjs`、`out/`、Wrangler assets directory。
- DEC-002 / INV-002: `wrangler.jsonc`とdeploy dry-run。
- DEC-003 / INV-003: page source、QUICKSTART、build/deploy手順。
- DEC-004: package engine、lockfile、local npm scripts。

## Rollback / Follow-ups

- server runtimeが必要になるまではasset-only構成を維持する。必要になった場合は
  DEC-001〜DEC-003を更新する別migrationとして扱う。
- 関連判断:
  `_docs/intent/Site/first-view-light-shader/decision.md`、
  `_docs/intent/App/top-page-initial/decision.md`。
