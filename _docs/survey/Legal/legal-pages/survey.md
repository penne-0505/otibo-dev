---
title: "Survey: Google Play アカウント削除要件 + Medo(backcast)事実インベントリ"
status: active
draft_status: n/a
created_at: 2026-07-03
updated_at: 2026-07-03
references:
  - "_docs/plan/Legal/legal-pages/plan.md"
  - "_docs/intent/Legal/legal-pages/decision.md"
  - "_docs/qa/Legal/legal-pages/test-plan.md"
  - "_docs/intent/Site/otibo-dev-site-purpose/decision.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/survey/Legal/legal-pages/survey.md -->

## Background

Legal-Feat-9(法務ページ群)の Plan にはオーナー確認 checklist があり、うち 2 点が調査待ちだった: (1) Medo の取得データ実態、(7) Google Play のアカウント削除要件(`/medo/account-deletion` が説明ページで足りるか、web 削除機能が必要か)。両調査が完了したため結果を記録する(2026-07-03、監督側検証済み)。

## Objective

- 調査 A: Google Play のアカウント削除要件の一次情報を確認し、`/medo/account-deletion` の機能要件(静的ページで足りるか)を確定する。
- 調査 B: Medo(backcast repo)のコードベースから、プライバシーポリシー記載の根拠となる事実インベントリ(取得データ・第三者 SDK・削除挙動・権限)を作成する。

## Method

- 調査 A: Google Play Console ヘルプの一次情報(下記 URL)の読解。
- 調査 B: `/home/penne/dev/active/backcast` の読み取り専用コードベース調査(ファイルパス付きで記録)。

## Results

### 調査 A — Google Play アカウント削除要件

出典(一次情報): <https://support.google.com/googleplay/android-developer/answer/13327111>

- アプリ内削除導線に加え、**web の削除リクエスト URL が必須**(データセーフティフォームに提出する)。
- web URL の要件は 3 つ:
  1. エラーなく読み込まれる。
  2. 削除リクエスト導線が目立つ形で配置されている。
  3. アプリ名またはデベロッパー名が参照可能。
- **静的ページ + mailto(customer service email)や form で要件を満たせる**と公式が例示している。自動削除機能は必須ではない。
- **課金解約とアカウント削除は独立要件**。解約が削除の前提になる場合は「手順の明示 + 解約を開始できるサポートフロー」が必要。
- 施行済み(最終期限 2024-05-31)。違反はストア掲載削除の対象。

**結論**: `/medo/account-deletion` は静的な説明ページ + 削除リクエスト導線(mailto またはフォーム)で要件を満たせる。web 側の削除機能実装は不要。ただし Medo に課金があるため、解約手順の明示を削除ページの必須記載事項とする。

### 調査 B — Medo(backcast)事実インベントリ

repo: `/home/penne/dev/active/backcast`(Flutter / Supabase)

| 領域 | 事実 |
| --- | --- |
| 認証 | Supabase Auth + Google OAuth(email、表示名、userMetadata)。Apple Sign-in コードは存在するが iOS API キー未設定(`'YOUR_IOS_API_KEY'`) |
| サーバー保存 | `user_pro_entitlements` / `pro_entitlement_events`(RevenueCat 同期、cascade delete 設定)、`analytics_event_batches` / `analytics_events`(**user_id 非紐付け**、install_id / session_id は UUID)、`reviewer_entitlement_allowlist`(email PK、内部運用) |
| ローカル保存 | Drift/SQLite(plans / plan_blocks / snapshots / templates / app_preferences / cached_pro_entitlements / analytics ローカルキュー) |
| 第三者 SDK | Supabase(`fcufrdzcdtytmszbteqx.supabase.co`)、RevenueCat(purchases_flutter、App User ID = Supabase UUID、email 非送信)、google_fonts(Google への通信可能性)、flutter_local_notifications / share_plus / url_launcher(端末内)。**Firebase / Crashlytics / 広告 SDK なし** |
| analytics | 既定 disabled。同意なしでは送信されない。同意撤回でローカルキュー・install_id 削除。設定画面にトグル(「利用改善データを送信」)。**初回起動時の同意ダイアログは未確認** |
| 課金 | RevenueCat 経由 Google Play サブスク(月額 primary、買い切り対応コードあり)。Pro 機能 = 無制限タイムライン / テンプレート / 共有画像 / 余裕時間。Free は 2 タイムラインまで。価格はストア取得(ハードコードなし) |
| アカウント削除 | アプリ内導線あり(設定画面、「サブスク解約は別途」の注記あり)。delete-account Edge Function → `auth.users` 削除 → cascade で entitlement 系も削除。**送信済み analytics イベントは user 非紐付けのため残る**。RevenueCat 側 subscriber record とストア購入履歴は残る。端末ローカルは cleanup(README 記載どおり) |
| 権限 | カレンダー読み書き(Android/iOS)、通知、BOOT_COMPLETED。位置情報・カメラ等なし |
| 対象年齢 | 既存ポリシーに「13 歳未満(地域により 16 歳未満)対象外」と記載 |
| 海外移転 | Supabase リージョンはコードから確定不可。RevenueCat / Google は国外処理 |

### 調査 B — 重大発見: 本番向け法務ページの現存

`backcast/public/` に**本番向け法務ページが現存する**:

- `backcast/public/medo/privacy/index.html`(最終更新 2026-05-14)
- `backcast/public/medo/account-deletion/index.html`(最終更新 2026-05-13)

canonical URL は `https://otibo.dev/medo/...`。README の「ストアで公開中」記載・本番 RevenueCat キーという傍証はあったが、**その後の検証・オーナー確認により以下が確定した(2026-07-03)**:

- **otibo.dev は web 未配信**(DNS 検証: A / AAAA レコードなし。NS / MX は Cloudflare 設定済みで Email Routing は実在。Cloudflare Pages / Workers への紐付けなし)。
- **Medo はストア未公開・クローズドテスト未実施**(オーナー確認。公開まで最短 2 週間以上)。README の「公開中」記述はエージェントの憶測による虚偽(修正は別タスク起票済み)。
- よって backcast/public の法務ページは「**本番向けに書かれた未公開ドラフト**」であり、配信・Play 提出の実績はない。

既存削除ページは `dev@otibo.dev` と外部フォーム `https://otibo.dev/contact` を参照している(→ オーナー判断 2026-07-03: `contact@otibo.dev` に統一、フォームは mailto に置換)。

## Discussion

- **「新規書き起こし」前提の揺らぎ → 解消(2026-07-03)**: backcast に現物が存在することで前提事実が一時変化したが、オーナー再判断により**新規書き起こし維持で確定**。既存ドラフトは公開実績がないため引き継ぎ義務なし、**事実関係の参照資料に格下げ**(対象年齢 13 歳等の記述は参照可)。invariant(Legal intent INV-002 / サイトパーパス intent INV-006)は原文のまま有効。
- **URL 連続性の制約 → 消滅(2026-07-03)**: DNS 検証とオーナー確認により未配信・Play 未提出と確定したため、無 404 移行制約は存在しない。完全グリーンフィールド。ただし今後 Play へ URL を提出した後は「URL 不変」の制約が発動する。
- **連絡先の不整合 → 解消(2026-07-03)**: オーナー判断で `contact@otibo.dev` に統一(`dev@otibo.dev` 不採用)。`/contact` フォームは作らず mailto に置換(Play 要件上十分 — 調査 A)。catch-all の実挙動は公開前にテスト送信で検証する。
- **プライバシーポリシー記載の含意**(調査 B より): analytics は同意ベース・user 非紐付け、Firebase / 広告 SDK 不在、RevenueCat へ email 非送信 — 記載すべき第三者提供は限定的。一方、削除後も残るデータ(送信済み analytics・RevenueCat subscriber record・ストア購入履歴)は削除ページに明記が必要。

## Recommended Actions

1. checklist (7) を解消: `/medo/account-deletion` は静的ページ + 削除リクエスト導線(mailto or フォーム)で確定。解約手順の明示を必須記載に追加。— 反映済み
2. checklist (9)(10)(11) を新設: 新規書き起こし前提の再判断 / otibo.dev の現在の配信元 / 連絡先の統一。— 新設後、2026-07-03 の DNS 検証 + オーナー回答で全てクローズ(Discussion 参照)
3. Plan の Risks に URL 連続性(無 404 移行)の制約を追加。— 追加後、未配信確定により「解消」として更新済み
4. checklist (1)(6) を本 survey 参照に更新し、オーナー確認のみを残件とする。— 反映済み(法的文書ドラフトのレビューと同時に確認可能)
