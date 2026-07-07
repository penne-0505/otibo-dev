---
title: "Plan: Migrate to @otibo/ui 0.3 without consumer-side Panda"
status: active
draft_status: n/a
created_at: 2026-07-11
updated_at: 2026-07-11
references:
  - "_docs/intent/App/otibo-ui-0-3-migration/decision.md"
  - "_docs/qa/App/otibo-ui-0-3-migration/test-plan.md"
  - "_docs/intent/App/workers-static-export-next16/decision.md"
related_issues: []
related_prs: []
---

## Overview

`@otibo/ui`を0.3.0へ更新し、library同梱の`styles.css`へreset / tokens / fonts / component stylesを
一元化する。otibo-dev固有のlayoutはCSS Modulesへ移し、consumer-side Panda codegenをbuild条件から外す。

## Scope

- root layoutで`@otibo/ui/styles.css`を一度だけ読み込む。
- 法務layoutとaccount deletion CTAをCSS Modulesへ移す。
- top pageのstatus / link / separator / mobile media railに既存UI primitiveを適用する。
- package scriptsとdependencyからPanda codegen requirementを外す。
- static exportとWorkers Static Assetsを維持する。

## Non-Goals

- top pageのvisual tuningを同時に完成させない。
- product moduleやcarouselを`@otibo/ui`へ新設しない。
- 法務本文・route・metadataを変更しない。
- 未参照になったPanda生成物や設定ファイルを無承認で恒久削除しない。

## Requirements

- **Functional**: 既存routeと表示内容を維持し、mobile mediaは`ScrollArea`で横移動できる。
- **Non-Functional**: React 19、Node 22、static export、Workers dry-run、semantic structureを維持する。

## Tasks

1. dependencyとroot CSS entryを0.3.0 contractへ更新する。
2. Panda利用箇所をCSS Modulesへ移す。
3. top pageへ既存primitiveを適用する。
4. source grep、automated checks、desktop / mobile browser QAを行う。
5. verificationを残し、Panda artifact削除候補を明記する。

## QA Plan

- QA document: `_docs/qa/App/otibo-ui-0-3-migration/test-plan.md`
- Risk level: Medium
- Test strategy: dependency tree、source grep、lint / typecheck / test / build / dry-run、全route smoke、desktop / mobile visual QA。

## Deployment / Rollout

- production deployは行わない。
- rollbackはpackage / CSS import / CSS Modules変更を一単位で0.2.x consumer方式へ戻す。
