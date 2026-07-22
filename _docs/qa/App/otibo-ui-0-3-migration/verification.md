---
title: "QA Verification: @otibo/ui 0.3 migration"
status: active
draft_status: n/a
qa_status: verified
risk: Medium
qa_schema: 2
created_at: 2026-07-11
updated_at: 2026-07-17
references:
  - "_docs/qa/App/otibo-ui-0-3-migration/test-plan.md"
  - "_docs/intent/App/otibo-ui-0-3-migration/decision.md"
  - "_docs/plan/App/otibo-ui-0-3-migration/plan.md"
  - "TODO.md"
related_issues: []
related_prs: []
---

# QA Verification: `App-Refactor-18`

## Summary

`@otibo/ui@0.3.0` の自己完結CSSとprimitiveへ移行し、consumer-side Pandaを
runtime / build経路から外した。自動gate、Workers dry-run、desktop / mobileの
browser QAで全AC、影響するDEC、strict INVを確認した。

## Verification Verdict

Verdict: PASS

- **Rationale**: `@otibo/ui@0.3.0` の自己完結CSSとprimitiveへ移行し、consumer-side
  Pandaをruntime / build経路から外した。自動gate、Workers dry-run、desktop / mobileの
  browser QAで全AC、影響するDEC、strict INVを確認した。

## Commands Run

```text
npm run lint
npm run typecheck
npm test -- --run
npm run build
npm run deploy:dry-run
npm ls @otibo/ui @pandacss/dev gen-interface-jp
rg -n "@pandacss|styled-system|panda codegen|gen-interface-jp" app package.json package-lock.json tsconfig.json next.config.mjs QUICKSTART.md
git diff --check
```

## Automated Test Results

- Biome: 27 files、errorなし。
- TypeScript: `tsc --noEmit` PASS。
- Vitest: 1 file / 10 tests PASS。
- Next build: `/`、法務6 route、`/_not-found` の9 pageをstatic prerender。
- Wrangler dry-run: `out/` の496 assetsを読み込み、bindingなし、exit 0。
- dependency tree: `@otibo/ui@0.3.0`。`@pandacss/dev` / `gen-interface-jp`は不在。
- runtime / build sourceのPanda参照は0件。`tsconfig.json`のexcludeは、削除待ちartifactを
  build対象外にするための境界として残した。

## Manual QA Results

- 1440x900: First Viewは900px、`Principle -> Products -> Contact` の順序を維持し、
  document-level horizontal overflowなし。
- 390x844: First Viewは844px、document-level horizontal overflowなし。
- Medoのmedia rail: viewport 301px / content 504px。実操作で`scrollLeft`が0から203へ変化した。
- 画像1枚のSaraeはmedia railの余分な横幅を作らず、2枚のMedo / Stashだけ横移動を持つ。
- `/medo/privacy`: 720px prose、見出し、4 tables、mailto / external / account deletion linksを確認。
- browser consoleにサイト由来のerror / warningなし。Electron固有のdevelopment warningのみ。

## Acceptance Criteria Coverage

- AC-001: PASS — 0.3.0とrootの`@otibo/ui/styles.css`を使用。
- AC-002: PASS — Panda / styled-systemをruntime / build sourceから除外。
- AC-003: PASS — 法務route、本文、URL、表と可読幅を維持。
- AC-004: PASS — First Viewとtop pageの4段階構成を維持。
- AC-005: PASS — lint / typecheck / unit / static build / Workers dry-runが成功。

## Decision Conformance

| ID | Result | Why the implementation remains aligned |
| --- | --- | --- |
| DEC-001 | PASS | 公開stylesheetだけをrootで読み、consumer-side Pandaをruntime / build経路から外した。 |
| DEC-002 | PASS | page compositionはapp側に残し、ScrollAreaはmedia railへ限定した。 |
| DEC-003 | PASS | route / visual / deployを回帰確認し、旧artifactの恒久削除は行わなかった。 |

## Invariant Coverage

- INV-002: PASS — Panda codegen script / dependency / source importなし。

## Deferred / Not Covered

- `panda.config.ts` と `styled-system/` は参照されない旧artifactとして残る。恒久削除は
  repositoryの削除方針に従い、ユーザー承認後に行う。
- production deployは今回のscope外で、実行していない。

## Residual Risks

None

## Follow-up TODOs

- なし。旧Panda artifactの削除は任意のrepository cleanupとして扱う。
