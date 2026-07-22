---
title: "Intent: Disposable Temporary Workers previews"
status: active
draft_status: n/a
intent_schema: 2
created_at: 2026-07-18
updated_at: 2026-07-18
references:
  - "_docs/plan/Workflow/temporary-workers-preview-skill/plan.md"
  - "_docs/qa/Workflow/temporary-workers-preview-skill/test-plan.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/intent/Workflow/temporary-workers-preview-skill/decision.md -->

## Context

`otibo-dev`のcurrent worktreeをスマートフォンや外部端末から短時間確認する際、
Temporary Workersはproduction accountやcustom domainを変更せず公開URLを発行できる。
一方、既存Cloudflare認証、Wranglerの対話TTY、5 MiB per-file limit、dirty worktree上の
build-time valueが、再実行時の停止やsource改変を招き得る。

## Decisions

### DEC-001: previewを隔離snapshotとしてbuildする

- **What**: current worktreeを`/tmp`へcopyし、その中でdependency install、static export、
  oversized imageの変換を行う。
- **Why**: dirty worktreeの現状を入力にしながら、source asset、生成物、依存関係を
  preview都合で変更しないため。
- **Change freedom**: copy手段、staging path、image resize algorithmは、source非変更と
  public artifactの明示を保つ限り変更できる。

### DEC-002: Temporary Workersを非対話かつ既存認証から隔離して実行する

- **What**: explicitな公開依頼後だけ、TTYなし、`CI=1`、isolated HOME/XDG、
  Cloudflare credential環境変数unsetで`wrangler deploy --temporary`を実行する。
- **Why**: 規約確認promptでagentを停止させず、ユーザーの恒久Cloudflare loginを
  logout・上書きしないため。
- **Change freedom**: Wranglerが非対話temporary accountと認証profileを正式分離する場合、
  同じ無停止・恒久認証非変更を満たす新しいCLI経路へ変更できる。
- **Why not**: `wrangler logout`はpreviewのために既存の利用可能な認証状態を破壊する。

### DEC-003: 5 MiB limitはconsumer semanticsを壊さない範囲だけ自動変換する

- **What**: copied artifact内のoversized raster imageだけを縮小し、oversized non-imageは停止する。
- **Why**: imageの解像度変更は同じURLとdecode contractを維持できるが、任意binaryのbyte分割は
  consumer側の参照・復元処理なしでは壊れたartifactになるため。
- **Change freedom**: image format変換やapp-aware chunkingは、consumer変更とlive verificationを
  同時に行う場合に追加できる。

### DEC-004: preview configをproduction configから生成しない

- **What**: assets directoryだけを持つtemporary configをstaging directoryへ生成し、
  repositoryの`wrangler.jsonc`をdeployへ渡さない。
- **Why**: `otibo.dev` custom domain routeを一時アカウントへ適用せず、production deployと
  preview deployの外部状態を分離するため。
- **Change freedom**: Cloudflareが安全なpreview environment overrideを提供した場合、
  production routeが除外されることを検証したうえで置換できる。

## Consequences / Impact

- 初回と再実行にはisolated `npm ci`の時間がかかる。
- 5 MiB超画像を含むpreviewはproduction artifactとpixel-levelでは一致しない。
- Temporary Workers URLとclaim URLは約60分で期限切れになる。
- 未知のbuild environment keyやoversized non-imageは、無停止より公開安全性を優先して停止する。

## Quality Implications

- source treeとproduction Wrangler configのdiffがpreview処理で増えないこと。
- agentがTTY、logout、source image resizeへ逸脱しないこと。
- preview-only変換とclaim URLの機密性を完了報告で明示すること。
- exported HTML routesと変換assetをlive URLで検証してから完了扱いにすること。

## Intent-derived Invariants

- INV-001 (from DEC-001): preview都合のbuild・asset変換はsource worktreeを変更しない。
- INV-002 (from DEC-002): temporary deployはユーザーの恒久Cloudflare認証を変更しない。
- INV-003 (from DEC-004): temporary deployはproduction custom domain routeを適用しない。

## Enforced in (optional)

- DEC-001 / INV-001: `scripts/deploy-temporary-workers-preview.sh`
- DEC-002 / INV-002: `.agents/skills/temporary-workers-preview/SKILL.md`,
  `.claude/skills/temporary-workers-preview/SKILL.md`,
  `scripts/deploy-temporary-workers-preview.sh`
- DEC-003: `scripts/deploy-temporary-workers-preview.sh`
- DEC-004 / INV-003: `scripts/deploy-temporary-workers-preview.sh`

## Rollback / Follow-ups

- skill、helper script、対応するWorkflow docsを削除すればproduct runtimeへの影響なく戻せる。
- Cloudflareのtemporary account仕様またはasset limit変更時に、CLI sourceと公式docsを再確認する。
