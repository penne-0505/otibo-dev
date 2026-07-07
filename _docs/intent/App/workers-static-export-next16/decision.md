---
title: "Intent: Keep Next.js on Workers Static Assets"
status: active
draft_status: n/a
created_at: 2026-07-10
updated_at: 2026-07-10
references:
  - "_docs/plan/App/workers-static-export-next16/plan.md"
  - "_docs/qa/App/workers-static-export-next16/test-plan.md"
  - "_docs/intent/Site/first-view-light-shader/decision.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/intent/App/workers-static-export-next16/decision.md -->

## Context

公開先は Cloudflare Workers から変更できない。現行サイトは Next.js の `output: "export"` と
Wrangler Static Assets によって Worker script なしで配布できる。一方、Next.js 14 と React 18 は
First View の本番統合前に更新が必要であり、`@otibo/ui@0.2.0` は React 19 と Panda CSS 1.11 を
consumer baseline として利用できる。

## Decision

- Next.js 16、React 19、Panda CSS 1.11、`@otibo/ui@0.2.0` を基盤とする。
- Cloudflare 上の実行形態は Workers Static Assets に固定する。
- Next.js は `output: "export"` を維持し、deploy artifact は `out/` とする。
- OpenNext や server runtime adapter は、静的サイトに runtime 要件が生じるまで導入しない。
- `process.env` を参照するページ値は Next build 時に確定する build variable として扱い、Workers runtime binding と説明しない。
- Wrangler は devDependency と script に固定し、Node.js 22 以上を package engine と build 条件にする。

## Alternatives

- **Next.js 14 / React 18 を維持する**: 不採用。新しい First View を旧基盤へ結合した後に framework migration を重ねることになる。
- **OpenNext を先に導入する**: 不採用。現在の route は static export 可能で、server runtime の運用面と bundle を増やす理由がない。
- **Cloudflare Pages へ変更する**: 不採用。deploy target は Workers が固定条件である。
- **Wrangler を global install のまま使う**: 不採用。CI と開発環境で deploy behavior がずれる。

## Rationale

Workers Static Assets は Cloudflare Workers の custom domain と asset delivery を使いながら、静的な
Next.js site に不要な server runtime を持ち込まない。framework upgrade を First View 統合より先に
閉じることで、視覚実装の回帰と platform migration の回帰を分離できる。

## Consequences / Impact

- Next.js runtime feature は採用できない。必要になった時点で別の intent と migration QA が必要になる。
- 環境変数の変更は、runtime binding の変更ではなく再 build / 再 deploy を要する。
- Node.js 20 環境は install / build baseline の対象外になる。
- Workers の asset-only deployment には Worker observability や compatibility flag を追加しない。

## Quality Implications

- `next build` 成功だけでなく `out/` と Wrangler dry-run の両方を deployment gate にする。
- dependency tree と Panda codegen を upgrade regression の検査対象にする。
- route が runtime feature を参照していないことを diff review と build output で確認する。

## Intent-derived Invariants

- INV-001: production artifact は Next.js static export の `out/` である。
- INV-002: deploy 構成に Worker script、OpenNext adapter、runtime binding を追加しない。
- INV-003: build-time value を Workers runtime environment variable として扱わない。
- INV-004: package baseline は Node.js 22 以上と lockfile 内の Wrangler によって再現できる。
- INV-005: First View 統合前に dependency tree、Panda codegen、Next build、Wrangler dry-run が成功する。

## Related Decisions

- `_docs/intent/Site/first-view-light-shader/decision.md`
- `_docs/intent/App/top-page-initial/decision.md`
