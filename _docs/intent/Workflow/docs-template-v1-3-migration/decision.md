---
title: "docs-driven template v1.3.0 migration boundary"
status: active
draft_status: n/a
intent_schema: 2
created_at: 2026-08-04
updated_at: 2026-08-04
references:
  - "_docs/archives/plan/Workflow/docs-template-v1-3-migration/plan.md"
  - "_docs/qa/Workflow/docs-template-v1-3-migration/test-plan.md"
  - "_docs/qa/Workflow/docs-template-v1-3-migration/artifacts/inventory.tsv"
related_issues: []
related_prs: []
---

# docs-driven template v1.3.0 migration boundary

## Context

v1.3.0は、session-end reflectionを任意の会話上の振り返りではなく、新規QA verificationの
検証可能なcontractへ移す。validatorだけを更新するとskill / templateが必要sectionを生成せず、
skillだけを更新すると記録漏れを検出できない。既存projectにはv2 verificationが多数あるため、
release adoptionと既存recordのstrict schema migrationも分離する必要がある。

## Decisions

### DEC-001: v3 contractをrelease単位で統合する

- **What**: schema marker、standards、templates、validators、fixtures、agent eval、paired skillsを
  v1.3.0の一単位として統合する。
- **Why**: producerとvalidatorを部分更新すると、正しい文書を拒否するか、必須reflectionの欠落を
  見逃す分裂状態になるため。
- **Change freedom**: 将来のreleaseでsection名や実装を変えられるが、生成・検査・運用説明が同じ
  contractを参照する状態は保つ。

### DEC-002: candidateのIntent昇格はuser判断に残す

- **What**: Transferable Principlesはcandidateまたは理由付き`None:`としてverificationへ記録し、
  Intentへの昇格をmigration実装者が自動実行しない。
- **Why**: セッション中の学びを恒久decisionへ直接変えると、ownerが合意していない制約を将来の
  実装へ課すため。
- **Change freedom**: userが採用・却下・保留を判断した後は、provenanceを保ってIntentを更新できる。

### DEC-003: v2 compatibilityとstrict schema migrationを分ける

- **What**: 既存`qa_schema: 2`文書を一括変更せず、v1.3.0 validatorがv2とv3を受理することを
  compatibility gateにする。新規migration verificationだけv3で作成する。
- **Why**: 既存verificationの意味を再構成せずmarkerだけ上げると、当時存在しなかったreflectionを
  後付けで捏造するため。
- **Change freedom**: 個別文書を意味のある後続編集でv3へ移行できる。

### DEC-004: active dirty treeをmigration candidateから隔離する

- **What**: PはHEADとdirty cutoff evidenceで固定し、candidateはdetached worktreeで構築する。
  active treeへは検証済みmigration pathだけを反映する。
- **Why**: First View WIPとmigrationを同じindexで扱うと、unrelated artifactの混入または
  post-cutoff変更の上書きが起こり得るため。
- **Change freedom**: 同等のpath ownershipとbefore / after evidenceを示せる隔離方式へ変更できる。

### DEC-005: lockをcompatibility確定後に進める

- **What**: `docs-template.lock.json`はv1.3.0 filesのreconciliationとcompatibility PASS後の
  最後のmigration writeとして更新する。
- **Why**: 未検証treeを採用済みと表示すると、次回migrationのBが実態と一致しなくなるため。
- **Change freedom**: lock formatは変更できるが、採用revisionと統合済みcontentの一致は保つ。

## Consequences / Impact

- 新規verificationはv3のTransferable Principles sectionを持つ。
- 既存v2 QA recordは履歴として変更しない。
- app / asset / feature behaviorには変更がない。
- migrationの学びはcandidateとして提示し、恒久Intentへ自動昇格しない。

## Quality Implications

- v2 valid fixtureとv3 valid / invalid fixtureを同じvalidator runで確認する。
- paired skill hash、inventory coverage、protected path diff、cutoff hashを確認する。
- compatibilityとstrict schemaをverificationで別判定する。

## Intent-derived Invariants

None

## Enforced in (optional)

- DEC-001: validator fixtures、workflow smoke、paired skill comparison。
- DEC-002: v3 verification templateとqa-review skill。
- DEC-003: v2 / v3 fixture setとmigration verification。
- DEC-004: isolated worktree、cutoff before / after hashes。
- DEC-005: lock chronology review。

## Rollback / Follow-ups

- active反映前はcandidateを採用しなければrollbackできる。
- active反映後はmigration pathのdiffを逆適用できるが、dirty cutoffとの重なりを先に再確認する。
- stale draftや既存QAのv3移行は別taskとし、今回へ含めない。
