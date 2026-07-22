---
title: "docs-driven template v1.0.0 migration plan"
status: active
draft_status: n/a
created_at: 2026-07-22
updated_at: 2026-07-22
references:
  - "_docs/intent/Workflow/docs-template-v1-migration/decision.md"
  - "_docs/qa/Workflow/docs-template-v1-migration/test-plan.md"
  - "_docs/qa/Workflow/docs-template-v1-migration/artifacts/inventory.tsv"
related_issues: []
related_prs: []
---

# docs-driven template v1.0.0 migration plan

## Overview

pre-v1.0.0の導入base `c1dc3322351f2e11361334b9184c9c70fe5c7565`
から、推奨release `v1.0.0`のfull SHA
`f71e9ab20466ea2972158334261f5ae2b2265754`へ移行する。project cutoffは
local `main`の`b674980a4f49d180703436d0cb84500329ac91fe`とし、isolated
detached worktree内だけで統合する。

## Scope

- B/U/P union全pathを二軸分類し、resolutionとfinal dispositionをTSVへ残す。
- release provenance、reader docs、paired migration skills、lifecycle hooks、
  validator / workflow evalをproject固有変更とmergeする。
- compatibility checks後に初回`docs-template.lock.json`を作成する。
- 旧migrationのIntent / QA / verificationとproject固有app / runtime / source /
  tests / shader / docsを保持する。
- outer checkoutとnested shader worktreeの不変性を前後hashで検証する。

## Non-Goals

- legacy Intent / QAの一括schema v2変換。
- template repo自身のPlan / Intent / QA履歴をactive guidanceとして導入すること。
- app、runtime、UI、shader、asset、project feature docsの変更。
- outer checkoutのuntracked / ignored artifact、`.env.local`、nested WIPへの操作。
- push、local `main`更新、branch ref作成、deploy。

## Requirements

- **Functional**:
  - tagとfull SHAでUを固定し、96/96 B path一致によるlegacy bootstrap根拠を残す。
  - upstream deltaとproject relationを独立分類し、`apply` / `merge` / `keep` /
    `remove` / `defer`以外のresolutionを使わない。
  - template-self historyとrelease機能を区別し、exact pathでdispositionを決める。
  - lockはreconciliationとcompatibility PASSの後にだけUへ進める。
- **Non-Functional**:
  - generated artifactを含むfinal diffがinventoryから漏れない。
  - unscopedとACMR scopedの両docs modeを維持する。
  - hook self-auditはscope拡張権限を与えず、既存の削除 / sensitive-file guardを保持する。
  - project regressionとgenerated shader assetの再現性を維持する。

## Tasks

1. cutoff、provenance、baseline、docs inventoryを固定する。
2. B/U/P unionとmigration-created artifactをinventory TSVへ分類する。
3. Uの新規validator / fixture / hook / skillを内容確認後に統合する。
4. customized shared pathをthree-way mergeし、project-only pathを保持する。
5. template-self historyを導入対象から除外し、exact dispositionを記録する。
6. compatibility gate後にlockを最後のmigration writeとして作成する。
7. QA review、protected diff、zero-missing、outer / nested preservationを検証する。
8. detached HEADへPの子commitを一つ作成する。

## QA Plan

- QA document: `_docs/qa/Workflow/docs-template-v1-migration/test-plan.md`
- Risk level: High
- Test strategy:
  - Unit: type-specific validator fixtures、hook unit tests。
  - Integration: unscoped / ACMR scoped`./scripts/check-docs.sh`、workflow smoke。
  - E2E: deployは対象外。production buildとWrangler dry-runは非侵襲な範囲で確認する。
  - Manual QA: provenance、inventory、template-self history、strict schema境界、
    outer / nested preservation。
  - Validator / static check: full markdown lint、paired skill、front-matterの
    wrong / unknown / duplicate fixture、Git provenance、diff check。
- AC-001〜AC-010をTest Matrixへ割り当てる。
- DEC-001〜DEC-007のWhyとChange freedomをDecision Conformanceで確認する。
- branch mixing、blind replacement、premature lock、bulk schema migration、
  outer artifact混入、template-self history混入をagent misbehaviorとして確認する。

## Deployment / Rollout

- `/tmp/docs-template-v1-rollout/otibo-dev`のdetached HEADだけで実施する。
- application deploy、push、branch作成、main更新を行わない。
- rollbackはPへ戻る別worktreeの破棄で可能だが、このrunでは恒久削除を行わない。
