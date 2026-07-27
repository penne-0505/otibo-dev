---
title: "Intent: Rebuild below the First View without legacy page constraints"
status: active
draft_status: n/a
intent_schema: 2
created_at: 2026-07-10
updated_at: 2026-07-31
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

### DEC-011: typography roleのsizeはdesign systemへ委ね、site側の上書きを不足の暫定措置に限る

- **What**: 見出し・本文のfont-size / weight / familyは`textStyle`のroleが持ち、site側のCSSでsizeを決め直さない。principle見出しは`display`、Products見出しは`heading.lg`、product名は`heading.md`、本文は`body`を使う。site側にfont-sizeの上書きを置くのは、DSのscaleに必要な段が存在しない場合と、role固定値がviewport幅に収まらないresponsiveな段下げの場合だけとし、いずれも理由と解消条件をCSSコメントへ残す。
- **Why**: 2026-07-28時点で`display`を3箇所へ当てながら、site側が`4.4vw` / `4.0vw` / `4.2vw`という別々のclampで上書きしていた。差に意味はなくdriftであり、結果としてproduct名67.2pxがsection見出し54pxを上回る階層逆転を起こしていた。roleを当てた上でsizeを決め直すと、roleが表示契約として機能しなくなる。
- **Change freedom**: どのroleをどの要素へ割り当てるかは、階層が保たれる限り変更できる。responsive段下げの数値、breakpoint、composition（幅・余白・grid）はsite側の責務として自由に変更できる。
- **Why not**: 見た目を合わせるためにroleを当てたまま毎回font-sizeを書くことはしない。sizeが足りない場合は、site側で恒久的な独自scaleを作らず、design system側へ段を追加する。
- **Revisit when**: `@otibo/ui`へ`display.sm`が入ったとき。principle見出しの暫定上書き`clamp(2xl, 4vw, 3.5rem)`を削除し、`textStyle("display.sm")`へ差し替える。2026-07-30に差し替えを実施したが、参照している`display.sm`は未publishの`dist`をnode_modulesへ手で置いた状態であり、条件は完全には満たしていない。publish完了までこの差し替えを確定扱いにしない。

### DEC-012: Products領域はgalleryではなくeditorial chapter grammarで構成する（superseded by DEC-013、2026-07-31）

- **Status**: superseded by DEC-013 (2026-07-31). owner判断でbentoκへ収束したため、chapter grammar
  は working layout ではなくなった。以下の記述はβ pivot時点の判断として履歴保持する（削除しない）。
  DEC-013 との違い、および β → κ 収束の Why は DEC-013 を参照する。
- **What**: Products領域はproduct情報 + 横scroll screenshot galleryのtwo-pane構成ではなく、単一columnの
  editorial chapter構成で示す。各productは status badge（chapter kicker）→ logo + name（chapter heading）
  → description（opening paragraph）というreading orderで、余白と`textStyle` roleが密度を担う。読みやすさの
  ためreading columnはdesktopで44rem前後（≤ 56rem）に収め、chapter間の分離は`.productList`のgap
  （`clamp(20, 10vw, 48)`）で表現する。
- **Why**: 掲載3productの実態が「テスト中（UI screenshot可）」「構想中（実装なし・screenshotなし）」
  「開発中（partial）」と不均衡である。gallery two-paneはproduct毎に大きな視覚assetを前提とする骨格で、
  assetを持たないproductが構造的に「欠けて」見え、DEC-007の「欠落を補作しない」姿勢と噛み合わない。
  otibo-uiのgrammarはeditorialで抑制的、accentは alpha ramp主体という方向に収束しつつあり、
  gallery-firstの視覚密度はこのgrammarと擦れる。density carrierをasset volumeからtypography rhythmへ
  移すことで、product間の実態差を情報密度の差ではなく質感の差として並べられる。
- **Change freedom**: 各productのdescription量、logo有無、badge文言、chapter内spacingは変更できる。
  将来productが増えた際もchapter grammarを再利用できる。
- **Why not**:
  - α（galleryを維持し全productへscreenshotを供給する）: Sarae（実装なし）とStash（partial）で
    掲載可能なasset供給の見通しがなく、DEC-007（欠落を補作しない）と両立できない。
  - γ（Medoのscreenshotだけでgalleryを試す）: 1つだけscreenshotを持つ構成はproduct間の均衡をさらに
    崩す。今cycleでは追加trialを行わずβへ収束する。
- **Revisit when**: 全productに掲載可能なscreenshotが揃い、かつownerがgallery grammarをotibo-uiの
  editorial方向へ整合させたいと明示的に判断した場合。その際はcompositionを再検討する。この決定は
  screenshot supply自体を閉じるものではなく、supplyが整うまでの表現形式を確定させるだけである。

### DEC-013: Products領域は column-featured bento grammar で構成する

- **What**: Products領域を、`@otibo/ui`のCard primitiveを cell として並べる column-featured bento grid
  で示す。左 column に Medo（tall、image dominant）を置き、右 column を上下 Sarae / Stash に分割する。
  3枚のCard variantは同一（`surface="paper"`, `padding="md"`）で、hierarchy は Card recipe ではなく
  grid cell size が担う。cell 間の分離は gap のみで、border / divider は導入しない（DEC-010 継承）。
  section header は h2 のみ（`textStyle("heading.lg")`）で、eyebrow / lede / subtitle / kicker を
  埋め草として置かない（INV-007 継承）。Medo の image slot は `.medoMedia > *` を future nested grid
  の item として並べ替えられる single grid-container point に保ち、将来 image asset が増えた際の
  bento-in-bento 展開を CSS restructure なしで許容する（現状は Medo 1枚のみ）。mobile ≤640px では
  bento を単一 column へ collapse し、Medo → Sarae → Stash の順で stack する。
- **Why**: 掲載3productの status（テスト中 / 構想中 / 開発中）と asset 供給（Medo は 1080x2400 の
  ホーム screenshot 実在、Sarae / Stash は screenshot なし）が不均衡であるという DEC-012 と同じ
  前提を踏まえたうえで、DEC-012 の editorial chapter は「asset を持つ Medo と、text-only の Sarae /
  Stash を同じ chapter template に並べる」設計だった。owner の実物確認により、Medo の image を
  presence として活かしつつ product 間の実態差を composition（cell size）で吸収する asymmetric bento
  のほうが、chapter よりも空虚感なく densely 読めると判断された。card language は `@otibo/ui`
  primitive のまま（surface / padding / typography role いずれも native）で、site 側は grid composition
  のみを持つ（DEC-009 準拠）。asymmetric bento は product 間の実態差を「均一 card の欠け」ではなく
  「cell size の差」として自然に表現でき、DEC-007（欠落を補作しない）と両立する。
- **Change freedom**: bento grid の column 幅（現行 `minmax(0, 22rem)` / `minmax(0, 1fr)`）、gap、
  row 分割比、mobile breakpoint、Medo image の cell 内 alignment / 幅は composition 判断として
  変更できる。product 追加時に cell 構造を組み替えることも、column-featured から別の bento
  arrangement へ移すことも許容する。responsive collapse の順序と閾値は content 密度と実測に応じて
  調整できる。3枚同一 Card variant の原則（hierarchy は cell size が担う）は維持する。
- **Why not**:
  - α（DEC-012 継続 = editorial chapter）: Medo の実 screenshot を presence として活かせず、
    text-only の Sarae / Stash と同じ chapter template では Medo の情報密度が抑え込まれる。
    owner の実物比較で κ が上回った。
  - β（compact index = product を等 grid で並べる）: card 均一化は product 間の status 差を
    隠し、DEC-007 の「実態を率直に映す」方向と擦れる。
  - γ（aggressive plain = 見出し + description のみ、card なし）: composition 不足で
    section 開始点が視認されず、principle と Products の boundary が弱まる。
  - ι（featured + secondary text = Medo だけ大きく、Sarae / Stash は文だけ）: Sarae / Stash 側に
    filler 的 copy 追加が要求され、INV-007（copy restraint）に反する。
  - δ（visual-forward without card language = 生 image + 生 text）: `@otibo/ui` grammar から
    outside へ半歩踏み出す。Card primitive を持つ以上、site 固有 language を site 側で作る
    必要はない（DEC-009 継承）。
  - η（dark surface = bento を暗面へ載せる）: `@otibo/ui` base surface が明面 grain である今、
    site 側で dark を導入すると grammar 境界が離れ過ぎる。将来 DS 側が暗面 grammar を採用した
    ときに再検討する。
- **Revisit when**: (a) product が2つ以下 / 4つ以上へ変わったとき — 現 column-featured は
  1 tall + 2 short の3枚構成に最適化されており、product 数変化で cell 構造を再検討する。
  (b) Medo 以外にも image asset が加わったとき — 各 cell の image 保持方針を横並びに揃えるか、
  Medo の bento-in-bento を先に展開するか判断する。(c) `@otibo/ui` 側で bento layout primitive が
  導入されたとき — site 側の grid CSS を DS primitive へ委譲できるか再評価する。

### DEC-014: 見出し補助 copy（eyebrow / lede / subtitle / kicker / tagline）は具体的目的が示せる場合だけ使う

- **What**: section header に付随する eyebrow / lede / subtitle / kicker / tagline / description prose
  等の補助 copy は、その要素が具体的に果たす役割（例: 同姓 section を区別する signal、mobile 階層
  逆転の代償として section 開始点を担わせる signal）を owner に説明できる場合だけ使う。埋め草として
  「見出しだけだと寂しい」「情報を足せば伝わる」といった理由では置かない。既定は h2 のみ。
- **Why**: 2026-07-31 の κ 統合作業で、eyebrow「作っているもの」を subagent が追加し owner が棄却
  した経緯がある。descriptive prose を section headline の周囲に添える傾向は LLM 由来の slop signal
  として繰り返し出現しており、site 全体で埋め草の混入経路を断つ必要がある。装飾的補助 copy は brand
  voice に「余計な語りを添える人格」を混ぜ、INV-002（個人ブランドとして書かれる、複数人 team を装う
  語り口を含まない）を溶かす方向へ働く。principle と Products の hierarchy を owner copy と
  composition で成立させた現状に対し、補助 copy の重量は overshoot になる。
- **Change freedom**: 個別 section で補助 copy に具体的目的が生じた場合（例: mobile 階層逆転で
  h2 のサイズを下げ、section 開始点の signal を担う eyebrow が必要になった場合）は、その目的を
  intent / verification に記して採用できる。Contact section の eyebrow role h2 のように既存の
  意図的採用は本 DEC で棄却しない。
- **Why not**: 「読みやすさが上がるだろう」「情報密度が上がるだろう」という一般的な期待だけを
  根拠に補助 copy を置かない。owner の brand voice 判断は generative default より上位である。

## Grammar principles

### GP-001: copy restraint（DEC-014 の運用）

- section headline は h2 のみを既定とする。eyebrow / lede / subtitle / kicker / tagline / descriptive
  prose を追加する場合は、それが果たす具体的な signal を DEC / verification に説明できることを条件と
  する（DEC-014）。
- product name / description / status は owner 確認済みの正本（`Site-Feat-17` Publication Gate）から
  変更しない。paraphrase / 補足文言の生成禁止。
- 埋め草判定: 「見出しだけだと寂しい」「情報を足したほうが伝わる」「LLM 生成の descriptive prose
  で自然に埋まる」は具体的目的ではない。棄却する。

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
- INV-011 (from DEC-014): 見出し補助 copy（eyebrow / lede / subtitle / kicker / tagline / descriptive prose）は
  具体的目的が示せる場合だけ使い、埋め草として置かない。

## Enforced in (optional)

- INV-009: `app/_components/top-page/TopPageContent.tsx`
- DEC-003: `_docs/intent/Site/first-view-light-shader/decision.md`
- DEC-009: `app/_components/top-page/TopPageContent.tsx`
- DEC-011: `app/_components/top-page/TopPageContent.tsx`の`textStyle`割り当てと、`app/_components/top-page/top-page.module.css`のmobile段下げ上書き（解消条件をコメントで明示）。desktopの`.principle h2`暫定上書きは2026-07-30に`textStyle("display.sm")`へ移して削除済み。
- DEC-012: superseded by DEC-013 (2026-07-31). 実装は既に bento κ へ収束したため、 chapter grammar
  としての enforcement は無効化された。判断履歴のみ decision.md に保持。
- DEC-013: `app/_components/top-page/TopPageContent.tsx`（`.productsBento` / `.medoCard` / `.saraeCard` /
  `.stashCard` の bento composition と、Medo の `MediaFrameImage` 実 asset 参照）と、
  `app/_components/top-page/top-page.module.css`（`.productsBento` grid 定義、`.medoMedia` の
  future bento-in-bento 用 single grid-container point、mobile collapse）。
- DEC-014 / INV-011: `app/_components/top-page/TopPageContent.tsx` の Products section header（h2 のみ、
  eyebrow / subtitle 非搭載）と、DEC-013 / GP-001 の運用。

## Rollback / Follow-ups

- product紹介の候補表現が不採用でもDEC-004の責務順は保持する。
- CSS stackはDEC-002の理由を保ち、全体compositionとinteraction要件から再選択できる。
- First Viewの値・比較・実験履歴は専用intent / QAで更新し、top-page-rebuildへ再複製しない。
