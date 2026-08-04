---
title: "docs-driven template v1.3.0 migration plan"
status: active
draft_status: n/a
created_at: 2026-08-04
updated_at: 2026-08-04
references:
  - "_docs/intent/Workflow/docs-template-v1-3-migration/decision.md"
  - "_docs/qa/Workflow/docs-template-v1-3-migration/test-plan.md"
  - "_docs/qa/Workflow/docs-template-v1-3-migration/artifacts/inventory.tsv"
related_issues: []
related_prs: []
---

# docs-driven template v1.3.0 migration plan

## Overview

採用済みrelease `v1.2.0` / `a7fb411edb8974d0c4418fc675edc829c7600728`
から、推奨release `v1.3.0` / `98f5f13cef68abb81305a425249a27a70cda2669`
へtag-to-tag migrationする。project cutoffはHEAD
`1e743d256ea81d085c622c48f4b32dabfb97785f`と2026-08-04T18:11:40+09:00の
dirty evidenceで固定し、統合と検証はisolated detached worktreeで行う。

## Scope

- `qa_schema: 3`とTransferable Principlesのstandards / templates / validators / fixturesを統合する。
- `post-implementation` / `qa-review` / prep skillsをpaired treeで同期する。
- agent workflow evalとsmoke testを更新する。
- compatibility PASS後に`docs-template.lock.json`をv1.3.0へ更新する。
- isolated candidateを検証し、active treeにはmigration対象pathだけを反映する。

## Non-Goals

- 既存`qa_schema: 2`文書の一括schema変換。
- Transferable Principles candidateのIntentへの自動昇格。
- app、public asset、First View、product content、dependency、deploy設定の変更。
- stale draft 5件の整理またはarchive。
- active tree / nested worktreeのWIP整理、commit、巻き戻し。
- commit、push、deploy。

## Requirements

- **Functional**:
  - B / U tagをpeeled full SHAへ解決し、moving branchをprovenanceに使わない。
  - v3 marker、verification section、validator、fixtures、skillsを同じrelease単位で統合する。
  - v2 compatibilityを維持し、strict schema migrationとは別判定にする。
  - lockはreconciliationとcompatibility PASS後の最後のmigration writeにする。
- **Non-Functional**:
  - 既存v1.2.0 inventory 259行とpost-v1.2 deltaを合成し、B / U / P unionを解決する。
  - baseline stale failureを新規regressionとして扱わない。
  - active dirty status / diff / file hashとnested worktree hashを最終反映後に再確認する。
  - paired skillsはbyte-identicalに保つ。

## Tasks

1. provenance、cutoff、baseline validator resultを固定する。
2. inherited inventoryとB→U / post-v1.2 / dirty cutoff deltaを統合する。
3. current skill contractでPlan / Intent / QAを準備する。
4. upstream-owned unmodified 26パスをv1.3.0へ統合する。
5. target validatorでunchanged legacy docsのv2 compatibilityを確認する。
6. migration QAをv3へ移行し、lockを最後に更新する。
7. docs wrapper、fixtures、workflow smoke、paired skills、project regressionを検証する。
8. active treeへmigration pathだけを反映し、dirty cutoff保全を再確認する。

## QA Plan

- QA document: `_docs/qa/Workflow/docs-template-v1-3-migration/test-plan.md`
- Risk level: High
- Unit: frontmatter / QA validator fixtures、agent workflow smoke。
- Integration: docs wrapper、v2 / v3 compatibility、paired skills。
- Regression: markdownlint、lint、typecheck、test、build、deploy dry-run、protected-path diff。
- Manual: tag peeling、inventory、lock chronology、dirty cutoff。
- Agent misbehavior: moving tip、blind replacement、premature lock、bulk schema migration、candidate自動昇格、dirty WIP混入を確認する。

## Deployment / Rollout

- candidateは`/tmp/otibo-docs-template-v1-3.eGFRBW/project`で構築する。
- active treeへの反映前にcandidate diffとinventoryを照合する。
- userの明示依頼がないためcommit / push / deployは行わない。
- 問題時はcandidateを採用せず、active treeのcutoffを変更しない。
