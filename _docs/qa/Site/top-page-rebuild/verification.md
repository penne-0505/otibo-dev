---
title: "QA Verification: Top page rebuild"
status: active
draft_status: n/a
qa_status: partial
risk: Medium
created_at: 2026-07-11
updated_at: 2026-07-13
references:
  - "_docs/intent/Site/top-page-rebuild/decision.md"
  - "_docs/plan/Site/top-page-rebuild/plan.md"
  - "_docs/qa/Site/top-page-rebuild/test-plan.md"
  - "../../../../prototypes/top-page-product-wireframe/design-qa.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/qa/Site/top-page-rebuild/verification.md -->

# QA Verification: `Site-Feat-17` — Top page rebuild

## Summary

2026-07-11時点の中間verification。オーナーの手描きスケッチをsource visualとして、Products領域の
product module構造だけをproduction外prototypeで確認した。Site-Feat-17全体のpage composition、
実asset / destination、principle / contact統合は未完了であり、本verificationは完了判定ではない。

## Verification Verdict

Verdict: PARTIAL

product module wireframeは局所的にPASS。Site-Feat-17は完了不可で、TODOに残す。

2026-07-11追記: Figma上でdesktop / mobileの4段階full-page compositionを作成し、責務順を確認した。
その後、mobile frameをFirst View一画面高、owner-authored Principle、mailto-only Contactへ同期し、同じ構造を
Next.js初版へ実装した。copy / statusの公開前確認、実logo / UI image / destination、production visual
approvalは未完了のためverdictはPARTIALを維持する。

2026-07-13追記: `@otibo/ui@0.4.0`へ更新し、productのlogo / fallbackを`LogoFrame`、UI image /
empty stateを`MediaFrame`、display / body / eyebrowを`textStyle`へ移行した。site CSSにはproduct情報列と
media railのcompositionだけを残した。desktop / mobileでsystem primitive適用後の表示を確認したが、
実UI imageと公開前のowner visual approvalは未完了のためverdictはPARTIALを維持する。

同日のvisual QAで、Products外枠、heading divider、product Separator、caption divider、mobileの
custom Scrollbarを除去した。section / product間は余白とsurface差で識別し、status badgeの細線と
link underlineだけを意味のある例外として残した。mobile media railはScrollbarなしで
`scrollLeft: 156`まで操作でき、document-level overflowも発生していない。

Google Playの公式preview asset要件を確認し、phone screenshotの推奨portrait比率`9:16`、推奨最小
`1080 × 1920px`をplaceholder寸法へ採用した。アプリ本体未完成のため中身は作らず、captionも
機能を断定しない内部識別子`Preview 01 / 02`へ変更した。可視captionは情報価値がないため表示しない。
1枚だけのproductはdesktopで2枚分の幅へ引き伸ばさない。

## Commands Run

```bash
cd prototypes/top-page-product-wireframe
npm install
npm run build

cd /home/penne/dev/active/otibo-dev
npx biome check app/page.tsx app/_components/top-page/TopPageContent.tsx app/_components/top-page/top-page.module.css
npm run typecheck
npm test -- --run
npm run build
npm run deploy:dry-run
DD_SCOPE_PATHS=... deno run --allow-read --allow-env --allow-run=git scripts/validate-frontmatter.mjs
deno run --allow-read scripts/validate-todo.mjs
DD_SCOPE_PATHS=... deno run --allow-read --allow-env --allow-run=git scripts/validate-doc-links.mjs
DD_SCOPE_PATHS=... deno run --allow-read --allow-env --allow-run=git scripts/validate-qa.mjs
git diff --check

# 2026-07-13 component migration
npm run lint
npm run typecheck
npm test -- --run
npm run build
npm run deploy:dry-run
./scripts/check-docs.sh
```

Browser QA:

- Codex in-app BrowserでNext.js初版を`1440x900`と`390x844`で確認。
- First View高はdesktop `900px`、mobile `844px`で各viewport高と一致。
- document-level horizontal overflowなし。mobile media railは2枚時だけproduct内で横送りになる。
- `Privacy` footer linkから`/medo/privacy/`へ遷移し、既存routeのtitle / contentを確認。
- desktopのcopy / media上端差を`0px`へ修正。
- mobileのpage-level horizontal overflowなし。
- Medoのprototype linkを一意に解決し、遷移を確認。
- local page由来のconsole warning / errorなし。
- 2026-07-13に`1440x900`でMedoの2枚media、`390x844`で局所horizontal railとContactへの接続を再確認。
- 2026-07-13のmobile documentは`scrollWidth === clientWidth`でpage-level horizontal overflowなし。
- 修正後の新規DOM snapshotにframework overlayなし。Browser console APIは同じbrowser sessionの修正前
  `textStyle()` RSC errorを履歴として返すため、現在状態の判定にはDOM snapshotとproduction buildを使用した。

## Automated Test Results

| Check | Result | Evidence |
| --- | --- | --- |
| Prototype build | PASS | Vite production build生成 |
| Root static build | PASS | Next.js static route 9件。prototype routeの混入なし |
| Biome / TypeScript / Vitest | PASS | 対象3ファイル、typecheck、10 tests |
| Workers dry-run | PASS | `out/`の490 assetsを読取り、bindingsなしでdry-run終了 |
| Scoped docs validators | PASS | front-matter / TODO / links / QA |
| Diff whitespace | PASS | `git diff --check` |
| `@otibo/ui@0.4.0` migration | PASS | lint / typecheck / 10 tests / static build / Workers dry-run |
| Docs wrapper | FAIL (pre-existing) | 今回のscope外にある過去3件のPASS verification residual-risk表記を検出 |

## Manual QA Results

| Check | Result | Evidence |
| --- | --- | --- |
| Source sketch comparison | PASS | `prototypes/top-page-product-wireframe/artifacts/comparison-final.png` |
| Badge placement | PASS | logo / product nameの上にstatus badge |
| One / multiple media | PASS | Sarae 1枚、Medo / Stash 2枚の同一contract |
| Desktop reading order | PASS | badge → identity → description → links、右側media |
| Mobile reading order | PASS | 情報列の後にmedia rail |
| Production isolation | PASS | root build route listにprototypeなし |
| Full-page responsibility order | PASS | Figma desktop `4:3` / mobile `4:93`で4段階を接続 |
| Next.js desktop / mobile composition | PASS | `1440x900` / `390x844`でFirst View → Principle → Products → Contact |
| Mobile overflow boundary | PASS | document `scrollWidth === clientWidth`、media railだけ局所overflow |
| Legal route interaction | PASS | footer `Privacy` → `/medo/privacy/` |
| Editorial primitives | PASS | MedoはLogoFrameImage、Sarae / StashはLogoFrameFallback、全mediaはMediaFrameEmptyを表示 |
| Border / divider reduction | PASS | Products外枠、heading / product / caption divider、mobile Scrollbarを除去 |
| Mobile rail interaction | PASS | custom Scrollbarなしでhorizontal scrollが`0 → 156`へ変化 |

## Acceptance Criteria Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| AC-001 | PASS | prototypeはproduction route / static exportへ含まれない |
| AC-002 | PASS | FigmaとNext.js初版で4段階を同順に接続 |
| AC-003 | PASS | root First Viewへ変更なし |
| AC-004 | PARTIAL | 全page体験は実装。product facts / assetsの公開前確認が未完了 |
| AC-005 | PARTIAL | Principle / contact / legalは追跡可。product status / destination / assetは未承認 |
| AC-006 | PARTIAL | desktop / mobile / semantic / internal keyboard linkを確認。全keyboard巡回とreduced-motion browser QAは未実施 |
| AC-007 | PASS | root static buildとWorkers dry-run成功 |
| AC-008 | PARTIAL | product module構造のみオーナー対話とwireframeで確認中 |

## Invariant Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| INV-001 | PASS | shader-only / wireframeをdeploy candidateにしていない |
| INV-002 | PASS | 旧sectionを復元していない |
| INV-003 | PASS | First Viewへ要素を追加していない |
| INV-004 | PASS | FigmaとNext.jsで4段階全体を統合 |
| INV-005 | PASS | prototype copyをfinal owner copyとして扱っていない |
| INV-006 | PASS | card / UI断片 / gridをproduction仕様へ固定していない |
| INV-007 | PARTIAL | placeholderはprototype限定。production材料は未確定 |
| INV-008 | PASS | legal routeとstatic exportを変更していない |
| INV-009 | PARTIAL | name / description / statusのslotのみ。公開値は未確認 |
| INV-010 | PARTIAL | placeholderはproduction非対象。実asset置換は未完了 |
| INV-011 | PASS | desktop / mobileともFirst View高がviewport高と一致 |
| INV-012 | PASS | logo / media / typography roleを`@otibo/ui@0.4.0`へ委譲し、site CSSではcompositionのみ保持 |
| INV-013 | PASS | section / product境界を余白とsurfaceで表現し、反復する外枠 / dividerを除去 |

## Deferred / Not Covered

- productごとの公開可能なdescription / status / destination。
- Sarae / Stashの製品固有logoと、Medo / Stashの実UI image。
- full pageのreduced motion / 全keyboard巡回。
- production visualと3秒 / 30秒体験のオーナー承認。

## Residual Risks

- wireframe placeholderや仮linkをproductionへ転用するとINV-007 / INV-010に違反する。
- 現Next.js初版にはlogo / UI image placeholderがあるためdeploy candidateではない。
- product description / statusはprototype値であり、公開事実としての再確認が必要。
- media枚数とmobile横送りは、実assetのaspect ratio次第で再調整が必要になる。
- `./scripts/check-docs.sh`は今回の変更外にある`App/top-page-initial`、`App/ui-integration`、`App/scaffold`の
  過去verification 3件を理由にFAILする。今回更新したtop-page-rebuild文書の追加エラーはない。

## Follow-up TODOs

- `Site-Feat-17` Step 3を継続し、product facts / destinations /実assetを充足する。
- 実asset反映後にresponsive / reduced motion / keyboard QAとproduction visual reviewを行う。

## Product Asset Inventory — 2026-07-11

- Medoの製品固有iconを`/home/penne/dev/active/backcast/assets/images/medo_icon.png`から取得した。
- SaraeのQA screenshotは掲載用assetではないため不採用とした。
- Stashの現行AppIconはFlutter標準assetのため、製品logoとして不採用にした。
- Medo iconだけを先行反映した。Sarae / Stash logo、全product UI image、全product destinationは未確認のまま補作していない。
