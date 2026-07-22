---
title: "QA Verification: docs-driven template why-first migration"
status: active
draft_status: n/a
qa_status: verified
risk: Medium
qa_schema: 2
created_at: 2026-07-17
updated_at: 2026-07-17
references:
  - "_docs/intent/Workflow/docs-template-version-migration/decision.md"
  - "_docs/archives/plan/Workflow/docs-template-version-migration/plan.md"
  - "_docs/qa/Workflow/docs-template-version-migration/test-plan.md"
related_issues: []
related_prs: []
---

# QA Verification: `docs-driven template why-first migration`

## Summary

導入base `c1dc332`から公開main `778d9b9`とwhy-first `511f44e`までを
選択laneとして、standards、templates、validator、fixtures、CI、hooks、
paired skills、root guidanceを既存projectへ統合した。別lane
`34ac6a4` (`codex/metacognitive-audit-hooks`) は含めていない。

カットオフ時点の126 tracked Markdownと0 untracked Markdownを棚卸しし、
意味またはcode traceabilityを今回変更した5組の既存Intent / QAだけを
schema v2へ移行した。旧App文書3組は履歴を保持したままsuperseded化し、
template meta-work 11件は承認どおり削除した。
PASS確定後はmigration TODOを削除し、このtaskのPlanだけをarchive checklistに
従って`_docs/archives/plan/Workflow/docs-template-version-migration/`へ移した。

## Verification Verdict

Verdict: PASS

互換移行と、今回選択したstrict schema移行範囲はともに完了した。
legacy文書の一括schema変換と一般的なarchive整理は、合意した非対象である。

## Commands Run

```text
./scripts/check-docs.sh
deno fmt --check scripts/*.mjs
npx markdownlint-cli2 "_docs/**/*.md" "_evals/**/*.md" "README.md" \
  "AGENTS.md" "TODO.md" "QUICKSTART.md" "!_docs/archives/**/*" \
  "!_docs/standards/templates/**/*" --config .markdownlint.jsonc
npm run lint
npm run typecheck
npm test
sha256sum public/first-view/light-height-map.png
npm run build
sha256sum public/first-view/light-height-map.png
npm run deploy:dry-run
cmp -s .agents/skills/docs-template-migration/SKILL.md \
  .claude/skills/docs-template-migration/SKILL.md
cmp -s .agents/skills/docs-inventory/SKILL.md \
  .claude/skills/docs-inventory/SKILL.md
git diff --check
rg -l '^intent_schema: 2$' _docs/intent
rg -l '^qa_schema: 2$' _docs/qa
```

削除11 path、削除済みslug参照、excluded branch fingerprint、
旧intent comment形式、post-cutoff untracked Markdownは個別の
`test` / `rg` / `git ls-files --others`でも確認した。

## Automated Test Results

| Command / Test | Result | Evidence |
| --- | --- | --- |
| `./scripts/check-docs.sh` | PASS | live docs、TODO、front-matter、link、Intent、QA、fixtures、hook、workflow smokeが全件成功 |
| validator fixtures | PASS | valid fixture成功、invalid fixtureは期待どおり失敗、legacy compatibilityとscope filter成功 |
| hook tests | PASS | destructive command、sensitive file、closure reminder、recursive stopを期待どおり判定 |
| workflow smoke | PASS | paired skills、bounded migration trigger、全6 stepのcompletion criterion、schema marker受理を確認 |
| Deno format | PASS | 12 scripts checked |
| markdownlint | PASS | 96 files、0 issues |
| Biome | PASS | 31 files、fixなし |
| TypeScript | PASS | `tsc --noEmit` exit 0 |
| Vitest | PASS | 2 files、19 tests |
| Next.js build | PASS | 8公開routeとnot-foundをstatic prerender |
| Wrangler dry-run | PASS | `out/`から495 assets、bindingなし、uploadなしで終了 |
| generated asset stability | PASS | build前後ともSHA-256 `48d0637d...79b6f5e` |
| diff / skill parity | PASS | `git diff --check`と両paired skillの`cmp`成功 |

## Manual QA Results

| Checklist Item | Result | Evidence |
| --- | --- | --- |
| upstream provenance | PASS | `c1dc332..511f44e`を採用し、main `778d9b9`を包含するlaneとして固定 |
| excluded branch | PASS | `UserPromptSubmit`、`user-prompt-submit`、`lifecycle-self-audit`が対象hook / evalに存在しない |
| customization preservation | PASS | AGENTS、README、QUICKSTART、TODOをpath単位でmergeし、projectのfrontend-design skill削除を採用しなかった |
| post-cutoff boundary | PASS | 新規Markdownはupstream追加、migration task、migration skillに限定。並行作業由来の新規docなし |
| meta-work deletion | PASS | 承認済み11 pathが不在で、3 slugへのdoc / fixture path参照も不在 |
| selective schema migration | PASS | 既存5 Intentと対応QAだけをv2化。untouched legacyはmarkerなしで受理 |
| code traceability | PASS | active commentsはDEC、strict INV、またはACを参照し、廃止済みINV test名もACへ変更 |
| behavior boundary | PASS | migration由来のsource変更はコメント / test表示名のみ。lint、typecheck、unit、build、dry-runが成功 |

### Documentation inventory

- **Operating surface**: `AGENTS.md`、`TODO.md`、documentation guide、
  documentation / QA standardsが現行source of truth。
- **TODO**: `Legal-Chore-13`を公開日待ちとしてBacklogへ戻した。
  `Docs-Chore-1`はowner review、`App-Enhance-15`はPARTIAL受容判断、
  `Site-Feat-17`は並行UI作業のため本migrationではphaseを変更しない。
- **Durable docs**: scaffold、旧UI integration、旧top pageのIntent / QAを
  後継参照付き`superseded`へ変更した。旧top page verificationは実browser
  visual / motion未確認に合わせてPARTIALへ訂正した。
- **Temporary docs**: 完了済みplan、Legal draft / survey、
  top-page exhibition draftはarchive candidate。今回のnon-goalに従い移送しない。
  migration task自身のPlanだけは、Intent / QAへの参照更新後にarchive済み。
- **Reader docs**: READMEはproject固有化前だが、既存P0
  `Docs-Chore-2`が正規の対応taskであるため本migrationで代行しない。

## Acceptance Criteria Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| AC-001 | PASS | base / main / why-first / excluded laneをfull SHAで固定し、最終fingerprint確認 |
| AC-002 | PASS | cutoff記録とuntracked Markdown監査。並行UI変更をmigration scopeへ含めていない |
| AC-003 | PASS | 既存v2対象はApp 2、Legal 1、Site 2のIntent / QA。legacy一括変換なし |
| AC-004 | PASS | meta-work 11件を削除し、削除slugの残存参照をfixture専用slugへ解消 |
| AC-005 | PASS | code commentとtest表示名をDEC / strict INV / ACへ再分類、behavior test成功 |
| AC-006 | PASS | project固有root docs、frontend-design skill、未コミットFirst View実装を保持 |
| AC-007 | PASS | migration skillを両agent系へ追加し、review指摘とsmoke testを反映 |
| AC-008 | PASS | docs、fixture、hook、format、lint、typecheck、test、build、dry-run成功 |

## Decision Conformance

| ID | Result | Why the implementation remains aligned |
| --- | --- | --- |
| DEC-001 | PASS | moving branch tipではなくbase / adopted commits / excluded laneを固定した |
| DEC-002 | PASS | cutoff後Markdownを別監査し、migration自身とupstream追加以外を対象にしなかった |
| DEC-003 | PASS | semantic edit対象だけv2化し、metadata / formatting修正はlegacyのまま保持した |
| DEC-004 | PASS | template meta-work 11件を削除し、standards / fixturesを正典として残した |
| DEC-005 | PASS | current値の固定ではなく、判断理由・strict結果・検証条件へanchorを再分類した |
| DEC-006 | PASS | provenance、cutoff evidence、historical evidence、gate closureを再利用skillへ一般化した |

## Invariant Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| INV-001 | PASS | excluded branch固有hook / self-audit fingerprintなし |
| INV-002 | PASS | post-cutoff並行docの編集・削除なし |
| INV-003 | PASS | untouched legacy Intent / QAにschema markerなし |
| INV-004 | PASS | exact 11 path不在 |
| INV-005 | PASS | runtime regression suite成功。migration owned source hunkはcomment / test labelのみ |

## Deferred / Not Covered

- legacy Intent / QAの全件schema v2変換。意味を変更する後続taskで個別移行する。
- archive candidateとなった完了plan、draft、surveyの一括移送。
- `codex/metacognitive-audit-hooks` lane。
- READMEのproject固有化。既存`Docs-Chore-2`で扱う。
- `Site-Feat-17`のTODO phase変更と並行UI実装。
- `App-Enhance-15`のPARTIAL受容、`Docs-Chore-1`のowner review。

## Residual Risks

None

## Follow-up TODOs

- `codex/metacognitive-audit-hooks`は別session・別decision scopeで評価する。
- archive候補はownerが一括整理を選んだ場合に`docs-cleanup`のchecklistで移送する。
