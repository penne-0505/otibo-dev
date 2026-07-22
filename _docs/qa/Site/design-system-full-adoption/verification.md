---
title: "QA Verification: design system full adoption"
status: active
draft_status: n/a
qa_status: verified
risk: Medium
created_at: 2026-07-11
updated_at: 2026-07-11
references:
  - "_docs/qa/Site/design-system-full-adoption/test-plan.md"
  - "_docs/intent/Site/design-system-full-adoption/decision.md"
  - "_docs/plan/Site/design-system-full-adoption/plan.md"
  - "TODO.md"
related_issues: []
related_prs: []
---

# QA Verification: `Site-Refactor-19`

## Summary

公開ページのcolor、spacing、size、radius、typographyを`@otibo/ui@0.3.0` tokenへ移行し、
account deletion CTAをButton primitiveへ移行した。shader固有表現とpage compositionを維持したまま、
system-first baselineをlocalhostで確認できる状態にした。

## Verification Verdict

Verdict: PASS

- **Rationale**: 全AC / INVをautomated gate、static review、desktop / mobile / legalの
  browser QAで確認した。system適用結果として観察された密度差は不具合ではなく、次のvisual tuningの
  判断材料として分離できている。

## Commands Run

```text
npx biome check --write <changed files>
npm run lint
npm run typecheck
npm test -- --run
npm run build
npm run deploy:dry-run
rg <CSS literal scan>
git diff --check
```

## Automated Test Results

- Biome: 27 files、errorなし。
- TypeScript: `tsc --noEmit` PASS。
- Vitest: 1 file / 10 tests PASS。
- Next build: 9 pagesをstatic prerender。
- Wrangler dry-run: 496 assets、bindingなし、exit 0。
- CSS scan: shader / fallback色、layout geometry、border width以外のvisual literalをsystem tokenへ移行。

## Manual QA Results

- desktop: First View、Principle、Products、Contactの順序とdocument幅を維持。
- mobile 390x844: First Viewは844px、document-level horizontal overflowなし。
- media rail: 2画像は301px viewport / 504px content、1画像は301px / 301pxを維持。
- account deletion: Button primitiveが`A`要素へpolymorphic renderされ、system class / size / colorを適用。
- legal table: 初回確認で3px overflowを検出し、`table-layout: fixed`と`overflow-wrap: anywhere`で
  321px content幅内へ修正。
- browser consoleにsite由来のerror / warningなし。

## Acceptance Criteria Coverage

- AC-001: PASS — semantic color、spacing、size、radius、typography、motion tokenへ移行。
- AC-002: PASS — Badge、Link、Separator、ScrollArea、Buttonを対応箇所で使用。
- AC-003: PASS — shader / fallback固有色とsection順を維持。
- AC-004: PASS — desktop / mobile / legalのoverflow、media、table、primitive recipeを確認。
- AC-005: PASS — lint、typecheck、unit、build、Workers dry-runが成功。

## Invariant Coverage

- INV-001: PASS — token化可能なvisual valueをsystem tokenへ移行。
- INV-002: PASS — shader / fallbackの光学色は変更していない。
- INV-003: PASS — TSXのpage compositionとsection順を維持。
- INV-004: PASS — system適用後の密度差を独自scaleで補正していない。
- INV-005: PASS — static export / Workers asset-only dry-runを維持。

## Improvement Candidates Observed

- `@otibo/ui` base styleが`html`と`body`の双方へ`--font-sizes-md`を指定するため、root 18pxに対して
  bodyは20.25pxになる。トップの本文密度は従来より大きく、system側のbase contractとして再検討候補。
- Principle見出しとproduct名はsystem scaleに揃ったが、desktopで本文との差が大きい。次のvisual tuningでは
  token自体を変えるか、用途別typography tokenを追加するかを先に判断する。
- Button secondaryは法務CTAとして十分視認できる一方、削除申請という重要度に対してprimary intentが
  適切かはcontent hierarchyの判断余地がある。

## Deferred / Not Covered

- 上記改善候補の調整。
- production deploy。

## Residual Risks

None

## Follow-up TODOs

- なし。改善候補はユーザーの画面評価後に必要なものだけ別タスク化する。
