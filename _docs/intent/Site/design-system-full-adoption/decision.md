---
title: "Decision: system tokens first, site composition second"
status: active
draft_status: n/a
created_at: 2026-07-11
updated_at: 2026-07-11
references:
  - "_docs/plan/Site/design-system-full-adoption/plan.md"
  - "_docs/qa/Site/design-system-full-adoption/test-plan.md"
related_issues: []
related_prs: []
---

# Decision: system tokens first, site composition second

## Context

`@otibo/ui@0.3.0`移行後もsite CSSに独自scaleが残り、design systemを適用した結果と既存designの
補正結果が混在していた。ユーザーはsystem適用後の状態を見てから改善箇所を判断したい。

## Decision

- color、spacing、size、radius、typographyはsystem tokenを第一選択とする。
- fluid responsive値でも、上下限とcontainerは可能な限りsystem tokenで構成する。
- Badge、Link、Separator、ScrollArea、Buttonは用途が一致する箇所へ適用する。
- page compositionとshader/mediaの表現固有値はsite CSSに残す。
- system適用後の不均衡はverificationに改善候補として記録し、この段階で独自scaleへ戻さない。

## Alternatives

- 現在のsite CSSを維持し、component classだけ使う: system適用後のbaselineを観察できないため不採用。
- page全体をCard / Stack相当のcomponentへ再構成する: systemにlayout primitiveがなく、情報構造まで変えるため不採用。
- shader色もsemantic paletteへ置換する: PoCで確定した光表現を別物にするため不採用。

## Rationale

systemの責務とsite固有表現を分けることで、design system不足とsite側の改善要望を混同せず判断できる。

## Consequences / Impact

- 余白・文字サイズ・surface contrastは現在から変化する。
- system scaleにない微調整が減り、改善候補が明確になる。
- shaderとlayout compositionは従来の意図を維持する。

## Quality Implications

- globalなvisual regression riskがあるためdesktop / mobile / legalを手動確認する。
- token名の誤りはcomputed styleとstatic grepで検出する。
- interactive primitiveのfocus stateを確認する。

## Intent-derived Invariants

- INV-001: system tokenで意味を表せる色・spacing・size・radius・typographyに新しいliteralを置かない。
- INV-002: shaderとfallbackの光学表現はsystem paletteへの統一対象にしない。
- INV-003: page compositionとsection順を変更しない。
- INV-004: system適用後の改善候補を独自scaleで先回りして隠さない。
- INV-005: Workers static exportを維持する。
