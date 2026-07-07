---
title: "Intent: Rebuild below the First View without legacy page constraints"
status: active
draft_status: n/a
created_at: 2026-07-10
updated_at: 2026-07-13
references:
  - "_docs/plan/Site/top-page-rebuild/plan.md"
  - "_docs/qa/Site/top-page-rebuild/test-plan.md"
  - "_docs/draft/Site/top-page-exhibition/notes.md"
  - "_docs/intent/Site/otibo-dev-site-purpose/decision.md"
  - "_docs/reference/Site/visual-canon/reference.md"
  - "_docs/intent/Site/first-view-light-shader/decision.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/intent/Site/top-page-rebuild/decision.md -->

## Context

First View の光表現は PoC と production integration の技術条件を満たした。一方、旧トップページの
Products / About / Contact / Footer は、shader と visual canon を得る前の初期実装であり、現在の
「3秒で良い、30秒で何の場所か信頼できる」という目的から導かれた構成ではない。Panda CSS の
stylesheet 欠落も見つかったが、旧構成を修復することと新しいトップページを設計することは分離する。

## Decision

- First View light shader を唯一の確定済み visual foundation とする。
- 旧下流 section のDOM、見た目、Panda utility usageを互換条件にしない。
- shader-only page はローカル制作ベースであり、production state ではない。
- 上位情報骨格を「First View → principle 的な短文 → product 紹介 → contact / 所在」とする。
- 4段階は「見る → 読む → 確認する → 所在」の責務と読む順序を表し、固定 section template ではない。
- principle は短く otibo の意味を渡し、product 紹介は Medo を含む実在 product によってその意味を裏付ける。
- product 紹介は追加可能性を前提とするが、product card、UI 断片、一覧 grid を必須形式にしない。
- product 紹介の必須情報は公開可能なname、owner確認済みの短いdescription、確認時点に即したstatusとする。
- logo、UI / image、外部linkは実在する場合だけ使う任意情報とし、欠けていても補作を要求しない。
- contact / 所在は`contact@otibo.dev`、必要なlegal route、掲載理由のある実在linkだけで構成する。
- copy はオーナー執筆を正本とし、未執筆箇所を生成文で埋めない。
- `@otibo/ui` を使う場合は実在componentをそのまま材料にし、展示専用componentを新設しない。
- CSS方式は全体compositionとproduct紹介の要件から判断し、旧Panda実装を維持するためだけには選ばない。
- 完成した一枚トップだけをCloudflare Workers Static Assetsのdeploy candidateにする。
- principleはowner copyを正本とし、First Viewから読む状態へ移るために見出しと2段落程度の占有量を許容する。
- contact本文はmailtoだけに絞り、required legal routesは補助的なfooter navigationとして分離する。
- product固有の構成はsite側に保ちつつ、logo / media frameは`LogoFrame` / `MediaFrame`、文字の階層は`textStyle`を正本として使う。
- sectionとproductの境界は原則として余白・面・typographyで示し、外枠やdivider lineを常用しない。status badgeのように線自体がcomponentの識別に必要な箇所は例外とする。

## Alternatives

- **旧ページのPanda CSSだけを復旧し、漸進的に整える**: 不採用。CSS欠落は直せても、借り物の情報骨格と生成copyの問題を固定する。
- **shader-onlyを公開する**: 不採用。3秒の印象は満たしても、30秒で何の場所か伝えるサイトパーパスを満たさない。
- **個別の proof unit を決めてからページ骨格を考える**: 不採用。product の見せ方を先に固定すると、追加可能性や principle / contact との関係を局所判断へ閉じ込める。
- **product card または UI 断片を必須にする**: 不採用。どちらも候補にはできるが、product の種類と数が増えても成立する表現を全体構成の中で判断する。
- **`@otibo/ui`展示を必須にする**: 不採用。実在の証拠にはなり得るが、サイトを component library の広告へ限定しない。

## Rationale

確定した光表現と未確定の情報設計を分離すると、視覚の基準を失わずに下流を再検討できる。4段階の
責務を先に定めることで、各領域に個性や説明責任を重複させず、product が増えても読む順序を維持できる。
CSS stackも同様に、旧実装の修復コストではなく採用する構成とinteractionの要件から決められる。

## Consequences / Impact

- 作業途中の`/`はローカルでshader-onlyになるため、production deployを禁止する運用が必要になる。
- 旧sectionのcopyとclass構成は削除候補になるが、恒久削除はユーザー承認とrepo規約に従う。
- Panda CSSを継続する可能性も、CSS Modules中心へ移す可能性も残る。
- 法務routeとdeployment architectureは変更しない。
- owner copy、掲載product、各productの公開時点status、product 紹介の表現が主要な人間判断になる。

## Quality Implications

- shader-only状態を完成ページと誤認しないことをQAとTODOで強制する。
- legacy section復元を進捗と見なさず、4段階の責務が連続して成立するかで評価する。
- screenshotだけでなく、3秒 / 30秒の理解、事実性、導線を検証する。
- owner未確認のcopyとvisual verdictをPASS扱いにしない。

## Intent-derived Invariants

- INV-001: shader-only pageをproduction deployしない。
- INV-002:旧Products / About / Contact / Footerの構成とPanda classを互換条件にしない。
- INV-003: First Viewには光と`otibo`以外を追加しない。
- INV-004: ページは First View、短い principle、product 紹介、contact / 所在の順で責務を渡す。
- INV-005: owner未執筆のbrand copyを生成文で完成扱いにしない。
- INV-006: product 紹介を product card、UI 断片、一覧 grid のいずれかへ事前固定しない。
- INV-007: 実在しないproduct、status、UI componentを展示材料にしない。
- INV-008: 法務route、static export、Workers Static Assetsを維持する。
- INV-009: product紹介は公開可能なname、owner確認済みdescription、確認時点に即したstatusを必須情報とする。
- INV-010: productのlogo、UI / image、外部linkは実在する場合だけ使い、欠落を補うために捏造しない。
- INV-011: First Viewはdesktop / mobileとも一画面高を維持し、full-page wireframeの編集都合で短縮しない。
- INV-012: productのlogo / mediaとtypography roleをsite固有の疑似componentとして再定義しない。
- INV-013: section / product間の区切りを外枠やdivider lineの反復へ依存させない。

## Rollback / Follow-ups

- product 紹介の候補表現が不採用でもFirst View foundationと4段階の責務は保持する。
- CSS stackの決定は全体compositionとproduct紹介の技術要件が明らかになった時点で本intentへ追記する。
