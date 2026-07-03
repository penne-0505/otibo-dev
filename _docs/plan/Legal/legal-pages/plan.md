---
title: "Plan: Legal pages for Medo / Sarae / otibo"
status: proposed
draft_status: n/a
created_at: 2026-07-03
updated_at: 2026-07-03
references:
  - "_docs/intent/Legal/legal-pages/decision.md"
  - "_docs/qa/Legal/legal-pages/test-plan.md"
  - "_docs/survey/Legal/legal-pages/survey.md"
  - "_docs/intent/Site/otibo-dev-site-purpose/decision.md"
  - "_docs/intent/App/top-page-initial/decision.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/plan/Legal/legal-pages/plan.md -->

## Overview

otibo.dev に Medo / Sarae / otibo の法務ページ群(プライバシーポリシー / 利用規約 / アカウント削除 / 特商法表記)を立てる。法的文書は**新規に書き起こす**(旧テキストの復旧・流用は行わない — サイトパーパス intent INV-006)。backcast repo の本番向け法務ページ現物の発見で一時再判断となったが、**オーナー再判断の結果、新規書き起こし維持で確定(2026-07-03)**。既存ドラフトは公開実績がなく引き継ぎ義務はないため、**事実関係の参照資料に格下げ**(対象年齢 13 歳等の記述は参照可)。これはプロダクトリリースのハードブロッカー解消であり、サイトパーパス intent の初期スコープ第 2 項・最優先事項に対応する。

**前提の確定(2026-07-03、DNS 検証 + オーナー確認)**: otibo.dev は **web 未配信**(A / AAAA レコードなし。NS / MX は Cloudflare 設定済みで Email Routing は実在)。Medo は**ストア未公開・クローズドテスト未実施**(公開まで最短 2 週間以上)。よって本タスクは**完全グリーンフィールド**であり、既存公開物への互換制約はない。

**作業フローの前提**: 法的記載内容の正確性はオーナーにしか確認できない。本タスクは「**エージェントがドラフト → オーナーが事実確認 → 反映**」の往復を基本サイクルとし、オーナー未確認の事実記述を公開状態にしない。

## Scope

- `/medo/privacy` — Medo プライバシーポリシー
- `/medo/terms` — Medo 利用規約
- `/medo/account-deletion` — Medo アカウント削除手順
- `/tokushoho` — otibo(個人事業主)の特定商取引法に基づく表記
- Sarae 用ページ — **placeholder で確定**(オーナー回答 2026-07-03、ロゴ未整備)
- Stash 用ページ — **placeholder として掲載**(オーナー指示 2026-07-03 で Scope に追加。repo: `/home/penne/dev/active/stash`)
- 法務ページ共通 layout(長文読書面)の設計・実装
- 各ページの SEO meta(noindex 等)の明示的な決定と設定

### 未決事項(スコープに影響)

- ~~削除導線の機能要件は Play 要件調査の結果で確定(未決)~~ → **解消(2026-07-03、survey 調査 A)**: Google Play の一次情報により、`/medo/account-deletion` は**静的な説明ページ + 削除リクエスト導線(mailto またはフォーム)で要件を満たせる**ことが確定。web 側の削除機能実装は不要。初期スコープ(静的ページ群)への機能実装追加は発生しない。詳細は `_docs/survey/Legal/legal-pages/survey.md` 調査 A。

### Risks

- ~~URL 連続性(無 404 移行)~~ → **解消(2026-07-03)**: DNS 検証により otibo.dev は未配信(A / AAAA なし)、Medo はストア未公開(オーナー確認)と確定。Play 提出済み URL は存在せず、無 404 移行制約は消滅。**ただし今後 Play へ URL を提出した後は「URL 不変」の制約が発動する**(Deployment 参照)。
- **Play 要件違反はストア掲載削除の対象**(施行済み、最終期限 2024-05-31)。削除ページの要件 3 点(エラーなく読み込み / 削除導線が目立つ / アプリ名 or デベロッパー名参照可能)を実装時の必須確認事項とする。

## Non-Goals

- 法的文書の内容に関する法的助言(本 Plan / Intent は法制度の解釈を確定しない。記載要件・省略可否の判断はオーナーが行い、必要に応じて専門家に確認する)
- 旧 repo の法的文書テキストの復旧・流用(**再判断完了・新規書き起こし維持で確定 2026-07-03**。backcast/public の既存ドラフトは事実関係の参照資料としてのみ扱う)
- `/contact` フォームの実装(連絡導線は mailto に統一 — checklist (11)。Play 要件上 mailto で十分 — survey 調査 A)
- トップページ(`/`)の実装・改修(App-Feat-12 の縮退後スコープ)
- Medo / Sarae アプリ本体のストア掲載要件対応(本タスクは Web ページ側のみ)
- cookie consent banner / analytics(現時点で対象となる仕組みが存在するかもオーナー確認事項)

## Requirements

### Functional

- F-001: `/medo/privacy`, `/medo/terms`, `/medo/account-deletion`, `/tokushoho` が HTTP 200 で配信される。
- F-002: 各ページの本文はオーナー事実確認済みのテキストである。
- F-003: Sarae / Stash 用ページが placeholder として存在し、「準備中」であることを明示する(オーナー確定 2026-07-03)。
- F-004: 各ページに noindex 等の SEO meta が「明示的な決定」に基づいて設定されている(放置デフォルトにしない)。
- F-005: 法務ページ共通 layout は `@otibo/ui`(core-ui)consumer として構成される(サイトパーパス intent INV-005)。
- F-006: `/medo/account-deletion` は Google Play の削除要件 3 点(エラーなく読み込み / 削除リクエスト導線が目立つ形 / アプリ名 or デベロッパー名参照可能)を満たし、削除リクエスト導線(mailto またはフォーム)を持つ(survey 調査 A)。
- F-007: `/medo/account-deletion` に**サブスク解約手順の明示**を必須記載とする(Medo に課金があるため。課金解約とアカウント削除は独立要件 — survey 調査 A)。削除後も残るデータ(送信済み analytics・RevenueCat subscriber record・ストア購入履歴)も明記する(survey 調査 B)。

### Non-Functional

- NF-001: 長文読書面の typography は otibo-ui 側の 16px long-form reading grammar(otibo-ui commit `839c11f`)を**参照候補**として設計する(採用可否は実装時に判断し、結果を Intent / verification に残す)。
- NF-002: dev / build / lint / typecheck が全て exit 0。
- NF-003: 個人情報の掲載範囲はオーナーの決定(下記 checklist (2))に厳密に従い、決定範囲を超える個人情報をページにもリポジトリにも書き込まない。
- NF-004: template 既存ファイル(`_docs/standards/` / `AGENTS.md` 等)は無変更。

## オーナー確認 checklist(実装前・ドラフト往復で解消する)

法的記載の根拠となる事実は、以下をオーナーが確認・決定するまで「ドラフト」の状態に留める。オーナー回答 1 巡目を反映済み(2026-07-03)。**確定事項**と**オーナー認識(未検証)**を書き分ける。

- [x] **(1) Medo のデータ実態**: **クローズ(2026-07-04)** — 事実インベントリは `_docs/survey/Legal/legal-pages/survey.md` 調査 B を参照(認証 = Supabase Auth + Google OAuth、analytics は同意ベース・user 非紐付け、Firebase / 広告 SDK 不在、RevenueCat へ email 非送信、等)。ドラフト 1 巡目でコードベース裏取り済み(同意ダイアログ不在 / BOOT_COMPLETED 用途 / analytics 保存期間 TTL 不在 / 削除導線の画面名 / イベント一覧 — 根拠パスは各ドラフトの HTML コメント参照)。**ドラフト 2 巡目のオーナー通読承認済み(2026-07-04)**。
- [x] **(2) 特商法表記の事業者情報**: **確定(2026-07-03)** — 本名・バーチャルオフィス住所・**電話番号のいずれも公開する**(「事業所として届け出済み」はオーナー認識・未検証)。電話番号はオーナー提供済み・**実装時に反映**(リポジトリ文書には番号そのものを書き込まない — NF-003)。
- [x] **(3) 準拠法・管轄**: **確定(2026-07-03)** — 日本法・東京地方裁判所を合意管轄とする。
- [x] **(4) 問い合わせ先アドレス**: **確定(2026-07-03)** — `contact@otibo.dev`。「otibo.dev 宛は catch-all 受信設定あり」はオーナー認識・未検証(実装時に受信テストで検証する)。
- [x] **(5) Sarae / Stash の扱い**: **placeholder で確定(2026-07-03)** — Sarae はロゴ未整備のため placeholder。**新規事項(オーナー指示 2026-07-03): 「Stash」というプロダクト(repo: `/home/penne/dev/active/stash`)も placeholder として掲載する。**
- [x] **(6) 課金・販売の有無**: **確定(2026-07-03、オーナー回答)** — 提供形態は **Google Play サブスクリプションのみ(月額 480 円 / 年額 3,000 円、米国: $2.99 / $14.99、いずれも税込)**。買い切り(lifetime)は**販売なし**(コード上の表示ラベルは fallback 対応のみ)。Pro 機能 = 無制限タイムライン / テンプレート / 共有画像 / 余裕時間、Free は 2 タイムラインまで。施行日は「ストア公開時の日付」ルールで確定。
- [x] **(7) アカウント削除の実手順**: **解消(2026-07-03、survey 調査 A + B)**。Play 要件: web の削除リクエスト URL が必須(データセーフティフォーム提出)だが、**静的ページ + mailto またはフォームで要件を満たせる**(公式例示)。自動削除機能は不要。Medo の実装: アプリ内削除導線あり(delete-account Edge Function → cascade delete)。`/medo/account-deletion` は静的説明ページ + 削除リクエスト導線で確定。解約手順の明示を必須記載に追加(F-007)。
- [x] **(8) Medo の公開状態の実際**: **確定(2026-07-03、オーナー確認)** — **ストア未公開・クローズドテスト未実施**(公開まで最短 2 週間以上)。backcast README の「公開中」記述はエージェントの憶測による虚偽と判明(README 修正は別タスク起票済み)。プライバシーポリシーの施行日記述・トップページのステータス表示(「開発中」)双方と整合する。
- [x] **(9) 「新規書き起こし」前提の再判断**: **クローズ(2026-07-03、オーナー判断)** — **新規書き起こしを維持**。backcast/public の既存ドラフトは公開実績がないため引き継ぎ義務なし。**事実関係の参照資料に格下げ**(対象年齢 13 歳等の記述は参照可)。invariant(Legal intent INV-002 / サイトパーパス intent INV-006)は原文のまま有効。
- [x] **(10) otibo.dev の現在の配信元**: **確定(2026-07-03、DNS 検証)** — **未配信**。A / AAAA レコードが存在せず、Cloudflare Pages / Workers への紐付けもなし(NS / MX は Cloudflare 設定済み、Email Routing は実在)。backcast/public の法務ページは「本番向けに書かれた未公開ドラフト」であり配信実績はない。無 404 移行制約は消滅(Risks 参照)。
- [x] **(11) 連絡先の不整合**: **確定(2026-07-03、オーナー判断)** — **`contact@otibo.dev` に統一**。`dev@otibo.dev` は不採用。`/contact` フォームは作らず **mailto に置換**(Play 要件上十分 — survey 調査 A)。catch-all の実挙動は公開前にテスト送信で検証(QA test-plan に確認項目あり)。

## Tasks

1. **オーナー確認 checklist の解消**: **全 11 項目クローズ(2026-07-04)**。
2. **Plan / Intent / QA の確定**: checklist 全解消済み。
3. **文書ドラフト作成**: **完了(2026-07-03)** — 4 本を `_docs/draft/Legal/legal-pages/` に作成。
4. **オーナー事実確認**: **完了(2026-07-04)** — 2 巡目通読でオーナー承認。【オーナー確認】マーカー残ゼロ(残るのは実装時反映プレースホルダ 6 箇所のみ)。
5. **route 構造 + 共通 layout 実装**: `app/medo/privacy` 等の route、長文読書面 layout(`@otibo/ui` consumer、16px long-form reading grammar を参照候補に)。
6. **SEO meta の決定・設定**: 各ページの noindex 要否をオーナーと決定し、meta を設定。
7. **Sarae / Stash ページ**: placeholder として実装(「準備中」明示)。
8. **static check + build 検証**: lint / typecheck / build。
9. **Verification 作成** + TODO 完了処理。

## QA Plan

- QA document: `_docs/qa/Legal/legal-pages/test-plan.md`
- Risk level: **Medium**
- Test strategy:
  - E2E: `curl` で全 route の HTTP 200 + 期待見出し・本文構造。
  - Static: SEO meta(noindex)の存在確認、オーナー未確認マーカーの残存ゼロ確認(grep)、個人情報の掲載範囲逸脱チェック。
  - Manual QA: オーナーによる本文事実確認(これが本タスクの最重要 QA。自動化不能)。
  - Integration: build 通過で layout + `@otibo/ui` consumer 構成を確認。
- AC ↔ confirmation の対応は test-plan の Test Matrix を参照。

## Deployment / Rollout

- **完全グリーンフィールド**(2026-07-03 確定): otibo.dev は未配信(A / AAAA なし)、Play 提出済み URL なし。既存公開物への互換制約なしで deploy を設計できる。DNS(A / AAAA)+ ホスティング(Cloudflare Pages / Workers 等)の新規設定が deploy 作業に含まれる。
- 公開(deploy)は**オーナーの事実確認完了が前提条件**。マーカー残存状態で deploy しない。
- 公開前に `contact@otibo.dev` へのテスト送信で catch-all(Email Routing)の実挙動を検証する。
- rollback: git で revert 可能。法務ページは他 route から独立しており、削除時の影響は限定的。ただし公開後の削除はプロダクト側のリンク切れを招くため、公開後の変更は差し替えで行う。
- ストア審査等でページ URL を提出した後は URL を変えない(route 構造は公開前に確定させる)。

## 関連

- TODO: `Legal-Feat-9`
- Intent: `_docs/intent/Legal/legal-pages/decision.md`
- QA: `_docs/qa/Legal/legal-pages/test-plan.md`
- 上位文書: `_docs/intent/Site/otibo-dev-site-purpose/decision.md`(サイトの憲法。INV-001 / INV-005 / INV-006 が本タスクを拘束)
- 上流: `App-Feat-10`(scaffold、verification PASS 済み・完了)
