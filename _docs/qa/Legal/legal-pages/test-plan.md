---
title: "QA Test Plan: Legal pages for Medo / Sarae / otibo"
status: active
draft_status: n/a
qa_status: planned
risk: Medium
created_at: 2026-07-03
updated_at: 2026-07-03
references:
  - "_docs/intent/Legal/legal-pages/decision.md"
  - "_docs/plan/Legal/legal-pages/plan.md"
  - "_docs/intent/Site/otibo-dev-site-purpose/decision.md"
related_issues: []
related_prs: []
---

# QA Test Plan: `Legal-Feat-9` — Legal pages for Medo / Sarae / otibo

## Source of Intent

- TODO: `Legal-Feat-9`
- Plan: `_docs/plan/Legal/legal-pages/plan.md`
- Intent: `_docs/intent/Legal/legal-pages/decision.md`
- 上位文書: `_docs/intent/Site/otibo-dev-site-purpose/decision.md`

## Quality Goal

Medo / Sarae / otibo の法務ページが otibo.dev で配信でき、**記載内容がすべてオーナー確認済みの実態と一致している**。プロダクトリリースのブロッカーが解消される。品質の核心は「記載と実態の一致」であり、オーナー事実確認を QA の第一級工程とする。

## Acceptance Criteria

TODO `Legal-Feat-9` より:

- AC-001: `/medo/privacy`, `/medo/terms`, `/medo/account-deletion` が公開され、必要な記述要件を満たす。
- AC-002: `/tokushoho`(otibo)が公開され、特定商取引法に基づく記載要件を満たす(記載要件の充足はオーナーが最終確認する。必要に応じて専門家確認)。
- AC-003: Sarae / Stash 用のページが「準備中」placeholder か本実装で用意されている(製品状況に応じて選択。現時点の決定は両方 placeholder — オーナー確定 2026-07-03)。
- AC-004: SEO 用 meta(noindex 等)が必要に応じて設定されている。

本 test-plan 追加(intent 由来):

- AC-101: 公開時点で「要オーナー確認」マーカーが本文に残存していない。
- AC-102: dev / build / lint / typecheck が全て exit 0。

## Intent-derived Invariants

- INV-001: 法務ページの事実記述はオーナー確認済みの内容のみを公開する。未確認マーカー残存状態で公開しない。
- INV-002: 法的文書は新規書き起こしであり、旧テキストを復旧・流用しない。
- INV-003: 法務ページは実態と異なる記載を含まない。
- INV-004: 法務ページの layout は `@otibo/ui`(core-ui)consumer として構成する。
- INV-005: 各法務ページの SEO meta は明示的な決定に基づいて設定されている。
- INV-006: オーナー決定範囲を超える個人情報を、ページ・リポジトリのいずれにも書き込まない。
- INV-007: placeholder ページは「準備中」を明示し、完成済みの体裁を取らない。
- INV-008: 文書・実装は法制度の解釈を断定しない。最終判断はオーナー(必要に応じて専門家)。

## Risk Assessment

- **Risk level**: Medium
- **Risk rationale**: 法務ページは対外的な法的表明であり、誤記載はプロダクトのストア審査・ユーザーとの信頼・法的リスクに直結する。一方で実装自体は静的ページ群で技術リスクは低い。リスクの重心は「内容の正確性」にあり、これはオーナー確認で受ける。
- **Regression risk**: scaffold / App-Feat-11 で確立した build / preset 継承を壊す可能性(route 追加のみなので低)。
- **Data safety risk**: なし(ページはデータを収集しない前提。form を置く場合は本 plan のスコープ外として再評価)。
- **Security / privacy risk**: 個人事業主の個人情報(氏名・住所・電話番号)の掲載範囲逸脱。オーナー決定を超える情報を book に載せない(INV-006)。
- **UX risk**: 長文読書面の可読性(16px long-form reading grammar の採否判断で対応)。
- **Agent misbehavior risk**:
  - agent が未確認の事実(取得データ・手順・事業者情報)を断定調で書いて公開可能な状態にする。
  - agent が旧テキストを jj / git 履歴から発掘して流用する(INV-002 違反)。
  - agent が法制度の解釈(特商法の省略可否等)を断定して文書化する(INV-008 違反)。
  - agent が個人情報を placeholder のつもりで実値で書き込む。
  - agent が `git commit` / deploy を勝手に実行する。

## Test Strategy

- **Unit**: なし(静的ページ群、unit 対象なし)。
- **Integration**: `npm run build` の exit 0 + 対象 route の prerender 確認。
- **E2E**: `curl` で全 route の HTTP 200 + 期待見出し・本文構造。
- **Manual QA(最重要)**: オーナーによる本文事実確認。Plan の「オーナー確認 checklist」(1)〜(7) の全項目解消と、最終ドラフトの通読承認。自動化不能・省略不可。
- **Validator / static check**: `biome check .` / `tsc --noEmit` / grep によるマーカー残存・個人情報範囲・noindex meta の確認。

## Test Matrix

| ID | Source | Requirement / Invariant | Test Type | Command / File | Expected Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AC-001 | TODO | Medo 3 ページ公開 | E2E + Manual | `curl /medo/privacy /medo/terms /medo/account-deletion` + オーナー通読承認 | 全 HTTP 200 + 期待見出し + オーナー承認記録 | planned |
| AC-002 | TODO | /tokushoho 公開 + 記載要件 | E2E + Manual | `curl /tokushoho` + オーナー最終確認(必要に応じ専門家) | HTTP 200 + 記載項目がオーナー決定と一致 | planned |
| AC-003 | TODO | Sarae / Stash ページ | E2E | `curl <sarae route> <stash route>` | 両ページとも「準備中」文言を含む HTTP 200(placeholder 確定) | planned |
| AC-004 | TODO | SEO meta | Static + E2E | `grep -r "robots" app/` + `curl` で `<meta name="robots">` 確認 | 各ページに明示的決定に基づく meta が存在 | planned |
| AC-101 | intent | マーカー残存ゼロ | Static | `grep -rn "要オーナー確認\|TODO(owner)\|UNCONFIRMED" app/` | 0 hit | planned |
| AC-102 | intent | dev/build/lint/typecheck | CI-equivalent | 各コマンド | 全 exit 0 | planned |
| INV-001 | intent | 未確認事実の公開なし | Manual + Static | オーナー確認記録の存在 + AC-101 の grep | checklist (1)〜(7) 全解消の記録 | planned |
| INV-002 | intent | 旧テキスト不使用 | Manual + Diff | 作業ログ / diff review | jj / git 履歴からの復元操作が作業過程に存在しない | planned |
| INV-003 | intent | 実態と一致 | Manual | オーナー事実確認(取得データ・削除手順) | オーナーが「実態と一致」と確認した記録 | planned |
| INV-004 | intent | @otibo/ui consumer | Static | `grep -r "@otibo/ui" app/medo app/tokushoho` + 独自 CSS の diff review | layout が library import で構成されている | planned |
| INV-005 | intent | SEO meta 明示的決定 | Static | metadata 定義箇所の intent 参照コメント確認 | `// intent: INV-005 (Legal/legal-pages)` アンカー存在 | planned |
| INV-006 | intent | 個人情報範囲 | Static + Manual | `grep` で電話番号 / 住所パターン + オーナー決定との突合 | 決定範囲外の個人情報 0 件 | planned |
| INV-007 | intent | placeholder 明示 | E2E | `curl <sarae route>` | 「準備中」明示、完成体裁でない | planned |
| INV-008 | intent | 法解釈の断定なし | Manual | 本文 review | 法制度解釈の断定記述なし(「〜とされています」等の断定回避 or オーナー確認済み事実のみ) | planned |

## Manual QA Checklist

- [ ] Plan の「オーナー確認 checklist」(1)〜(11) が全て解消されている(2026-07-03 時点の残件は (1)(6) の 2 点のみ — ドラフトレビューと同時に確認可能)
- [ ] オーナーが最終ドラフト全文を通読し、事実誤認がないことを確認した
- [ ] 特商法表記の記載項目(本名・バーチャルオフィス住所・電話番号 — いずれも公開、オーナー確定 2026-07-03)がオーナーの決定と一致している。電話番号は実装時反映であり、リポジトリ文書に実値が書かれていない
- [ ] アカウント削除手順が Medo の実際の手順と一致している
- [ ] **公開前に `contact@otibo.dev` へテスト送信し、catch-all(Cloudflare Email Routing)で実際に受信できることを検証した**(「catch-all あり」はオーナー認識であり未検証のため)
- [ ] 掲載連絡先がすべて `contact@otibo.dev` に統一されている(`dev@otibo.dev` / `/contact` フォーム参照が残っていない — オーナー判断 2026-07-03)
- [ ] 長文読書面が読みやすい(行長・行間・font size — 16px long-form reading grammar 採否の判断材料)
- [ ] 各ページからの導線(戻りリンク等)が dead でない

## Regression Checklist

- [ ] 既存 route(`/` 等)の HTTP 200 が壊れていない
- [ ] scaffold / App-Feat-11 で確立した panda preset 継承 / build 通過が維持されている
- [ ] template 既存ファイル無変更

## High-risk Checklist

本 task は Risk Medium のため適用しない。

## Agent misbehavior checks

- [ ] agent は未確認の事実記述に必ずマーカーを付けている(断定調で埋めていない)
- [ ] agent は jj / git 履歴から旧法的文書を発掘・流用していない
- [ ] agent は特商法等の法制度解釈を断定する文章を書いていない
- [ ] agent は個人情報(氏名・住所・電話番号)を推測や仮値で書き込んでいない
- [ ] agent は `git commit` / `git push` / deploy を勝手に実行していない
- [ ] agent は verification.md に個人情報の実値を書き込んでいない

## Out of Scope

- 法的助言・記載要件の法的判断(オーナー + 必要に応じて専門家)
- Medo / Sarae アプリ本体側のストア審査要件対応
- cookie consent banner / analytics
- トップページ(App-Feat-12)の実装

## Open Questions

- Plan の「オーナー確認 checklist」(1)〜(7) — 実装前に解消する。
- Sarae ページの route パス(`/sarae/*` か単一ページか)は checklist (5) の回答に依存。
- 法務ページを footer 等からリンクする導線の設計は App-Feat-12(縮退後トップ一枚)側との調整事項。
