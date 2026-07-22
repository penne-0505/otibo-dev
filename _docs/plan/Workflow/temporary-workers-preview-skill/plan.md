---
title: "Plan: Temporary Workers preview skill"
status: active
draft_status: n/a
created_at: 2026-07-18
updated_at: 2026-07-18
references:
  - "_docs/intent/Workflow/temporary-workers-preview-skill/decision.md"
  - "_docs/qa/Workflow/temporary-workers-preview-skill/test-plan.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/plan/Workflow/temporary-workers-preview-skill/plan.md -->

## Overview

otibo baselineのTemporary Workers公開を、repo-local skillと単一helper scriptで再現可能にする。

## Scope

- `.agents/skills`と`.claude/skills`へ同じmodel-invoked skillを追加する。
- isolated build、build environment allowlist、oversized image resize、temporary config、
  non-interactive deploy、live route verificationをhelper scriptへ集約する。
- `--prepare-only`で外部状態を変更せずartifact preparationを検証できるようにする。

## Non-Goals

- production `otibo.dev` deployの置換。
- Cloudflare Quick Tunnelの起動。
- oversized non-imageの汎用byte分割。
- Temporary Workersのclaimまたは恒久アカウント化。

## Requirements

- **Functional**: 明示的な公開依頼から、人間の途中入力なしでverified `workers.dev` URLを返す。
- **Non-Functional**: current worktree、既存Cloudflare認証、production configを変更しない。
- **Safety**: 未知のbuild environment key、非画像oversized asset、live verification failureで停止する。

## Tasks

- canonical Intent / QAを作成する。
- shared helper scriptと両agent向けskillを追加する。
- `--prepare-only`でisolated buildと5 MiB adaptationを検証する。
- shell syntax、skill mirror、docs validator、diff boundaryを確認する。
- QA verificationへ実行結果を記録する。

## QA Plan

- QA document: `_docs/qa/Workflow/temporary-workers-preview-skill/test-plan.md`
- Risk level: Medium
- Test strategy:
  - Unit: shell syntaxとstatic assertions。
  - Integration: `--prepare-only`によるisolated production build。
  - E2E: 新規外部deployは行わず、live branchは既存成功ログとscript reviewで境界確認。
  - Manual QA: skill trigger、claim URL、preview-only resizeの説明をreview。
  - Validator / static check: docs validators、`git diff --check`、skill `cmp`。
- AC-001〜AC-006とINV-001〜INV-003をtest matrixへ対応づける。
- DEC-001〜DEC-004のWhyをscriptとskill diffでreviewする。

## Deployment / Rollout

- skillは次回の明示的なtemporary preview依頼から使用する。
- `--prepare-only`検証では外部Cloudflare状態を作成しない。
- 問題時はskill、script、Workflow docsをrevertし、既存production deploy手順を維持する。
