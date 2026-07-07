---
title: "QA Test Plan: design system full adoption"
status: active
draft_status: n/a
qa_status: in-progress
risk: Medium
created_at: 2026-07-11
updated_at: 2026-07-11
references:
  - "_docs/intent/Site/design-system-full-adoption/decision.md"
  - "_docs/plan/Site/design-system-full-adoption/plan.md"
related_issues: []
related_prs: []
---

# QA Test Plan: `Site-Refactor-19`

## Source of Intent

- TODO: `Site-Refactor-19`
- Plan: `_docs/plan/Site/design-system-full-adoption/plan.md`
- Intent: `_docs/intent/Site/design-system-full-adoption/decision.md`

## Quality Goal

design system token / primitiveへ全面移行し、既存の情報構造と光表現を壊さず、改善判断に使える
system-first baselineを作る。

## Acceptance Criteria

- AC-001: systemで表現可能なvisual valueがtokenを使う。
- AC-002: 対応するprimitiveを公開ページで使用する。
- AC-003: shader固有表現とsection順を維持する。
- AC-004: desktop / mobile / legalの回帰がない。
- AC-005: automated / Workers gateが成功する。

## Intent-derived Invariants

- INV-001: token化可能な新規literalを置かない。
- INV-002: shader / fallback固有色を変更しない。
- INV-003: composition / section順を変更しない。
- INV-004: system適用結果を独自scaleで補正しない。
- INV-005: static exportを維持する。

## Risk Assessment

- Risk level: Medium
- Risk rationale: 全公開routeのspacing、typography、surfaceへ作用する。
- Regression risk: First View、折返し、media rail、legal table、focus、horizontal overflow。
- Data safety risk: なし。
- Security / privacy risk: 法務本文とリンク先を変更しない。
- UX risk: system scale適用で密度と階層が変化する。
- Agent misbehavior risk: visual tuningを混ぜてsystem適用結果を隠すこと。

## Test Strategy

- Automated: lint、typecheck、unit、static build、Workers dry-run。
- Static: CSS token / literal scan、primitive import scan。
- Manual: 1440x900 / 390x844 top、media rail、legal prose / table / CTA / focus。
- Diff review: shader固有値、本文、section順の維持。

## Test Matrix

| ID | Source | Requirement / Invariant | Test Type | Command / File | Expected Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AC-001 | TODO | visual token全面適用 | static + computed | CSS / browser | token参照とcomputed value | verified |
| AC-002 | TODO | primitive適用 | static + browser | TSX / DOM | system class | verified |
| AC-003 | TODO | shaderと順序維持 | diff + browser | First View / `/` | 表現と順序維持 | verified |
| AC-004 | TODO | responsive / legal回帰なし | browser | desktop / mobile / legal | overflow・可読性・操作 | verified |
| AC-005 | TODO | build gate | automated | npm scripts | all pass | verified |
| INV-001 | intent | literal抑制 | static review | CSS | token化可能literalなし | verified |
| INV-002 | intent | 光学表現維持 | diff review | First View CSS | 固有色差分なし | verified |
| INV-003 | intent | composition維持 | diff review | TSX | section順差分なし | verified |
| INV-004 | intent | baselineを補正しない | diff review | CSS | system scaleを使用 | verified |
| INV-005 | intent | Workers維持 | build | dry-run | success | verified |

## Manual QA Checklist

- [x] desktop / mobileでFirst Viewとsection順を確認する。
- [x] heading / body / eyebrowのsystem typographyをcomputed styleで確認する。
- [x] media railを横移動できる。
- [x] legal tableとaccount deletion CTAを確認する。
- [x] Link / Buttonのfocus-visible recipeを確認する。
- [x] system適用後の改善候補を記録する。

## Regression Checklist

- [x] document-level horizontal overflowがない。
- [x] shader canvas / fallbackの色と幾何を変更していない。
- [x] legal本文・URL・metadataを変更していない。
- [x] static route listとWorkers configを維持する。

## Out of Scope

- system適用後の個別visual tuning。
- production deploy。

## Open Questions

- なし。
