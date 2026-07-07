---
title: "QA Verification: First View light shader local foundation"
status: active
draft_status: n/a
qa_status: verified
risk: Medium
created_at: 2026-07-10
updated_at: 2026-07-10
references:
  - "_docs/qa/Site/first-view-light-shader/test-plan.md"
  - "_docs/intent/Site/first-view-light-shader/decision.md"
  - "_docs/plan/Site/first-view-light-shader/plan.md"
  - "_docs/draft/Site/otibo-light-shader-handoff/notes.md"
  - "_docs/reference/Site/visual-canon/reference.md"
  - "_docs/plan/Site/top-page-rebuild/plan.md"
  - "TODO.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/qa/Site/first-view-light-shader/verification.md -->

# QA Verification: `Site-Enhance-14`

## Summary

PoC完了済みの`layered-v5`をServer-rendered First View、Client canvas、standalone WebGL engine、
precomputed height textureへ再構成した。旧Products / About / Contact / Footerを`/`から外し、browser
default marginのないshader-onlyローカル制作基盤として閉じた。この状態はproduction deployしない。

## Verification Verdict

**Verdict: PASS**

全AC / INVをunit、static review、production artifactのbrowser QA、build / dry-runで確認した。
完成トップページの設計とproduction visual verdictは`Site-Feat-17`の別taskで扱う。

## Commands Run

```text
npm run assets:first-view
npm run lint
npm run typecheck
npm test
npm run build
npm run deploy:dry-run
npm start
browser QA at 1440x900 and 390x844
browser QA with prefers-reduced-motion: reduce
browser QA with ?light-debug=material|light|fallback
browser QA with WEBGL_lose_context
computed style / DOM inspection for shader-only baseline
```

## Automated Test Results

- Vitest: diagnostic boundaryとmotion policyの10 tests PASS。
- Height map: deterministic build scriptから`512x1024`、502,583 bytesのPNGを生成。
- Biome / TypeScript / Next.js build / Wrangler dry-run: PASS。
- static build: `/`と法務6 route、`/_not-found`をstatic prerender。
- Wrangler dry-run:490 assets、`No bindings found`、exit 0。

## Manual QA Results

- 通常motion: 600 ms差のscreenshot SHA-256が不一致で、緩やかな変化を確認。
- reduced motion: 600 ms差のscreenshot SHA-256が一致し、静止を確認。
- forced fallback: canvas opacity `0`、`otibo` visible、status `forced-fallback`。
- material / light diagnostic: screenshot hashが異なり、named contributionを区別できた。
- context loss / restore: `ready → context-lost → ready`を確認。
- 1440x900 shader-only artifact:
  - body margin `0px`、document `1440x900`、First View rect `[0, 0, 1440, 900]`。
  - `main`の子は1、直下sectionは1、見出しは`otibo`だけ、canvas status `ready`。
- 390x844 shader-only artifact:
  - body margin `0px`、document `390x844`、First View rect `[0, 0, 390, 844]`。
  - `main`の子は1、見出しは`otibo`だけ、canvas status `ready`。
- Workers local artifact由来のbrowser console error / warningなし。

## Acceptance Criteria Coverage

- AC-001: PASS — First Viewは光と`otibo`のみでbaselineの光層を維持。
- AC-002: PASS — development buildのnamed diagnostic 3種とforced fallbackを確認。
- AC-003: PASS — 1440x900 / 390x844の寸法と視覚比較を記録。
- AC-004: PASS — policy unit test、通常 / reduced screenshot、visibility lifecycleのstatic review。
- AC-005: PASS — WebGL2 null / compile / linkは同じfallback契約へ接続し、forced fallbackと実context loss / restoreをbrowser確認。
- AC-006: PASS — SSR heading / CSS fallbackとprecomputed assetを確認し、runtime procedural generationなし。
- AC-007: PASS — body margin 0、documentとviewport寸法一致、白枠なし。
- AC-008: PASS — `/`はFirst View一つ。local-only / no-deploy境界をPlan・Intent・TODOへ記録。
- AC-009: PASS — static exportとWorkers dry-run成功。本番deployは未実施。

## Invariant Coverage

- INV-001: PASS — First View DOMはfallback、canvas、`h1`のみ。
- INV-002: PASS — baseline shader contributionとbounded rangeを維持。
- INV-003: PASS — production buildはquery diagnosticを無効化し、visible controlなし。
- INV-004: PASS — pure policy testとmotion / visibility lifecycle review。
- INV-005: PASS — AC-005と同じ。
- INV-006: PASS — precomputed assetとServer-rendered fallbackを確認。
- INV-007: PASS — pageはServer Component、canvas lifecycleだけclient boundary。
- INV-008: PASS — static exportとasset-only Wrangler dry-run / local deliveryを確認。
- INV-009: PASS — shader-only stateをproduction deployしないとTODO / Plan / Intentへ記録。
- INV-010: PASS — 旧下流sectionをDOMと`app/page.tsx`から外し、`Site-Feat-17`へ分離。
- INV-011: PASS — global resetとcomputed style / rectでfull-viewport表示を確認。

## Deferred / Not Covered

- production domain deploy。shader-only stateでは実行禁止。
- First View以降のinformation architecture、copy、proof unit、CSS stack選定。`Site-Feat-17`で扱う。
- GPU vendor / browserを横断したperformance profile。
- baseline captureのdurable reference昇格。

## Residual Risks

None

## Follow-up TODOs

- `Site-Feat-17`: proof unitを一つ選び、完成トップページをFirst View foundationから再設計する。
