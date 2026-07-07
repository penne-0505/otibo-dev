---
title: "Plan: design system full adoption"
status: active
draft_status: n/a
created_at: 2026-07-11
updated_at: 2026-07-11
references:
  - "_docs/intent/Site/design-system-full-adoption/decision.md"
  - "_docs/qa/Site/design-system-full-adoption/test-plan.md"
  - "_docs/qa/App/otibo-ui-0-3-migration/verification.md"
related_issues: []
related_prs: []
---

# Plan: design system full adoption

## Overview

`@otibo/ui@0.3.0`への接続だけでなく、公開ページのvisual foundationをsystem tokenとprimitiveへ
全面的に寄せる。適用後の画面をbaselineとして、改善が必要な箇所を観察可能にする。

## Scope

- `app/globals.css`のbackgroundをsemantic color tokenへ移行する。
- First Viewのwordmark typographyをsystem tokenへ寄せる。
- top pageのcolor、spacing、size、radius、typographyをsystem tokenへ移行する。
- legal layoutとaccount deletion CTAをsystem token / primitiveへ移行する。
- desktop / mobile / legalのbrowser QAを行い、改善候補をverificationへ記録する。

## Non-Goals

- shader、fallback gradient、placeholder surfaceの表現固有色をsystem paletteへ強制変換すること。
- system適用後に見つかった改善候補を、評価前に独自値で補正すること。
- page compositionをCard等へ置換すること。

## Requirements

- system tokenが存在する値はliteralよりtokenを優先する。
- fluid responsive値はtokenをclampの端点またはcontainer値として使う。
- system primitiveが対応するinteractive / structural elementではprimitiveを使う。
- site固有layoutはCSS Modulesに残す。
- static export / Workers asset-only deploymentを維持する。

## Tasks

1. CSS literalをsemantic / scale tokenへ対応づける。
2. global、First View、top page、legal CSSを移行する。
3. account deletion CTAをButton primitiveへ移行する。
4. static grepとautomated gateを実行する。
5. desktop / mobile / legalをbrowserで比較し、改善候補を記録する。

## QA Plan

- `_docs/qa/Site/design-system-full-adoption/test-plan.md`に従う。
- CSS literal scanはtoken化可能な値と表現固有値をdiff reviewで分類する。
- 1440x900 / 390x844でtop pageとlegal routeを確認する。

## Deployment / Rollout

- production deployは行わない。
- static buildとWrangler dry-runまでを完了条件にする。
