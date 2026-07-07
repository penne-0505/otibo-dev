---
title: "Intent: otibo.dev サイト パーパスと初期スコープ"
status: active
draft_status: n/a
created_at: 2026-07-03
updated_at: 2026-07-04
references:
  - "_docs/archives/draft/Site/otibo-dev-site-purpose/notes.md"
  - "_docs/intent/App/top-page-initial/decision.md"
  - "_docs/intent/App/scaffold/decision.md"
  - "_docs/intent/App/ui-integration/decision.md"
  - "_docs/reference/Site/visual-canon/reference.md"
  - "_docs/guide/Site/visual-canon/usage.md"
  - "_docs/archives/draft/Site/visual-canon/notes.md"
  - "_docs/archives/draft/Site/visual-canon-translation/notes.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/intent/Site/otibo-dev-site-purpose/decision.md -->
<!-- otibo.dev サイトの憲法。ページ・コンテンツ・UI 判断はすべて本 intent を上位文書とする。 -->

## Context

otibo.dev のパーパスが未定義のまま実装(scaffold / DS 統合 / top page 初手)が先行していた。オーナー(ぺんね)との議論でパーパス・初期スコープ・時間軸・UI 供給元を確定し、draft(`_docs/archives/draft/Site/otibo-dev-site-purpose/notes.md`)を経て本 intent に昇格した(オーナー承認 2026-07-03)。

背景の制約:

- プロダクトのリリースにはプライバシーポリシー / ToS 掲載ページが必要であり、**otibo.dev がプロダクト完成の前提条件**になっている。
- 旧実験(Hero / light-field / 点描エンジン / エディトリアル 2 案)は**すべて廃棄で確定**(オーナー判断 2026-07-03)。otibo.dev は完全にゼロイチで再スタートする。

## Decision

### パーパス

otibo.dev は **otibo というプロダクトブランドの紹介サイト**。otibo とはどんな組織か、何をしているか、どんなプロダクトがあるか — これを訪問者に伝える。

- **Audience**: otibo について知りたい人。プロダクトのユーザー候補、関係者、興味を持って訪れた人。
- **組織の実体**: 個人ブランド(個人事業主)。複数人チームを装う語り口は使わない。

### Non-goals

- ぺんね個人のポートフォリオではない。
- `@otibo/ui` の宣伝ページではない。

### Content inventory(2026-07-03 時点)

Android / web アプリとして展開予定のプロダクトが 5 つ。

| ステータス | 数 | プロダクト |
| --- | --- | --- |
| ほぼ完成(主役候補・未完成) | 1 | **Medo** — サイトで前に出せる筆頭候補だが、プロダクト自体はまだ未完成。**ストア未公開・クローズドテスト前(2026-07-03 確認)** |
| 実装途中 | 2 | うち一つは **Sarae**。もう一つは名前未提示 |
| アイデア段階 | 2 | 名前未提示 |

### 時間軸の方針(承認済み 2026-07-03、オーナー)

「今ある otibo」を正直に映すことを基調とする。実装途中のプロダクトは「開発中」等の率直なステータス表示で、これからの軌道を伝える。実物のない未来を宣言的に語らない。

### 初期スコープ(承認済み 2026-07-03、オーナー)

1. **トップページ(一枚)** — otibo とは / プロダクト一覧(ステータス付き) / 連絡導線。凝縮された一枚で完結させる。
2. **法務ページ群** — プライバシーポリシー / ToS の掲載ページ。既存タスク `Legal-Feat-9`(TODO.md: Set up legal pages for Medo / Sarae / otibo)が該当。`/medo/privacy` / `/medo/terms` / `/medo/account-deletion` / `/tokushoho`(特商法表記)を含み、Sarae は placeholder 可。法的文書は**新規に書き起こす**(旧テキストの復旧は行わない — オーナー確定 2026-07-03)。

About / News 等のフルコーポレート構造は採らない。在庫に対して過大であり、空虚さがブランドを毀損する。

### 優先順位と依存

1. **法務ページを最優先。** プロダクトリリースのブロッカー解消が先。TODO.md では `Legal-Feat-9`(P1 / M / Medium、Dependencies: [App-Feat-10])としてタスク化済み。
2. ブランド表現の深化(Hero の完成度・ビジュアル等)は法務ページ完成後。

### UI 供給元(承認済み 2026-07-03、オーナー)

サイトの UI は `@otibo/ui`(core-ui)を consumer として使う。旧 editorial-ui は放棄済み。見せる系 component は本 intent を憲法として、ページ駆動でゼロベース設計する。法務ページの長文読書面には otibo-ui 側の 16px long-form reading grammar(otibo-ui commit `839c11f`)が再利用候補。

## Alternatives

- **フルコーポレート構造(About / News / Works 等の複数ページ)**: 不採用。コンテンツ在庫(完成プロダクト 0)に対して過大で、空虚なページがブランドを毀損する。`top-page-initial` intent の `/works` `/about` `/contact` stub 構造はこの判断により縮退(同 intent の Amendment を参照)。
- **個人ポートフォリオとしての位置づけ**: 不採用。otibo はプロダクトブランドであり、個人の作品集とは目的が異なる。
- **旧実験(Hero / light-field 等)の復元**: 不採用(オーナー確定 2026-07-03)。痕跡は otibo-ui の jj 履歴 snapshot(例: `f1eae62`)と `/home/penne/dev/active/penne-portfolio` の PoC に残存するが、復元せずゼロイチで再スタートする。
- **法的文書の旧テキスト復旧(jj reflog 等)**: 不採用(オーナー確定 2026-07-03)。新規に書き起こす。

## Rationale

- 「今を正直に映す」方針は、未完成プロダクトを前にした唯一の誠実なブランド表現であり、率直なステータス表示は虚飾よりも信頼を作る。
- 一枚トップへの凝縮は、在庫とページ構造の釣り合いを取り、空虚さの露出を構造的に防ぐ。
- 法務ページ最優先は、otibo.dev がプロダクトリリースのハード依存であることから機械的に導かれる。

## Consequences / Impact

- `_docs/intent/App/top-page-initial/decision.md` の route 構造(`/works` / `/about` / `/contact` stub)は本 intent と競合するため、同 intent に Amendment を追記して縮退させた。
- `Legal-Feat-9` の Steps(旧テキスト復旧 or 新規記述)は「新規書き起こし」に確定・更新した。
- 見せる系 component の設計は本 intent 起点のページ駆動となる。otibo-ui 側への component 要求は、ページの必要から逆算して発生する。

## Quality Implications

- 本 intent はサイトの憲法であり、ページ追加・コピー・構造の判断はすべてここへトレース可能であること。
- 破ると起きるリスク: フルコーポレート構造への漂流(空虚ページの発生)、チームを装う語り口の混入、宣言的な未来語りによる信頼毀損。
- QA 観点: 新規ページ追加時に初期スコープ(一枚トップ + 法務)からの逸脱がないか、コピーが Non-goals / 組織実体の記述と整合するかを確認する。

## Intent-derived Invariants

- INV-001: otibo.dev の初期スコープは「一枚の凝縮されたトップページ + 法務ページ群」のみであり、About / News 等のフルコーポレート構造を持たない。
- INV-002: サイトのコピーは個人ブランド(個人事業主)として書かれ、複数人チームを装う語り口を含まない。
- INV-003: プロダクトの提示は現在の実ステータス(開発中等)を率直に表示し、実物のない未来を宣言的に語らない。
- INV-004: 廃棄確定した旧実験(Hero / light-field / 点描エンジン / エディトリアル 2 案)を復元してサイトに取り込まない。
- INV-005: サイトの UI は `@otibo/ui`(core-ui)の consumer として構成し、見せる系 component は本 intent 起点のページ駆動で設計する。
- INV-006: 法的文書は新規に書き起こし、旧テキストの復旧を行わない。※backcast repo での現物発見(`_docs/survey/Legal/legal-pages/survey.md` 調査 B)による再判断は完了 — **再判断完了・新規書き起こし維持で確定(2026-07-03、オーナー判断)**。既存ドラフトは公開実績がなく(otibo.dev 未配信)、事実関係の参照資料としてのみ利用可。本 invariant は原文のまま有効。

## Rollback / Follow-ups

- 本 intent の変更(スコープ拡大等)は、コンテンツ在庫の変化(プロダクト完成等)を根拠にオーナー承認を経て行う。
- Follow-up: 名前未提示のプロダクト 3 つ(実装途中 1、アイデア段階 2)の扱いと、トップページ掲載時の名前・ステータス表記の確定。Medo / Sarae は確定済み。
- Follow-up: `top-page-initial`(App-Feat-12)の Plan / QA を Amendment 後のスコープに合わせて見直す(必要なら別タスク)。
