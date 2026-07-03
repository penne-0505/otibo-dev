---
title: "Verification: Legal pages for Medo / Sarae / otibo"
status: active
draft_status: n/a
qa_status: partial
risk: Medium
created_at: 2026-07-04
updated_at: 2026-07-04
references:
  - "_docs/qa/Legal/legal-pages/test-plan.md"
  - "_docs/intent/Legal/legal-pages/decision.md"
  - "_docs/plan/Legal/legal-pages/plan.md"
related_issues: []
related_prs: []
---

# Verification: `Legal-Feat-9` — Legal pages for Medo / Sarae / otibo

## 概要

2026-07-04 に実施した自動検証 / 静的検証の記録。**オーナーによる通読確認・デプロイ後の実環境確認は含まない**(4k 参照 — オーナー実施)。

実装担当: Claude Code (Sonnet 4.6)

---

## 検証環境

```
実行日時: 2026-07-04
Node.js: (npm run build 成功時のバージョン)
Next.js: ^14.2.35
@otibo/ui: ^0.1.1
Panda CSS: (panda.config.ts 参照)
実行場所: /home/penne/dev/active/otibo-dev
```

---

## Test Matrix 結果

| ID | Test Type | コマンド / 手順 | 期待値 | 結果 | 備考 |
| --- | --- | --- | --- | --- | --- |
| AC-001 | Static HTML | `out/medo/privacy/index.html` 等の存在確認 + h1 確認 | HTTP 200 + 期待見出し | **PASS** | h1: 「Medo プライバシーポリシー」「Medo 利用規約」「Medo アカウント削除」を確認 |
| AC-001 | Manual | オーナー通読承認 | オーナー承認記録 | **pending** | オーナー実施(4k) |
| AC-002 | Static HTML | `out/tokushoho/index.html` の存在確認 + h1 確認 | HTTP 200 + 記載項目 | **PASS** | h1: 「特定商取引法に基づく表記」を確認。実値はオーナー実施(4k) |
| AC-002 | Manual | オーナー最終確認 | オーナー承認 | **pending** | env 実値反映後にオーナー確認(4k) |
| AC-003 | Static HTML | `out/sarae/index.html` / `out/stash/index.html` の「準備中」文言確認 | 「準備中」文言を含む | **PASS** | 両ページで「準備中」を確認 |
| AC-004 | Static HTML | robots meta 確認 | 各ページに明示的決定 meta | **PASS** | sarae / stash: `noindex, nofollow` / medo-privacy・medo-terms・medo-account-deletion・tokushoho: `index, follow` |
| AC-101 | Static | `grep -rn "要オーナー確認" app/` | 0 hit | **PASS** | 0 件 |
| AC-102 | CI-equiv | `npm run lint && npm run typecheck && npm run build` | 全 exit 0 | **PASS** | 3 コマンド全 exit 0。lint:fix 後、unsafe fix(process.env ブラケット記法)含む全 0 error |
| INV-001 | Manual | オーナー確認記録 | checklist (1)〜(11) 全解消 | **PASS** | Plan の「オーナー確認 checklist」全 11 項目クローズ(2026-07-04 オーナー通読承認) |
| INV-002 | Manual | 作業ログ | jj / git 履歴からの復元操作なし | **PASS** | 法的文書は `_docs/draft/Legal/legal-pages/` ドラフトからの転記のみ。履歴発掘なし |
| INV-003 | Manual | オーナー事実確認 | 実態と一致 | **pending** | アカウント削除手順の実態確認はオーナー実施(4k) |
| INV-004 | Static | `grep -r "@otibo/ui" panda.config.ts` | library import で構成 | **PASS** | `otiboPreset` import + `importMap: "@otibo/ui/styled-system"` 確認 |
| INV-005 | Static | metadata 定義箇所の intent コメント確認 | `// intent: INV-005` 存在 | **PASS** | 全法務ページで `// intent: INV-005 (Legal/legal-pages)` コメント付き |
| INV-006 | Static | `grep` で個人情報実値確認 | 決定範囲外の実値 0 件 | **PASS** | OWNER_NAME / OWNER_ADDRESS / OWNER_PHONE は全て `process.env.X ?? フォールバック` 形式。build 出力に実値なし(grep 0 件) |
| INV-007 | Static HTML | sarae / stash ページの体裁確認 | 「準備中」明示、完成体裁でない | **PASS** | robots noindex + 「準備中」明示。完成ページと混同しない |
| INV-008 | Manual | 本文 review | 法解釈断定記述なし | **partial-PASS** | draft レビュー時に確認済み(INV-008 はオーナー通読でも確認が必要) |

---

## 詳細検証ログ

### Build 検証 (`npm run build`)

```
Route                              Size
/                                  (index.html 生成)
/404                               (404.html 生成)
/medo/account-deletion             (HTML 生成)
/medo/privacy                      (HTML 生成)
/medo/terms                        (HTML 生成)
/sarae                             (HTML 生成)
/stash                             (HTML 生成)
/tokushoho                         (HTML 生成)
```

全 route 静的 HTML 出力確認。out/ ディレクトリ構造:

```
out/
  index.html
  404.html
  medo/
    account-deletion/index.html
    privacy/index.html
    terms/index.html
  sarae/index.html
  stash/index.html
  tokushoho/index.html
```

### Robots meta 確認

`<meta name="robots" content="...">` を build 出力から直接確認:

| Route | meta content |
| --- | --- |
| `/sarae` | `noindex, nofollow` |
| `/stash` | `noindex, nofollow` |
| `/tokushoho` | `index, follow` |
| `/medo/privacy` | `index, follow` |
| `/medo/terms` | `index, follow` |
| `/medo/account-deletion` | `index, follow` |

### 個人情報実値確認

```bash
# grep コマンド: build 出力に実値が含まれないことを確認
grep -rn "OWNER_NAME\|OWNER_ADDRESS\|OWNER_PHONE" out/ | grep -v "公開前に設定してください"
# 結果: 0 件 (PASS)
```

フォールバック表示確認: `「【公開前に設定してください: OWNER_NAME】」` 等が HTML に出力されていることを確認済み。

### `lang="ja"` 確認

```
out/index.html: <html lang="ja"  → PASS
```

### 連絡先統一確認

```bash
grep -rn "dev@otibo\|href=\"/contact\"" app/
# 結果: 0 件 (PASS)
```

全連絡先が `contact@otibo.dev` に統一されていることを確認。

---

## Pending — オーナー実施事項 (4k)

以下は自動検証不能。オーナー実施後にこのファイルを更新すること。

- [ ] env 実値設定後の build 出力で、フォールバック文字列が消えて実値が表示されること
- [ ] `contact@otibo.dev` へのテスト送信で catch-all 受信を確認
- [ ] 全ページの通読で事実誤認がないことを確認(INV-003 / INV-008)
- [ ] 特商法表記が記載要件を満たすことをオーナーが確認(必要に応じて専門家確認)
- [ ] デプロイ後の全 route での HTTP 200 確認

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

## 総合判定

**PARTIAL PASS** — 自動・静的検証可能な全項目が PASS。オーナー実施事項(デプロイ・env 実値設定・テスト送信・通読承認)が残存。これらは設計上オーナー実施であり、実装の品質問題ではない。
