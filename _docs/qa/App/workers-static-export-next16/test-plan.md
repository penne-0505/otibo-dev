---
title: "QA Test Plan: Workers static export and Next.js 16 baseline"
status: active
draft_status: n/a
qa_status: planned
risk: Medium
qa_schema: 2
created_at: 2026-07-10
updated_at: 2026-07-17
references:
  - "_docs/intent/App/workers-static-export-next16/decision.md"
  - "_docs/plan/App/workers-static-export-next16/plan.md"
  - "_docs/qa/Site/first-view-light-shader/test-plan.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/qa/App/workers-static-export-next16/test-plan.md -->

# QA Test Plan: `App-Enhance-15` — Workers static export and Next.js 16 baseline

## Source of Intent

- TODO: `App-Enhance-15`
- Plan: `_docs/plan/App/workers-static-export-next16/plan.md`
- Intent: `_docs/intent/App/workers-static-export-next16/decision.md`

## Quality Goal

dependency update 後も既存 route と Panda CSS consumer integration が成立し、生成された `out/` を
Cloudflare Workers Static Assets が受理することを、local build と deploy dry-run の連続した証跡で示す。

## Acceptance Criteria

- AC-001: Next.js 16 / React 19 / `@otibo/ui@0.2.0` / Panda CSS 1.11 の dependency tree に invalid peer がない。
- AC-002: lint、typecheck、test、Panda codegen、Next.js production build が成功する。
- AC-003: 全公開 route が static export され、deploy artifact が `out/` に生成される。
- AC-004: lockfile に固定された Wrangler で Workers Static Assets の deploy dry-run が成功する。
- AC-005: Node.js 22 以上と build-time environment variable の運用境界が文書化される。
- AC-006: OpenNext、Worker script、runtime binding を導入していない。

## Decision Review Scope

- DEC-001: static export artifactとWorkers Static Assets。
- DEC-002: asset-only runtime boundary。
- DEC-003: build-time environment semantics。
- DEC-004: reproducible framework / deployment tooling。

## Intent-derived Invariants

- INV-001: production artifact は Next.js static export の `out/` である。
- INV-002: deploy 構成に Worker script、OpenNext adapter、runtime binding を追加しない。
- INV-003: build-time value を Workers runtime environment variable として扱わない。

## Risk Assessment

- **Risk level**: Medium
- **Risk rationale**: framework、UI library、CSS codegen、deployment CLI を同時に更新するため、build success だけでは deploy compatibility を判断できない。
- **Regression risk**: Panda class 欠落、React hydration error、static export 不可 route、Wrangler config schema drift。
- **Data safety risk**: なし。dry-run のみで production state を変更しない。
- **Security / privacy risk**: secret を扱わず、`.env` 実値を読み取らない。
- **UX risk**: dependency migration による既存ページの styling / interaction regression。

## Test Strategy

- **Dependency**: `npm ls` と package metadata で peer / engine を確認する。
- **Unit**: Vitest runner の smoke test を追加し、以後の First View policy test の基盤にする。
- **Static**: Biome、TypeScript、Wrangler config schema を確認する。
- **Integration**: Panda codegen と Next.js build を同じ install tree で実行する。
- **Deployment**: package script 経由で Wrangler dry-run を実行する。
- **E2E / Manual**: desktop / mobile で既存 route を開き、console error と主要 content を確認する。

## Test Matrix

| ID | Source | Requirement / Optional Invariant | Test Type | Command / File | Expected Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AC-001 | TODO | dependency compatibility | Dependency | `npm ls --depth=1` | invalid peer / missing dependency なし | planned |
| AC-002 | TODO | local quality gates | Static + Integration | `npm run lint && npm run typecheck && npm test && npm run build` | 全 command exit 0 | planned |
| AC-003 | TODO | static route export | Integration | `npm run build`、`find out` | 公開 route HTML と assets が `out/` に存在 | planned |
| AC-004 | TODO | Workers asset upload | Deployment | `npm run deploy:dry-run` | asset bundle と config を受理 | planned |
| AC-005 | TODO | build environment boundary | Docs + Static | `package.json`、`QUICKSTART.md` review | Node >=22、build variable と再 build 条件を明記 | planned |
| AC-006 | TODO | server runtime 非導入 | Diff review | `next.config.mjs`、`wrangler.jsonc` | adapter / main / binding なし | planned |
| INV-001 | intent | `out/` artifact | Integration | AC-003 と同じ | Wrangler source と build output が一致 | planned |
| INV-002 | intent | asset-only deployment | Static | `wrangler.jsonc` schema / diff review | assets 以外の runtime entry なし | planned |
| INV-003 | intent | env boundary | Docs | AC-005 と同じ | runtime binding と誤記しない | planned |

## Manual QA Checklist

- [ ] `/`、`/privacy`、`/terms`、`/medo/account-deletion` が表示される。
- [ ] desktop / mobile で主要な layout と typography が崩れていない。
- [ ] browser console に hydration、CSS、resource error がない。

## Regression Checklist

- [ ] `@otibo/ui` の Panda build info が consumer CSS に反映される。
- [ ] `out/` の path と Wrangler assets directory が一致する。
- [ ] `next start` を static export の production 手順として案内していない。
- [ ] global Wrangler に依存していない。
- [ ] production deploy を実行していない。

## Out of Scope

- First View shader の visual / motion QA。
- production domain への deploy。
- server-side Next.js feature。

## Open Questions

- なし。Cloudflare Workers Static Assets は固定された deployment invariant とする。
