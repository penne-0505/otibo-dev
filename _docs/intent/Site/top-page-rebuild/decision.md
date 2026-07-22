---
title: "Intent: Rebuild below the First View without legacy page constraints"
status: active
draft_status: n/a
intent_schema: 2
created_at: 2026-07-10
updated_at: 2026-07-17
references:
  - "_docs/plan/Site/top-page-rebuild/plan.md"
  - "_docs/qa/Site/top-page-rebuild/test-plan.md"
  - "_docs/draft/Site/top-page-exhibition/notes.md"
  - "_docs/intent/Site/otibo-dev-site-purpose/decision.md"
  - "_docs/reference/Site/visual-canon/reference.md"
  - "_docs/intent/Site/first-view-light-shader/decision.md"
  - "_docs/qa/Site/first-view-light-shader/test-plan.md"
  - "_docs/qa/Site/first-view-light-shader/verification.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/intent/Site/top-page-rebuild/decision.md -->

## Context

First View の光表現は PoC と production integration の技術条件を満たした。一方、旧トップページの
Products / About / Contact / Footer は、shader と visual canon を得る前の初期実装であり、現在の
「3秒で良い、30秒で何の場所か信頼できる」という目的から導かれた構成ではない。Panda CSS の
stylesheet 欠落も見つかったが、旧構成を修復することと新しいトップページを設計することは分離する。

## Decisions

### DEC-001: 制作基盤と公開可能な完成ページを分ける

- **What**: First Viewだけの状態や局所wireframeは制作・比較の基盤として扱い、ページ全体の責務と公開前確認を満たした一枚のトップだけをdeploy candidateにする。
- **Why**: 一瞥の視覚品質だけで完成と判断すると、30秒でotiboの実体と導線を確認できるというサイト目的を満たさないまま公開されるため。
- **Change freedom**: 制作中のroute、prototype、比較手段、公開判定のチェック手順は、未完成状態をproductionへ出さない境界を保つ限り変更できる。
- **Why not**: shader-only pageの公開は、3秒の印象を満たしても30秒の説明責任を欠く。

### DEC-002: 旧ページを互換条件にしない

- **What**: 旧下流sectionのDOM、見た目、copy、Panda utility usageを新トップページの互換条件にしない。
- **Why**: 旧構成は現在のサイト目的とvisual canonから導かれておらず、stylesheetだけを復旧すると借り物の情報骨格と生成copyを固定するため。
- **Change freedom**: 旧実装の一部を再利用することは、その要素が新しい責務と品質条件から独立に選び直される限り許容する。CSS方式も全体compositionとinteraction要件から選べる。
- **Why not**: Panda CSSだけを復旧して漸進的に整える案では、技術的欠落は直せても情報設計の理由を更新できない。

### DEC-003: First Viewの判断を専用の正本へ委譲する

- **What**: First Viewの表示責務、viewport占有、scroll、motion、shader、asset、performance、実験baselineは`_docs/intent/Site/first-view-light-shader/decision.md`と対応QAを正本とし、このintentでは再定義しない。トップページ側はFirst Viewから下流への接続とページ全体の3秒 / 30秒体験だけを判断する。
- **Why**: 同じ値や実験条件を二つのintentへ複製すると、First Viewの探索結果が更新された際に不一致が生じ、どちらが現行契約か判定できなくなるため。
- **Change freedom**: First View正本の範囲内で、section高、scroll配分、光学表現、asset形式、比較手順を変更できる。トップページの責務順を維持できるなら、下流への接続方法も変更できる。

### DEC-004: 4段階を責務順として使う

- **What**: ページは「First Viewで見る → principleで読む → productで確認する → contact / legalで所在を得る」の順に責務を渡す。この4段階は固定section名や固定section templateではない。
- **Why**: 視覚、意味、実在の証拠、連絡可能性を順に渡すと、各領域へ説明責任を重複させず、短時間の印象と30秒の理解を両立できるため。
- **Change freedom**: 見出し、section数、DOM境界、copy量、レイアウトは、責務の順序と各段階の役割が読者に伝わる限り統合・分割・改称できる。principleは短い見出しと2段落程度、contact本文はmailto中心という現行構成も固定templateではない。

### DEC-005: owner未執筆copyを完成扱いしない

- **What**: principleとbrand copyはowner執筆を正本とし、未執筆または未確認の箇所を生成文で埋めて公開可能なcopyとして扱わない。
- **Why**: 語調が整っていてもownerの意図と異なる文は、otiboの意味やproductの現況について事実でない主張を作り、公開後の説明責任を損なうため。
- **Change freedom**: drafting、校正、翻訳への支援はできる。完成判定はownerが内容と公開可否を確認したsourceへ追跡できることを条件とする。

### DEC-006: product紹介の形式を事前固定しない

- **What**: product紹介は追加可能性を前提とするが、card、UI断片、一覧grid、`@otibo/ui`展示のいずれも必須形式にしない。
- **Why**: 見せ方を先に固定すると、productの種類や数が変わった際に実在情報よりcomponent都合が優先され、ページ全体の責務順を局所表現へ従属させるため。
- **Change freedom**: productごとに異なるcompositionやmedia数を採用できる。実asset適用後の比率、余白、mobile interactionも、必須情報とreading orderが保たれる限り変更できる。

### DEC-007: 公開表示は実在情報だけから構成する

- **What**: product紹介の必須情報を公開可能なname、owner確認済みdescription、確認時点に即したstatusとする。logo、UI / image、destinationは実在し掲載理由がある場合だけ使う任意情報とし、欠落を補作しない。
- **Why**: placeholderや推測値を事実として表示すると、閲覧者がproductの存在・状態・到達先を誤認し、サイトの信頼性を損なうため。
- **Change freedom**: 必須情報の保存形式、source inventory、確認フロー、任意assetの種類は変更できる。未確認情報は非表示または明示的な制作中placeholderとしてproduction外に隔離できる。

### DEC-008: 法務routeとasset-only deploymentを維持する

- **What**: 必要なlegal route、Next.js static export、Cloudflare Workers Static Assetsのasset-only deploymentをトップページ再設計でも維持する。
- **Why**: 情報設計の変更を法務導線の欠落やserver runtime導入へ波及させる理由がなく、既存の公開・運用契約を壊すため。
- **Change freedom**: footer navigationの表現、link配置、build手順は、必要routeが到達可能でstatic assetとしてdeployできる限り変更できる。

### DEC-009: editorial primitiveの見た目はdesign systemを正本にする

- **What**: product固有のcompositionはsite側に保ち、logo / media frameとtypography roleの外観は`@otibo/ui`の`LogoFrame` / `MediaFrame` / `textStyle`を正本として使う。
- **Why**: site固有の疑似componentで同じ役割を再定義すると、design systemと表示契約が分岐し、更新時に同じ意味の要素が異なる見た目になるため。
- **Change freedom**: design system側のcomponent名、API、themeは変更でき、site側の配置・幅・media rail構成もproduct固有の責務として変更できる。primitiveで表せない新しい意味が必要ならdesign system ownershipを再検討できる。

### DEC-010: 情報境界は余白・面・typographyを主に使う

- **What**: sectionとproductの境界は余白、surface、typographyで示し、外枠やdivider lineの反復を標準手段にしない。
- **Why**: 線による囲いを重ねると、責務の階層よりboxの反復が先に読まれ、editorialな連続性とproduct間の差が弱まるため。
- **Change freedom**: status badgeやlink underlineなど、線自体がcomponent識別や操作性に必要な箇所では使用できる。情報階層を明確にする別の視覚手段へ変更することもできる。

## Consequences / Impact

- 作業途中の`/`はproduction deploy対象にならず、公開前にpage全体の判定が必要になる。
- 旧sectionのcopyとclass構成は再利用前提ではなくなる。
- owner copy、掲載product、各productの公開時点status、任意asset / destinationが主要な人間判断になる。
- First Viewの詳細変更は専用intent / QAへ記録し、トップページQAでは下流との接続と全体体験を確認する。
- 法務routeとdeployment architectureは変更しない。

## Quality Implications

- 3秒 / 30秒の理解、事実性、導線、responsive / accessibilityをpage全体で検証する。
- legacy restoration、生成copy、架空のproduct evidenceを進捗として扱わない。
- product contentはowner確認済みsourceと確認時点へ追跡できるようにする。
- First Viewの局所条件は専用QAのverdictを参照し、このQAへ比較値や実験invariantを複製しない。

## Intent-derived Invariants

- INV-001 (from DEC-001): shader-only pageをproduction deployしない。
- INV-005 (from DEC-005): owner未執筆のbrand copyを生成文で完成扱いにしない。
- INV-007 (from DEC-007): 実在しないproduct、status、UI componentを展示材料にしない。
- INV-008 (from DEC-008): 法務route、static export、Workers Static Assetsを維持する。
- INV-009 (from DEC-007): product紹介は公開可能なname、owner確認済みdescription、確認時点に即したstatusを必須情報とする。
- INV-010 (from DEC-007): productのlogo、UI / image、外部linkは実在する場合だけ使い、欠落を補うために捏造しない。

## Enforced in (optional)

- INV-009: `app/_components/top-page/TopPageContent.tsx`
- DEC-003: `_docs/intent/Site/first-view-light-shader/decision.md`
- DEC-009: `app/_components/top-page/TopPageContent.tsx`

## Rollback / Follow-ups

- product紹介の候補表現が不採用でもDEC-004の責務順は保持する。
- CSS stackはDEC-002の理由を保ち、全体compositionとinteraction要件から再選択できる。
- First Viewの値・比較・実験履歴は専用intent / QAで更新し、top-page-rebuildへ再複製しない。
