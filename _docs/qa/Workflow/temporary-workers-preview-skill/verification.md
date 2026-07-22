---
title: "QA Verification: Temporary Workers preview skill"
status: active
draft_status: n/a
qa_status: verified
risk: Medium
qa_schema: 2
created_at: 2026-07-18
updated_at: 2026-07-18
references:
  - "_docs/intent/Workflow/temporary-workers-preview-skill/decision.md"
  - "_docs/plan/Workflow/temporary-workers-preview-skill/plan.md"
  - "_docs/qa/Workflow/temporary-workers-preview-skill/test-plan.md"
related_issues: []
related_prs: []
---

# QA Verification: Temporary Workers preview skill

## Summary

repo-local skill、共有helper script、Workflow Intent / Plan / QAを追加した。
`--prepare-only`でisolated dependency install、Next.js static export、5 MiB超画像の
preview-only resize、temporary Wrangler config生成まで実行し、Wrangler dry-runで
495 assetsが受理されることを確認した。

## Verification Verdict

Verdict: PASS

## Commands Run

```bash
bash -n scripts/deploy-temporary-workers-preview.sh
cmp .agents/skills/temporary-workers-preview/SKILL.md \
  .claude/skills/temporary-workers-preview/SKILL.md
sha256sum public/first-view/light-height-map.png
scripts/deploy-temporary-workers-preview.sh --help
scripts/deploy-temporary-workers-preview.sh --prepare-only
find /tmp/otibo-temporary-workers-preview-AO95dh/assets -type f -size +5242880c
file /tmp/otibo-temporary-workers-preview-AO95dh/assets/first-view/light-height-map.png
wrangler deploy --config /tmp/otibo-temporary-workers-preview-AO95dh/wrangler.temporary.jsonc --dry-run
git diff --check -- <scoped files>
git diff -- wrangler.jsonc
deno run --allow-read --allow-env --allow-run=git scripts/validate-frontmatter.mjs <scoped docs>
deno run --allow-read --allow-env --allow-run=git scripts/validate-intent.mjs <intent>
deno run --allow-read --allow-env --allow-run=git scripts/validate-qa.mjs <test-plan>
deno run --allow-read --allow-env --allow-run=git scripts/validate-doc-links.mjs <scoped docs>
```

## Automated Test Results

| Command / Test | Result | Notes |
| --- | --- | --- |
| shell syntax / help | PASS | `bash -n`と`--help`がexit 0。 |
| skill mirror | PASS | `.agents`と`.claude`のSKILL.mdはbyte-identical。 |
| `--prepare-only` | PASS | isolated `npm ci`と全9 static page buildが成功。 |
| oversized asset adaptation | PASS | 17,364,753-byte source PNGから3,276,921-byte preview copyを生成。 |
| source preservation | PASS | source PNG SHA-256は`48d0637...79b6f5e`で実行前後不変。 |
| temporary config | PASS | custom domain / routesなし、staged assetsだけを参照。 |
| Wrangler dry-run | PASS | Wrangler 4.110.0が495 assetsを受理し、bindingなしでexit 0。 |
| scoped docs validators | PASS | frontmatter、intent、QA、doc linksがexit 0。 |

## Manual QA Results

| Checklist Item | Result | Notes |
| --- | --- | --- |
| temporary / production boundary | PASS | skillは明示的な短期previewだけをtriggerにする。 |
| claim URL handling | PASS | bearer credentialとして依頼者以外へ共有しないと明記。 |
| non-image oversized branch | PASS | app-aware transformなしのbyte分割を拒否する。 |
| non-interactive execution | PASS | skillはnon-TTY、scriptは`CI=1`を強制する。 |

## Acceptance Criteria Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| AC-001 | PASS | model-invoked descriptionがshort-lived public preview、workers.dev、phone snapshotをtriggerに含む。 |
| AC-002 | PASS | `/tmp/otibo-temporary-workers-preview-AO95dh`内だけでbuildとresizeを実行。 |
| AC-003 | PASS | credential env unset、isolated HOME/XDG、`CI=1`をstatic review。 |
| AC-004 | PASS | preview PNGだけ3.28 MBへ縮小し、source hashは不変。non-image拒否branchあり。 |
| AC-005 | PASS | generated configにproduction routeなし。live branchは全公開index routeを検証する。 |
| AC-006 | PASS | 両skillが同一helper pathを参照し、skill本文もbyte-identical。 |

## Decision Conformance

| ID | Result | Why the implementation remains aligned |
| --- | --- | --- |
| DEC-001 | PASS | source copy、install、build、resizeをfresh `/tmp` stagingへ閉じた。 |
| DEC-002 | PASS | permanent authをlogoutせず、non-interactive isolated configでtemporary deployする。 |
| DEC-003 | PASS | imageだけ同URL・同formatでresizeし、non-imageは停止する。 |
| DEC-004 | PASS | production `wrangler.jsonc`を読まず、routeなしconfigをstagingへ生成する。 |

## Invariant Coverage

- INV-001: PASS — source image hashとproduction config diffが不変。
- INV-002: PASS — helperにlogin / logout変更がなく、isolated credential stateだけを使用。
- INV-003: PASS — dry-run対象configに`routes` / `custom_domain`なし。

## Deferred / Not Covered

- helperによる新規live deploymentは、今回のskill作成依頼には含まれないため実行していない。
  同じWrangler temporary flow、asset adaptation、live routeは2026-07-17の手動previewで確認済み。

## Residual Risks

None

## Follow-up TODOs

- None.
