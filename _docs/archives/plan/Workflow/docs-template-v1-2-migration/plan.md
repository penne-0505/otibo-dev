---
title: "docs-driven template v1.2.0 migration plan"
status: active
draft_status: n/a
created_at: 2026-07-28
updated_at: 2026-07-28
references:
  - "_docs/intent/Workflow/docs-template-v1-2-migration/decision.md"
  - "_docs/qa/Workflow/docs-template-v1-2-migration/test-plan.md"
  - "_docs/qa/Workflow/docs-template-v1-2-migration/artifacts/inventory.tsv"
related_issues: []
related_prs: []
---

# docs-driven template v1.2.0 migration plan

## Overview

採用済みrelease `v1.0.0`のfull SHA
`f71e9ab20466ea2972158334261f5ae2b2265754`から、推奨release
`v1.2.0`のfull SHA `a7fb411edb8974d0c4418fc675edc829c7600728`へ
tag-to-tag migrationを行う。project cutoffはlocal `main`の
`5a78491594d15b82843cfdfaaecfa505aef97129`とし、統合と検証はisolated
detached worktree内で行う。

## Scope

- `starter/`配下を導入済みprojectのrootへ正規化したconsumer treeでB / U / Pを比較する。
- TypeScript validator / hook、fixtures、CI、standards、reader docs、paired skillsを統合する。
- Deno用`scripts/*.ts`をapp TypeScript compilerから分離する。
- ownerが許可した旧`.mjs` validator / hook scripts 10件を削除する。
- compatibility PASS後に`docs-template.lock.json`をv1.2.0へ更新する。
- active mainの既存staged / unstaged / untracked内容を保全し、migration pathだけをcommitする。

## Non-Goals

- upstream template repo自身の`starter/`やrouter `AGENTS.md`を導入済みprojectへ追加すること。
- legacy Intent / QAの一括schema変換。
- app、UI、shader、asset、feature docsの変更。
- active mainの既存dirty内容を整理、commit、または巻き戻すこと。
- application deploy。

## Requirements

- **Functional**:
  - B / U tagをpeeled full SHAへ解決し、moving branchをprovenanceに使わない。
  - upstream path relocationをconsumer-rootへ正規化し、移動を削除と誤認しない。
  - project customizationはshared pathごとにthree-way mergeする。
  - lockはcompatibility checks後の最後のmigration writeにする。
- **Non-Functional**:
  - inventoryとfinal diffを双方向に照合し、未分類pathを残さない。
  - unscoped / ACMR scoped validatorの両modeを維持する。
  - active mainのcutoff hashをpush後まで維持する。
  - main commitはmigration対象だけを含み、既存index内容を含めない。

## Tasks

1. provenance、cutoff、baseline validatorを固定する。
2. normalized B / U consumer treeとPのunion inventoryを生成・reviewする。
3. new validators / fixtures / hooksをlegacy-compatible modeで導入する。
4. standards、CI、reader docs、paired skillsをpath単位でmergeする。
5. owner許可済みの旧`.mjs` 10件を削除する。
6. compatibility gate後にlockを更新し、verificationを作成する。
7. qa-review、project regression、cutoff preservation、diff coverageを確認する。
8. migration対象だけをactive mainへ適用してcommit / pushする。

## QA Plan

- QA document: `_docs/qa/Workflow/docs-template-v1-2-migration/test-plan.md`
- Risk level: High
- Unit: validator fixtures、hook unit / smoke。
- Integration: unscoped / ACMR scoped docs wrapper、paired skill、CI config review。
- Regression: lint、typecheck、test、build、deploy dry-run、protected path diff。
- Manual: provenance、starter normalization、deletion authority、lock chronology、dirty cutoff。
- Agent misbehavior: moving tip、root router導入、blind replacement、premature lock、bulk schema
  migration、unrelated staging、dirty WIP混入を確認する。

## Deployment / Rollout

- migration実装は`/tmp/otibo-docs-template-migration.9sDwne/project`で行う。
- verification PASS後、対象patchだけをactive `main`へ適用し、path限定commitを作る。
- `origin/main`の進行をfetchで確認し、競合や非fast-forwardがあれば自動解決せず停止する。
- push後にremote SHAとlocal `main`の一致を確認する。

このPlanはIntentとQAへ昇華済みであり、実装完了後にarchive checklistを満たして
`_docs/archives/plan/Workflow/docs-template-v1-2-migration/plan.md`へ移送した。
