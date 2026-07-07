---
title: "QA Test Plan: First View light shader local foundation"
status: active
draft_status: n/a
qa_status: planned
risk: Medium
created_at: 2026-07-10
updated_at: 2026-07-10
references:
  - "_docs/intent/Site/first-view-light-shader/decision.md"
  - "_docs/plan/Site/first-view-light-shader/plan.md"
  - "_docs/draft/Site/otibo-light-shader-handoff/notes.md"
  - "_docs/reference/Site/visual-canon/reference.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/qa/Site/first-view-light-shader/test-plan.md -->

# QA Test Plan: `Site-Enhance-14` — First View light shader local foundation

## Source of Intent

- TODO: `Site-Enhance-14`
- Plan: `_docs/plan/Site/first-view-light-shader/plan.md`
- Intent: `_docs/intent/Site/first-view-light-shader/decision.md`
- Visual authority: `_docs/reference/Site/visual-canon/reference.md` と正典画像

## Quality Goal

PoC 完了済みの `layered-v5` を production baseline として本番 First View へ移し、通常表示を汚さずに
光の contribution、viewport、motion、fallback、initial paint、Workers deployment を検証できる。

## Acceptance Criteria

- AC-001: 通常表示は光の場と `otibo` のみで、`layered-v5` の層と bounded dynamic range を維持する。
- AC-002: 開発時 named diagnostic view で material、主要 light contribution、final composite を個別確認できる。
- AC-003: 1440x900 / 390x844 を含む複数 viewport の比較記録がある。
- AC-004: 通常 motion、reduced motion、非表示タブで lifecycle が意図どおりに変わる。
- AC-005: WebGL2 不在、shader error、context loss の全経路で fallback と `otibo` が表示される。
- AC-006: fallback と `otibo` は shader 初期化を待たず、同期 1024x2048 height texture 生成を既定経路の初期描画 blocker にしない。
- AC-007: browser default marginによる白い枠がなく、First Viewがviewport全面を占める。
- AC-008: 旧下流sectionを外し、shader-only状態をproduction deployしない境界が記録される。
- AC-009: static export / Workers dry-runを技術互換確認として通す。

## Intent-derived Invariants

- INV-001: 通常表示には光の場と `otibo` 以外を置かない。
- INV-002: light layer を単一の淡い帯へ縮退させず、暗部を黒落ちさせない。
- INV-003: diagnostic view は明示的な開発時 opt-in なしに現れない。
- INV-004: reduced motion と非表示タブでは連続 animation frame を実行しない。
- INV-005: WebGL failure の全対象経路で fallback と `otibo` が表示される。
- INV-006: 初期 fallback と `otibo` は procedural height texture の準備を待たない。
- INV-007: page 本体は Server Component のまま、WebGL lifecycle だけを Client Component に閉じる。
- INV-008: default routeはstatic export可能で、Workers Static AssetsにWorker scriptを要求しない。
- INV-009: shader-only状態をproduction deployしない。
- INV-010: 旧Products / About / Contact / Footerをlocal baselineと後続設計の互換条件から外す。
- INV-011: browser default marginを残さず、First Viewがviewport全面を占める。

## Risk Assessment

- **Risk level**: Medium
- **Risk rationale**: 視覚・motion・性能・GPU failure を同じ First View が担い、回帰を静止画像一枚では判定できない。
- **Regression risk**: 診断用変更が default composite を変える、fallback が通常表示へ残る、motion 停止後に再開しない可能性。
- **Data safety risk**: なし。外部入力、永続データ、通信を扱わず、本番 deploy も実行しない。
- **Security / privacy risk**: なし。secret、個人情報、外部 API を扱わない。
- **UX risk**: motion discomfort、初期表示の長い暗転、文字と光の衝突、mobile での構図崩れ。
- **Agent misbehavior risk**: shader 探索へ戻る、下流 section まで再設計する、guide の checklist 充足を visual canon 判定と取り違える、debug control を通常表示へ残す。

## Test Strategy

- **Unit**: mode 解決と lifecycle state を純粋関数へ分離した場合に追加する。分離しない場合は no-test rationale を verification に記録する。
- **Integration**: WebGL 初期化、first frame、fallback、context loss、visibility change の接続を browser で確認する。
- **E2E**: viewport と motion preference を固定し、DOM snapshot、時間差 screenshot、console error を記録する。
- **Manual QA**: visual canon、First View の責務、文字位置・濃度、motion 量をオーナーが判定する。
- **Validator / static check**: `bash scripts/check-docs.sh`、`npm run lint`、prototype の mode / lifecycle / fallback diff review。
- **Diff review**: pageがServer Componentのまま、First Viewだけに縮退し、通常表示にdebug controlがないことを確認する。

## Test Matrix

| ID | Source | Requirement / Invariant | Test Type | Command / File | Expected Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AC-001 | TODO | default composite と First View 責務 | E2E + Manual | default URL を 1440x900 / 390x844 で screenshot | 光の場 + `otibo` のみ。baseline の層を維持 | planned |
| AC-002 | TODO | named diagnostic view | Integration | 各 named mode を browser で選択し screenshot | material / light contribution / final を区別できる | planned |
| AC-003 | TODO | viewport 比較 | E2E + Manual | 1440x900 / 390x844 と追加 extreme viewport | 文字・光が切れず、比較記録が残る | planned |
| AC-004 | TODO | motion lifecycle | E2E | 通常 / reduced motion の時間差 screenshot + visibility の frame count | 通常は変化、reduced / hidden は連続描画なし | planned |
| AC-005 | TODO | fallback 全経路 | Integration | WebGL2 null、compile error、`WEBGL_lose_context` | 各経路で canvas を退避し fallback + `otibo` 表示 | planned |
| AC-006 | TODO | 初期表示と同期 blocker 解消 | Performance + Static | reload timing、initial paint capture、初期化 diff review | fallback + `otibo` が先に表示され、巨大同期生成を待たない | planned |
| AC-007 | TODO | full-viewport表示 | Browser + Computed style | html / body / main / First View | margin 0、viewport全面 | planned |
| AC-008 | TODO | shader-only local boundary | DOM + Docs | `/` DOM、TODO / Plan | 下流sectionなし、deploy禁止を明記 | planned |
| AC-009 | TODO | static compatibility | Build + Deployment | `npm run build`、`npm run deploy:dry-run` | static exportとdry-run成功 | planned |
| INV-001 | intent | 追加 content 不在 | DOM + Static | DOM snapshot、`index.html` review | heading 以外の公開 content/control なし | planned |
| INV-002 | intent | layer と dynamic range | Diagnostic + Manual | contribution screenshot と baseline 比較 | 光の芯・境界膜・暖色層・青い散乱が残る | planned |
| INV-003 | intent | diagnostic 境界 | E2E + Static | default URL と opt-in URL の比較 | default に diagnostic control/state が漏れない | planned |
| INV-004 | intent | 不要な連続描画停止 | E2E + Static | frame scheduling の計数、lifecycle code review | reduced / hidden 中の連続 frame なし | planned |
| INV-005 | intent | WebGL failure fallback | Integration | AC-005 と同じ | 全対象経路で fallback が読める | planned |
| INV-006 | intent | first paint 非依存 | Performance | AC-006 と同じ | texture 準備前に fallback + `otibo` を確認 | planned |
| INV-007 | intent | Server / Client boundary | Static + Diff review | `app/page.tsx` と First View modules | page は Server、canvas だけ Client | planned |
| INV-008 | intent | asset-only deployment | Build + Deployment | `npm run build && npm run deploy:dry-run` | runtime script なしで `out/` を受理 | planned |
| INV-009 | intent | no shader-only deploy | Docs review | TODO / Plan / verification | deploy candidateではない | planned |
| INV-010 | intent | legacy非互換 | DOM + Diff review | `app/page.tsx`、browser DOM | 旧下流sectionなし | planned |
| INV-011 | intent | no browser frame | Computed style | html / body / First View | margin 0、白枠なし | planned |

## Manual QA Checklist

- [ ] 1440x900 で `otibo` の位置・濃度・光との重なりが適切である。
- [ ] 390x844 で `otibo` と光の主軸が切れず、desktop の縮小版に見えない。
- [ ] 追加の wide / short viewport で構図が破綻しない。
- [ ] 通常 motion を一定時間見ても、光そのものが主役になる速さや振幅ではない。
- [ ] reduced motion で見た目が静止し、連続描画も止まる。
- [ ] fallback が単なる障害画面ではなく、`otibo` を記憶させる最小表示として成立する。
- [ ] 一瞥で「良い」が成立するかをオーナーが判定した。
- [ ] 様式名へ即座に回収されず、分析を要求しないかを visual canon と照合した。

## Regression Checklist

- [ ] `layered-v5` の light contribution を単一の帯へ戻していない。
- [ ] 暗部に黒落ちした領域を再導入していない。
- [ ] default URL に diagnostic control や mode label が見えない。
- [ ] fallback から shader への切替で `otibo` の位置が跳ねない。
- [ ] resize 後に canvas resolution と viewport が一致する。
- [ ] `/`の旧下流sectionを外し、法務routeは変更していない。
- [ ] browser console に shader / page 由来の error がない。
- [ ] `bash scripts/check-docs.sh` が通る。

## High-risk Checklist

本タスクは Risk Medium のため適用しない。

## Agent misbehavior checks

- [ ] image generation や shader 美観探索へ戻っていない。
- [ ] First View に tagline、説明、product、UI component、CTA を追加していない。
- [ ] guide の構造項目を満たすこと自体を visual canon の合格条件にしていない。
- [ ] diagnostic view を公開 API や常設 panel にしていない。
- [ ] WebGL engine 全体を React component state に入れていない。
- [ ] Workers runtime が不要なまま OpenNext や binding を追加していない。

## Out of Scope

- shader-only状態のproduction domainへのdeploy。
- First Viewより下の新しいinformation architectureとvisual composition。
- First View 下の What / Makes / Where セクション設計。
- 新しい shader 美観方向、image generation、material と light の同時変更。
- `@otibo/ui` component の展示。

## Open Questions

- visual validation 後、working baseline asset を `_docs/reference/` へ昇格するか。
- shader parameter を内部 preset として維持するか、固定値へ閉じるかは production diff review で判断する。
- 初回 shader frame の数値 budget は実測を verification に残し、必要なら follow-up で SLO 化する。
