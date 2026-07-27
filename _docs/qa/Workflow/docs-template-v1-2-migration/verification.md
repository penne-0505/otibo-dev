---
title: "QA Verification: docs-driven template v1.2.0 migration"
status: active
draft_status: n/a
qa_status: verified
risk: High
qa_schema: 2
created_at: 2026-07-28
updated_at: 2026-07-28
references:
  - "_docs/intent/Workflow/docs-template-v1-2-migration/decision.md"
  - "_docs/archives/plan/Workflow/docs-template-v1-2-migration/plan.md"
  - "_docs/qa/Workflow/docs-template-v1-2-migration/test-plan.md"
  - "_docs/qa/Workflow/docs-template-v1-2-migration/artifacts/inventory.tsv"
related_issues: []
related_prs: []
---

# QA Verification: docs-driven template v1.2.0 migration

## Summary

B / U / P provenance、normalized consumer inventory、TypeScript validator / hook、
frontmatter fixtures、project regression、lock chronology、旧`.mjs`削除権限、active
main / nested worktree preservationを確認した。

## Verification Verdict

Verdict: PASS

Compatibility migration: PASS。Strict schema migration: 対象なし。legacy Intent / QAの
意味変更や一括schema変換を行っていない。Overall verdictはPASS。

## Commands Run

```bash
./scripts/check-docs.sh
DD_TEST_TMPDIR=/tmp \
  DD_SCOPE_BASE=a50b827c3bdb6f99d4c29422df73d492ed1b5f5f \
  DD_SCOPE_DIFF_FILTER=ACMR ./scripts/check-docs.sh
npx --yes markdownlint-cli2 "_docs/**/*.md" "_evals/**/*.md" \
  "README.md" "AGENTS.md" "TODO.md" "QUICKSTART.md" \
  "!_docs/archives/**/*" "!_docs/standards/templates/**/*" \
  --config .markdownlint.jsonc
npx biome check app
npm run typecheck
npm test
npm run build
npm run deploy:dry-run
git diff --check
git ls-remote https://github.com/penne-0505/docs_driven_dev_template.git \
  'refs/tags/v1.0.0*' 'refs/tags/v1.1.0*' 'refs/tags/v1.2.0*'
git -C /tmp/otibo-docs-template-migration.9sDwne/upstream \
  rev-parse 'v1.2.0^{commit}'
sha256sum /tmp/otibo-docs-template-migration.9sDwne/evidence/before/*
sha256sum /tmp/otibo-docs-template-migration.9sDwne/evidence/after-isolated/*
git diff --name-only 5a78491594d15b82843cfdfaaecfa505aef97129 -- \
  app public package.json package-lock.json next.config.mjs panda.config.ts wrangler.jsonc
git diff --diff-filter=D --name-only \
  5a78491594d15b82843cfdfaaecfa505aef97129 -- scripts
```

## Automated Test Results

| Command / Test | Result | Notes |
| --- | --- | --- |
| unscoped / ACMR docs wrapper | PASS | TypeScript validator、fixture、hook unit / smokeが成功。 |
| markdownlint | PASS | 120 files、0 issues。 |
| Biome | PASS | `app/` 22 files、0 fixes。 |
| app typecheck | PASS | Deno scripts分離後にexit 0。 |
| Vitest | PASS | 2 files / 19 tests。 |
| static build | PASS | 8 public routesを生成。 |
| Wrangler dry-run | PASS | 495 assets、bindingなし、uploadなし。 |
| inventory | PASS | 259 path、final changed path missing 0。 |
| paired skills | PASS | 9 skillsが`.agents` / `.claude`でbyte-identical。 |

## Manual QA Results

| Checklist Item | Result | Notes |
| --- | --- | --- |
| provenance | PASS | B=`v1.0.0` / `f71e9ab...`、U=`v1.2.0` / `a7fb411...`。 |
| starter normalization | PASS | root router / `starter/`を導入せずconsumer pathへ対応付けた。 |
| authorized removal | PASS | owner許可と削除された旧`.mjs` 10件が一致。 |
| strict schema boundary | PASS | legacy docsの一括変換なし。 |
| protected paths | PASS | app / public / package / deploy configの差分0。 |
| outer / nested preservation | PASS | status / staged / unstaged / untracked hash全7件一致。 |

## Acceptance Criteria Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| AC-001 | PASS | B / U / P full SHAとbefore / after hash一致。 |
| AC-002 | PASS | normalized inventory 259 path、final diff missing 0。 |
| AC-003 | PASS | TypeScript scripts、fixtures、standards、reader docs、paired skillsを統合。 |
| AC-004 | PASS | owner許可済み旧`.mjs` 10件のみ削除、protected diff 0。 |
| AC-005 | PASS | compatibility後にlockをv1.2.0へ更新、strict schema対象なし。 |
| AC-006 | PASS | docs、lint、typecheck、test、build、dry-runが成功。 |
| AC-007 | PASS | isolated candidateとactive dirty hashを分離し、unrelated pathを含まない。 |
| AC-008 | PASS | Deno wrapperとapp typecheckが個別に成功。 |

## Decision Conformance

| ID | Result | Notes |
| --- | --- | --- |
| DEC-001 | PASS | `starter/`をconsumer rootへ正規化しrouterを除外した。 |
| DEC-002 | PASS | runner / scripts / fixtures / docsを一体でTypeScriptへ移行した。 |
| DEC-003 | PASS | isolated worktreeとbefore evidenceを使用している。 |
| DEC-004 | PASS | compatibility PASS後にlockを更新し、strict schemaを分離した。 |
| DEC-005 | PASS | write-time / Stopのworkflow-sensitive testが成功した。 |
| DEC-006 | PASS | Deno scriptsをapp compilerから分離し、双方を検証した。 |

## Invariant Coverage

None

## Deferred / Not Covered

None

## Residual Risks

None

## Follow-up TODOs

None
