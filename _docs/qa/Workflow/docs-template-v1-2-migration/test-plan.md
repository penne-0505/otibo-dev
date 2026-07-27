---
title: "QA Test Plan: docs-driven template v1.2.0 migration"
status: active
draft_status: n/a
qa_status: in-progress
risk: High
qa_schema: 2
created_at: 2026-07-28
updated_at: 2026-07-28
references:
  - "_docs/intent/Workflow/docs-template-v1-2-migration/decision.md"
  - "_docs/archives/plan/Workflow/docs-template-v1-2-migration/plan.md"
  - "_docs/qa/Workflow/docs-template-v1-2-migration/artifacts/inventory.tsv"
related_issues: []
related_prs: []
---

# QA Test Plan: docs-driven template v1.2.0 migration

## Source of Intent

- TODO: `Workflow-Chore-22`
- Plan: `_docs/archives/plan/Workflow/docs-template-v1-2-migration/plan.md`
- Intent: `_docs/intent/Workflow/docs-template-v1-2-migration/decision.md`

## Quality Goal

v1.2.0のconsumer-facing contractを再現可能に統合しながら、project customizationと
active mainのdirty WIPをmigration commitへ混入させない。

## Acceptance Criteria

- AC-001: B / U / Pとactive main cutoffがfull SHAとhash evidenceで固定される。
- AC-002: normalized B / U / P unionの全pathがinventoryで解決される。
- AC-003: TypeScript validator / hook、fixtures、CI、standards、paired skillが統合される。
- AC-004: owner許可済みの旧`.mjs` 10件だけが削除され、protected pathsに差分がない。
- AC-005: compatibilityとstrict schemaが別判定され、lockが最後にv1.2.0へ進む。
- AC-006: docs checks、project regression、inventory / provenance checkが成功する。
- AC-007: mainへ適用するcandidate diffがmigration対象だけを含み、既存dirty内容を含まない。
- AC-008: Deno validatorとNext.js appの型検査境界が分離され、両方が成功する。

## Decision Review Scope

- DEC-001: initialized project向けconsumer tree normalization。
- DEC-002: TypeScript validator / hook移行の一体性。
- DEC-003: dirty mainとmigration commitの分離。
- DEC-004: staged schema boundaryとlock chronology。
- DEC-005: workflow-sensitive riskのwrite-time / closure通知。
- DEC-006: Deno validatorとapp TypeScript compilerの分離。

## Intent-derived Invariants

None

## Risk Assessment

- Risk level: High
- Regression risk: local / CI runner分裂、project customization上書き、root router混入。
- Data safety risk: active mainのstaged artifact、feature docs、nested worktreeの誤commit。
- Security / privacy risk: `.env*`の実値を読まず、sensitive-file guardを維持する。
- UX risk: app / UI / shader behavior変更は禁止する。
- Agent misbehavior risk: branch tip採用、literal starter copy、blind replacement、premature
  lock、bulk schema migration、unrelated staging、dirty WIP巻き込み。

## Test Strategy

- Unit: TypeScript validator fixtures、hook unit tests。
- Integration: unscoped / ACMR scoped docs wrapper、workflow smoke、paired skill compare。
- Regression: lint、typecheck、unit test、build、deploy dry-run。
- Manual QA: tag peeling、consumer path mapping、deletion list、lock chronology、main commit scope。
- Diff review: normalized inventory、P..migration、protected paths、before / after cutoff hash。

## Test Matrix

| ID | Source | Requirement / Optional Invariant | Test Type | Command / File | Expected Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AC-001 | TODO | provenance / cutoff | git + hash review | tag / status / diff hashes | B / U / Pとcutoff一致 | verified |
| AC-002 | TODO | inventory completeness | generated artifact | `inventory.tsv` coverage check | missing / duplicate 0 | verified |
| AC-003 | TODO | consumer contract integration | validator / static | docs wrapper / paired check | all checks PASS | verified |
| AC-004 | TODO | authorized deletion / protected paths | exact diff review | name-status / protected diff | 旧`.mjs` 10件のみ、feature差分0 | verified |
| AC-005 | TODO | staged schema / lock | chronology + JSON | compatibility / lock review | separate verdict、U SHA一致 | verified |
| AC-006 | TODO | regression | automated | lint / typecheck / test / build / dry-run | baseline比の新規失敗0 | verified |
| AC-007 | TODO | main candidate scope | diff review | candidate paths / dirty hashes | unrelated path 0、dirty hash一致 | verified |
| AC-008 | TODO | runtime別typecheck | automated | docs wrapper / `npm run typecheck` | Denoとapp双方がPASS | verified |

## Manual QA Checklist

- [x] v1.0.0 / v1.2.0 tagが記録full SHAへpeelされる。
- [x] Uの`starter/`をconsumer rootへ正規化し、routerを導入していない。
- [x] old `.mjs` deletion listがowner許可の10件と一致する。
- [x] lock更新前にcompatibility checksがPASSする。
- [x] main candidate diffに既存dirty内容が含まれない。

## Regression Checklist

- [x] project runtime / feature docs / shader / testsにmigration由来差分がない。
- [x] paired `.agents` / `.claude` skillが同期している。
- [x] local wrapperとDocs CIが同じTypeScript scriptsを実行する。
- [x] dirty outer / nested evidenceがbefore / afterで一致する。

## High-risk Checklist

- [x] isolated worktreeによりpush前のrollback / recoveryを確保した。
- [x] active mainとnested worktreeのstatus / diff hashをdata safety evidenceとして保存した。
- [x] deletion authorityをownerから明示取得した。
- [x] `.env*`を読まないsecurity boundaryを確認した。
- [x] verificationにPASS根拠とresidual riskなしを記録した。

## Out of Scope

- app deploy、UI / shader変更、legacy schema一括変換、dirty WIPの整理。

## Open Questions

None.
