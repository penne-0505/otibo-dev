---
title: "QA Test Plan: docs-driven template why-first migration"
status: active
draft_status: n/a
qa_status: in-progress
risk: Medium
qa_schema: 2
created_at: 2026-07-17
updated_at: 2026-07-17
references:
  - "_docs/intent/Workflow/docs-template-version-migration/decision.md"
  - "_docs/archives/plan/Workflow/docs-template-version-migration/plan.md"
related_issues: []
related_prs: []
---

# QA Test Plan: `docs-driven template why-first migration`

## Source of Intent

- TODO: `Workflow-Chore-20`
- Plan: `_docs/archives/plan/Workflow/docs-template-version-migration/plan.md`
- Intent: `_docs/intent/Workflow/docs-template-version-migration/decision.md`

## Quality Goal

upstreamの運用改善を、project固有変更・並行作業・legacy intentの意味を
失わずに統合し、同種migrationを再現可能にする。

## Acceptance Criteria

- AC-001: base / main / why-first / excluded branchが正しく分離される。
- AC-002: cutoff後の並行文書とUI作業をmigration scopeへ含めない。
- AC-003: semantic change対象だけschema v2へ移行する。
- AC-004: template meta-work文書11件と残存参照が除去される。
- AC-005: intent参照コメントをDEC / strict INVへ再分類し、挙動を変えない。
- AC-006: project固有変更と未コミット作業を保持する。
- AC-007: reusable migration skillが両agent系で一致する。
- AC-008: docs / validator / hook / project regression checksが成功する。

## Decision Review Scope

- DEC-001: upstream provenanceとbranch exclusion。
- DEC-002: cutoffと並行作業の隔離。
- DEC-003: legacy schemaの段階移行。
- DEC-004: template meta-workの除去。
- DEC-005: DEC / INV code traceability。
- DEC-006: migration processのskill化。

## Intent-derived Invariants

- INV-001: excluded branchを混入しない。
- INV-002: post-cutoff並行文書を編集・削除しない。
- INV-003: legacy文書を一括変換しない。
- INV-004: template meta-work文書11件を残さない。
- INV-005: runtime/UI挙動を変更しない。

## Risk Assessment

- Risk level: Medium
- Risk rationale: documentation workflow、validator、CI、agent skill、
  code traceabilityへ横断的に影響する。
- Regression risk: project固有ガイダンスの上書き、link切れ、legacy docの
  過剰契約化、未コミット作業の巻き戻し。
- Data safety risk: 永続データは扱わない。文書11件の削除はユーザー承認済み。
- Security / privacy risk: secretや`.env`を扱わない。
- UX risk: runtime/UIは対象外。コメント以外の挙動差分を禁止する。
- Agent misbehavior risk: branchの無断合成、bulk schema migration、
  validator PASSだけでの完了、post-cutoff文書の混入、project変更の上書き。

## Test Strategy

- Unit: validator fixtures、hook unit test。
- Integration: `./scripts/check-docs.sh`。
- E2E: runtime変更がないため対象外。
- Manual QA: upstream commit graph、semantic DEC / INV classification、
  cutoff後file監査。
- Validator / static check: markdownlint、front-matter、links、intent、QA。
- Diff review: template delta、deleted path、comment-only source diff、
  skill parity、excluded branch fingerprint。

## Test Matrix

| ID | Source | Requirement / Optional Invariant | Test Type | Command / File | Expected Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AC-001 | TODO | upstream範囲 | git diff review | template clone / repository diff | `511f44e`まで、`34ac6a4`固有変更なし | verified |
| AC-002 | TODO | cutoff隔離 | file inventory | cutoff記録 / final status | post-cutoff並行文書をmigration diffへ含めない | verified |
| AC-003 | TODO | selective schema v2 | validator + review | `validate-intent.mjs` / schema一覧 | v2は意味を変更した文書のみ | verified |
| AC-004 | TODO | meta-work除去 | static check | exact path / `rg` | 11件なし、active linkなし | verified |
| AC-005 | TODO | code traceability | diff + test | source comments / related tests | DEC / INVが因果に対応し挙動差分なし | verified |
| AC-006 | TODO | customization保全 | diff review | pre-existing dirty paths | user changesが保持される | verified |
| AC-007 | TODO | migration skill | static + smoke | `.agents` / `.claude` | 内容一致、triggerとcompletion criteriaあり | verified |
| AC-008 | TODO | validation closure | integration | `./scripts/check-docs.sh`ほか | required checks PASS | verified |
| INV-001 | DEC-001 | excluded branch | git diff review | `34ac6a4` fingerprint | UserPromptSubmit自己監査変更を含まない | verified |
| INV-002 | DEC-002 | post-cutoff除外 | status review | file timestamps / diff | 並行新規文書の編集なし | verified |
| INV-003 | DEC-003 | no bulk migration | schema count review | `_docs/intent` / `_docs/qa` | untouched legacy markerなし | verified |
| INV-004 | DEC-004 | no template meta-work | static check | exact 11 paths | すべて不在 | verified |
| INV-005 | DEC-005 | no runtime change | source diff + tests | app / scripts / public | コメント以外のmigration差分なし | verified |

## Manual QA Checklist

- [x] v2 IntentごとにWhyとChange freedomが現在値の言い換えでない。
- [x] INVがactive decision下の全実装で守る結果に限定される。
- [x] code commentの一行要約から完全なDEC / INVへ到達できる。
- [x] project固有AGENTS / README / TODO内容が保持される。
- [x] newly introduced migration skillが今回固有commitを規則として固定しない。

## Regression Checklist

- [x] pre-existing dirty pathsを巻き戻していない。
- [x] deleted meta-work以外のpersistent docsを削除していない。
- [x] runtime/UI/assetのmigration由来変更がない。
- [x] markdown linkとfront-matterが有効。
- [x] legacy docsが新validatorで引き続き受理される。

## Out of Scope

- `codex/metacognitive-audit-hooks`。
- post-cutoffの並行文書。
- UI / shader / asset behaviorの改善。
- 全legacy文書のschema v2移行。

## Open Questions

None.
