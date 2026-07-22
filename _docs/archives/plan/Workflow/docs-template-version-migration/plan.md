---
title: "docs-driven template why-first版への移行計画"
status: superseded
draft_status: n/a
created_at: 2026-07-17
updated_at: 2026-07-17
references:
  - "_docs/intent/Workflow/docs-template-version-migration/decision.md"
  - "_docs/qa/Workflow/docs-template-version-migration/test-plan.md"
related_issues: []
related_prs: []
---

# docs-driven template why-first版への移行計画

## Overview

`otibo-dev`の導入元template commit `c1dc332`から、公開main
`778d9b9`とwhy-first branch `511f44e`までの運用変更を統合する。
project固有の文書と未コミット作業を保持し、legacy文書は必要なものだけ
schema v2へ移行する。

## Scope

- standards、templates、validator、fixtures、CI、hook、agent skillsの同期。
- `2026-07-17T16:12:12.651316957+09:00`以前から存在した文書の棚卸し。
- 判断の意味、QA契約、コード参照を変更するIntent / QAのschema v2移行。
- 既存intent参照コメントの`DEC-*` / strict `INV-*`への再分類。
- template由来Workflow meta-work文書11件の削除と参照解消。
- 今後のversion migrationを再現するproject-local skillの作成。

## Non-Goals

- `codex/metacognitive-audit-hooks` branchの取り込み。
- カットオフ後に並行作成された文書の移行。
- UI、shader、asset、runtime挙動の変更。
- legacy Intent / QAのschema v2への一括変換。
- draft / plan / surveyの一般的なarchive整理。

## Requirements

- **Functional**:
  - upstream provenanceとbranch境界を検証可能な形で残す。
  - project固有変更をupstream同期で上書きしない。
  - v2へ移行したIntentは`DEC-*`ごとに`What`、`Why`、
    `Change freedom`を持つ。
  - v2へ移行したQAはDecision Review Scope / Decision Conformanceを持つ。
  - コードコメントは現在値の固定ではなく、判断の因果へ到達できる。
- **Non-Functional**:
  - 既存の未コミット変更を保持する。
  - post-cutoffの並行作業をmigration scopeへ混入させない。
  - validator PASSだけでsemantic migration完了と判断しない。
  - runtime/UI diffはコメント変更に限定する。

## Tasks

1. upstream差分を機械同期可能・project統合・削除・対象外に分類する。
2. current working treeをsource of truthとして既存文書を棚卸しする。
3. standards / validator / hook / skillをproject固有内容と統合する。
4. 対象Intent / QAとコードコメントをwhy-firstへ移行する。
5. meta-work文書11件を削除し、参照とfixturesを更新する。
6. 得られた教訓をtemplate migration skillへ一般化する。
7. validator、hook test、docs lint、関連project testを実行する。
8. verificationとcleanupを確定する。

## QA Plan

- QA document:
  `_docs/qa/Workflow/docs-template-version-migration/test-plan.md`
- Risk level: Medium
- Test strategy:
  - Unit: validator fixture / hook unit test。
  - Integration: `./scripts/check-docs.sh`。
  - E2E: 対象外。runtime変更を行わない。
  - Manual QA: upstream diff、branch provenance、semantic DEC / INV review。
  - Validator / static check: markdownlint、front-matter、links、intent、QA。
- AC-001〜AC-008をTest Matrixへ割り当てる。
- DEC-001〜DEC-006のWhyとChange freedomをDecision Conformanceで確認する。
- agent misbehaviorとして、bulk migration、parallel docs混入、project変更の
  上書き、別branch混入、INVの機械的renameを確認する。

## Deployment / Rollout

- 同一branch / HEAD上で既存未コミット変更と共存させる。
- application runtimeのdeployは行わない。
- 問題時はmigration対象diffだけをcommit単位でrevertできる構成を保つ。
