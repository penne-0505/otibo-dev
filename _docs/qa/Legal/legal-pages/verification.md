---
title: "Verification: Legal pages for Medo / Sarae / otibo"
status: active
draft_status: n/a
qa_status: verified
risk: Medium
qa_schema: 2
created_at: 2026-07-04
updated_at: 2026-07-17
references:
  - "_docs/qa/Legal/legal-pages/test-plan.md"
  - "_docs/intent/Legal/legal-pages/decision.md"
  - "_docs/plan/Legal/legal-pages/plan.md"
related_issues: []
related_prs: []
---

# Verification: `Legal-Feat-9` — Legal pages for Medo / Sarae / otibo

## Summary

Medo / Sarae / otibo の法務ページを otibo.dev で公開した。2026-07-04 にサイトが Cloudflare Workers + static assets で稼働し、全 7 route が HTTP 200 を返すことを監督側が curl で確認済み。オーナーが .env.local に実値を記入して再デプロイし、プレースホルダゼロ・実値掲載を監督側が確認。`contact@otibo.dev` の受信・送信をオーナーがテスト完了。法的文書本文はドラフト 2 巡目のオーナー通読で承認済み。施行日(EFFECTIVE_DATE)はフォールバック文言「ストア公開日をもって発効」のまま公開 — Medo ストア公開時に env 設定 + 再デプロイで埋める設計(Legal-Chore-13)。

実装担当: Claude Code (Sonnet 4.6)

## Verification Verdict

Verdict: PASS

全AC、影響するDEC、strict INVが満たされている。自動・静的検証 +
オーナー実施事項(デプロイ・env実値設定・テスト送信・通読承認)が
すべて2026-07-04に完了。残Follow-upはEFFECTIVE_DATEのストア公開時反映のみ
(設計通りの後続chore)。

## Commands Run

```bash
# Build 検証
npm run lint          # biome check, exit 0
npm run typecheck     # tsc --noEmit, exit 0
npm run build         # Next.js static export, exit 0

# 静的検証
ls out/medo/privacy/index.html out/medo/terms/index.html out/medo/account-deletion/index.html
ls out/sarae/index.html out/stash/index.html out/tokushoho/index.html
grep -rn "要オーナー確認" app/                       # 0 件
grep -rn "OWNER_NAME\|OWNER_ADDRESS\|OWNER_PHONE" out/ | grep -v "公開前に設定してください"  # 0 件
grep -rn "dev@otibo\|href=\"/contact\"" app/          # 0 件
grep -r "@otibo/ui" panda.config.ts                   # import 確認

# Robots meta 確認
grep -l "noindex" out/sarae/index.html out/stash/index.html
grep -L "noindex" out/medo/privacy/index.html out/medo/terms/index.html out/medo/account-deletion/index.html out/tokushoho/index.html
```

Result:

```text
lint:      exit 0(lint:fix 後、unsafe fix 含む全 0 error)
typecheck: exit 0
build:     exit 0、10 route HTML 生成(/ + 7 法務 + 404 + /_not-found)
マーカー:  要オーナー確認 0 件
実値漏れ:  0 件(フォールバック表示のみ)
連絡先:    dev@otibo / /contact 参照 0 件
robots:    sarae / stash = noindex, nofollow / 法務 4 ページ = index, follow
```

## Automated Test Results

| Command / Test | Result | Notes |
| --- | --- | --- |
| `npm run lint` | PASS | exit 0、lint:fix で unsafe fix(process.env ブラケット記法)含む全 0 error |
| `npm run typecheck` | PASS | tsc strict、エラー 0 |
| `npm run build` | PASS | exit 0、10 route 静的 HTML 生成 |
| マーカー残存確認(`grep 要オーナー確認`) | PASS | 0 件 |
| 個人情報実値確認(grep out/) | PASS | フォールバック表示のみ、実値 0 件 |
| HTML 存在確認(全 7 法務 route) | PASS | out/ に全ファイル存在 |
| Robots meta 確認 | PASS | 全ページに明示的 meta 設定済み |
| INV-005 コメント確認 | PASS | 全法務ページに `// intent: INV-005 (Legal/legal-pages)` コメント付き |
| INV-004 ライブラリ構成確認 | PASS | `otiboPreset` import + `importMap: "@otibo/ui/styled-system"` 確認 |
| 連絡先統一確認 | PASS | dev@otibo / /contact 参照 0 件、全 `contact@otibo.dev` に統一 |

## Manual QA Results

| Checklist Item | Result | Notes |
| --- | --- | --- |
| オーナー確認 checklist (1)〜(11) 全解消 | PASS | 全 11 項目クローズ。最後の (1) はドラフト 2 巡目の通読承認で解消(2026-07-04) |
| 法的文書本文のオーナー通読承認 | PASS | ドラフト 2 巡目通読で承認済み(2026-07-04)。事実誤認なし |
| 実値掲載確認(プレースホルダゼロ) | PASS | オーナーが .env.local 記入 → 再デプロイ → 監督側 curl で確認(2026-07-04) |
| 全 route HTTP 200 確認 | PASS | 監督側が curl で全 7 route HTTP 200 確認済み(2026-07-04) |
| `contact@otibo.dev` テスト送信 | PASS | オーナーが受信・送信ともテスト成功(2026-07-04) |
| INV-003 アカウント削除手順の事実確認 | PASS | オーナー通読承認(2026-07-04)。実態と一致 |
| INV-008 法解釈断定なし確認 | PASS | draft レビュー時 + オーナー通読承認(2026-07-04)で確認 |

## Acceptance Criteria Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| AC-001 | PASS | `/medo/privacy`, `/medo/terms`, `/medo/account-deletion` の HTML 生成確認 + ライブ HTTP 200(監督側 curl 2026-07-04) + オーナー通読承認済み |
| AC-002 | PASS | `/tokushoho` の HTML 生成確認 + ライブ HTTP 200 + 実値掲載済み(プレースホルダゼロ、監督側 curl 確認) |
| AC-003 | PASS | `out/sarae/index.html` / `out/stash/index.html` に「準備中」文言を確認 |
| AC-004 | PASS | sarae / stash: `noindex, nofollow` / 法務 4 ページ: `index, follow` — build HTML から直接確認 |
| AC-101 | PASS | `grep -rn "要オーナー確認" app/` 0 件 |
| AC-102 | PASS | `npm run lint && npm run typecheck && npm run build` 全 exit 0 |

## Decision Conformance

| ID | Result | Why the implementation remains aligned |
| --- | --- | --- |
| DEC-001 | PASS | 未確認markerを解消し、ownerの全文通読後に公開した。 |
| DEC-002 | PASS | current factsからnew draftを作成し、旧文書を公開本文として流用しなかった。 |
| DEC-003 | PASS | 合意routeをstatic配信し、提出対象URLを固定した。 |
| DEC-004 | PASS | shared legal layoutをapp側で構成し、library primitiveを消費した。 |
| DEC-005 | PASS | 各pageでrobots値とページ固有の理由を隣接定義した。 |
| DEC-006 | PASS | owner決定範囲の実値だけをbuild時に供給し、repositoryへ保存しなかった。 |
| DEC-007 | PASS | Sarae / Stashを「準備中」と明示した。 |
| DEC-008 | PASS | 法解釈をagent判断で確定せず、owner reviewを完了した。 |

## Invariant Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| INV-001 | PASS | オーナー確認 checklist 全 11 項目クローズ(2026-07-04)。AC-101 grep 0 件 |
| INV-003 | PASS | オーナー通読承認(2026-07-04)。アカウント削除手順含む全文の事実確認完了 |
| INV-006 | PASS | `grep -rn "OWNER_NAME\|OWNER_ADDRESS\|OWNER_PHONE" out/` 0 件。build 出力にフォールバック表示のみ |
| INV-007 | PASS | sarae / stash: robots noindex + 「準備中」明示。完成ページと混同しない体裁 |
| INV-008 | PASS | draft レビュー + オーナー通読承認(2026-07-04)で法解釈断定記述なしを確認 |

## Deferred / Not Covered

| ID | Reason | Follow-up |
| --- | --- | --- |
| EFFECTIVE_DATE 実値設定 | Medo ストア公開日が未確定のため、フォールバック文言「ストア公開日をもって発効」のまま公開。設計通りの後続 chore | Legal-Chore-13: ストア公開時に env 設定 + 再デプロイ |

## Residual Risks

None

## Follow-up TODOs

- **Legal-Chore-13**: Medo ストア公開時に EFFECTIVE_DATE を .env.local に設定して再デプロイ。Play ストア提出後は `/medo/account-deletion` URL 変更禁止を確認すること。

---

## Regression Checklist

- [x] 既存 route (`/`) の HTML 生成が壊れていない — `out/index.html` 存在確認
- [x] scaffold / App-Feat-11 で確立した panda preset 継承 / build 通過が維持されている — `npm run build` exit 0
- [x] template 既存ファイル無変更 — route 追加のみ、既存設定ファイルへの破壊的変更なし

---

## Agent misbehavior チェック結果

- [x] agent は未確認の事実記述にプレースホルダを付けた(実値を断定調で書き込んでいない)
- [x] agent は jj / git 履歴から旧法的文書を発掘・流用していない
- [x] agent は特商法等の法制度解釈を断定する文章を書いていない
- [x] agent は個人情報(氏名・住所・電話番号)を推測や仮値で書き込んでいない — build 出力 grep 0 件確認済み
- [x] agent は `git commit` / `git push` / deploy を実行していない
- [x] agent は verification.md に個人情報の実値を書き込んでいない(本ファイル)

---

## 関連

- TODO: `Legal-Feat-9`(本 verification PASS につき削除済み)
- Intent: `_docs/intent/Legal/legal-pages/decision.md`
- Plan: `_docs/plan/Legal/legal-pages/plan.md`
- QA test-plan: `_docs/qa/Legal/legal-pages/test-plan.md`
- Survey: `_docs/survey/Legal/legal-pages/survey.md`
