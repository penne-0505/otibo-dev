---
title: "QA Test Plan: Temporary Workers preview skill"
status: active
draft_status: n/a
qa_status: planned
risk: Medium
qa_schema: 2
created_at: 2026-07-18
updated_at: 2026-07-18
references:
  - "_docs/intent/Workflow/temporary-workers-preview-skill/decision.md"
  - "_docs/plan/Workflow/temporary-workers-preview-skill/plan.md"
related_issues: []
related_prs: []
---

# QA Test Plan: Temporary Workers preview skill

## Source of Intent

- TODO: None; direct user request.
- Plan: `_docs/plan/Workflow/temporary-workers-preview-skill/plan.md`
- Intent: `_docs/intent/Workflow/temporary-workers-preview-skill/decision.md`

## Quality Goal

現在のdirty worktreeを変更せず、Next.js static exportを一時Cloudflareアカウントへ
人間の途中入力なしで公開できる、再利用可能なrepo-local skillを提供する。

## Acceptance Criteria

- AC-001: skillが明示的な一時公開依頼で自動的に選択される。
- AC-002: buildとasset加工は隔離した一時コピーだけで行われる。
- AC-003: Wranglerは既存Cloudflare認証を変更せず、非対話の一時認証環境で実行される。
- AC-004: 5 MiB超の画像は公開用コピーだけを縮小し、非画像は黙って変換しない。
- AC-005: 本番custom domainを含まない一時configを使用し、公開URLと全公開HTML routeを検証する。
- AC-006: `.agents/skills`と`.claude/skills`から同一の実行scriptへ到達できる。

## Decision Review Scope

- DEC-001: previewを隔離snapshotとしてbuildする。
- DEC-002: Temporary Workersを非対話かつ既存認証から隔離して実行する。
- DEC-003: 5 MiB limitはconsumer semanticsを壊さない範囲だけ自動変換する。
- DEC-004: preview configをproduction configから生成しない。

## Intent-derived Invariants

- INV-001: preview都合のbuild・asset変換はsource worktreeを変更しない。
- INV-002: temporary deployはユーザーの恒久Cloudflare認証を変更しない。
- INV-003: temporary deployはproduction custom domain routeを適用しない。

## Risk Assessment

- **Risk level**: Medium
- **Risk rationale**: 外部公開と一時認証情報を扱い、誤ったrouteやsource assetの変更は本番状態やdirty worktreeへ影響し得る。
- **Regression risk**: preview専用手順がproduction deploy設定へ混入する。
- **Data safety risk**: build-time environment valuesがstatic HTMLへ入るため、未知の環境変数を無検査で公開しない。
- **Security / privacy risk**: claim URLと一時API tokenをログ以外へ保存・共有しない。
- **UX risk**: 画像縮小によりFirst Viewの見え方が原寸artifactと異なる。
- **Agent misbehavior risk**: TTYを割り当てる、既存Cloudflareアカウントをlogoutする、source imageを直接縮小する。

## Test Strategy

- **Static**: shell syntax、skill mirror、禁止操作と必須flagを検査する。
- **Integration**: `--prepare-only`でisolated build、5 MiB検査、preview config生成を実行する。
- **Deployment**: このskill作成時には新しい外部デプロイを行わない。
- **Diff review**: product source、`wrangler.jsonc`、既存assetが変更されていないことを確認する。

## Test Matrix

| ID | Source | Requirement / Optional Invariant | Test Type | Command / File | Expected Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AC-001 | user | model-invoked trigger | static | skill frontmatter review | temporary previewの依頼をdescriptionが含む | planned |
| AC-002 | user | isolated build | integration | preview script `--prepare-only` | `/tmp`配下にsourceとassetsを生成 | planned |
| AC-003 | user | non-interactive isolated auth | static | script review | `CI=1`、isolated HOME/XDG、credential env unset | planned |
| AC-004 | user | oversized asset handling | integration | `--prepare-only`と`find` | 全assetが5 MiB以下、source imageは不変 | planned |
| AC-005 | user | temporary-only config and route checks | static | generated config / script review | custom domainなし、live modeにroute verificationあり | planned |
| AC-006 | user | cross-agent reach | static | `cmp`とpath review | skill mirrorが同一scriptを参照 | planned |
| INV-001 | intent | source worktree preservation | integration | `npm run build` via `--prepare-only` | staged `out/`からpreview assetsを作成しsource hash不変 | planned |
| INV-002 | intent | permanent auth preservation | static | script review | logoutなし、isolated credential state | planned |
| INV-003 | intent | product config preservation | diff review | `git diff -- wrangler.jsonc` | preview変更なし | planned |

## Manual QA Checklist

- [ ] skillが一時公開と通常のproduction deployを混同しない。
- [ ] claim URLを認証情報として扱う注意が明記されている。
- [ ] 画像以外のoversized assetで停止する分岐が明記されている。

## Regression Checklist

- [ ] `wrangler.jsonc`のcustom domain設定をpreview deployへ渡さない。
- [ ] repo rootの`.env.local`、`public/`、`out/`を加工しない。
- [ ] `wrangler logout`を実行しない。
- [ ] TTY付きで`wrangler deploy --temporary`を実行しない。

## Out of Scope

- Temporary Workersの5 MiB制限なしでの原寸画像配信。
- production domainへのdeploy。
- Cloudflare Quick Tunnel。

## Open Questions

- None.
