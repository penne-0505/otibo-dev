---
title: "QA Test Plan: docs-driven template v1.0.0 migration"
status: active
draft_status: n/a
qa_status: in-progress
risk: High
qa_schema: 2
created_at: 2026-07-22
updated_at: 2026-07-22
references:
  - "_docs/intent/Workflow/docs-template-v1-migration/decision.md"
  - "_docs/archives/plan/Workflow/docs-template-v1-migration/plan.md"
  - "_docs/qa/Workflow/docs-template-v1-migration/artifacts/inventory.tsv"
related_issues: []
related_prs: []
---

# QA Test Plan: docs-driven template v1.0.0 migration

## Source of Intent

- TODO: `Workflow-Chore-21`
- Plan: `_docs/archives/plan/Workflow/docs-template-v1-migration/plan.md`
- Intent: `_docs/intent/Workflow/docs-template-v1-migration/decision.md`

## Quality Goal

release contractを再現可能に統合しながら、project customization、過去のmigration
history、outer artifact、nested shader WIPを一切migration diffへ混入させない。

## Acceptance Criteria

- AC-001: B/U/Pとcutoff evidenceがfull SHAで固定される。
- AC-002: union全pathとmigration-created artifactがinventoryで解決される。
- AC-003: release contractとproject customizationがpath単位でmergeされる。
- AC-004: template-self historyがactive project guidanceへ混入しない。
- AC-005: compatibilityとstrict schemaが別々に判定される。
- AC-006: lockがcompatibility PASS後の最後のmigration writeになる。
- AC-007: docs / fixtures / hooks / smoke / paired checksが成功する。
- AC-008: project regression、build、shader asset stabilityとprotected diffが成功する。
- AC-009: outer artifactとnested WIPがbefore / after evidenceで一致する。
- AC-010: detached child commit一つ、no push / no branch refで閉じる。

## Decision Review Scope

- DEC-001: legacy bootstrapとcutoffの根拠。
- DEC-002: inventoryによるpath completeness。
- DEC-003: release機能とtemplate-self historyの分離。
- DEC-004: compatibility / strict schema境界。
- DEC-005: lock advancement順序。
- DEC-006: isolated child commitとconcurrent work保全。
- DEC-007: release self-audit hookのscope-preserving adoption。

## Intent-derived Invariants

None

## Risk Assessment

- Risk level: High
- Risk rationale: migration、CI、validator、agent hooks / skills、provenanceを横断する。
- Regression risk: project固有fixture / hook調整の上書き、active guidance混入、schema過剰移行。
- Data safety risk: outer untracked / ignored artifactとnested WIPの巻き戻しまたは誤stage。
- Security / privacy risk: `.env.local`を読まず、sensitive-file guardを維持する。
- UX risk: app / runtime / shader挙動変更は禁止し、buildとsource diffで確認する。
- Agent misbehavior risk: branch mixing、blind replacement、premature lock、bulk schema
  migration、template-self history導入、outer artifact操作、summary countだけでの完了。

## Test Strategy

- Unit: validator fixtures、hook unit tests。
- Integration: unscoped / ACMR scoped docs wrapper、workflow smoke、paired skill compare。
- E2E: production deployは対象外。static buildとdeploy dry-runを非侵襲に実行する。
- Manual QA: B blob provenance、inventory disposition、lock、strict schema、protected paths。
- Validator / static check: full markdown lint、Git provenance、front-matter type / wrong /
  unknown / duplicate checks、diff check。
- Diff review: P..HEAD、B..U、inventory zero-missing、app / runtime / source / tests /
  shader / feature docsのraw diff。

## Test Matrix

| ID | Source | Requirement / Optional Invariant | Test Type | Command / File | Expected Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AC-001 | TODO | provenance / cutoff | git + hash review | B/U/P blob / status commands | tag SHA、96/96、cutoff hash一致 | verified |
| AC-002 | TODO | inventory completeness | generated artifact + diff | inventory TSV / zero-missing script | unionとfinal diffにmissingなし | verified |
| AC-003 | TODO | selective merge | three-way diff review | U / P / final blob比較 | local customizationとrelease契約を保持 | verified |
| AC-004 | TODO | template-self exclusion | exact path check | inventory disposition / `test ! -e` | lifecycle meta-work 4 pathを導入しない | verified |
| AC-005 | TODO | staged schema verdict | validator + schema list | docs wrapper / verification | compatibilityとstrictを別記 | verified |
| AC-006 | TODO | final lock write | Git diff chronology + JSON | `docs-template.lock.json` | tag / full SHAがUと一致 | verified |
| AC-007 | TODO | workflow validation | validator / unit / static | docs / fixtures / hooks / smoke / paired | 全件PASS | verified |
| AC-008 | TODO | behavior preservation | regression + diff | lint / typecheck / test / build / shader hash | tests PASS、protected diff 0 | verified |
| AC-009 | TODO | concurrent work preservation | status / inode / hash | outer / nested before-after | countとhashが一致 | verified |
| AC-010 | TODO | commit topology | Git graph review | `git rev-list` / refs / status | Pの子一つ、no branch / push | verified |

## Manual QA Checklist

- [x] U tagは指定full SHAへ解決し、moving branchを使っていない。
- [x] project root commitはBの96 pathすべてとbyte-identicalである。
- [x] inventoryのmerge / keep / defer dispositionをpath単位で読む。
- [x] lockを作る前にcompatibility checksがPASSしている。
- [x] strict schemaで意味を変更したlegacy docがないことを確認する。

## Regression Checklist

- [x] project-only runtime / tests / shader / durable feature docsを変更していない。
- [x] source差分はBiome false positive抑制のcomment-onlyである。
- [x] prior migration Intent / QA / verificationを変更していない。
- [x] frontend-design / temporary preview skillsを保持している。
- [x] hookの削除 / sensitive-file guardとscope boundaryを保持している。
- [x] outer / nested evidenceがbefore / afterで一致する。

## High-risk Checklist

- [x] Rollback / recoveryはouter main未変更のdetached worktree隔離で確保した。
- [x] Data safety対象をouter artifact / nested WIPとしてcutoffに固定した。
- [x] `.env.local`を読まないsecurity / privacy boundaryを確認した。
- [x] fixture / hook / build failure modeとresidual riskをverificationへ残す。

## Out of Scope

- deploy、push、main更新、branch ref作成。
- app / UI / shader改善とlegacy schema一括移行。
- migration以外のdraft / plan / survey cleanup。

## Open Questions

None.
