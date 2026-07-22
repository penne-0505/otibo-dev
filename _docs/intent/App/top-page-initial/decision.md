---
title: "Intent: Initial otibo.dev top page implementation"
status: superseded
draft_status: n/a
created_at: 2026-06-21
updated_at: 2026-07-17
references:
  - "_docs/intent/Site/top-page-rebuild/decision.md"
  - "_docs/intent/Site/otibo-dev-site-purpose/decision.md"
  - "_docs/reference/Site/visual-canon/reference.md"
  - "_docs/plan/App/top-page-initial/plan.md"
  - "_docs/qa/App/top-page-initial/test-plan.md"
  - "_docs/intent/App/scaffold/decision.md"
  - "_docs/intent/App/ui-integration/decision.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/intent/App/top-page-initial/decision.md -->

## Context

scaffold(App-Feat-10)と DS 統合(App-Feat-11)が完了し、`@otibo/ui@0.1.1` の手触りを **portfolio の page 上で答え合わせする最初の機会**(memory `otibo-real-goal`)。「動かしながら確かめる」phase の本番。

正本ソース:
- **理念.md**(`/home/penne/text/obsidian/vaults/30_Projects/otiboDesignSystem/理念.md`)── ステートメント策定で確定済、S/N 比の高い圧縮済資料。本 task の判断基準。
- **otibo-ui motion-grammar.md** + **per-component spec** ── DS の grain。
- **memory**:`otibo-real-goal` / `otibo-color-layering` / `otibo-accent-direction` / `feedback-commit-fully-when-reversible` 等。

本 task の grain は「**動かしながら**」── 議論先行で踏み足を止めない、reversible な決定では遠慮せず全力でコミット(memory `feedback-commit-fully-when-reversible`)。試し直せる前提だが、初手は捨て案にしない。

## Decision

### 0. scope と route 構造

本 task で実装する route:

| Route | scope | 内容 |
| --- | --- | --- |
| `/` | **本実装(初手)** | hero + product list(3 件)+ about preview |
| `/works` | **stub** | 「準備中」+ 戻りリンク、本実装は別 task |
| `/about` | **stub(軽い試案)** | 理念.md タグライン見出し + 短い 1〜2 段落、本格マニフェストは別 task |
| `/contact` | **stub** | 現状の contact channel(github / npm)を最小限明示、本実装は別 task |
| `/tokushoho` | **scope 外** | Legal-Feat-9 専用 task |

> **2026-07-03 改訂**: 上記 route 構造のうち `/works` / `/about` / `/contact` の stub は、サイトパーパス intent(`_docs/intent/Site/otibo-dev-site-purpose/decision.md`)の確定により**縮退**した。詳細は文末の「Amendment (2026-07-03)」を参照。原文は経緯保存のため残置。

### 1. 理念.md §1 原則(六原則 + 内向き)── 採用方針

| 原則 | 本 task での反映 |
| --- | --- |
| 一. 誰かのひと手間に基づく | 架空ペルソナ / 数字を引用しない。product 説明は実物(Medo / Sarae / @otibo/ui)が抽象的に何の「ひと手間」に応えるかで書く |
| 二. 万能を目指さない | hero / product list は 1 ページに詰め込まず、scope を最小に絞る。一画面が一目的 |
| 三. 「気づけば終わっている」 | 操作 motion は **応答 = 0ms / feedback = tier 尺**(motion-grammar `staged motion`)で「待たされ感」を出さない |
| 四. 主体性を奪わない、可逆 | scroll は hijack せず、focus / hover の選択肢を絞らない。dark mode / theme は本 task では preset default のみ(可逆に拡張可能な設計) |
| 五. 動きの予測可能性、予兆 | 突然の変化を避ける。motion はすべて library motion-grammar token に乗せ、duration / easing を独自に発明しない |
| 六. 届ける言葉、扇情的でない | 「革命」「圧倒的」「リードする」等を使わない。タグラインは正本の `誰かのひと手間に、ぴったりの道具を。` を据え置き、追加コピーは最小限 |
| (内向き)拡大は貪欲、表立っては示さない | growth-hacking 的 cta(「今すぐ登録」「無料体験」)を hero に置かない。屋号 page として情報密度を抑える |

### 2. 理念.md §2 タグライン ── アロケーション

正本のままアロケーション:

| 場所 | 採用コピー |
| --- | --- |
| `/` hero(ブランドの顔) | **誰かのひと手間に、ぴったりの道具を。** |
| `/about` 見出し(思想/方法論) | **ひとつのために、ひとつ。それが、いちばん。** |
| product 紹介(各 product の説明文に含意) | **「やればできる」を、「気づけば終わる」に。** ── product カード短文に grain として反映(直引用は避ける、product ごとに固有の手触りで書く) |
| 短い版 | 本 task では未使用(meta description で使う候補) |
| 英語版 | 本 task では未使用(多言語展開時) |

### 3. 理念.md §3 視覚言語(第二層)── 適用

| 項目 | 方向 | 本 task での反映 |
| --- | --- | --- |
| 色 | 無彩寄り中間色 + わずかな温度 | preset default(neutral 基調 + accent `oklch(0.40 0.11 265)`)を素直に使用。surface はやや warm 寄りの ivory(library token 範囲) |
| 質感 | 紙的またはマットなガラス感、光沢抑え | gradient / glass effect / vibrancy は使わない。surface = solid neutral、border 細め |
| 形 | 有機的カーブ + 直線、幾何学的硬さ回避 | 角丸 mild(library radius token)、直線基調、強い対称は避ける(asymmetric grid と整合) |
| 余白 | ゆったり | spacing token "8" "12" "16" 帯を多用、padding を絞らない |
| 線 | 細め、軽やか | border は library の `border-subtle` / `border-default` 帯、装飾 line は使わない |
| フォント | 機能的・可読性 + 温度 | **`gen-interface-jp`** を導入(otibo 前提で選定、user 判断 2026-06-21) |

### 4. 理念.md §4 視覚的態度 ── 適用

| 態度 | 本 task での反映 |
| --- | --- |
| 結果ではなく余韻 | hover で underline が draw、focus ring が静かに広がる ── library motion-grammar の `staged motion` に乗せる |
| 素材の質感が前景化 | 紙的 surface(neutral solid)+ font の温度。装飾 svg / illustration は本 task では使わない |
| 余白が構図の一部 | grid 上で **意図的に列幅 / 行を非対称**、ゆったり余白で content と空間を等価に扱う |
| わずかな揺らぎ | hero に **ambient breathing motion**(opacity 0.94 ↔ 1.00、4s 周期、ease-in-out、`prefers-reduced-motion` 尊重)── 静止しているように見えてわずかに動く |
| 抽象と具体の共存 | hero の抽象タグライン + 具体 product list の 3 件で対比 |
| 構造が背景に控えめ | asymmetric grid の軸は見せず、content が grid に乗っていることだけ感じられる程度に余白で示す |

### 5. 理念.md §5 t2i(コンセプト画像)── 本 task scope 外

t2i によるコンセプトビジュアル生成は別 task。本 task は CSS / typography / motion のみで「pale ivory、muted neutral with whisper of warmth」の世界観を表現する。生成画像を hero 背景に置くのは早すぎる(t2i プロンプト F もまだチューニング途中)。

### 6. 理念.md §6 保留中 ──「about ページのマニフェスト(長文版)── Web 実装段階で着手」

これは本 task でちょうど該当する phase。ただし scope 制御のため、`/about` は **軽い試案**(理念.md §1 原則のうち hero 上手間に響くもの 2〜3 個を 1〜2 段落で表現)に留め、本格長文版は別 task に切り出す。

### 7. 理念.md §7 プロセスメモ ── 適用

- **「焼き直し」「クリシェ」「お上品」「クラフト感」「tool-display 寄り」は避ける**:hero に SaaS 風 gradient hero、icon-grid、stock photo、spec table を置かない。「料金」「features」「testimonials」のような SaaS テンプレ構造を持ち込まない。
- **「概念をズバリ言い当てる」基準**:詩的精度ではなく、機能 / 価値を正確に短く言う。

### 8. hero の "重心ずらし"(論点 1: B)── 詳細

- **CSS Grid 8 column** で hero を組む。
- タグライン は column 1〜6 程度に左寄せ、上下にゆったり余白(`min-height: ~70vh`、`padding-top: spacing.20` 帯)。
- title font size は `clamp(2.5rem, 6vw, 4.5rem)`(画面いっぱいではない、余白が構図)。
- font weight: `medium`(機能的 + 温度)。
- 屋号名(otibo)は **小さく、別の場所**(footer に置くか、hero の片隅に控えめ)── タグラインの余韻を妨げない。
- ambient breathing motion を hero タイトルに(motion-grammar `quiet register` に近い、独自の新 grain)。

### 9. product list の "asymmetric"(論点 2: B)── 詳細

- 3 件(Medo / Sarae / @otibo/ui、user 確定 2026-06-21)。
- レイアウト:hero と grid を共有(8 column)、product card は column 1〜4 / 5〜8 / 1〜4 のような **列幅不均等 stagger**、または simple 3 column(検討)。**初手は stagger を試す**(reversible)。
- 各 card:product name + 1 行説明 + link。@otibo/ui は **外部リンク**(npm)、Medo / Sarae は **`/works` stub** に飛ばす。
- description は理念.md §2 アロケーション通り、「やればできる」→「気づけば終わる」の grain を product ごとに具体表現(直引用は避ける)。
- hover/focus motion は library Card recipe / Link recipe に従う。

### 10. about preview ── 詳細

- 見出し:**ひとつのために、ひとつ。それが、いちばん。**(理念.md §2 about 見出し)。
- 本文:1〜2 段落、理念.md §1 原則の二と三(`万能を目指さない` / `気づけば終わっている`)を読みやすく言い直し。
- `/about` route(本 task では同じく軽い stub)への link。

### 11. motion(論点 5)── 詳細

| Layer | Source | Implementation |
| --- | --- | --- |
| Operation feedback(button / link / card hover / focus) | **library motion-grammar 100% 準拠** | library recipe が emit する transition を そのまま使う。consumer で上書きしない |
| Hover-open overlay(本 task では未使用) | 未使用 | — |
| Ambient idle motion(hero タグライン) | **新規(consumer 側)** | opacity 0.94 ↔ 1.00、4s 周期、ease-in-out、最初の 1s は静止、prefers-reduced-motion で disable |
| Scroll-triggered animation | **使わない** | 理念.md「突然の変化を避ける」と擦れる |
| Page transition | **使わない** | Next.js default、独自 transition 不要 |

ambient breathing は library motion-grammar には無い新 grain。理念.md 第四・第五原則 と「わずかな揺らぎ」に整合させる:

- amplitude を **極小**(opacity 0.06、translate なし)
- duration を **長い**(4s、operation 系の 90〜320ms とは別 register)
- easing `ease-in-out`(往復)
- amplitude が知覚閾値スレスレ ── 「気のせいに見える」が狙い
- `prefers-reduced-motion: reduce` で **完全停止**

本 task で実装し、library にフィードバックするかは別 task で判断(library motion-grammar 拡張の候補)。

### 12. font 適用(論点 5 補助)── 詳細

- `gen-interface-jp` を **runtime fetch ではなく** Next.js の font loader 経由で適用(本 task の調査ポイント、Plan で確定)。
- 適用範囲:全 page(`<html>` / `<body>` レベル)。
- fallback chain:`gen-interface-jp, -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic UI", sans-serif`。
- Panda token `fonts.body` を上書き(または semanticTokens 経由)。

### 13. dark mode / theme switching ── 本 task では未対応

preset default(light)で進める。dark mode は library が対応している前提だが、consumer 側のスイッチャ UI は本 task scope 外。

### 14. SEO / OG / structured data ── 本 task では最小限

- `<title>` / `<meta name="description">` のみ追加
- OG 画像 / Twitter Card / JSON-LD は別 task
- 理念.md の **短い版タグライン「ひと手間に、ぴったりの道具を。」** を `<meta description>` 候補(本 task で採用)

### 15. i18n ── 本 task では日本語 only

英語版タグライン候補は理念.md にあるが、多言語展開時に作成と明記されている ── 本 task では単言語。

## Alternatives

### hero の重心(論点 1)

- **(A) 中央**:お上品に倒れるリスク。理念.md「お上品は避ける」と擦る。不採用(user 同意 2026-06-21)。
- **(B) 重心ずらし**:**採用**。構造が背景に控えめ + 届ける言葉の両立。
- **(C) full-bleed asymmetric**:強いが「届ける」義務と擦れる、第一視認で何のサイトか伝わりにくい。不採用(user 同意)。

### product list scope(論点 2)

- **(A) 別 route に退避**:hero 純度高すぎ、屋号 page としての説明不足。不採用(user 同意)。
- **(B) hero + 短い product list 2〜3 件**:**採用**。屋号 page としての具体性が出る。
- **(C) hero + product list + about preview 数行**:情報密度高すぎ、tool-display 寄りに倒れる懸念。**ただし本 task では (C) 寄りで実装**(about は preview = 軽量、本格は別 task)── (B) と (C) の中間案。

### product 選定(論点 3)

- **(A) Medo / Sarae / @otibo/ui の 3 件**:**採用**(user 確定 2026-06-21)。実物 3 種類。
- (B) Medo / Sarae のみ:薄い。不採用。
- (C) DDD-template も含む 4 件:DDD-template は内向き tool、portfolio の外向きとレイヤーが違う。不採用。
- (D) Medo のみ:product preview として弱い。不採用。

### footer link / stub page(論点 4)

- **(A) link を出さない**:dead を避けるが試行錯誤の grain と擦れる(後で page を増やすたびに header を改修)。
- **(B) link を出して stub に飛ばす**:**採用**(user 判断 2026-06-21、「実公開時にそれだったらまずいだけで、試行錯誤中は OK」)。

### motion 戦略(論点 5)

- **(a) library 100% 準拠、新規 motion なし**:安全だが理念.md「わずかな揺らぎ」の表現に届かない。
- **(b) library 準拠 + ambient breathing 新規**:**採用**(user 任せた、reversible なら全力)。
- (c) scroll-triggered / parallax 等の大胆 motion:理念.md「突然の変化を避ける」と擦れる。不採用。

### about preview の深さ

- **(α) 見出しのみ(タグライン 1 行)**:軽すぎ、`/` で about を予告する意義が薄い。
- **(β) 見出し + 1〜2 段落、本格長文は別 task**:**採用**。
- (γ) 完全長文マニフェスト:scope creep、別 task に切り出す方が grain。不採用。

## Rationale

- **理念.md は S/N 比が高く、判断分岐がすでに圧縮されている** ── 本 Intent は理念.md の項目に 1:1 で対応させ、読み返したとき「どの原則のためか」がトレース可能にした。
- **reversible なら全力でコミット**(memory `feedback-commit-fully-when-reversible`):asymmetric grid / ambient breathing / stagger 配置 等の visual / motion 判断は、控えめ寄りに倒すと検証材料が薄くなる。レビューに耐える具体物を出す。
- **library motion-grammar 100% 準拠 + 新規 ambient のみ追加**:operation motion を独自発明すると library との grain が分岐する。新規追加するなら、library に持ち上げる候補として「明確に別 register」「a11y 配線」「理念整合」を満たす ambient のみ。
- **stub page 込み**:試行錯誤 phase の grain と整合(dead link 回避)、後で本 page に書き換える前提。

## Consequences / Impact

- **`gen-interface-jp` 追加 install**:font runtime fetch のサイズ増(数十 KB)。Next.js font loader で self-host(`next/font` の woff2 subset)。
- **panda.config に semanticTokens / fonts の上書きが入る可能性**:font token を gen-interface-jp で上書き、library token は base のまま。
- **First Load JS**:hero に motion(CSS のみ)を入れるなら +0 KB、JS で制御するなら微増。本 task は **CSS のみ**(JS なし)で実装。
- **a11y**:`prefers-reduced-motion` を必ず尊重。 ambient breathing は完全 stop。
- **後続 task**:本 task で確立した hero / product card / asymmetric grid の grain を、`/works` `/about` `/contact` の本実装(別 task)で踏襲。
- **library への逆フィードバック**(別 task 候補):
  - ambient idle motion grammar の library 化(motion-grammar.md に新 section)
  - product card pattern の library 化(`@otibo/ui` に Card 拡張または新 recipe)

## Non-decisions(本 task で決めないこと)

- t2i によるコンセプトビジュアル(hero 背景画像)── 別 task、t2i プロンプト F のチューニング後
- dark mode / theme switching
- OG 画像 / Twitter Card / JSON-LD
- 多言語(英語版タグライン)
- `/tokushoho` 実装(Legal-Feat-9)
- contact form / newsletter / 入口型 cta
- analytics / privacy banner

## 関連

- TODO: `App-Feat-12`
- Plan: `_docs/plan/App/top-page-initial/plan.md`
- QA: `_docs/qa/App/top-page-initial/test-plan.md`
- 上流: `App-Feat-10`(scaffold)、`App-Feat-11`(DS 統合)
- 正本:理念.md(`/home/penne/text/obsidian/vaults/30_Projects/otiboDesignSystem/理念.md`)
- DS grain:`otibo-ui/_docs/reference/DesignSystem/principles.md` / `motion-grammar.md` / `token-semantic-usage-map.md` / `components/*.md`
- memory: [[otibo-real-goal]] [[otibo-color-layering]] [[otibo-accent-direction]] [[feedback-commit-fully-when-reversible]] [[otibo-two-track-structure]] [[panda-dynamic-component-staticcss]]

## Amendment (2026-07-03): サイトパーパス intent との整合

サイトパーパス intent(`_docs/intent/Site/otibo-dev-site-purpose/decision.md`、オーナー承認 2026-07-03)が本 intent の**上位文書**として確定した。同 intent の初期スコープは「**一枚の凝縮されたトップページ + 法務ページ群**」であり、About / News 等のフルコーポレート構造は採らない(INV-001)。これに伴い本 intent の以下を改訂する。

### route 構造の縮退

| Route | 旧 scope | 新 scope |
| --- | --- | --- |
| `/` | 本実装(初手) | **変更なし** — hero + product list + about preview は「一枚トップ」(otibo とは / プロダクト一覧 with ステータス / 連絡導線)の構成要素として存続 |
| `/works` | stub | **廃止** — 初期スコープ外。product の情報はトップ一枚内に凝縮 |
| `/about` | stub(軽い試案) | **廃止** — 「otibo とは」はトップ一枚内の about 節として表現 |
| `/contact` | stub | **廃止** — 連絡導線はトップ一枚内に置く |
| `/tokushoho` | scope 外(Legal-Feat-9) | **変更なし** — 法務ページ群(Legal-Feat-9)として初期スコープに含まれる |

### 派生する再設計ポイント

- Decision §9 の product card link(Medo / Sarae → `/works` stub)は行き先を失う。トップ一枚内での表現(ステータス表示付きカード等)へ再設計する。パーパス intent INV-003(率直なステータス表示・宣言的未来語りの禁止)に従う。
- Alternatives「footer link / stub page(論点 4)」の採用案 (B)(stub に飛ばす)は、この route 縮退により実質失効。
- 本 Amendment は route 構造(Decision §0)にのみ及ぶ。§1〜§15 の理念適用・視覚言語・motion 等のデザイン判断は影響を受けない。
- Plan / QA(`_docs/plan/App/top-page-initial/plan.md` / `_docs/qa/App/top-page-initial/test-plan.md`)の縮退後スコープへの見直しは follow-up(パーパス intent の Rollback / Follow-ups 参照)。

## Amendment 2 (2026-07-04): トップページの「一文の仕事」確定

トップページの仕事は次の効果の実現である —「3 秒で『良い』と感じさせ、30 秒で『一人の作り手が道具を丁寧に作っている場所だ』と信頼させる。従として、Medo がここで育っていると伝わる」。

### 身分の明記

- これは訪問者に生じる**効果の定義**であり、公開コピーではない。
- **語彙は非正典・改訂可能**。例: 「工房・場所」は一人の作り手の場所という事実のニュアンスであり、アルチザン様式・クラフト美学の指定ではない。「信頼」は「この作り手のアプリに時間やデータを預けてもいい」と感じること。効果の再判定なしに語の差し替えを許す。オーナー判定 2026-07-04(ニュアンスとして承認)。

### 相互参照

視覚面の判定は視覚正典(`_docs/reference/Site/visual-canon/reference.md`)に遡る。
