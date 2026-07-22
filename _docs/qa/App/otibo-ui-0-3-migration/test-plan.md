---
title: "QA Test Plan: @otibo/ui 0.3 migration"
status: active
draft_status: n/a
qa_status: in-progress
risk: Medium
qa_schema: 2
created_at: 2026-07-11
updated_at: 2026-07-17
references:
  - "_docs/intent/App/otibo-ui-0-3-migration/decision.md"
  - "_docs/plan/App/otibo-ui-0-3-migration/plan.md"
related_issues: []
related_prs: []
---

# QA Test Plan: `App-Refactor-18`

## Source of Intent

- TODO: `App-Refactor-18`
- Plan: `_docs/plan/App/otibo-ui-0-3-migration/plan.md`
- Intent: `_docs/intent/App/otibo-ui-0-3-migration/decision.md`

## Quality Goal

0.3.0の自己完結CSSへ移行し、consumer-side Pandaをbuild条件から外しても、公開routeと視覚基盤を維持する。

## Acceptance Criteria

- AC-001: 0.3.0とstyles.cssを使用する。
- AC-002: Panda / styled-system参照がruntime / build sourceにない。
- AC-003: 法務routeの内容・URL・可読性を維持する。
- AC-004: First Viewとtop page構成を維持する。
- AC-005: automated build / deploy gateが成功する。

## Decision Review Scope

- DEC-001: self-contained CSSとconsumer-side Panda非依存。
- DEC-002: library primitiveとpage compositionの所有境界。
- DEC-003: migration regressionとartifact削除の分離。

## Intent-derived Invariants

- INV-002: consumer-side Pandaを参照しない。

## Risk Assessment

- Risk level: Medium
- Risk rationale: global resetとCSS基盤が全routeへ作用する。
- Regression risk: shader sizing、legal typography、focus、mobile overflow。
- Data safety risk: なし。
- Security / privacy risk: 法務本文や環境値を変更しない。
- UX risk: reset競合とScrollAreaの操作性。
- Agent misbehavior risk: 不要artifactを無承認で削除すること。

## Test Strategy

- Automated: lint、typecheck、unit、static build、Workers dry-run。
- Integration: dependency tree、package export、全route生成。
- Manual QA: 1440x900 / 390x844 top、legal長文、horizontal media scroll。
- Static check: Panda / styled-system / internal import grep。
- Diff review: 法務本文・route metadata非変更。

## Test Matrix

| ID | Source | Requirement / Optional Invariant | Test Type | Command / File | Expected Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AC-001 | TODO | 0.3.0 styles | dependency + build | `npm ls` / `npm run build` | version / CSS load | verified |
| AC-002 | TODO | Panda非依存 | grep | app / package / config | runtime参照0 | verified |
| AC-003 | TODO | legal維持 | diff + browser | legal routes | content / URLs維持 | verified |
| AC-004 | TODO | top維持 | browser | `/` | 4段階と100svh | verified |
| AC-005 | TODO | gates | automated | npm scripts | all pass | verified |
| INV-002 | intent | codegenなし | grep | package / app | 参照0 | verified |

## Manual QA Checklist

- [x] desktop / mobileでFirst Viewと4段階順を確認する。
- [x] mobile media railを横移動できる。
- [x] legal長文の見出し、表、CTA、footerを確認する。
- [x] UI Linkのfocus-visible recipeが読み込まれ、既存のkeyboard focus contractを維持する。

## Regression Checklist

- [x] route listとmetadataを変更していない。
- [x] document-level horizontal overflowがない。
- [x] shader canvas / fallbackを壊していない。
- [x] Panda codegenなしでinstall / build可能なpackage contractになっている。

## Out of Scope

- top pageの最終visual tuning。
- Panda artifactの恒久削除。

## Open Questions

- なし。
