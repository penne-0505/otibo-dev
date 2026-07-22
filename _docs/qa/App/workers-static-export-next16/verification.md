---
title: "QA Verification: Workers static export and Next.js 16 baseline"
status: active
draft_status: n/a
qa_status: partial
risk: Medium
qa_schema: 2
created_at: 2026-07-10
updated_at: 2026-07-17
references:
  - "_docs/qa/App/workers-static-export-next16/test-plan.md"
  - "_docs/intent/App/workers-static-export-next16/decision.md"
  - "_docs/plan/App/workers-static-export-next16/plan.md"
  - "TODO.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/qa/App/workers-static-export-next16/verification.md -->

# QA Verification: `App-Enhance-15`

## Summary

Next.js 16.2.10 / React 19.2.7 / `@otibo/ui@0.2.0` / Panda CSS 1.11.4 へ更新し、
全 route の static export、Wrangler 4.110.0 の asset-only dry-run、Workers local server の
browser smoke testまで成功した。最新 Next.js が内部固定する PostCSS の moderate advisory だけを
upstream follow-up として分離する。

## Verification Verdict

Verdict: PARTIAL

- **Rationale**: 全 AC / INV は成立するが、production dependency audit に安全な local fix のない
  upstream PostCSS advisory が残る。`App-Chore-16` で追跡する。

## Commands Run

```text
node --version
npm ls --depth=1
npm run lint
npm run typecheck
npm test
npm run build
npm run deploy:dry-run
npm start
npm audit --omit=dev
npm audit
curl <Workers local route>
```

## Automated Test Results

- Node.js: `v24.14.1`。package engine `>=22` を満たす。
- Dependency tree: React 19.2.7、React DOM 19.2.7、Next.js 16.2.10、Panda CSS 1.11.4、
  Base UI 1.6.0、`@otibo/ui@0.2.0` に invalid peer / missing required dependency なし。
- Biome: 23 files、error なし。
- TypeScript: `tsc --noEmit` PASS。
- Vitest: 1 file / 10 tests PASS。
- Panda codegen: `prepare` と build 前処理で PASS。
- Next build: `/` と法務6 route、`/_not-found` をすべて static prerender。
- Wrangler dry-run: `out/` から490 assetsを読み込み、`No bindings found`、exit 0。
- Workers local server: 全7公開 URL が HTTP 200。

## Manual QA Results

- Workers local server の `/` で First View canvas が `data-status="ready"` へ遷移した。
- production artifact の browser console に `localhost:8787` 由来の error / warning はなかった。
- `/tokushoho/`、Medo 3 route、`/sarae/`、`/stash/` を asset server から取得できた。
- 後続のcomputed style診断で、旧トップページと法務routeのPanda classに対応するstylesheetが
  読み込まれていないことを確認した。HTTP / static route smoke testはPASSだが、既存styleの
  behavior-preservationを確認したという以前の解釈は撤回する。
- production deploy は実行していない。

## Acceptance Criteria Coverage

- AC-001: PASS — dependency tree と registry peer metadata を確認。
- AC-002: PASS — lint / typecheck / test / codegen / build が成功。
- AC-003: PASS — 全公開 route と not-found が `out/` へ static export された。
- AC-004: PASS — lockfile の Wrangler 4.110.0 で dry-run が成功。
- AC-005: PASS — `package.json` と `QUICKSTART.md` に Node >=22 と build variable 境界を記録。
- AC-006: PASS — `wrangler.jsonc` は assets directory のみで main / adapter / binding なし。

## Decision Conformance

| ID | Result | Why the implementation remains aligned |
| --- | --- | --- |
| DEC-001 | PASS | `output: "export"`の`out/`をWrangler assets directoryへ渡した。 |
| DEC-002 | PASS | Worker script、OpenNext、runtime bindingを導入しなかった。 |
| DEC-003 | PASS | environment valuesをbuild-time valueとして実装・文書化した。 |
| DEC-004 | PASS | declared Node engineとlockfile内Wranglerで全gateを実行した。 |

## Invariant Coverage

- INV-001: PASS — `next.config.mjs` の `output: "export"` と `out/` artifact を確認。
- INV-002: PASS — dry-run の `No bindings found` と config diff を確認。
- INV-003: PASS — environment values は build-time value として文書化。

## Deferred / Not Covered

- Cloudflare production domain への deploy と live smoke testは、ユーザーの明示指示なしに実行しない。
- `@otibo/ui` が将来 Panda CSS consumer requirement を外した場合の package cleanup は、その release 後に判断する。

## Residual Risks

- `next@16.2.10` 内部の `postcss@8.4.31` に `GHSA-qx2v-qp2m-jg93` の moderate advisory が
  2件残る。`npm audit fix --force` は Next.js 9.3.3 への破壊的 downgrade を提案するため不採用。
  当サイトは外部 CSS 入力を処理せず、該当 PostCSS は build-time のみで使われる。
- Panda codegenは成功するが、generated utility CSSをappへ読み込む配線がない。`/`は
  shader-only local baselineへ移したため影響を切り離した。法務routeと完成トップのCSS stackは
  `Site-Feat-17`でPanda継続 / CSS Modules中心のいずれかを判断し、production deploy前に検証する。

## Follow-up TODOs

- `App-Chore-16`: Next.js stable の内部 PostCSS 更新後に production audit と全 build gate を再実行する。
- `Site-Feat-17`: CSS stack決定後、法務routeを含むcomputed styleとvisual regressionを検証する。
