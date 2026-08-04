---
title: "QA Verification: docs-driven template v1.3.0 migration"
status: active
draft_status: n/a
qa_status: verified
risk: High
qa_schema: 3
created_at: 2026-08-04
updated_at: 2026-08-04
references:
  - "_docs/intent/Workflow/docs-template-v1-3-migration/decision.md"
  - "_docs/archives/plan/Workflow/docs-template-v1-3-migration/plan.md"
  - "_docs/qa/Workflow/docs-template-v1-3-migration/test-plan.md"
  - "_docs/qa/Workflow/docs-template-v1-3-migration/artifacts/inventory.tsv"
related_issues: []
related_prs: []
---

# QA Verification: docs-driven template v1.3.0 migration

## Summary

B / U / P provenance、26 upstream path、v2 / v3 validator compatibility、paired skills、
project regression、lock chronology、active / nested worktreeのcutoff保全を確認した。
上流26パス中25パスはv1.3.0とbyte-identicalで、QA verification templateだけは
上流末尾空行を`git diff --check`のため正規化した。

## Verification Verdict

Verdict: PASS

Compatibility migration: PASS。Strict schema migration: 実施なし。既存`qa_schema: 2`
文書は互換受理し、一括変換していない。Overall verdictはPASS。

## Commands Run

```bash
date --iso-8601=seconds
git status --short --branch
git rev-parse HEAD
git ls-remote --tags https://github.com/penne-0505/docs_driven_dev_template.git
./scripts/check-docs.sh
deno run --allow-read --allow-write --allow-env --allow-run scripts/test-validators.ts
deno run --allow-read --allow-write --allow-env --allow-run scripts/test-agent-workflow-hook.ts
deno run --allow-read scripts/test-agent-workflow-smoke.ts
DD_SCOPE_PATHS=<migration-docs> deno run --allow-read --allow-env --allow-run=git scripts/validate-frontmatter.ts
DD_SCOPE_PATHS=<migration-docs> deno run --allow-read --allow-env --allow-run=git scripts/validate-doc-links.ts
DD_SCOPE_PATHS=<migration-docs> deno run --allow-read --allow-env --allow-run=git scripts/validate-intent.ts
DD_SCOPE_PATHS=<migration-docs> deno run --allow-read --allow-env --allow-run=git scripts/validate-qa.ts
npx --yes markdownlint-cli2 "_docs/**/*.md" "_evals/**/*.md" "README.md" "AGENTS.md" "TODO.md" "QUICKSTART.md" "!_docs/archives/**/*" "!_docs/standards/templates/**/*" --config .markdownlint.jsonc
npm run lint
npx biome check app
npm run typecheck
npm test
npm run build
npm run deploy:dry-run
git diff --check
```

## Automated Test Results

| Command / Test | Result | Notes |
| --- | --- | --- |
| tag resolution / lock review | PASS | B=`v1.2.0` / `a7fb411...`、U=`v1.3.0` / `98f5f13...`。 |
| target validator fixtures | PASS | v2 validを維持し、v3 valid 3件を受理、invalid 2件を拒否。 |
| scoped migration validators | PASS | frontmatter / links / intent / QAがmigration docsで成功。 |
| agent hook unit / smoke | PASS | 正しい`--allow-write`権限でunit / smokeが成功。 |
| paired skills | PASS | 4 skillが`.agents` / `.claude`でbyte-identical。 |
| `git diff --check` | PASS | upstream templateの末尾空行1件をlocal normalization後に成功。 |
| markdownlint | PASS (migration scope) | 全体は既存feature verification 2件の7 issueでFAIL。migration pathは0 issue。 |
| `npm run lint` | NOT EFFECTIVE | Biome設定により`.`は0 files。既知のproject設定。 |
| `npx biome check app` | PASS | app 22 files、fixなし。 |
| app typecheck | PASS | `tsc --noEmit` exit 0。 |
| Vitest | PASS | 2 files / 19 tests。 |
| static build | PASS | active treeの実依存で8 public routeを生成。 |
| Wrangler dry-run | PASS | 503 assets、bindingなし、uploadなし。 |
| protected candidate diff | PASS | app / public / dependency / deploy / compiler config差分0。 |

## Manual QA Results

| Checklist Item | Result | Notes |
| --- | --- | --- |
| provenance | PASS | annotated tagをpeeled full SHAへ解決しlockと一致。 |
| three-way inventory | PASS | prior 259行を継承し、B→U 26、post-v1.2、dirty cutoffを追加分類。 |
| reconciliation | PASS | 25 path byte-identical、1 pathは末尾空行だけ正規化。 |
| v2 compatibility | PASS | 既存v2 QAの一括変更なし、v2 fixtures継続PASS。 |
| owner authority | PASS | Transferable Principles candidateをIntentへ昇格していない。 |
| dirty cutoff | PASS | original 12 file hashとnested HEAD / status / diff hashがcutoff一致。 |
| lock chronology | PASS | compatibility gate後にv1.3.0へ更新。 |

## Acceptance Criteria Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| AC-001 | PASS | B / U full SHA、P HEAD、cutoff time / hashesを固定。 |
| AC-002 | PASS | inherited inventory + 26 upstream + post-v1.2 + dirty cutoffを解決。 |
| AC-003 | PASS | v3 contract一式とv2 / v3 fixturesが成功。 |
| AC-004 | PASS | standards / templates / evals / paired skillsを同期。 |
| AC-005 | PASS | candidate protected diff 0、dirty path hashとnested evidence一致。 |
| AC-006 | PASS | stale draft 5件をbefore / afterで同一baselineとして分離。 |
| AC-007 | PASS | compatibility後にlockをU tag / SHAへ更新。 |
| AC-008 | PASS | QA review、docs / hook / app regression、別verdictを記録。 |

## Decision Conformance

| ID | Result | Why the implementation remains aligned |
| --- | --- | --- |
| DEC-001 | PASS | marker / validator / fixture / template / skillを同じrelease laneで統合した。 |
| DEC-002 | PASS | candidateをverificationへ記録し、Intentへ自動昇格していない。 |
| DEC-003 | PASS | v2を互換受理し、既存recordのstrict migrationを行っていない。 |
| DEC-004 | PASS | candidateをdetached worktreeで作り、protected cutoffをhash確認した。 |
| DEC-005 | PASS | lock更新をcompatibility確認後まで遅延した。 |

## Invariant Coverage

None

## Deferred / Not Covered

| ID | Reason | Follow-up |
| --- | --- | --- |
| baseline stale drafts | full wrapperは既存draft 5件のstale判定でFAILする | migration外。今回変更しない。 |
| baseline markdown | full markdownlintは既存feature verification 2件の7 issueでFAILする | migration外。今回変更しない。 |
| candidate-local build | 外部rootを指す一時`node_modules` symlinkをTurbopackが拒否した | active treeの実依存でbuild / dry-runをPASSし代替確認済み。 |

## Residual Risks

None

## Follow-up TODOs

None

## Transferable Principles

- TP: scope挙動そのものを検証するfixture suiteへ外側の`DD_SCOPE_PATHS`を継承すると、
  negative caseの前提が変わる。scoped content validationとscope fixture suiteは環境を分離する。
  (契機: targeted wrapperでscope negative caseが偽FAIL / 昇格先候補: `_docs/intent/Workflow/conventions/decision.md`)
- TP: Git worktreeの分離とbuild toolのfilesystem isolationは同義ではない。外部rootを指す依存symlinkを
  拒否するtoolでは、依存実体をworktree内へ置くか、同一sourceの実依存環境で回帰を代替する。
  (契機: Turbopackのout-of-root symlink拒否 / 昇格先候補: `_docs/intent/Workflow/conventions/decision.md`)
