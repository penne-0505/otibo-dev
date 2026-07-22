---
title: "QA Verification: docs-driven template v1.0.0 migration"
status: active
draft_status: n/a
qa_status: verified
risk: High
qa_schema: 2
created_at: 2026-07-22
updated_at: 2026-07-22
references:
  - "_docs/intent/Workflow/docs-template-v1-migration/decision.md"
  - "_docs/archives/plan/Workflow/docs-template-v1-migration/plan.md"
  - "_docs/qa/Workflow/docs-template-v1-migration/test-plan.md"
  - "_docs/qa/Workflow/docs-template-v1-migration/artifacts/inventory.tsv"
related_issues: []
related_prs: []
---

# QA Verification: docs-driven template v1.0.0 migration

## Summary

B/U/P provenance、release reconciliation、front-matter fixtures、hook / smoke、
project regression、inventory、outer / nested preservation、commit topologyを確認した。

## Verification Verdict

Verdict: PASS

Compatibility migration: PASS。Strict schema migration: 対象なし（legacy Intent /
QAの意味変更と一括変換を行っていない）。Overall verdictはPASS。

## Commands Run

```text
./scripts/check-docs.sh
DD_TEST_TMPDIR=/home/penne/.cache/docs-dd-test-tmp \
  DD_SCOPE_BASE=a50b827c3bdb6f99d4c29422df73d492ed1b5f5f \
  DD_SCOPE_DIFF_FILTER=ACMR ./scripts/check-docs.sh
npx --yes markdownlint-cli2 "_docs/**/*.md" "_evals/**/*.md" \
  "README.md" "AGENTS.md" "TODO.md" "QUICKSTART.md" \
  "!_docs/archives/**/*" "!_docs/standards/templates/**/*" \
  --config .markdownlint.jsonc
npm run lint
npm run typecheck
npm test
npm run build
npm run deploy:dry-run
node --check scripts/generate-light-height-map.mjs
node --check scripts/blend-light-height-maps.mjs
deno fmt --check scripts/generate-light-height-map.mjs \
  scripts/blend-light-height-maps.mjs
glslangValidator -S frag public/first-view/light.frag
git -C /home/penne/dev/tools/templates/docs_driven_dev_template \
  rev-parse 'refs/tags/v1.0.0^{commit}'
git diff --name-status --no-renames \
  b674980a4f49d180703436d0cb84500329ac91fe..HEAD
comm -23 \
  <(git diff --name-only --no-renames \
    b674980a4f49d180703436d0cb84500329ac91fe..HEAD | sort) \
  <(awk -F '\t' 'NR > 1 { print $2 }' \
    _docs/qa/Workflow/docs-template-v1-migration/artifacts/inventory.tsv | sort)
git rev-list --count \
  b674980a4f49d180703436d0cb84500329ac91fe..HEAD
git branch --show-current
```

## Automated Test Results

| Command / Test | Result | Notes |
| --- | --- | --- |
| baseline unscoped / ACMR docs | PASS | Pで両mode成功 |
| migrated unscoped / ACMR docs | PASS | fixture、hook、smokeを含む |
| Docs CI ACMR scope | PASS | adoption base full SHAと`DD_SCOPE_DIFF_FILTER: ACMR`を固定 |
| full markdown lint | PASS | 111 files、0 issues。P-only draft末尾を1行だけ修正 |
| front-matter fixtures | PASS | valid、wrong schema/type、unknown、duplicate |
| project lint | PASS | current migration tree 27 files、0 warning / error |
| typecheck / Vitest | PASS | TypeScript exit 0、2 files / 19 tests |
| build / Wrangler dry-run | PASS | 8 public routes、495 assets、uploadなし |
| shader checks | PASS | GLSL compile、generator syntax / format、asset hash前後一致 |
| inventory | PASS | TSV 249 rows、union 237 + artifact 12、missing / duplicate / invalid 0 |

## Manual QA Results

| Checklist Item | Result | Notes |
| --- | --- | --- |
| B / U provenance | PASS | initial 96/96 blob一致、tag full SHA一致 |
| template-self history | PASS | lifecycle 4 docsはdefer、hookはDEC-007へanchor |
| strict schema boundary | PASS | legacy一括変換なし |
| outer preservation | PASS | status 255、page 254、path / inode / ignored hashがbeforeと一致 |
| nested preservation | PASS | 5 tracked WIP、status / diff / cached diff hashがbeforeと一致 |

## Acceptance Criteria Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| AC-001 | PASS | full SHA、96/96、cutoff hash |
| AC-002 | PASS | union / final working diff zero-missing、duplicate 0 |
| AC-003 | PASS | release contractとproject customizationをmerge |
| AC-004 | PASS | template-self 4 docsをdefer |
| AC-005 | PASS | compatibility / strictを分離 |
| AC-006 | PASS | compatibility後にlockを作成しtag / SHA一致 |
| AC-007 | PASS | docs / fixtures / hooks / smoke / paired |
| AC-008 | PASS | lint / typecheck / test / build / dry-run / shader checks |
| AC-009 | PASS | outer / nested before-after hash一致 |
| AC-010 | PASS | parent P、child count 1、detached HEAD、branch refなし |

## Decision Conformance

| ID | Result | Why the implementation remains aligned |
| --- | --- | --- |
| DEC-001 | PASS | content evidenceとtagでlegacy bootstrapを固定 |
| DEC-002 | PASS | TSVとunion / working diffを双方向再計算 |
| DEC-003 | PASS | behaviorとtemplate-self historyを分離 |
| DEC-004 | PASS | legacy schemaの意味を推測していない |
| DEC-005 | PASS | compatibility PASS後にlockをUへ進めた |
| DEC-006 | PASS | isolated worktreeのdetached child commit一つに閉じた |
| DEC-007 | PASS | scope非拡張をhook testsで確認 |

## Invariant Coverage

None

## Deferred / Not Covered

None

## Residual Risks

None

## Follow-up TODOs

None
