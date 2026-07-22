---
title: "Intent: Legal pages for Medo / Sarae / otibo"
status: active
draft_status: n/a
intent_schema: 2
created_at: 2026-07-03
updated_at: 2026-07-17
references:
  - "_docs/plan/Legal/legal-pages/plan.md"
  - "_docs/qa/Legal/legal-pages/test-plan.md"
  - "_docs/survey/Legal/legal-pages/survey.md"
  - "_docs/intent/Site/otibo-dev-site-purpose/decision.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/intent/Legal/legal-pages/decision.md -->

## Context

Medo の事前登録・リリースにはプライバシーポリシー / 利用規約 / アカウント削除ページが、otibo(個人事業主)には特商法表記が必要であり、otibo.dev がプロダクト完成の前提条件になっている(サイトパーパス intent の「優先順位と依存」)。法的文書は**新規書き起こしで確定**(オーナー確定 2026-07-03、サイトパーパス intent INV-006)。

> **注記(2026-07-03)**: backcast repo に本番向け法務ページの現物が発見され(`_docs/survey/Legal/legal-pages/survey.md` 調査 B)、「旧テキスト消失」という前提事実が一時変化したが、**再判断完了・新規書き起こし維持で確定(2026-07-03、オーナー判断)**。既存ドラフトは公開実績がなく(otibo.dev は未配信 — DNS 検証済み)、引き継ぎ義務はないため**事実関係の参照資料に格下げ**。INV-002 は原文のまま有効。

本 intent は法務ページ群の設計判断を記録する。法制度(特商法の記載要件・省略可否等)に関する記述は本文書内で断定せず、**オーナーが最終確認する(必要に応じて専門家確認)**という位置づけに統一する。本文書は法的助言をしない。

## Decisions

### DEC-001: オーナー確認を公開gateにする

- **What**: エージェントがdraftし、オーナーが事実確認して反映する。
  未確認markerが残る文書は公開しない。
- **Why**: 取得データ、事業者情報、削除手順などの事実性はオーナーしか
  最終確認できず、未確認公開は虚偽記載につながるため。
- **Change freedom**: draft形式やreview toolは変更できる。事実確認の責任と
  marker残存ゼロの公開gateは維持する。
- **Why not**: エージェントによる一括作成・即公開では、確認責任を代替できない。

### DEC-002: 現在の実態から新規に書き起こす

- **What**: 旧法的文書を復旧・流用せず、新規に書く。発見済み旧draftは
  事実関係の参照資料としてのみ使う。
- **Why**: 旧draftは未公開で継承義務がなく、現在の取得データと手順との一致を
  一から検証できるため。
- **Change freedom**: 参照資料は追加できる。公開済み文書の将来改訂は、
  現行文書からの差分として扱う。
- **Revisit when**: 公開済み文書との継続性を守る必要が生じた場合。

### DEC-003: 法務routeと公開後のURLを安定させる

- **What**: Medo 3 route、`/tokushoho`、Sarae / Stashのplaceholderを
  otibo.devで配信し、ストア等へ提出したURLは変更しない。
- **Why**: store reviewとユーザー導線が公開URLを外部参照するため。
- **Change freedom**: URL内の内容、layout、CTAは要件を保って更新できる。
  新productのrouteは別判断で追加できる。

`/medo/account-deletion`は静的説明と削除request導線を持ち、Play要件の
読み込み可能性、目立つ削除導線、appまたはdeveloper名参照を満たす。

### DEC-004: legal reading surfaceをapplication側で構成する

- **What**: `@otibo/ui`のconsumerとしてprimitiveを使い、法務固有の
  reading compositionはsite側で構成する。
- **Why**: site全体のUI基盤と整合しながら、長文法務面の情報構造を
  library componentへ固定しないため。
- **Change freedom**: typography値、CSS Module構成、利用primitiveは変更できる。

### DEC-005: robots policyをページごとに明示する

- **What**: 各法務ページのindex / followを放置defaultにせず、
  ページの公開目的に基づいて設定する。
- **Why**: 法務ページの検索露出はstore審査上の参照性とbrandの見え方に
  影響するため。
- **Change freedom**: product statusや公開目的が変われば、owner reviewを経て
  個別ページのrobots値を変更できる。

### DEC-006: 個人情報の公開境界をオーナー決定に限定する

- **What**: 氏名、住所、電話番号の公開範囲はオーナーが決定し、
  その範囲を超える実値をpageにもrepositoryにも書かない。
- **Why**: 法務要件の確認と不要な個人情報露出の抑制を両立するため。
- **Change freedom**: 公開方法はowner decisionと必要な専門家確認に基づき変更できる。

### DEC-007: 未完成productを完成済みに見せない

- **What**: Sarae / Stashの未完成ページは「準備中」を明示する。
- **Why**: 実在する現在のproduct statusを率直に示し、公開済み法務文書と
  誤認させないため。
- **Change freedom**: 正式文書が完成した時点でplaceholderを置換できる。

### DEC-008: 法制度の解釈をagentが確定しない

- **What**: 文書と実装は法制度の解釈を断定せず、オーナーが最終判断し、
  必要に応じて専門家へ確認する。
- **Why**: repositoryのdecision recordは法的助言を代替できないため。
- **Change freedom**: authoritative sourceと専門家確認に基づく確定事実は記載できる。

## Consequences / Impact

- 公開スケジュールはオーナーの確認往復に律速される。エージェント側で短縮できない工程として Plan に明記した。
- Medo / Sarae のプロダクト側で取得データが変わった場合、法務ページの改訂が必要になる(プロダクト変更時のチェック項目として運用に乗せる — follow-up)。
- 特商法表記の記載内容は課金・販売の有無に依存する。現状の有無はオーナー確認事項(Plan checklist (6))。

## Quality Implications

- 本タスクの品質の核心は「記載と実態の一致」であり、これはコードのテストでは担保できない。オーナー事実確認を QA の第一級工程として扱う。
- 破ると起きるリスク: 虚偽記載(取得していないデータの記載・実在しない削除手順の記載)、決定範囲を超える個人情報の公開、未確認ドラフトの誤公開。
- QA test-plan で確認すべき観点: マーカー残存ゼロ、route の HTTP 200、SEO meta の設定、個人情報の範囲逸脱、placeholder の「準備中」明示。

## Intent-derived Invariants

- INV-001 (from DEC-001): オーナー未確認の事実記述や未確認markerを含む法務ページを公開しない。
- INV-003 (from DEC-001): 公開する法務ページの記述は現在の実態と一致する。
- INV-006 (from DEC-006): オーナー決定範囲を超える個人情報をpage・repositoryへ書かない。
- INV-007 (from DEC-007): placeholderページは「準備中」を明示し、完成済みの体裁を取らない。
- INV-008 (from DEC-008): agentや文書が法制度の解釈を独断で確定しない。

## Enforced in (optional)

- DEC-001 / INV-001 / INV-003: owner review記録と未確認marker grep。
- DEC-003: route build outputとlive URL verification。
- DEC-004: shared legal layoutとlibrary import。
- DEC-005: 各pageのmetadata隣接commentとrendered robots meta。
- DEC-006 / INV-006: source / build outputの個人情報pattern review。
- DEC-007 / INV-007: placeholder heading、body、robots meta。
- DEC-008 / INV-008: ownerによる全文review。

## Rollback / Follow-ups

- rollback: 公開前は git revert で足りる。公開後・ストア URL 提出後は URL を維持したまま内容差し替えで対応する。
- Follow-up: プロダクト側の取得データ変更時に法務ページ改訂を発火させる運用チェックの整備。
- Follow-up: 16px long-form reading grammar の採否判断結果を本 intent に追記。
- Follow-up: Sarae 本実装(placeholder を選んだ場合)。
