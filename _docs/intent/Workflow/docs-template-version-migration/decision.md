---
title: "docs-driven template version migrationの適用境界"
status: active
draft_status: n/a
intent_schema: 2
created_at: 2026-07-17
updated_at: 2026-07-17
references:
  - "_docs/archives/plan/Workflow/docs-template-version-migration/plan.md"
  - "_docs/qa/Workflow/docs-template-version-migration/test-plan.md"
related_issues: []
related_prs: []
---

# docs-driven template version migrationの適用境界

## Context

このrepositoryはdocs-driven template `c1dc332`を起点に開発され、
project固有文書と未コミット実装を積み重ねている。upstreamの公開mainと
why-first branchを取り込む際、template filesの上書きだけではproject固有の
判断、進行中作業、legacy documentの意味を失う可能性がある。

## Decisions

### DEC-001: upstream provenanceを三点で固定する

- **What**: 導入base `c1dc332`、公開main `778d9b9`、why-first
  `511f44e`をmigration provenanceとする。
- **Why**: branch名や「最新版」だけでは、並行branchを誤って混入させ、
  後から適用内容を再構成できなくなるため。
- **Change freedom**: 将来のmigrationでは別commit群を使えるが、base、
  adopted tip、excluded branchを明記する。
- **Why not**: remoteの全branchを時系列で合成しない。branchは公開順ではなく
  独立した提案境界を表すため。

### DEC-002: migration対象をカットオフ時点で固定する

- **What**: `2026-07-17T16:12:12.651316957+09:00`以前に存在した文書を
  棚卸し対象とし、以後の並行作業は対象外にする。
- **Why**: migration中の別作業をupstream由来変更と誤認し、上書きや
  semantic rewriteへ巻き込まないため。
- **Change freedom**: migration自身のPlan / Intent / QA、upstreamから
  導入する新規運用ファイル、合意済みmigration skillは追加できる。

### DEC-003: legacy schemaを段階移行する

- **What**: legacy Intent / QAは一括移行せず、判断の意味、QA契約、
  コード参照を今回変更する文書だけschema v2へ移行する。
- **Why**:形式変換だけの一括作業では、過去のWhyや変更可能範囲を現在の
  推測で捏造し、実装詳細を新しい契約として固定するため。
- **Change freedom**: untouched legacy文書はvalidator互換を保つ。後続taskで
  意味を変更するときにv2へ移行できる。

### DEC-004: template meta-workをproject guidanceから除外する

- **What**: template改善履歴として混入したWorkflow文書11件を削除し、
  吸収済みのstandardsとfixturesを正典にする。
- **Why**: template自身の履歴をproject固有のactive decisionやQA証跡として
  読むと、現行規約と二重のsource of truthになるため。
- **Change freedom**: 今回のproject固有migration記録はWorkflow領域の
  persistent recordとして保持する。

### DEC-005: コード参照を理由と不変結果へ分離する

- **What**: 非自明な判断は`DEC-*`のWhyを参照し、active decision下で
  どの実装でも破れない結果だけ`intent-invariant: INV-*`で参照する。
- **Why**: 現在値や実験条件をINVとしてコメントすると、将来の安全な
  代替実装を禁止し、commentとtestが実装詳細を二重固定するため。
- **Change freedom**: 自明なコードはコメントを持たなくてよい。runtime/UI
  挙動は変えず、コメントと参照先の意味だけを更新する。

### DEC-006: version migrationの手順をskillへ一般化する

- **What**: provenance、cutoff、customization保全、段階schema移行、
  meta-work整理、verificationを再利用可能なskillとして両agent系へ置く。
- **Why**: 同種migrationを都度ad hocに行うと、branch混入、上書き、
  bulk migration、検証漏れが再発するため。
- **Change freedom**: skillはproject固有commitやpathを固定せず、
  各runで発見して記録する。

## Consequences / Impact

- template同期は単純copyではなくthree-way classificationになる。
- semantic migration対象は文書・QA・コードコメントを一単位で扱う。
- migration task自体は新schemaの実例となる。
- runtime deployやUI変更は発生しない。

## Quality Implications

- branch provenanceとexcluded branchをdiff reviewする。
- modified / untracked filesをmigration前後で比較する。
- v2 Intent / QAをvalidatorとhuman semantic reviewの両方で確認する。
- code comment以外のruntime diffがないことを確認する。
- skillの両agent系一致とmisbehavior guardを確認する。

## Intent-derived Invariants

- INV-001 (from DEC-001): `codex/metacognitive-audit-hooks`の変更を今回のmigrationへ含めない。
- INV-002 (from DEC-002): カットオフ後に並行作成された文書をmigration候補として編集・削除しない。
- INV-003 (from DEC-003): legacy文書をschema移行だけを目的として一括変換しない。
- INV-004 (from DEC-004): template meta-work文書11件をactive project guidanceとして残さない。
- INV-005 (from DEC-005): migrationによってruntime/UI挙動を変更しない。

## Enforced in (optional)

- DEC-001 / INV-001: upstream commit・branch diff review。
- DEC-002 / INV-002: cutoff記録、作業中の新規Markdown監査。
- DEC-003 / INV-003: schema marker一覧とmigration理由のreview。
- DEC-004 / INV-004: exact path listと残存参照grep。
- DEC-005 / INV-005: source diffとproject regression tests。
- DEC-006: `.agents` / `.claude` skill一致check。

## Rollback / Follow-ups

- migration diffはapplication behaviorから分離してreviewする。
- `codex/metacognitive-audit-hooks`は別session・別decision scopeで扱う。
