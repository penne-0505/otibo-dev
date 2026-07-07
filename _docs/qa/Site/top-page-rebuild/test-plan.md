---
title: "QA Test Plan: Top page rebuild from the light shader foundation"
status: active
draft_status: n/a
qa_status: in-progress
risk: Medium
created_at: 2026-07-10
updated_at: 2026-07-13
references:
  - "_docs/intent/Site/top-page-rebuild/decision.md"
  - "_docs/plan/Site/top-page-rebuild/plan.md"
  - "_docs/draft/Site/top-page-exhibition/notes.md"
  - "_docs/reference/Site/visual-canon/reference.md"
  - "_docs/qa/Site/first-view-light-shader/verification.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/qa/Site/top-page-rebuild/test-plan.md -->

# QA Test Plan: `Site-Feat-17` — Top page rebuild

## Source of Intent

- TODO: `Site-Feat-17`
- Plan: `_docs/plan/Site/top-page-rebuild/plan.md`
- Intent: `_docs/intent/Site/top-page-rebuild/decision.md`
- Site purpose: `_docs/intent/Site/otibo-dev-site-purpose/decision.md`
- Visual authority: `_docs/reference/Site/visual-canon/reference.md`

## Quality Goal

First Viewの視覚基準を維持しながら、旧section構成に依存せず、「First View → principle → products →
contact / 所在」の順で3秒の印象と30秒の理解を実在する材料から成立させる。制作途中のshader-only
stateや生成copyを公開可能な完成状態と混同しない。

## Acceptance Criteria

- AC-001: shader-only baselineはlocal限定で、production deploy対象から除外される。
- AC-002: First View、短いprinciple、product紹介、contact / 所在の4段階がこの順で成立する。
- AC-003: First Viewは光と`otibo`だけを維持する。
- AC-004: 30秒以内にotiboの実体、現行product、必要導線を事実から確認できる。
- AC-005: principle、各productのname / description / status、contact / legal導線は承認済みsourceへ追跡できる。
- AC-006: desktop / mobile、reduced motion、semantic structure、keyboard navigationが成立する。
- AC-007: Next.js static exportとWorkers Static Assets dry-runが成功する。
- AC-008: オーナーが3秒 / 30秒の体験とproduction visualを承認する。

## Intent-derived Invariants

- INV-001: shader-only pageをproduction deployしない。
- INV-002:旧section構成とPanda classを互換条件にしない。
- INV-003: First Viewに説明、product、CTA、UI componentを追加しない。
- INV-004: 4段階の責務順を維持しつつ、固定section templateを要求しない。
- INV-005: owner未執筆copyを生成文で完成扱いにしない。
- INV-006: product紹介をcard、UI断片、一覧gridのいずれかへ事前固定しない。
- INV-007: 実在しない材料を表示しない。
- INV-008: 法務routeとWorkers static exportを維持する。
- INV-009: productごとに公開可能なname、owner確認済みdescription、確認時点に即したstatusを持つ。
- INV-010: logo、UI / image、外部linkは実在する場合だけ使い、欠落を補作しない。
- INV-011: First Viewはdesktop / mobileとも一画面高を維持する。

## Risk Assessment

- **Risk level**: Medium
- **Risk rationale**: information architecture、visual composition、copy、CSS stackを再判断し、完成判定に人間の視覚・意味理解が必要になる。
- **Regression risk**: First Viewの純度低下、旧sectionの無意識な復元、法務導線の欠落、mobileでの体験順序崩れ。
- **Data safety risk**: なし。永続データや外部入力を扱わない。
- **Security / privacy risk**: 公開copyへ個人情報やsecretを混入させない。法務の実値は既存build variable運用を維持する。
- **UX risk**: shaderだけで満足して説明責任を欠く、principleが長いmanifestoになる、product紹介を特定形式へ固定して追加性を損なう、contactが二度目の見せ場になる。
- **Agent misbehavior risk**: 旧pageを整えることで進捗とする、生成copyで穴を埋める、product cardやUI断片を要件と誤認する。

## Test Strategy

- **Content verification**: owner copy、product name / description / status、任意asset / link、contact / legal URLのsourceと確認日を記録する。
- **Prototype QA**: 4段階の全体compositionとproduct紹介の候補表現をdesktop / mobileで撮影し、採否理由を残す。
- **Product module wireframe**: status badge、identity、description、実在link、可変枚数mediaのreading orderをオーナースケッチと比較する。
- **Integration QA**: First Viewからprinciple、product、contact / legalへ至る時間軸とsemantic orderを確認する。
- **Automated**: lint、typecheck、unit、build、Wrangler dry-run。
- **Manual**: 3秒 / 30秒、visual canon、copy voiceをオーナーが判定する。
- **Diff review**: legacy restoration、placeholder、fake evidence、deployment boundaryを確認する。

## Test Matrix

| ID | Source | Requirement / Invariant | Test Type | Command / File | Expected Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AC-001 | TODO | shader-onlyはlocal限定 | Docs + Deployment gate | Plan / TODO / deploy checklist | deploy candidateにならない | planned |
| AC-002 | TODO | 4段階の責務順 | Prototype + Manual | screenshot / owner verdict | 各責務が順番に成立する | planned |
| AC-003 | TODO | First View純度 | DOM + Screenshot | `/` first viewport | 光と`otibo`のみ | planned |
| AC-004 | TODO | 30秒の理解 | Manual + Content review | owner / visitor walkthrough | 実体・product・導線を確認可能 | planned |
| AC-005 | TODO | content contractの実在性 | Source review | content contract / source inventory | 必須情報にsourceと確認日あり | planned |
| AC-006 | TODO | responsive / a11y | Browser + Static | desktop / mobile / reduced / keyboard | 体験順序と操作が成立 | planned |
| AC-007 | TODO | static deployment | Build + Deployment | `npm run build && npm run deploy:dry-run` | static routes / assetsを受理 | planned |
| AC-008 | TODO | owner verdict | Manual | verification review | 3秒 / 30秒 / visual承認 | planned |
| INV-001 | intent | local-only baseline | Diff + Docs | deploy docs / verification | shader-onlyを公開しない | planned |
| INV-002 | intent | legacy非互換 | Diff review | `app/page.tsx` / styles | 旧構成の復元を要求しない | planned |
| INV-003 | intent | First View境界 | DOM + Static | First View component |追加contentなし | planned |
| INV-004 | intent | 4段階の順序とtemplateの分離 | Design review | composition rationale | 責務順を保ち、固定section名を目的化しない | planned |
| INV-005 | intent | owner copy | Content review | content contract | 生成copyで穴埋めしない | planned |
| INV-006 | intent | product表現を事前固定しない | Design review | product composition rationale | card / UI断片 / gridを要件化しない | planned |
| INV-007 | intent | real evidence | Source review | component / product source | fake materialなし | planned |
| INV-008 | intent | legal / Workers維持 | Build + HTTP smoke | route list / dry-run | 全route維持 | planned |
| INV-009 | intent | product必須情報 | Content review | product source inventory | name / description / statusが確認済み | planned |
| INV-010 | intent | 任意情報を補作しない | Content + Diff review | asset / link inventory | 実在asset / linkだけを使用 | planned |
| INV-011 | intent | First Viewの一画面高 | Browser QA | `1440x900` / `390x844` | 両viewportでFirst View高がviewport高と一致する | planned |
| INV-012 | intent | editorial primitiveの重複定義を防ぐ | Static + Browser | imports / rendered product modules | LogoFrame / MediaFrame / textStyleが適用される | verified |
| INV-013 | intent | border / divider依存を避ける | Static + Browser | top-page TSX / CSS / screenshot | 余白と面でsection / product境界を判別できる | verified |

## Manual QA Checklist

- [ ] 3秒で一瞥の質が成立し、様式名や説明の読解を要求しない。
- [ ] 30秒でotiboの実体とproductの現況を理解できる。
- [ ] First Viewと下流の表示責務が混ざっていない。
- [ ] principleが短くotiboの意味を渡し、長いmanifestoになっていない。
- [ ] product紹介がname / description / statusを渡し、特定の表示形式を目的化していない。
- [ ] logo、UI / image、linkの欠落を架空の材料で補っていない。
- [ ] status badgeがlogo / product nameの上で属性として読め、destination linkと混同しない。
- [ ] UI画像が1枚でも成立し、2枚以上では同一productのmedia群として読める。
- [ ] desktop / mobileともproduct単位のreading orderが維持される。
- [ ] prototype placeholderがproduction route / exportへ混入していない。
- [ ] logo fallbackとmedia empty stateが`@otibo/ui`のprimitiveとして表示され、site CSSで枠の外観を再定義していない。
- [ ] Products外枠、heading divider、product separator、caption dividerがなくても情報単位を判別できる。
- [ ] copyがオーナーの声として読める。
- [ ] desktop / mobileで情報順序と余白が意図どおりである。
- [ ] legal / contact導線が発見できるが、二度目の見せ場になっていない。
- [ ] mobileでFirst Viewが一画面高を保ち、Principle、product情報、media、Contactの順に読める。

## Regression Checklist

- [ ] shaderの光層、wordmark位置、motion lifecycleを壊していない。
- [ ] 旧Products / About / Contact / Footerを惰性で復元していない。
- [ ] placeholder、debug label、未確認claimが公開DOMにない。
- [ ] hidden / reduced motionで不要なframeを継続しない。
- [ ] 法務routeと`/medo/account-deletion/` URLを変更していない。
- [ ] static exportとWorkers asset-only構成を維持する。

## Out of Scope

- shaderの新しい美観探索。
- 新規product、store listing、法務本文の制作。
- 展示専用`@otibo/ui` componentの開発。
- server runtime / OpenNext導入。

## Open Questions

- product紹介は現行wireframeを初版仮説とする。実asset適用後の比率と余白は未確定。
- principle copyはowner-authored初版を使用するが、最終改稿とタイポグラフィは未確定。
- 初期掲載productの公開可能なdescription / status / destinationを公開前にどう確定するか。
