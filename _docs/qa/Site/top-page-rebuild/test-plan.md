---
title: "QA Test Plan: Top page rebuild from the light shader foundation"
status: active
draft_status: n/a
qa_status: in-progress
risk: Medium
qa_schema: 2
created_at: 2026-07-10
updated_at: 2026-07-17
references:
  - "_docs/intent/Site/top-page-rebuild/decision.md"
  - "_docs/plan/Site/top-page-rebuild/plan.md"
  - "_docs/draft/Site/top-page-exhibition/notes.md"
  - "_docs/reference/Site/visual-canon/reference.md"
  - "_docs/intent/Site/first-view-light-shader/decision.md"
  - "_docs/qa/Site/first-view-light-shader/test-plan.md"
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
- First View authority: `_docs/intent/Site/first-view-light-shader/decision.md`
- First View QA: `_docs/qa/Site/first-view-light-shader/test-plan.md` / `verification.md`

## Quality Goal

First Viewの正本を変更せずに参照し、旧section構成へ依存しない責務順で、3秒の印象と30秒の理解を
実在する材料から成立させる。制作途中のshader-only state、owner未確認copy、架空または未確認の
product情報を公開可能な完成状態と混同しない。

## Acceptance Criteria

- AC-001: shader-only baselineと局所wireframeはproduction deploy対象から除外される。
- AC-002: 「見る → 読む → 確認する → 所在」の責務がこの順で成立し、固定section名や固定templateへの一致を完成条件にしない。
- AC-003: First Viewは専用intent / QAの現行契約に適合し、top-page-rebuild側で値や実験条件を再定義せずに下流へ接続する。
- AC-004: 30秒以内にotiboの実体、現行product、必要導線を事実から確認できる。
- AC-005: principle、各productのname / description / status、contact / legal導線はowner確認済みsourceと確認時点へ追跡でき、任意asset / destinationは実在する場合だけ表示される。
- AC-006: desktop / mobile、reduced motion、semantic structure、keyboard navigationで責務順と操作が成立する。
- AC-007: 必要なlegal routeを含むNext.js static exportとWorkers Static Assets dry-runが成功する。
- AC-008: オーナーが3秒 / 30秒の体験、copy、production visualを承認する。

## Decision Review Scope

- DEC-001: 局所的なPASSをページ全体のdeploy可否へ誤って昇格していないか確認する。
- DEC-002: 旧DOM、copy、Panda classを互換要件として復元していないか確認する。
- DEC-003: First Viewの局所条件は専用intent / QAを参照し、トップページ側では接続と全体体験だけを判定しているか確認する。
- DEC-004: 4段階が責務順として読め、固定section templateへの機械的一致を要求していないか確認する。
- DEC-005: owner未確認copyを完成copyとして扱っていないか確認する。
- DEC-006: product card、UI断片、grid、特定media数を要件として固定していないか確認する。
- DEC-007: product factsと任意asset / linkが実在sourceへ追跡でき、欠落を補作していないか確認する。
- DEC-008: legal route、static export、asset-only deploymentを維持しているか確認する。
- DEC-009: design-system primitiveの外観をsite側で重複定義せず、compositionだけを所有しているか確認する。
- DEC-010: section / product境界が線の反復に依存せず、例外の線にcomponent上の意味があるか確認する。

## Intent-derived Invariants

- INV-001 (from DEC-001): shader-only pageをproduction deployしない。
- INV-005 (from DEC-005): owner未執筆のbrand copyを生成文で完成扱いにしない。
- INV-007 (from DEC-007): 実在しないproduct、status、UI componentを展示材料にしない。
- INV-008 (from DEC-008): 法務route、static export、Workers Static Assetsを維持する。
- INV-009 (from DEC-007): product紹介は公開可能なname、owner確認済みdescription、確認時点に即したstatusを必須情報とする。
- INV-010 (from DEC-007): productのlogo、UI / image、外部linkは実在する場合だけ使い、欠落を補うために捏造しない。

## Risk Assessment

- **Risk level**: Medium
- **Risk rationale**: information architecture、visual composition、copy、CSS stackを再判断し、完成判定に人間の視覚・意味理解が必要になる。
- **Regression risk**: First View正本との不一致、旧sectionの無意識な復元、法務導線の欠落、mobileでの責務順崩れ。
- **Data safety risk**: なし。永続データや外部入力を扱わない。
- **Security / privacy risk**: 公開copyへ個人情報やsecretを混入させない。法務の実値は既存build variable運用を維持する。
- **UX risk**: First Viewだけで満足して説明責任を欠く、principleが長いmanifestoになる、product紹介を特定形式へ固定する、contactが二度目の見せ場になる。
- **Agent misbehavior risk**: 旧pageの復元を進捗とする、生成copyで穴を埋める、First Viewの実験値を再複製する、placeholderを実在情報として扱う。

## Test Strategy

- **Content verification**: owner copy、product name / description / status、任意asset / link、contact / legal URLのsourceと確認日を記録する。
- **Prototype QA**: 責務順とproduct紹介の候補表現をdesktop / mobileで確認し、特定templateではなくWhyへの適合で採否を判定する。
- **First View conformance**: 専用intent / QAの現行verdictとpage integrationを確認し、shader値や実験variantをこのQAで再検証しない。
- **Integration QA**: First Viewからprinciple、product、contact / legalへ至る時間軸、semantic order、keyboard orderを確認する。
- **Automated**: lint、typecheck、unit、build、Wrangler dry-run、docs validators。
- **Manual**: 3秒 / 30秒、visual canon、copy voiceをオーナーが判定する。
- **Diff review**: legacy restoration、placeholder、fake evidence、design-system重複、deployment boundaryを確認する。

## Test Matrix

| ID | Source | Requirement / Optional Invariant | Test Type | Command / File | Expected Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AC-001 | TODO | 制作基盤とdeploy candidateの分離 | Docs + Deployment gate | Plan / TODO / verification | 未完成状態がdeploy candidateにならない | planned |
| AC-002 | DEC-004 | 責務順とtemplate自由度 | Design + Browser | desktop / mobile composition | 責務順を保ち、section名や構造は目的に応じる | planned |
| AC-003 | DEC-003 | First View正本への適合 | Docs + Integration | First View intent / QA、`app/page.tsx` | 重複契約なしで下流へ接続する | planned |
| AC-004 | TODO | 30秒の理解 | Manual + Content review | owner / visitor walkthrough | 実体・product・導線を確認可能 | planned |
| AC-005 | DEC-005 / DEC-007 | content contractの実在性 | Source review | content source inventory | 必須情報にsourceと確認時点がある | planned |
| AC-006 | TODO | responsive / accessibility | Browser + Static | desktop / mobile / reduced / keyboard | 責務順と操作が成立する | planned |
| AC-007 | DEC-008 | static deployment | Build + HTTP smoke | `npm run build && npm run deploy:dry-run` | legal routeとstatic assetsを受理する | planned |
| AC-008 | TODO | owner verdict | Manual | verification review | 3秒 / 30秒 / copy / visual承認 | planned |
| INV-001 | intent | incomplete state isolation | Diff + Docs | route list / deploy checklist | shader-only / wireframeを公開しない | planned |
| INV-005 | intent | owner-authored copy | Content review | content source inventory | 生成copyで未確認箇所を完成扱いしない | planned |
| INV-007 | intent | real evidence only | Source + DOM review | product source / rendered DOM | 架空の材料がない | planned |
| INV-008 | intent | legal / asset-only deployment | Build + HTTP smoke | route list / dry-run | 必要routeとdeployment契約を維持する | planned |
| INV-009 | intent | product必須情報 | Content review | product source inventory | name / description / statusが確認済み | planned |
| INV-010 | intent | optional material authenticity | Content + Diff review | asset / link inventory | 実在asset / linkだけを使用する | planned |

## Manual QA Checklist

- [ ] 3秒で一瞥の質が成立し、様式名や説明の読解を要求しない。
- [ ] 30秒でotiboの実体、現行product、必要導線を理解できる。
- [x] First Viewの局所契約が専用intent / QAと一致し、下流の責務をFirst Viewへ混ぜていない。
- [x] principleが短くotiboの意味を渡し、長いmanifestoになっていない。
- [x] product紹介がname / description / statusを渡し、特定の表示形式を目的化していない。
- [x] logo、UI / image、linkの欠落を架空の材料で補っていない。
- [ ] UI画像が1枚でも成立し、複数枚では同一productのmedia群として読める。
- [x] desktop / mobileともproduct単位とpage全体のreading orderが維持される。
- [x] design-system primitiveの外観をsite CSSで再定義していない。
- [x] 外枠やdividerの反復なしに情報単位を判別できる。
- [x] legal / contact導線が発見できるが、二度目の見せ場になっていない。
- [ ] copyとproduction visualをownerが承認している。

## Regression Checklist

- [x] First View専用intent / QAの現行契約とpage integrationが矛盾していない。
- [x] 旧Products / About / Contact / Footerを惰性で復元していない。
- [x] placeholder、debug label、未確認claimがproduction DOMにない。
- [ ] product description / status / destinationにsourceと確認時点がある。
- [x] 必要な法務routeと`/medo/account-deletion/` URLを変更していない。
- [x] static exportとWorkers asset-only構成を維持する。

## Out of Scope

- First Viewのshader、scroll係数、asset、実験variantの設計と局所検証。専用intent / QAで扱う。
- 新規product、store listing、法務本文の制作。
- 展示専用`@otibo/ui` componentの開発。
- server runtime / OpenNext導入。

## Open Questions

- product紹介は現行wireframeを初版仮説とする。実asset適用後の比率と余白は未確定。
- principle copyはowner-authored初版を使用するが、最終改稿とタイポグラフィは未確定。
- 初期掲載productの公開可能なdescription / status / destinationを公開前にどう確定するか。
