---
title: "Draft: otibo.dev サイト パーパスと初期スコープ"
status: proposed
draft_status: exploring
created_at: 2026-07-03
updated_at: 2026-07-03
references:
  - "_docs/intent/App/top-page-initial/decision.md"
  - "_docs/intent/App/scaffold/decision.md"
  - "_docs/intent/App/ui-integration/decision.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/draft/Site/otibo-dev-site-purpose/notes.md -->
<!-- オーナー(ぺんね)との議論の結論を文書化したもの。レビュー後に intent へ昇格予定。 -->

## Purpose

otibo.dev は **otibo というプロダクトブランドの紹介サイト**。otibo とはどんな組織か、何をしているか、どんなプロダクトがあるか — これを訪問者に伝える。

## Non-goals

- ぺんね個人のポートフォリオではない。
- `@otibo/ui` の宣伝ページではない。

## Audience

otibo について知りたい人。プロダクトのユーザー候補、関係者、興味を持って訪れた人。

## Organization

個人ブランド(個人事業主)。複数人チームを装う語り口は使わない。

## Content inventory (2026-07-03 時点)

Android / web アプリとして展開予定のプロダクトが 5 つ。

| ステータス | 数 | プロダクト |
| --- | --- | --- |
| ほぼ完成(主役候補・未完成) | 1 | **Medo** — サイトで前に出せる筆頭候補だが、プロダクト自体はまだ未完成 |
| 実装途中 | 2 | うち一つは **Sarae**。もう一つは名前未提示 |
| アイデア段階 | 2 | 名前未提示 |

## 時間軸の方針

> **オーナー最終確認待ち**

「今ある otibo」を正直に映すことを基調とする。実装途中のプロダクトは「開発中」等の率直なステータス表示で、これからの軌道を伝える。実物のない未来を宣言的に語らない。

## 初期スコープ

> **オーナー最終確認待ち**

1. **トップページ(一枚)** — otibo とは / プロダクト一覧(ステータス付き) / 連絡導線。凝縮された一枚で完結させる。
2. **法務ページ群** — プライバシーポリシー / ToS の掲載ページ。既存タスク `Legal-Feat-9`(TODO.md: Set up legal pages for Medo / Sarae / otibo)が該当。`/medo/privacy` / `/medo/terms` / `/medo/account-deletion` / `/tokushoho`(特商法表記)を含み、Sarae は placeholder 可。

About / News 等のフルコーポレート構造は採らない。在庫に対して過大であり、空虚さがブランドを毀損する。

## 優先順位と依存

1. **法務ページを最優先。** プロダクトのリリースにはプライバシーポリシー / ToS の掲載が必要であり、otibo.dev の完成がプロダクトリリースの前提条件になっている。TODO.md では `Legal-Feat-9`(P1 / M / Medium、Dependencies: [App-Feat-10])として既にタスク化済み。なお同タスクには、旧 repo 破棄により法的文書テキストが消失しており jj reflog からの復旧可能性がある旨が記載されている。
2. ブランド表現の深化(Hero の完成度・ビジュアル等)は法務ページ完成後。

## UI 供給元

> **オーナー最終確認待ち**

サイトの UI は `@otibo/ui`(core-ui)を consumer として使う。旧 editorial-ui は放棄済み。見せる系 component は本文書を憲法として、ページ駆動でゼロベース設計する。法務ページの長文読書面には otibo-ui 側の 16px long-form reading grammar(otibo-ui commit `839c11f`)が再利用候補。

## 現状資産

**旧実験(Hero / light-field / 点描エンジン / エディトリアル 2 案)はすべて廃棄で確定**(オーナー判断、2026-07-03)。復元は行わず、otibo.dev は完全にゼロイチで再スタートする。

- 廃棄対象の痕跡は残存する — otibo-ui の jj 履歴(keep ref による working-copy snapshot、例: `f1eae62`)、および別リポジトリ `/home/penne/dev/active/penne-portfolio` の PoC(`poc-v1.html`, `handoff.md` 等)。いずれも**存在するが廃棄確定・復元しない**。
- `otibo-ui`(`/home/penne/dev/active/otibo-ui`)の現在の working tree(HEAD `370a966` + editorial-ui 削除後)には `src/light-field` も Hero 実装もない(2026-07-03 検証済み)。`src` 配下は core-ui / _explore / lib のみ。

~~本リポジトリ(`otibo-dev`)の Next.js + Panda CSS スキャフォールドが**唯一の出発点**である。~~

> **訂正(2026-07-04)**: 旧 repo 破棄により app/ / package.json 等のコード資産も消失していた(node_modules のみ残骸として残存)。**docs のみが出発点であり、スキャフォールドは 2026-07-04 の実装タスクで再構築した。** 再構築内容: Next.js 14 App Router + Panda CSS + @otibo/ui (Approach 4) + biome + TypeScript strict + gen-interface-jp + `output: "export"` 静的出力構成。

- `_docs/intent/App/top-page-initial/decision.md` に `/` / `/works` / `/about` / `/contact` ルートの初手スコープが定義されている。本 draft はその前提となるパーパスを補完する。

## Open questions

- [ ] 時間軸の方針をオーナーが正式に承認する。
- [ ] 初期スコープ(トップページ一枚 + 法務ページ群のみ)をオーナーが正式に承認する。
- [ ] UI 供給元方針(`@otibo/ui` consumer)をオーナーが正式に承認する。
- [ ] `top-page-initial` intent(App-Feat-12)との整合 — 現 intent にある `/works` / `/about` / `/contact` stub はフルコーポレート構造に近い。本 draft の「一枚 + 法務」方針が確定した場合、intent の更新またはスコープ再定義が必要になる。
- [x] ~~Hero / light-field の復元判断~~ — **廃棄で確定**(オーナー判断、2026-07-03)。復元せず、ゼロイチで再スタートする。「現状資産」節を参照。
- [ ] 名前未提示のプロダクト 3 つ(実装途中 1、アイデア段階 2)の扱いと、トップページ掲載時の名前・ステータス表記の確定。Medo / Sarae は確定済み(`Legal-Feat-9` でも既出)。
