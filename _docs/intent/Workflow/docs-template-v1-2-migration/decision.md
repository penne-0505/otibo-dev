---
title: "docs-driven template v1.2.0 migration boundary"
status: active
draft_status: n/a
intent_schema: 2
created_at: 2026-07-28
updated_at: 2026-07-28
references:
  - "_docs/archives/plan/Workflow/docs-template-v1-2-migration/plan.md"
  - "_docs/qa/Workflow/docs-template-v1-2-migration/test-plan.md"
  - "_docs/qa/Workflow/docs-template-v1-2-migration/artifacts/inventory.tsv"
related_issues: []
related_prs: []
---

# docs-driven template v1.2.0 migration boundary

## Context

`otibo-dev`はv1.0.0を採用済みだが、v1.2.0ではvalidator / hookのTypeScript化と
frontmatter検査強化に加え、template開発規約と利用者向け配布物を分ける`starter/`
構造が導入された。upstream root差分をそのまま適用すると、導入済みprojectの
agent設定を削除し、template開発用routerをactive guidanceにしてしまう。

## Decisions

### DEC-001: upstreamのconsumer-facing treeを正規化して比較する

- **What**: Uの`starter/`配下はprefixを除いてproject rootへ対応付け、upstream rootの
  router `AGENTS.md`はtemplate-self fileとして導入対象外にする。
- **Why**: `starter/`は未初期化templateでのみ意味を持つ配置であり、導入済みprojectへ
  literalに適用すると有効なskill / hook / TODOを無効化するため。
- **Change freedom**: upstreamが別の明示的export manifestを提供した場合は、そのmanifestを
  consumer treeの正典として使える。

### DEC-002: TypeScript移行を互換基盤として一単位で導入する

- **What**: `.ts` validator / hook、`deno.json`、fixtures、CI、reader docsを一つの
  compatibility gateとして統合し、owner許可済みの旧`.mjs` 10件を削除する。
- **Why**: runnerだけ、またはscriptだけを更新すると、CIとlocal wrapperが異なる実装を
  実行し、検証結果の意味が分裂するため。
- **Change freedom**: Deno以外のruntimeへ将来変更できるが、local / CI / fixturesが同じ
  validator contractを確認する状態は保つ。

### DEC-003: active mainのdirty内容をmigrationの入力から除外する

- **What**: Pはmain HEADで固定し、dirty内容はbefore / after hashで保全する。migrationは
  detached worktreeで完成させ、対象pathだけをmainへcommitする。
- **Why**: feature WIPとmigrationを同じindexで扱うと、unrelated artifactのcommit、または
  cutoff後変更の上書きが起こり得るため。
- **Change freedom**: Gitがpath限定commitとpreservationを同等に証明できる別方式を提供する
  場合は、detached worktree以外の隔離方法も使える。

### DEC-004: compatibilityとstrict schemaを分け、lockを最後に進める

- **What**: legacy docsの意味は一括変更せず、validator互換性を先に確認する。lockはU filesの
  reconciliationとcompatibility PASS後にだけv1.2.0へ更新する。
- **Why**: release更新を理由に既存decisionのWhyを推測で生成したり、失敗したtreeを採用済みと
  表示したりすることを防ぐため。
- **Change freedom**: 意味変更が必要なlegacy docは、根拠を持つ後続taskで個別にschema移行できる。

### DEC-005: workflow-sensitive riskをwrite前とclosureで通知する

- **What**: CI、standards、agent config、workflow scriptsへの書き込み前にRisk High相当の
  文書chainを知らせ、Stop時は実際のworking-tree差分とIntent / QAの有無を照合する。
- **Why**: 完了時の文面だけでclosureを通したり、実装後に初めて文書要件へ気づいたりすると、
  判断根拠と検証設計が変更へ追随できないため。
- **Change freedom**: risk分類は作業者に残し、通知対象path、event、文面はfalse positiveと
  見落としの証拠に基づいて変更できる。

### DEC-006: Deno validatorをapp TypeScript compilerから分離する

- **What**: `scripts/*.ts`はDenoのformatter / runnerで検証し、Next.js appの
  `tsconfig.json`の対象から除外する。
- **Why**: Deno globalsと`.ts` importをNode / Next.js用compilerへ混在させると、実行環境では
  正しいvalidatorがapp buildの型エラーとして扱われ、release contractを導入できないため。
- **Change freedom**: app compilerがDeno type environmentを競合なく扱える構成へ移行した場合は、
  別configやproject referenceによる分離へ変更できる。

## Consequences / Impact

- project rootには`starter/`やtemplate開発routerを追加しない。
- local / CI validatorとhookはTypeScript実装へ揃う。
- feature WIPはmigration commitと分離される。
- strict schema migrationは今回の完了条件に含めない。

## Quality Implications

- normalized inventoryとfinal diffのcoverageを機械確認する。
- old / new runnerの混在がないことをpath reviewとsmoke testで確認する。
- mainへ適用する前後でdirty cutoffのstatus / diff / untracked manifestを比較する。
- compatibilityとstrict schemaのverdictをverificationで別記する。

## Intent-derived Invariants

None

## Enforced in (optional)

- DEC-001: normalized consumer inventory。
- DEC-002: `scripts/check-docs.sh`、Docs CI、validator / hook tests。
- DEC-003: cutoff evidence、path限定commit review。
- DEC-004: migration verificationとprovenance lock review。
- DEC-005: `scripts/agent-workflow-hook.ts`とhook unit / smoke tests。
- DEC-006: `tsconfig.json`、Deno formatter、validator execution tests。

## Rollback / Follow-ups

- push前はdetached migration commitを採用しなければactive mainを変更しない。
- push後はmigration commit単位でrevert可能だが、dirty working treeとの境界を再確認して行う。
- dirty feature docsが新validatorで追加対応を要する場合だけ、別TODOへ起票する。
