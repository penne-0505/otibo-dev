---
title: "QA Test Plan: Initial otibo.dev top page implementation"
status: superseded
draft_status: n/a
qa_status: planned
risk: Medium
created_at: 2026-06-21
updated_at: 2026-07-17
references:
  - "_docs/qa/Site/top-page-rebuild/test-plan.md"
  - "_docs/intent/App/top-page-initial/decision.md"
  - "_docs/plan/App/top-page-initial/plan.md"
related_issues: []
related_prs: []
---

# QA Test Plan: `App-Feat-12` — Initial otibo.dev top page

## Source of Intent

- TODO: `App-Feat-12`
- Plan: `_docs/plan/App/top-page-initial/plan.md`
- Intent: `_docs/intent/App/top-page-initial/decision.md`
- 正本:理念.md(`/home/penne/text/obsidian/vaults/30_Projects/otiboDesignSystem/理念.md`)

## Quality Goal

otibo の屋号 page として `/` が成立する。**理念.md の正本タグラインと grain が page 上で読み取れる**(コピー / 視覚言語 / motion / 余白 すべて)。同時に `/works` `/about` `/contact` の stub が dead 化しない構造で揃い、後続 task が page ごとに本実装を積み上げる土台となる。「動かしながら確かめる」phase の最初の実物 ── レビューで「違う」と言われたら reversible に直せる範囲で全力でコミット(memory `feedback-commit-fully-when-reversible`)。

## Acceptance Criteria

- AC-001: `/` で理念.md の Web トップ用タグラインが hero に **asymmetric 配置**(中央配置ではなく重心ずらし)で表示される。
- AC-002: Medo / Sarae / @otibo/ui の 3 product が name + 1 行説明で並び、各 link が対応の route or 外部 URL に飛ぶ(@otibo/ui → npm 外部、Medo / Sarae → `/works`)。
- AC-003: font `gen-interface-jp` が全 page に適用されている(system fallback ではない)。
- AC-004: `/works` `/about` `/contact` の stub page が HTTP 200 で返り、dead link / 404 がない(`/tokushoho` は scope 外)。
- AC-005: dev / build / lint / typecheck が全て exit 0、hot reload が動作する。
- AC-006: 理念.md 第六原則(届ける言葉、扇情的でない)に擦らない文言になっている(`革命` / `圧倒的` / `リードする` / `今すぐ` / growth-hacking 風 cta が hero / product / about に存在しない)。
- AC-007: motion は library motion-grammar(`durations.*` / `easings.*` token)に準拠し、新規 motion(ambient breathing)は理念.md と整合する(突然の変化を避ける、予兆、揺らぎ)。
- AC-008: `prefers-reduced-motion: reduce` で ambient breathing 等の装飾 motion が disable される(operation motion は維持)。

## Intent-derived Invariants

- INV-001: hero タグラインは **理念.md §2 ブランドの顔(Web トップ)コピー** と完全一致(`誰かのひと手間に、ぴったりの道具を。`)。
- INV-002: about preview の見出しは **理念.md §2 思想/方法論コピー**(`ひとつのために、ひとつ。それが、いちばん。`)。
- INV-003: product 説明文は **理念.md §2 product 紹介の grain**(「やればできる」→「気づけば終わる」)を **直引用せず** に各 product 固有の手触りで表現。
- INV-004: 視覚言語(理念.md §3)── 色 = neutral + 単一 accent、質感 = solid surface(光沢 / gradient / glass なし)、形 = mild radius + 直線、余白 = ゆったり、線 = 細め、font = `gen-interface-jp`。
- INV-005: 視覚的態度(理念.md §4)── ambient breathing は「わずかな揺らぎ」、asymmetric grid は「構造が背景に控えめ」、ゆったり余白は「余白そのものが構図」を実装。
- INV-006: 避けるべきもの不在 ── SaaS 風 gradient hero、stock photo、icon-grid、料金表、testimonials、growth-hacking cta、煽り言葉、guilt-trip コピーがどこにも無い(理念.md §7 + 第六原則)。
- INV-007: hero は Server Component(library directive を信頼、consumer に `"use client"` 不要)。
- INV-008: ambient breathing は **新規 motion でありながら**(a)library `durations` / `easings` token を一切 hijack しない、(b)`prefers-reduced-motion` で完全停止、(c)amplitude が極小(opacity 0.06、translate なし)── これは library motion-grammar に逆持ち上げ可能な品質を満たす。
- INV-009: secret / 個人情報が新規 file に混入していない。
- INV-010: template 既存ファイル(`_docs/standards/` / `AGENTS.md` / `LICENSE.txt` / `QUICKSTART.md` / `README.md` 等)が無変更。
- INV-011: namespace export trap を踏まない ── App-Feat-11 で確立した flat export(`FieldRoot` 等)を引き続き使用(本 task では Field は不使用、Button / Card / Link を予定、Card は flat export 使用)。

## Risk Assessment

- **Risk level**: Medium
- **Risk rationale**: top page は portfolio の第一印象を担い、grain がずれると後続 task すべての base を引きずる。理念.md は明文化されているが、解釈の余地は残る(asymmetric の "どこに重心を" 等)。reversible なので試し直しは可能だが、初手の grain を立てることが本 task の核心。
- **Regression risk**:
  - App-Feat-11 で確立した `@otibo/ui` 統合(panda preset 継承 / Server Component 境界 / staticCss canonical)が壊れる可能性。
  - scaffold で確立した `/` の HTTP 200 / `<html lang="ja">` / hot reload。
- **Data safety risk**: なし。
- **Security / privacy risk**:
  - 個人情報を hero / about / contact 文言に書き過ぎる可能性(email / 住所 等)── contact stub は最小限に。
  - `gen-interface-jp` の supply chain(npm package、別 task で audit 評価)。
- **UX risk**:
  - hero の文字サイズが画面サイズによって読みづらい(`clamp` で対応するが、極端な viewport では試す価値あり)。
  - ambient breathing が「気のせい」を超えて目障りに感じる可能性 ── レビューで判断、reversible。
  - asymmetric grid が「ただ崩れているだけ」に見える可能性 ── レビュー判断。
- **Agent misbehavior risk**:
  - agent がコピーを理念.md と異なる文言に勝手に書き換える(タグライン正本を変える、説明文に煽り語を入れる)。
  - agent が library motion-grammar を無視して独自 duration / easing を発明する。
  - agent が `prefers-reduced-motion` の配線を忘れる。
  - agent が `git commit` / `jj` 操作を勝手に実行する。
  - agent が gen-interface-jp の font file を不要に repo に commit する。

## Test Strategy

- **Unit**: なし(top page、unit 対象なし)。
- **Integration**: `npm run build` の exit 0 + build CSS / route prerender 数(5 routes:`/`, `/_not-found`, `/works`, `/about`, `/contact`)。
- **E2E**: `curl` で全 route の 200 + 期待 HTML 構造(class / 文言 / link href)。
- **Manual QA**:
  - dev server で page を観察(可能なら browser、headless 環境では curl で diff)。
  - hot reload(scaffold で確立済の挙動を回帰)。
  - `prefers-reduced-motion` の挙動確認(curl で `@media` block の存在確認、browser があれば DevTools で emulate)。
- **Validator / static check**: `biome check .` / `tsc --noEmit` / grep による文言・token 使用の照合。
- **Diff review**: `git diff --stat` で template 既存ファイルが触られていないこと。

## Test Matrix

| ID | Source | Requirement / Invariant | Test Type | Command / File | Expected Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AC-001 | TODO | hero asymmetric | E2E + Static | `curl /` + `grep` page.tsx で grid template | HTTP 200、HTML に hero 文字 + grid 非均等 column class | planned |
| AC-002 | TODO | product 3 件 + 飛び先 | E2E + Static | `curl /` + `grep` href | 3 件の card、href: `/works` x 2 + npm 外部 URL | planned |
| AC-003 | TODO | font 適用 | Integration | build 後 `.next/static/media/` / `<head>` font preload | gen-interface-jp の woff2 が dist に含まれる、`<link rel="preload" as="font">` | planned |
| AC-004 | TODO | stub page 200 | E2E | `curl /works /about /contact` | 全 HTTP 200、期待文言含む | planned |
| AC-005 | TODO | dev/build/lint/typecheck | CI-equivalent | 各コマンド | 全 exit 0 | planned |
| AC-006 | TODO | 扇情語句不在 | Static | `grep -i '革命\|圧倒的\|リードする\|今すぐ\|無料体験'` on app/ | 0 hit | planned |
| AC-007 | TODO | motion library 準拠 | Static | `grep -E 'transition\|animation' app/` | duration/easing が token 参照、独自値なし(ambient のみ例外) | planned |
| AC-008 | TODO | prefers-reduced-motion | Static | `grep '@media.*prefers-reduced-motion' app/` | reduce で animation 停止の CSS が存在 | planned |
| INV-001 | intent | hero タグライン正本 | Static | `grep '誰かのひと手間に、ぴったりの道具を。' app/` | 完全一致 1 hit | planned |
| INV-002 | intent | about 見出し正本 | Static | `grep 'ひとつのために、ひとつ。それが、いちばん。' app/` | 完全一致 1 hit(`/` or `/about`) | planned |
| INV-003 | intent | product 説明文の grain | Manual | product card 文言の review | 「やればできる」「気づけば終わる」を直引用していない | planned |
| INV-004 | intent | 視覚言語 | Static | `grep -E 'gradient\|backdrop-filter\|filter:.*blur\|box-shadow' app/` | gradient / glass / 強い shadow なし(library が出すものを除く) | planned |
| INV-005 | intent | 視覚的態度 | Manual | hero に breathing animation + asymmetric grid 存在 | レビューで確認 | planned |
| INV-006 | intent | 避けるべきもの不在 | Static + Manual | grep + 視認 | SaaS テンプレ構造なし | planned |
| INV-007 | intent | Server Component | Static | `grep '"use client"' app/page.tsx app/layout.tsx` | 0 hit | planned |
| INV-008 | intent | ambient breathing 品質 | Static | `panda.config.ts` の keyframes + page で animation | amplitude 0.06、duration 4s、ease-in-out、reduce で停止 | planned |
| INV-009 | intent | secret なし | Static | `grep -rEi 'api[_-]?key\|token\|secret\|password' app/` | 0 hit | planned |
| INV-010 | intent | template 無変更 | Diff | `git diff --stat HEAD -- _docs/standards/ AGENTS.md ...` | 変更 0 行 | planned |
| INV-011 | intent | flat export 維持 | Static | `grep 'Field\.\|Card\.\|Tabs\.\|Toast\.' app/` | namespace property access なし | planned |

## Manual QA Checklist

- [ ] hero タグラインがブラウザで(可能なら)読みやすい(font の温度、weight、line-height)
- [ ] ambient breathing が「気のせい」レベル、目障りでない
- [ ] product card の hover / focus が library motion-grammar 通り(jarring でない)
- [ ] asymmetric grid が「崩れ」ではなく「意図」に見える
- [ ] 各 page の余白がゆったり、息苦しくない
- [ ] 全 route(`/`, `/works`, `/about`, `/contact`)が読める state
- [ ] `prefers-reduced-motion: reduce` で breathing が完全停止(browser DevTools で emulate)

## Regression Checklist

- [ ] scaffold で確立した HTTP 200 / `<html lang="ja">` / hot reload が壊れていない
- [ ] App-Feat-11 の panda preset 継承 / staticCss canonical / Server Component 境界が維持されている
- [ ] `panda.config.ts` の既存 key(presets / include / importMap / staticCss / preflight / outdir / jsxFramework)が消えていない
- [ ] `tsconfig.json` / `next.config.mjs` / `postcss.config.cjs` / `biome.json` / `.gitignore` の既存内容が無変更(font 追加のための panda.config / layout / package.json 以外)
- [ ] template 既存ファイル無変更

## High-risk Checklist

本 task は Risk Medium のため適用しない。

## Agent misbehavior checks

- [ ] agent はコピー(タグライン / 説明文)を理念.md と grep で照合した上で書いている
- [ ] agent は library motion-grammar の `durations` / `easings` token を使い、独自 ms / cubic-bezier を発明していない(ambient breathing を除く、それは intent で承認済)
- [ ] agent は `prefers-reduced-motion` の配線を全 ambient motion に施している
- [ ] agent は `app/page.tsx` / 全 stub page に `"use client"` を書いていない(library directive 信頼)
- [ ] agent は `Field.Root` 等の namespace property access を避け、flat export を使っている
- [ ] agent は `git commit` / `git push` / `jj` を勝手に実行していない
- [ ] agent は `rm` / `git rm` / `mv` で template ファイルを削除/移動していない
- [ ] agent は gen-interface-jp の font file(woff2 等)を repo に commit するよう .gitignore を弄っていない(node_modules 内で十分)
- [ ] agent は `.env*` / API key / secret を file に書き込んでいない
- [ ] agent は verification.md に実際の secret 値を書き込んでいない

## Out of Scope

- t2i コンセプトビジュアル、dark mode、theme switching、OG 画像、i18n、`/tokushoho`、`/works/[slug]`、contact form / cta、portfolio asset、analytics
- `/works` `/about` `/contact` の本実装(stub のみ)

## Open Questions

- ambient breathing の amplitude / duration は **初手 0.06 / 4s** で実装するが、レビュー結果次第で微調整可(reversible)。
- asymmetric grid の "どこに重心を" は実装時に decide(grid column 配分)── レビューで詰める想定。
- product card の stagger 配置 vs simple 3 column は実装時に決定 ── intent では「初手 stagger を試す」と書いたが、視認で微妙ならば simple 3 column に巻き戻し可。
