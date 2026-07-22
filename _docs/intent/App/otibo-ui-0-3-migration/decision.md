---
title: "Intent: Consume @otibo/ui as a self-contained CSS library"
status: active
draft_status: n/a
intent_schema: 2
created_at: 2026-07-11
updated_at: 2026-07-17
references:
  - "_docs/plan/App/otibo-ui-0-3-migration/plan.md"
  - "_docs/qa/App/otibo-ui-0-3-migration/test-plan.md"
related_issues: []
related_prs: []
---

## Context

0.2.xはconsumerにPanda preset / buildinfo / codegenを要求した。0.3.0はこれを廃止し、自己完結した
`styles.css`を公開する。otibo-devも将来Pandaを基本的に使わない方針となった。

## Decisions

### DEC-001: UI libraryを自己完結CSSとして消費する

- **What**: `@otibo/ui/styles.css`をrootで一度だけ読み、consumer-side
  Panda codegenをinstall / build条件から外す。
- **Why**: library内部のPanda versionとcodegen contractをconsumerへ漏らさず、
  fresh installから同じstyleを再現できるようにするため。
- **Change freedom**: library内部の生成方式とCSS bundle構成は変更できる。
  consumerが公開stylesheetだけでbuildできる境界は維持する。
- **Why not**: 0.2.x維持や旧生成物の併用では、fresh installがrepository内の
  stale artifactへ依存する。

### DEC-002: page compositionはconsumerが所有する

- **What**: app固有layoutはCSS Modulesで表現し、意味のあるprimitiveだけを
  `@otibo/ui`へ委譲する。product compositionをCardへ固定しない。
- **Why**: component stylingとsite固有の情報構造を分離し、library surfaceの都合で
  page compositionが決まる状態を避けるため。
- **Change freedom**: 使用primitiveやCSS Modulesの分割は変更できる。
  product表現を特定のlibrary componentへ固定しない。

### DEC-003: migrationとartifact削除を分離する

- **What**: 公開route、metadata、First View、top-page責務順、Workers static
  exportをmigration regressionとして確認し、未参照artifactの削除は別承認にする。
- **Why**: CSS基盤変更と恒久削除を同時に行うと、visual regressionとrollback不能な
  filesystem変更を切り分けられないため。
- **Change freedom**: 承認済みcleanup taskでは旧artifactを削除できる。

## Consequences / Impact

- 0.3.0のglobal reset / typographyがdocument全体へ作用するため全routeのvisual regression確認が必要。
- 法務ページのPanda utilityをCSS Modulesへ移す。
- 旧Panda設定と生成物は未参照になるが、承認までfilesystem上に残り得る。

## Quality Implications

- styles import漏れ、global resetによるshader / legal回帰、route変更、fresh install失敗を検出する。

## Intent-derived Invariants

- INV-002 (from DEC-001): app sourceとpackage scriptsはconsumer-side Panda codegen / styled-systemをbuild条件として参照しない。

## Enforced in (optional)

- DEC-001 / INV-002: root stylesheet import、dependency tree、
  package scripts、source grep。
- DEC-002: top-page compositionとmobile media railのdiff / browser review。
- DEC-003: route / metadata / visual / deploy regression checksと削除diff review。

## Rollback / Follow-ups

- 重大なglobal regression時は0.2.x dependencyと旧CSS pipelineへ一括で戻す。
- 未参照Panda config / generated artifactの削除は差分確認後に提案する。
