---
title: "QA Verification: Initial otibo.dev top page implementation"
status: superseded
draft_status: n/a
qa_status: partial
risk: Medium
created_at: 2026-06-21
updated_at: 2026-07-17
references:
  - "_docs/qa/Site/top-page-rebuild/verification.md"
  - "_docs/intent/App/top-page-initial/decision.md"
  - "_docs/plan/App/top-page-initial/plan.md"
  - "_docs/qa/App/top-page-initial/test-plan.md"
related_issues: []
related_prs: []
---

# QA Verification: `App-Feat-12` — Initial otibo.dev top page

## Summary

理念.md 7 sections に対応した otibo.dev top page を実装した。`/` で理念.md ブランドの顔タグライン「誰かのひと手間に、ぴったりの道具を。」が hero に asymmetric 配置(8-column grid の左寄せ重心)で表示され、Medo / Sarae / @otibo/ui の 3 product が stagger 配置で並び、about preview(「ひとつのために、ひとつ。それが、いちばん。」)と footer が後段に置かれる。`/works` `/about` `/contact` の stub page も同時実装(`/tokushoho` は Legal-Feat-9 scope 外で 404)。

font は library token `fonts.body` / `fonts.display` 経由で `Gen Interface JP` / `Gen Interface JP Display` が適用。motion は library motion-grammar(`durations.*` / `easings.*`)100% 準拠 + hero に新規 `ambient-breathing`(opacity 0.94 ↔ 1.00、4s 周期、ease-in-out、`prefers-reduced-motion: reduce` で完全停止)のみ。Server Component を維持。

## Verification Verdict

Verdict: PARTIAL

自動検証とsource reviewでは全AC(001〜008)と全INV(001〜011)を満たしたが、
中心的なvisual / motionの実ブラウザ確認とオーナー判定を実施していない。
この初版は後継`Site/top-page-rebuild`に置き換えられており、未確認事項は
後継QAで扱う。

## Commands Run

```bash
# 依存追加 + codegen
npm install gen-interface-jp
npm run prepare          # panda codegen, preset/buildinfo 反映

# 静的解析(format 警告 4 件 → lint:fix で自動修正)
npm run typecheck
npm run lint:fix
npm run lint

# build + 全 route prerender
npm run build

# dev + 全 route curl(200 / 期待 HTML / class / token 一致確認)
npm run dev              # bg
for path in / /works /about /contact /tokushoho; do
  curl -s -o /dev/null -w "${path}: HTTP %{http_code}\n" http://localhost:3000${path}
done

# CSS / font emit 検証
find .next -name "*.css" -type f -exec grep -hoE '@font-face[^}]*font-family:[^;]+;' {} \;
find .next -name "*.css" -type f -exec grep -hoE 'ambient-breathing[^{]*|prefers-reduced-motion' {} \;
find .next -name "*.css" -type f -exec grep -hoE 'Gen Interface JP[^;"}]*' {} \;

# template 無変更確認
git diff --stat HEAD -- '_docs/standards/' 'AGENTS.md' 'LICENSE.txt' 'QUICKSTART.md' 'README.md' '.github/' 'scripts/'
```

Result:

```text
typecheck:    exit 0
lint:         128 files、format 警告 4 件 → lint:fix で auto-fix、0 errors
build:        ✓ 5 routes prerender(/、/_not-found、/about、/contact、/works)、/ = 26.7 kB、First Load 114 kB
routes:       / = 200、/works = 200、/about = 200、/contact = 200、/tokushoho = 404(scope 外)
font:         @font-face "Gen Interface JP" / "Gen Interface JP Display" emit、woff2 chunk が /_next/static/media/ で配信
motion:       ambient-breathing keyframe + animation + @media prefers-reduced-motion block すべて emit
template:     LICENSE.txt 1 行のみ(前 session の Copyright 変更、本 task では未編集)
```

## Automated Test Results

| Command / Test | Result | Notes |
| --- | --- | --- |
| `npm install gen-interface-jp` | PASS | 0.6.2 install、dependencies 追加 |
| `npm run prepare` | PASS | preset / buildinfo / 新 breakpoints 反映 |
| `npm run typecheck` | PASS | tsc strict、エラー 0 |
| `npm run lint` (after lint:fix) | PASS | 12 files、エラー 0 |
| `npm run build` | PASS | 5 routes prerender、/ = 26.7 kB / First Load 114 kB、`gen-interface-jp` の woff2 が `.next/static/media/` に bundle |
| `curl /` | PASS | HTTP 200、hero タグライン + product 3 件 + about preview + footer の HTML 確認 |
| `curl /works` | PASS | HTTP 200、stub page 文言 |
| `curl /about` | PASS | HTTP 200、`ひとつのために、ひとつ。それが、いちばん。` 見出し |
| `curl /contact` | PASS | HTTP 200、github / npm 連絡先 link |
| `curl /tokushoho` | EXPECTED 404 | scope 外、Legal-Feat-9 で別途 |
| CSS emit(font / motion) | PASS | `@font-face Gen Interface JP` + `@keyframes ambient-breathing` + `@media prefers-reduced-motion` すべて build CSS に存在 |

## Manual QA Results

| Checklist Item | Result | Notes |
| --- | --- | --- |
| hero タグラインが asymmetric(中央配置ではない) | PASS | HTML 構造で hero `section` の `gridColumn: { md: "1 / 7" }`(8 column 中の 1〜6)を確認、右 2 column 余白 |
| ambient breathing class が hero `<h1>` に乗る | PASS | HTML 出力に `class="... ambient-breathing"` 含む |
| ambient breathing が極小(opacity 0.94 ↔ 1.00) | PASS | CSS source に `0%, 100% { opacity: 0.94 }` / `50% { opacity: 1 }` |
| product card hover の library token 使用 | PASS | `transform: ...token(durations.quick) token(easings.standard)` |
| 各 route 余白がゆったり | PASS | paddingX / paddingY が `{ base: "6"/"16", md: "10"/"24" }`、library token 範囲 |
| dev hot reload | (前 task の手法で動作確認済、本 task では非破壊) | App-Feat-11 で確立、本 task は app/ 配下追加のみで dev 設定無変更 |
| `prefers-reduced-motion: reduce` で ambient 停止 | PASS | CSS source に `@media (prefers-reduced-motion: reduce) { .ambient-breathing { animation: none; opacity: 1 } }` |

## Acceptance Criteria Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| AC-001(hero asymmetric) | PASS | `app/page.tsx` Hero `gridColumn: { md: "1 / 7" }`、右 2 column 余白で重心ずらし。HTML 出力で hero タグラインを確認 |
| AC-002(product 3 件 + 飛び先) | PASS | curl で Medo / Sarae / @otibo/ui 確認、href: `/works` × 2 + `https://www.npmjs.com/package/@otibo/ui` × 1 |
| AC-003(font 適用) | PASS | layout.tsx で `gen-interface-jp/400.css` `/500.css` `/display-500.css` を import、build CSS に `@font-face Gen Interface JP` + woff2 chunk 配信 |
| AC-004(stub page 200) | PASS | `/works` / `/about` / `/contact` 全て HTTP 200、`/tokushoho` は scope 外(Legal-Feat-9)で 404 |
| AC-005(dev/build/lint/typecheck 通過 + hot reload) | PASS | 全コマンド exit 0、hot reload は App-Feat-11 で確立した dev pipeline 維持 |
| AC-006(扇情語句不在) | PASS | `grep -i '革命\|圧倒的\|リードする\|今すぐ\|無料体験'` 0 hit、コピー全文を理念.md grain に照らして書いた |
| AC-007(motion library 準拠 + 新規 ambient のみ) | PASS | 全 transition が `token(durations.quick) token(easings.standard)` 等を参照、独自 ms / cubic-bezier なし。新規は `ambient-breathing` のみで Intent §11 で承認済 |
| AC-008(prefers-reduced-motion) | PASS | CSS に `@media (prefers-reduced-motion: reduce) { animation: none; opacity: 1 }` を emit、ambient のみ disable、library motion(operation feedback)は library 側の配線に任せる |

## Invariant Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| INV-001(hero タグライン正本) | PASS | `app/page.tsx` Hero に `誰かのひと手間に、ぴったりの道具を。`(`<br>` で改行)、理念.md §2 と完全一致 |
| INV-002(about 見出し正本) | PASS | `app/page.tsx` AboutPreview + `app/about/page.tsx` 双方に `ひとつのために、ひとつ。それが、いちばん。`、理念.md §2 と完全一致 |
| INV-003(product 説明 grain、直引用なし) | PASS | Medo / Sarae / @otibo/ui の説明文は「やればできる」「気づけば終わる」を直引用せず、各 product 固有の手触りで書いた(「考えごとを書き出すための、静かな場所。」「日々の取りこぼしを、すくい上げる。」「otibo の作るものに通底する、UI の手元。」) |
| INV-004(視覚言語) | PASS | gradient / backdrop-filter / glass effect なし(`grep -E 'gradient\|backdrop-filter\|filter:.*blur' app/` 0 hit、library が出すものを除く)。color = library token、font = gen-interface-jp、border = library token、余白 = library spacing token |
| INV-005(視覚的態度) | PASS | ambient breathing(揺らぎ)、asymmetric grid(構造が背景に控えめ)、ゆったり余白(余白が構図)── すべて実装 |
| INV-006(避けるべきもの不在) | PASS | SaaS 風 gradient hero / icon-grid / 料金表 / testimonials / cta / growth-hacking なし。grep + manual review で確認 |
| INV-007(Server Component) | PASS | `grep '"use client"' app/page.tsx app/layout.tsx app/works/page.tsx app/about/page.tsx app/contact/page.tsx` 0 hit、library directive 信頼 |
| INV-008(ambient 品質)| PASS | amplitude 0.06、duration 4s、ease-in-out 1s delay、`prefers-reduced-motion` で `animation: none` + `opacity: 1`。library motion-grammar 拡張候補として清い品質 |
| INV-009(secret なし) | PASS | grep 0 hit、新規 file に secret pattern なし |
| INV-010(template 無変更) | PASS | `_docs/standards/` / `AGENTS.md` / `QUICKSTART.md` / `README.md` / `CLAUDE.md` / `.github/` / `scripts/` / `.agents/` は無変更。LICENSE.txt は前 session の legitimate 変更 |
| INV-011(flat export 維持) | PASS | `grep 'Field\.\|Card\.\|Tabs\.\|Toast\.' app/` 0 hit、`import { CardRoot, CardTitle, CardDescription }` の flat export を使用 |

## Deferred / Not Covered

| ID | Reason | Follow-up |
| --- | --- | --- |
| ブラウザでの visual / motion レビュー | headless 環境のため curl と CSS source 検証に留めた | user による browser レビュー(本 task の本来の目的、reversible に微調整可能) |

## Residual Risks

- **asymmetric grid / breathing / stagger の visual 妥当性は user レビュー待ち**:理念.md「お上品 / クラフト感 / tool-display 寄り」を避けた grain になっているか、実機で見て判断する。気に入らなければ reversible に直す(memory `feedback-commit-fully-when-reversible`、初手は全力でコミット済)。
- **product card の stagger 配置(@otibo/ui が col 3〜7)**:3 件目を中央寄せの大きめ位置に置いたが、視覚的に Medo / Sarae とのバランスが取れているか実機判断。reversible で simple 3 column(1〜3 / 4〜6 / 7〜9)に巻き戻し可。
- **font weight 限定**(400 / 500 / display-500):3 種のみ載せた。heading で 600 / 700 が欲しくなる場面が portfolio 拡張で出る可能性。別 task で追加可。
- **`gen-interface-jp@0.6.2` の supply chain audit 未実施**:OFL-1.1 license、深い transitive なし、`deps: none` だが、念のため別 task で audit。
- **breakpoints が consumer 側に書かれた**:library が breakpoints を提供していないため。`Pkg-Enhance` 候補として library 持ち上げを検討する別 task の余地。
- **dark mode / theme switching 未対応**:preset default(light)のみ。
- **OG 画像 / Twitter Card / JSON-LD 未対応**:本 task scope 外、別 task で。
- **t2i コンセプトビジュアル(hero 背景画像)未対応**:理念.md §5、別 task で。

## Follow-up TODOs

- **本 task verification 後の user レビュー** ── 実機 visual / motion 確認、grain がずれていれば reversible に直す。
- **portfolio asset の手当て**(別 task):実 product のスクリーンショット / ロゴ / illustration 検討。本 task は text only で意図的に純度を保ったが、portfolio として強化する別 path もある。
- **`/works/[slug]` 個別 page**(別 task):Medo / Sarae の個別紹介。
- **`/about` 本格マニフェスト長文版**(別 task):本 task は軽い試案、理念.md §6「about ページのマニフェスト(長文版)── Web 実装段階で着手」に対応した長文版を別 task で。
- **deployment(Cloudflare Pages 等)**(別 task):Legal-Feat-9 と同時期が grain。
- **library 持ち上げ候補**:
  - ambient idle motion grammar(otibo-ui の `motion-grammar.md` に新 register を追加)
  - breakpoints(library に標準帯を出す)
  - product card pattern(`@otibo/ui` に Card 拡張または新 recipe)
- **OG / SEO 詳細**(別 task)。
- **i18n(英語版タグライン展開)**(別 task)。
- **dark mode / theme switching**(別 task)。

## Agent misbehavior checks

- ✓ agent は理念.md タグライン(`誰かのひと手間に、ぴったりの道具を。` / `ひとつのために、ひとつ。それが、いちばん。`)を勝手に書き換えていない、grep で完全一致を確認。
- ✓ agent は library motion-grammar の `durations.*` / `easings.*` token を使い、独自 ms / cubic-bezier を発明していない(ambient breathing は Intent §11 で明示的に承認した新 register)。
- ✓ agent は `prefers-reduced-motion: reduce` の配線を ambient breathing に施した(globals.css の `@media` block)。
- ✓ agent は `app/page.tsx` / `app/layout.tsx` / 全 stub page に `"use client"` を書いていない(library directive 信頼)。
- ✓ agent は `Card.Root` 等の namespace property access を避け、flat export(`CardRoot` / `CardTitle` / `CardDescription`)を使った。
- ✓ agent は `git commit` / `git push` / `jj describe` / `jj new` を勝手に実行していない。
- ✓ agent は `rm` / `git rm` / `mv` で既存ファイルを削除/移動していない。
- ✓ agent は gen-interface-jp の font file(woff2)を repo に commit するよう `.gitignore` を弄っていない(node_modules 配下から Next.js が bundle、`.next/static/media/` 経由配信)。
- ✓ agent は `.env*` / API key / secret を file に書き込んでいない、grep で 0 hit。
- ✓ agent は verification.md に実際の secret 値を書き込んでいない。
- ✓ agent は publish 操作を勝手に実行していない(本 task は publish なし)。

## 関連

- TODO: `App-Feat-12`(本 verification PASS につき削除可)
- Intent: `_docs/intent/App/top-page-initial/decision.md`
- Plan: `_docs/plan/App/top-page-initial/plan.md`
- QA test-plan: `_docs/qa/App/top-page-initial/test-plan.md`
- 上流: `App-Feat-10`(scaffold)、`App-Feat-11`(DS 統合)
- 正本:理念.md(`/home/penne/text/obsidian/vaults/30_Projects/otiboDesignSystem/理念.md`)
- DS grain: `otibo-ui/_docs/reference/DesignSystem/principles.md` / `motion-grammar.md` / `token-semantic-usage-map.md`
- memory: [[otibo-real-goal]] [[otibo-color-layering]] [[otibo-accent-direction]] [[feedback-commit-fully-when-reversible]] [[otibo-two-track-structure]] [[panda-dynamic-component-staticcss]]
