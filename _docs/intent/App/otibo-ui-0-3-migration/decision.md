---
title: "Intent: Consume @otibo/ui as a self-contained CSS library"
status: active
draft_status: n/a
created_at: 2026-07-11
updated_at: 2026-07-11
references:
  - "_docs/plan/App/otibo-ui-0-3-migration/plan.md"
  - "_docs/qa/App/otibo-ui-0-3-migration/test-plan.md"
related_issues: []
related_prs: []
---

## Context

0.2.xはconsumerにPanda preset / buildinfo / codegenを要求した。0.3.0はこれを廃止し、自己完結した
`styles.css`を公開する。otibo-devも将来Pandaを基本的に使わない方針となった。

## Decision

- `@otibo/ui/styles.css`をdesign-system baselineの正本とする。
- app固有layoutはCSS Modulesで表現する。
- componentとして意味があるBadge / Link / Separator / ScrollAreaだけを利用し、product compositionはapp側に残す。
- consumer-side Panda codegenをinstall / build条件から外す。
- 未参照artifactの恒久削除は別途オーナー承認を得る。

## Alternatives

- **0.2.xを維持**: 将来方針と逆行するため不採用。
- **0.3.0へ上げて旧生成物を使い続ける**: fresh installの再現性がなくなるため不採用。
- **product moduleをCardへ置換**: 表示構造をlibrary surfaceに従属させるため不採用。

## Rationale

libraryのcomponent stylingとconsumerのpage compositionを分離すると、Panda version / codegen contractを
consumerへ漏らさず、site固有の視覚判断も保持できる。

## Consequences / Impact

- 0.3.0のglobal reset / typographyがdocument全体へ作用するため全routeのvisual regression確認が必要。
- 法務ページのPanda utilityをCSS Modulesへ移す。
- 旧Panda設定と生成物は未参照になるが、承認までfilesystem上に残り得る。

## Quality Implications

- styles import漏れ、global resetによるshader / legal回帰、route変更、fresh install失敗を検出する。

## Intent-derived Invariants

- INV-001: appは`@otibo/ui/styles.css`をrootで一度だけ読む。
- INV-002: app sourceとpackage scriptsはconsumer-side Panda codegen / styled-systemを参照しない。
- INV-003: 法務routeの本文・URL・metadataを変更しない。
- INV-004: First Viewの一画面高と4段階の責務順を維持する。
- INV-005: product moduleをCardへ固定せず、mobile media railだけScrollAreaへ委譲する。
- INV-006: static exportとWorkers Static Assetsを維持する。

## Rollback / Follow-ups

- 重大なglobal regression時は0.2.x dependencyと旧CSS pipelineへ一括で戻す。
- 未参照Panda config / generated artifactの削除は差分確認後に提案する。
