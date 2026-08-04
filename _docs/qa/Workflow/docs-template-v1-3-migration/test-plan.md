---
title: "QA Test Plan: docs-driven template v1.3.0 migration"
status: active
draft_status: n/a
qa_status: in-progress
risk: High
qa_schema: 3
created_at: 2026-08-04
updated_at: 2026-08-04
references:
  - "_docs/intent/Workflow/docs-template-v1-3-migration/decision.md"
  - "_docs/archives/plan/Workflow/docs-template-v1-3-migration/plan.md"
  - "_docs/qa/Workflow/docs-template-v1-3-migration/artifacts/inventory.tsv"
related_issues: []
related_prs: []
---

# QA Test Plan: docs-driven template v1.3.0 migration

## Source of Intent

- TODO: `Workflow-Chore-25`
- Plan: `_docs/archives/plan/Workflow/docs-template-v1-3-migration/plan.md`
- Intent: `_docs/intent/Workflow/docs-template-v1-3-migration/decision.md`

## Quality Goal

v1.3.0のv3 QA contractを一体として統合しながら、v2 recordの履歴、project customization、
active / nested worktreeのWIPを変更しない。

## Acceptance Criteria

- AC-001: B / U / Pとdirty cutoffがfull SHA / hash evidenceで固定される。
- AC-002: inherited inventory、B→U 26パス、post-v1.2 delta、dirty cutoffが解決される。
- AC-003: v3 contract一式が統合され、v2 / v3 compatibility fixtureが成功する。
- AC-004: standards / templates / evals / paired skillsが同期する。
- AC-005: protected app / asset / feature / WIP pathにmigration由来差分がない。
- AC-006: baseline stale draft failureとmigration regressionが分離される。
- AC-007: compatibility後にlockがv1.3.0へ進み、tag / SHAが一致する。
- AC-008: qa-reviewとproject regressionが成功し、compatibility / strict schemaが別判定される。

## Decision Review Scope

- DEC-001: v3 producer / validator contractの一体性。
- DEC-002: candidate昇格のowner authority。
- DEC-003: v2 compatibilityとstrict schemaの分離。
- DEC-004: dirty tree isolation。
- DEC-005: lock chronology。

## Intent-derived Invariants

None

## Risk Assessment

- Risk level: High
- Regression risk: v3 markerだけ、validatorだけ、またはskillだけが先行するcontract分裂。
- Data safety risk: active / nested worktreeのWIPをcandidateまたは最終diffへ混入すること。
- Security / privacy risk: `.env*`実値を読まず、外部scriptはreview後にだけ実行する。
- Operations risk: stale draft baselineをmigration failureと混同し、無関係なcleanupへscope拡大すること。
- Agent misbehavior risk: moving tip、blind replacement、premature lock、bulk schema migration、
  candidate自動昇格、unrelated staging。

## Test Strategy

- Unit: validator fixtures、agent workflow smoke。
- Integration: docs wrapper、v2 / v3 schema coexistence、paired skills。
- Regression: markdownlint、lint、typecheck、test、build、deploy dry-run。
- Manual QA: tag peeling、inventory、lock chronology、cutoff preservation。
- Diff review: candidate paths、protected paths、active before / after hashes。

## Test Matrix

| ID | Source | Requirement / Optional Invariant | Test Type | Command / File | Expected Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AC-001 | TODO | provenance / cutoff | git + hash review | tag / status / diff hashes | B / U / Pとcutoff一致 | verified |
| AC-002 | TODO | inventory completeness | artifact + diff | `inventory.tsv` / name-status | unresolved / missing 0 | verified |
| AC-003 | TODO | v2 / v3 compatibility | validator fixtures | `./scripts/check-docs.sh` | v2 / v3 valid PASS、invalid reject | verified |
| AC-004 | TODO | paired workflow contract | static + hash | standards / templates / skill compare | target files同期 | verified |
| AC-005 | TODO | protected path preservation | diff + hash | app / public / feature / WIP review | migration差分0 | verified |
| AC-006 | TODO | baseline separation | before / after comparison | docs wrapper result | stale 5件のみ既知、new failure 0 | verified |
| AC-007 | TODO | lock chronology | JSON + git review | lock / tag peel | final write、U SHA一致 | verified |
| AC-008 | TODO | closure regression | automated + qa-review | lint / typecheck / test / build / dry-run | required gates PASS | verified |

## Manual QA Checklist

- [x] v1.2.0 / v1.3.0 tagが記録full SHAへpeelされる。
- [x] 26 upstream pathのproject relationがhash evidenceと一致する。
- [x] 既存v2 QA docsを一括変換していない。
- [x] Transferable Principles candidateをIntentへ自動昇格していない。
- [x] lock更新前にcompatibility checksがPASSする。
- [x] active / nested cutoff evidenceがbefore / afterで一致する。

## Regression Checklist

- [x] app / asset / feature docs / dependencies / deploy configにmigration差分がない。
- [x] `.agents` / `.claude` paired skillsがbyte-identicalである。
- [x] v2 verification fixtureとv3 valid / invalid fixturesが期待通り判定される。
- [x] baseline stale draft 5件以外のfrontmatter failureがない。

## High-risk Checklist

- [x] isolated candidateにより反映前のrollback / recoveryを確保した。
- [x] active / nested statusとdiff hashをdata safety evidenceとして保存した。
- [x] `.env*`を読まないsecurity boundaryを確認した。
- [x] lockをcompatibility PASS後の最後のmigration writeにした。
- [x] verificationにresidual riskとcompatibility / strict schema verdictを残した。

## Out of Scope

- stale draft cleanup、既存QA一括schema移行、app / asset / feature変更、commit / push / deploy。

## Open Questions

None.
