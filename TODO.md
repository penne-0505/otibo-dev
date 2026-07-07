# Project Task Management Rules

## 0. System Metadata

- **Current Max ID**: `Next ID No: 20` (タスク追加時にインクリメント必須)
- **ID Source of Truth**: このファイルの `Next ID No` 行が、全プロジェクトにおける唯一の ID 発番元である。

## 1. Task Lifecycle (State Machine)

タスクは以下の順序で単方向に遷移する。逆行は原則禁止とする。

### Phase 0: Inbox (Human Write-only)

- **Location**: `## Inbox` セクション
- **Description**: 人間がアイデアや依頼を書き殴る場所。フォーマット不問。ID 未付与。
- **Exit Condition**: LLM が内容を解析し、ID を付与して `Backlog` へ構造化移動する。

### Phase 1: Backlog (Structured)

- **Location**: `## Backlog` セクション
- **Status**: タスクとして認識済みだが、着手準備未完了。
- **Entry Criteria**:
  - ID が一意に採番されている。
  - 必須フィールドがすべて埋まっている。
  - `Risk`, `Acceptance Criteria`, `Intent`, `QA`, `Verification` が明示されている。
- **Exit Condition**: `Ready` の要件を満たす。

### Phase 2: Ready (Actionable)

- **Location**: `## Ready` セクション
- **Status**: いつでも着手可能な状態。
- **Entry Criteria**:
  - `Size >= M` の場合、Plan / Intent / QA が作成済みである。
  - `Risk >= Medium` の場合、Intent / QA が作成済みである。
  - Dependencies が解決済み、または未解決理由が明確である。
  - Steps が具体的、または Plan / QA への進行管理ポインタとして機能している。
- **Exit Condition**: 作業者がタスクに着手する。

### Phase 3: In Progress

- **Location**: `## In Progress` セクション
- **Status**: 現在実行中。
- **Entry Criteria**: 作業者がアサインされている、または自律的に着手している。

### Phase 4: Completed

- **Location**: なし。完了タスクは `TODO.md` から削除する。
- **Exit Action**: Goal と Acceptance Criteria の達成、および必要な verification verdict を確認後に削除する。
- **History**: 完了履歴は PR / commit / CHANGELOG / intent / guide / reference / QA verification に残す。`TODO.md` に Done / Archived セクションは作らない。

## 2. Schema & Validation

各タスクは以下のフィールドを必須とする。

| Field | Type | Constraint / Value Set |
| --- | --- | --- |
| **Title** | `String` | `[Category] Title` 形式。Category は後述の Enum 参照。 |
| **ID** | `String` | `<Area>-<Category>-<Number>` 形式。不変の一意キー。 |
| **Priority** | `Enum` | `P0` / `P1` / `P2` / `P3` |
| **Size** | `Enum` | `XS` / `S` / `M` / `L` / `XL` |
| **Risk** | `Enum` | `Low` / `Medium` / `High` / `Critical` |
| **Area** | `String` | タスクの論理領域。各 canonical path の `<Area>` と一致させる。 |
| **Dependencies** | `List<ID>` | 依存タスク ID の配列。なしは `[]`。 |
| **Goal** | `String` | 完了後に成り立つ状態を一文で書く。 |
| **Acceptance Criteria** | `Markdown` | `AC-001` 形式で、検証可能な条件を書く。 |
| **Steps** | `Markdown` | 進行管理用チェックリスト。 |
| **Description** | `Markdown` | Context / Notes を含める。 |
| **Plan** | `Path` | `None` または `_docs/plan/<Area>/<slug>/plan.md`。 |
| **Intent** | `Path` | `None` または `_docs/intent/<Area>/<slug>/decision.md`。 |
| **QA** | `Path` | `None` または `_docs/qa/<Area>/<slug>/test-plan.md`。 |
| **Verification** | `Path` | `None` または `_docs/qa/<Area>/<slug>/verification.md`。 |

推奨形式:

```markdown
### <ID>: [<Category>] <Title>

- **Title**: [<Category>] <Title>
- **ID**: <Area>-<Category>-<Number>
- **Priority**: P0 | P1 | P2 | P3
- **Size**: XS | S | M | L | XL
- **Risk**: Low | Medium | High | Critical
- **Area**: <Area>
- **Dependencies**: []
- **Goal**: <one sentence>
- **Acceptance Criteria**:
  - AC-001:
  - AC-002:
- **Steps**:
  1. [ ] Step 1
  2. [ ] Step 2
- **Description**:
  - Context:
  - Notes:
- **Plan**: None | _docs/plan/<Area>/<slug>/plan.md
- **Intent**: None | _docs/intent/<Area>/<slug>/decision.md
- **QA**: None | _docs/qa/<Area>/<slug>/test-plan.md
- **Verification**: None | _docs/qa/<Area>/<slug>/verification.md
```

## 3. Required Documents

| Condition | Requirement |
| --- | --- |
| `Size XS/S` and `Risk Low` | Plan / Intent / QA / Verification は `None` 可。 |
| `Size >= M` | Plan / Intent / QA が必須。 |
| `Risk >= Medium` | Intent / QA が必須。 |
| `Risk High / Critical` | Plan / Intent / QA が必須。完了前に Verification が必須。 |
| `Category Bug` | Acceptance Criteria に再発防止条件を含め、QA test-plan に regression test または no-test rationale を含める。 |
| `Category Refactor` | QA test-plan に behavior-preservation checks を含める。 |
| Agent workflow / validator / CI / Skill / documentation rule 変更 | QA test-plan に agent misbehavior checks を含める。 |

`Size XS/S` かつ `Risk Low` でも、将来の作業者が未実装と誤認しそうな非対応・制限・省略は intentional omission risk として扱う。その場合は、必須フィールドを増やさず、TODO Description / PR / commit、または必要に応じて Plan Non-Goals / Intent Alternatives に理由を残す。

## 4. Completion Rules

タスクを `TODO.md` から削除できるのは、以下を満たす場合のみ。

1. Steps が完了している。
2. Acceptance Criteria が満たされている。
3. `Size >= M` または `Risk >= Medium` の場合、`verification.md` が存在する。
4. verification verdict が `PASS` である。
5. `PARTIAL` の場合は、残リスクと follow-up TODO が明記されている。
6. `FAIL` / `BLOCKED` の場合は完了扱いにしない。
7. 必要な intent / guide / reference / QA docs が更新されている。

完了履歴は `verification.md`、intent、guide、reference、PR / commit に残す。`TODO.md` は未完了作業の source of truth として保つ。

## 5. Canonical Document Paths

```text
_docs/draft/<Area>/<slug>/notes.md
_docs/survey/<Area>/<slug>/survey.md
_docs/plan/<Area>/<slug>/plan.md
_docs/intent/<Area>/<slug>/decision.md
_docs/qa/<Area>/<slug>/test-plan.md
_docs/qa/<Area>/<slug>/verification.md
_docs/guide/<Area>/<slug>/usage.md
_docs/reference/<Area>/<slug>/reference.md
_docs/archives/{draft,plan,survey}/<Area>/<slug>/...
```

`<Area>` はタスクの `Area` と一致させる。`<slug>` は機能・変更単位の kebab-case 名にする。`intent` / `qa` / `guide` / `reference` は archive 対象にしない。

## 6. Defined Enums

### Categories (Title & ID)

- `Feat` (New Feature)
- `Enhance` (Improvement)
- `Bug` (Fix)
- `Refactor` (Code Structuring)
- `Perf` (Performance)
- `Doc` (Documentation)
- `Test` (Testing)
- `Chore` (Maintenance/Misc)

### Priorities

- `P0`: Critical / immediate
- `P1`: High
- `P2`: Medium
- `P3`: Low

### Sizes

- `XS`: 0.5 day 未満
- `S`: 1 day 程度
- `M`: 2-3 days 程度
- `L`: 1 week 程度
- `XL`: 2 weeks 以上

### Risk

Risk の詳細は `_docs/standards/quality_assurance.md` を参照する。

- `Low`: 局所的で失敗影響が小さい変更。
- `Medium`: 機能挙動、ワークフロー、validator、ドキュメント規約、agent skill に影響する変更。
- `High`: 互換性、データ損失、認証、権限、セキュリティ、課金、外部 API、CI/CD、migration に関わる変更。
- `Critical`: 本番障害、secret 漏洩、重大なデータ破壊、ユーザー影響の大きい破壊的変更につながり得る変更。

## 7. Operational Workflows (for LLM)

### Create Task from Inbox

1. `Next ID No` を読み取り、割り当て予定の ID を決定する。
2. `Next ID No` をインクリメントしてファイルを更新する。
3. Inbox の内容を解析し、最適な `Area` / `Category` / `Risk` を決定する。
4. intentional omission risk があるか確認する。将来「未実装なので直す」と誤認されそうな非対応・制限・省略がある場合は、Description に理由を残すか、設計判断として Intent を作成する。
5. ID を生成する。
6. Acceptance Criteria を `AC-001` 形式で書く。
7. 必須文書条件に従い、Plan / Intent / QA / Verification を `None` または canonical path で埋める。
8. タスクを `Backlog` の末尾に追加する。
9. 元の Inbox 行を削除する。

### Promote to Ready

1. `Size >= M` なら Plan / Intent / QA が存在することを確認する。
2. `Risk >= Medium` なら Intent / QA が存在することを確認する。
3. QA test-plan の Test Matrix が、主要 AC / INV を最低 1 つの確認手段へ割り当てていることを確認する。
4. Dependencies が解決済みか確認する。
5. 全てクリアした場合のみ `Ready` セクションへ移動する。

### Complete Task

1. Steps と Acceptance Criteria を確認する。
2. `Size >= M` または `Risk >= Medium` なら `qa-review` skill を使う。
3. verification verdict が `PASS`、または許容済み `PARTIAL` であることを確認する。
4. `FAIL` / `BLOCKED` の場合は、タスクを残すか follow-up を追加する。
5. 完了可能な場合のみ `TODO.md` から削除する。

## 8. Task Definition Examples

### Case A: XS/S + Low Risk Task

```markdown
### Docs-Chore-10: [Chore] Update project display name

- **Title**: [Chore] Update project display name
- **ID**: Docs-Chore-10
- **Priority**: P2
- **Size**: XS
- **Risk**: Low
- **Area**: Docs
- **Dependencies**: []
- **Goal**: README と Quickstart の表示名がプロジェクト名に置き換わっている。
- **Acceptance Criteria**:
  - AC-001: README の旧テンプレート名が新しいプロジェクト名に置き換わっている。
  - AC-002: Quickstart の初回案内が新しいプロジェクト名を参照している。
- **Steps**:
  1. [ ] README.md を更新する
  2. [ ] QUICKSTART.md を更新する
- **Description**:
  - Context: 新規プロジェクト作成直後の軽量カスタマイズ。
  - Notes: Plan / Intent / QA は不要。
- **Plan**: None
- **Intent**: None
- **QA**: None
- **Verification**: None
```

### Case B: Size M + Medium Risk Task

```markdown
### Core-Enhance-11: [Enhance] Add onboarding command

- **Title**: [Enhance] Add onboarding command
- **ID**: Core-Enhance-11
- **Priority**: P1
- **Size**: M
- **Risk**: Medium
- **Area**: Core
- **Dependencies**: []
- **Goal**: 新規メンバーが onboarding command で初期診断を実行できる。
- **Acceptance Criteria**:
  - AC-001: command が環境診断を実行し、結果を標準出力に表示する。
  - AC-002: intent-derived invariant に基づくテストまたは validator が存在する。
- **Steps**:
  1. [ ] Plan の Scope / Non-Goals を確認する
  2. [ ] QA test-plan の Test Matrix に従って実装と検証を進める
- **Description**:
  - Context: ユーザー向け workflow が増えるため Medium risk とする。
  - Notes: Plan / Intent / QA が必須。
- **Plan**: _docs/plan/Core/onboarding-command/plan.md
- **Intent**: _docs/intent/Core/onboarding-command/decision.md
- **QA**: _docs/qa/Core/onboarding-command/test-plan.md
- **Verification**: None
```

### Case C: Agent Workflow / Validator / Skill Task

```markdown
### Workflow-Chore-12: [Chore] Tighten TODO validator

- **Title**: [Chore] Tighten TODO validator
- **ID**: Workflow-Chore-12
- **Priority**: P1
- **Size**: M
- **Risk**: Medium
- **Area**: Workflow
- **Dependencies**: []
- **Goal**: TODO validator が新 schema と QA 必須条件を検出できる。
- **Acceptance Criteria**:
  - AC-001: validator が Risk / Intent / QA 欠落を error として検出する。
  - AC-002: QA test-plan に agent misbehavior checks が含まれている。
- **Steps**:
  1. [ ] Plan / Intent / QA を読む
  2. [ ] validator を更新する
  3. [ ] agent misbehavior checks を verification に残す
- **Description**:
  - Context: Agent workflow / validator / Skill 変更では、agent が古い運用へ戻るリスクを検証する。
  - Notes: `validate-todo` と `validate-qa` の両方を実行する。
- **Plan**: _docs/plan/Workflow/todo-validator/plan.md
- **Intent**: _docs/intent/Workflow/todo-validator/decision.md
- **QA**: _docs/qa/Workflow/todo-validator/test-plan.md
- **Verification**: None
```

---

## Inbox

-

---

## Backlog

### Docs-Chore-1: [Chore] Review and customize AGENTS.md

- **Title**: [Chore] Review and customize AGENTS.md
- **ID**: Docs-Chore-1
- **Priority**: P2
- **Size**: XS
- **Risk**: Low
- **Area**: Docs
- **Dependencies**: []
- **Goal**: `AGENTS.md` がプロジェクトのニーズに応じて必要に応じて編集されている。
- **Acceptance Criteria**:
  - AC-001: `AGENTS.md` の禁止事項、実行環境、推奨コマンドがプロジェクト実態に合っている。
  - AC-002: 外部入力、secret、破壊的操作の扱いがプロジェクトの安全基準と矛盾していない。
- **Steps**:
  1. [ ] `AGENTS.md` を開き、既存の内容を確認する
  2. [ ] 必要に応じてプロジェクト固有のコマンドや禁止事項を追記する
  3. [ ] 変更後にリンクと安全基準の整合性を確認する
- **Description**:
  - Context: 新規プロジェクト作成直後に agent 向け入口を調整する。
  - Notes: `Size XS` かつ `Risk Low` のため Plan / Intent / QA は不要。
- **Plan**: None
- **Intent**: None
- **QA**: None
- **Verification**: None

### Docs-Chore-2: [Chore] Customize README.md for project

- **Title**: [Chore] Customize README.md for project
- **ID**: Docs-Chore-2
- **Priority**: P0
- **Size**: S
- **Risk**: Low
- **Area**: Docs
- **Dependencies**: []
- **Goal**: `README.md` がプロジェクトの概要、目的、使用方法に合わせて編集されている。
- **Acceptance Criteria**:
  - AC-001: README の概要、使用方法、カスタマイズ案内がプロジェクト固有の内容になっている。
  - AC-002: テンプレート由来の不要な説明が残っていない。
- **Steps**:
  1. [ ] 現在の `README.md` を確認する
  2. [ ] プロジェクト名、概要、説明をプロジェクトに合わせて書き換える
  3. [ ] 使用方法セクションを編集する
  4. [ ] 不要なテンプレート固有の記述を削除または修正する
- **Description**:
  - Context: テンプレートから実プロジェクトへ移行するための初期作業。
  - Notes: `Size S` かつ `Risk Low` のため Plan / Intent / QA は不要。
- **Plan**: None
- **Intent**: None
- **QA**: None
- **Verification**: None

### Site-Feat-17: [Feat] First Viewを基盤にトップページをゼロから再設計する

- **Title**: [Feat] First Viewを基盤にトップページをゼロから再設計する
- **ID**: Site-Feat-17
- **Priority**: P1
- **Size**: L
- **Risk**: Medium
- **Area**: Site
- **Dependencies**: []
- **Goal**: light shaderを唯一の確定済みvisual foundationとして、3秒の印象と30秒の理解を実在する材料で成立させた一枚トップが完成している。
- **Acceptance Criteria**:
  - AC-001: shader-only baselineはlocal限定で、production deploy対象から除外されている。
  - AC-002: First View、短いprinciple、product紹介、contact / 所在の4段階がこの順で成立している。
  - AC-003: First Viewは光と`otibo`だけを維持している。
  - AC-004: 30秒以内にotiboの実体、現行product、必要導線を事実から確認できる。
  - AC-005: principle、各productのname / description / status、contact / legal導線は承認済みsourceへ追跡できる。
  - AC-006: desktop / mobile、reduced motion、semantic structure、keyboard navigationが成立する。
  - AC-007: Next.js static exportとWorkers Static Assets dry-runが成功する。
  - AC-008: オーナーが3秒 / 30秒の体験とproduction visualを承認している。
- **Steps**:
  1. [x] `Site-Enhance-14`のshader-only local baselineを完了する
  2. [x] 4段階それぞれのcontent contractを定義する
  3. [ ] owner copy、掲載product、status、asset、link、contact / legal導線をcontractへ充足する（文言とMedo logoは初版反映済み）
  4. [x] 全体compositionとproduct紹介の候補表現を試作・判定する
  5. [ ] responsive / motion / semantic / keyboard behaviorを実装する（`@otibo/ui@0.4.0` primitiveへの組み直しを進行中）
  6. [ ] static build / Workers dry-run / browser QA / owner reviewを実施する
  7. [ ] verificationがPASSになった完成ページだけをdeploy candidateにする
- **Description**:
  - Context: 旧Products / About / Contact / Footerはshaderとvisual canon確立前の初期実装で、Panda CSS stylesheetも実配信されていなかった。旧構成の修復ではなく、site purposeから下流を再設計する。
  - Notes: 「First View → principle的な短文 → product紹介 → contact / 所在」を上位情報骨格とする。これは責務と読む順序であり、固定section templateやproduct cardを必須にしない。shader-only状態はproduction deploy禁止。
- **Plan**: _docs/plan/Site/top-page-rebuild/plan.md
- **Intent**: _docs/intent/Site/top-page-rebuild/decision.md
- **QA**: _docs/qa/Site/top-page-rebuild/test-plan.md
- **Verification**: _docs/qa/Site/top-page-rebuild/verification.md

### App-Chore-16: [Chore] Next.js 内部 PostCSS advisory の解消を追跡する

- **Title**: [Chore] Next.js 内部 PostCSS advisory の解消を追跡する
- **ID**: App-Chore-16
- **Priority**: P2
- **Size**: XS
- **Risk**: Low
- **Area**: App
- **Dependencies**: []
- **Goal**: Next.js の安全な upstream update により、production dependency の PostCSS advisory が破壊的 downgrade なしで解消されている。
- **Acceptance Criteria**:
  - AC-001: `npm audit --omit=dev` が PostCSS `GHSA-qx2v-qp2m-jg93` を報告しない。
  - AC-002: Next.js を旧 major へ downgrade せず、lint / typecheck / test / build / Wrangler dry-run が成功する。
- **Steps**:
  1. [ ] Next.js stable release が内部 PostCSS を 8.5.10 以上へ更新したか確認する
  2. [ ] framework を安全な stable version へ更新する
  3. [ ] production audit と build / deploy dry-run を再実行する
- **Description**:
  - Context: 2026-07-10 時点の最新 stable `next@16.2.10` は内部で `postcss@8.4.31` を固定し、npm audit が moderate advisory を2件報告する。
  - Notes: `npm audit fix --force` は Next.js 9.3.3 への破壊的 downgrade を提案するため使用しない。サイトは外部 CSS 入力を処理せず、PostCSS は build-time にのみ使われる。
- **Plan**: None
- **Intent**: None
- **QA**: None
- **Verification**: None

---

## Ready

### Legal-Chore-13: [Chore] Medo ストア公開時に EFFECTIVE_DATE を設定し再デプロイ

- **Title**: [Chore] Medo ストア公開時に EFFECTIVE_DATE を設定し再デプロイ
- **ID**: Legal-Chore-13
- **Priority**: P1
- **Size**: XS
- **Risk**: Low
- **Area**: Legal
- **Dependencies**: []
- **Goal**: Medo ストア公開に合わせて EFFECTIVE_DATE の実値が法務ページに反映されている。
- **Acceptance Criteria**:
  - AC-001: `.env.local` の `EFFECTIVE_DATE` に正式施行日が設定されている。
  - AC-002: 再デプロイ後、ライブページで「ストア公開日をもって発効」フォールバック文言が実日付に置き換わっている。
  - AC-003: `/medo/account-deletion` の URL が変更されていないことを確認する(Play ストア提出後は URL 変更禁止)。
- **Steps**:
  1. [ ] Medo ストア公開日が確定したら `.env.local` の `EFFECTIVE_DATE` を設定する
  2. [ ] `npm run build` → `npx wrangler deploy` を実行する
  3. [ ] ライブページでフォールバック文言が消えて実日付が表示されることを確認する
  4. [ ] `/medo/account-deletion` の URL が変更されていないことを確認する
- **Description**:
  - Context: Legal-Feat-9 完了時点で EFFECTIVE_DATE はフォールバック文言「ストア公開日をもって発効」のまま公開。設計通りの後続 chore。
  - Notes: Play ストア提出後は `/medo/account-deletion` URL の変更禁止(ストア審査要件)。`Size XS` かつ `Risk Low` のため Plan / Intent / QA は不要。
- **Plan**: None
- **Intent**: None
- **QA**: None
- **Verification**: None

---

## In Progress

### App-Enhance-15: [Enhance] Next.js 16 と Workers static export の基盤を確立する

- **Title**: [Enhance] Next.js 16 と Workers static export の基盤を確立する
- **ID**: App-Enhance-15
- **Priority**: P0
- **Size**: M
- **Risk**: Medium
- **Area**: App
- **Dependencies**: []
- **Goal**: Next.js 16 / React 19 / `@otibo/ui@0.2.0` のサイトが Cloudflare Workers Static Assets 向けに再現可能な static export を生成する。
- **Acceptance Criteria**:
  - AC-001: Next.js 16、React 19、`@otibo/ui@0.2.0`、Base UI 1.6、Panda CSS 1.11 の dependency tree に invalid peer がない。
  - AC-002: lint、typecheck、test、Panda codegen、Next.js production build が成功する。
  - AC-003: 全公開 route が static export され、deploy artifact が `out/` に生成される。
  - AC-004: lockfile に固定された Wrangler で Workers Static Assets の deploy dry-run が成功する。
  - AC-005: Node.js 22 以上と build-time environment variable の運用境界が文書化される。
  - AC-006: OpenNext、Worker script、runtime binding を導入していない。
- **Steps**:
  1. [x] `@otibo/ui@0.2.0` の registry metadata と React 19 consumer install を確認する
  2. [x] dependency と package scripts を更新する
  3. [x] Panda CSS、Biome、Next.js、Wrangler の設定を更新する
  4. [x] dependency / lint / typecheck / test / build gate を実行する
  5. [x] Wrangler Static Assets dry-run と browser regression を確認する
  6. [x] verification を残す
- **Description**:
  - Context: Cloudflare Workers は変更不可の deploy target。現行 `output: "export"` と `out/` asset deployment は維持できるため、OpenNext を使わず platform baseline を先に更新する。
  - Notes: `@otibo/ui@0.2.0` は React 18 / 19 と Panda CSS 1.11 を peer として公開済み。production deploy は本タスクで実行しない。
- **Plan**: _docs/plan/App/workers-static-export-next16/plan.md
- **Intent**: _docs/intent/App/workers-static-export-next16/decision.md
- **QA**: _docs/qa/App/workers-static-export-next16/test-plan.md
- **Verification**: _docs/qa/App/workers-static-export-next16/verification.md

---
