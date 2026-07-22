---
title: "docs-driven template v1.0.0 migration boundary"
status: active
draft_status: n/a
intent_schema: 2
created_at: 2026-07-22
updated_at: 2026-07-22
references:
  - "_docs/archives/plan/Workflow/docs-template-v1-migration/plan.md"
  - "_docs/qa/Workflow/docs-template-v1-migration/test-plan.md"
  - "_docs/qa/Workflow/docs-template-v1-migration/artifacts/inventory.tsv"
related_issues: []
related_prs: []
---

# docs-driven template v1.0.0 migration boundary

## Context

`otibo-dev`はtemplate commit `c1dc332`とbyte-identicalな96 pathから開始し、
project code、shader、docsと、tag以前の複数template branch laneを選択統合している。
release `v1.0.0`はそれらを一つの推奨更新単位にまとめ、provenance lockと
legacy bootstrap契約を追加する。moving branchや現在のtemplate treeを単純copyすると、
project customization、過去のlane境界、並行WIPのいずれかを失う可能性がある。

## Decisions

### DEC-001: legacy bootstrapをB/U/Pの固定証拠で行う

- **What**: Bは初期project treeとの96/96 blob一致、Uは`v1.0.0` tagとfull SHA、
  Pはowner-approved local main SHAとouter / nested cutoff evidenceで固定する。
- **Why**: downstreamにB commit objectや旧lockがなくても、内容一致とcutoffを分離すれば
  baseと並行作業を推測せず再構成できるため。
- **Change freedom**: 後続migrationはlockのtag / SHAをBに使える。cutoffの保存形式は、
  staged / unstaged / untrackedと並行worktreeを再現できる限り変更できる。

### DEC-002: path inventoryを統合の制御面にする

- **What**: B/U/P unionとmigration-created artifactを一行一pathで記録し、upstream
  delta、project relation、5値resolution、disposition、rationaleを持たせる。
- **Why**: summary countだけではcustomized shared pathやgenerated artifactの欠落を検出できず、
  blind replacementや無言のdeferを防げないため。
- **Change freedom**: TSVの補助列や生成手順は変更できるが、unionとfinal diffの
  zero-missing再計算ができる情報は保持する。

### DEC-003: release機能とtemplate-self historyを分離する

- **What**: standards、skills、hooks、eval、provenance contractは統合し、template repo自身の
  lifecycle-self-audit Plan / Intent / QAはactive project guidanceへ導入しない。downstreamの
  既存migration recordとfrontend-design skillはproject-owned history / customizationとして保持する。
- **Why**: release機能は必要だが、その開発履歴をproject decisionとして読むと正典が二重化するため。
- **Change freedom**: template-self historyのexact pathはreleaseごとに再分類する。project側で
  独立に採用したdecision recordは、単なるupstream historyではない証拠があれば保持できる。

### DEC-004: compatibilityとstrict schemaを別判定にする

- **What**: validator互換性とrelease contractの統合をcompatibility migrationとして検証し、
  strict schemaは今回意味を変更するlegacy Intent / QAがあるかを別に判定する。
- **Why**: release更新を理由にlegacy decisionのWhyを現在の推測で一括生成すると、将来の変更幅を
  偽の契約で狭めるため。
- **Change freedom**: 後続taskで意味を変更するlegacy docは、その時点の根拠に基づいて
  schema v2へ個別移行できる。

### DEC-005: provenance lockを最後のmigration writeにする

- **What**: `docs-template.lock.json`はU filesのreconciliationとcompatibility PASS後に作成し、
  `v1.0.0`とfull SHAだけを採用revisionとして記録する。
- **Why**: 先にlockを進めると、未統合または失敗したtreeを完了済みrevisionとして後続作業へ
  誤表示するため。
- **Change freedom**: lock schemaはupstream contractに従って将来versioningできるが、
  strict schema状態やproject cutoffを混在させない。

### DEC-006: migrationをisolated child commitへ閉じる

- **What**: Pから作ったdetached external worktreeだけを編集し、outer artifactsとnested WIPを
  before / after hashで確認して、Pの子commit一つを作る。
- **Why**: active mainやshader worktreeと同じworking treeで統合すると、migration diffと
  concurrent workを区別できず、artifactの巻き戻しや誤stageにつながるため。
- **Change freedom**: ownerが明示した場合はbranch worktreeを使えるが、ownership、cutoff、
  protected paths、push境界は同様に固定する。

### DEC-007: releaseのself-audit hookをscope-preserving contextとして採用する

- **What**: `UserPromptSubmit`の短い反証確認、write前の非局所影響確認、Stop時の
  複数観点auditを採用するが、いずれも合意済みScopeを拡張する権限として扱わない。
- **Why**: releaseのhook挙動を導入しつつ、template repo自身の開発履歴を参照先にすると
  downstreamで存在しないdecisionへcode anchorが残り、保守者が理由を追えなくなるため。
- **Change freedom**: event名、文面、audit観点は、短さ、書き込み境界、scope非拡張、
  検証代替にしないという目的を保つ限り変更できる。

## Consequences / Impact

- migration diffはworkflow / docs infrastructureとmigration evidenceに限定される。
- project code、shader、assets、feature docsはPと同じblobを保持する。
- U treeとの完全一致ではなく、inventoryで説明可能なdownstream reconciliationが完了条件になる。
- 後続migrationは初回lockをBとしてtag-to-tag経路を使える。

## Quality Implications

- inventoryとfinal diffの双方向coverageを機械確認する。
- hook / fixture / smokeはproject-local調整を保持したままrelease contractを満たす。
- outer / nested preservationはpath countだけでなくstatus / inode / diff hashで確認する。
- compatibility PASSとstrict schemaの非変更判定を別々に記録する。

## Intent-derived Invariants

None

## Enforced in (optional)

- DEC-001 / DEC-006: cutoff evidenceとbefore / after preservation check。
- DEC-002 / DEC-003: `_docs/qa/Workflow/docs-template-v1-migration/artifacts/inventory.tsv`。
- DEC-004 / DEC-005: migration verificationとlock review。
- DEC-007: `scripts/agent-workflow-hook.mjs`とhook unit / smoke tests。

## Rollback / Follow-ups

- commitを採用しない場合はouter mainを変更せず、detached childを破棄可能な状態に保つ。
- legacy schema更新は、各project decisionの意味を変更する後続taskで個別に扱う。
