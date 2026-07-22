# Project Task Management Rules

## 0. System Metadata

- **Current Max ID**: `Next ID No: 22` (タスク追加時にインクリメント必須)
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

`Size XS/S` かつ `Risk Low` でも、将来の作業者が未実装と誤認しそうな非対応・制限・省略は intentional omission risk として扱う。その場合は、必須フィールドを増やさず、TODO Description / PR / commit、または必要に応じて Plan Non-Goals / Intent の DEC（Why / Why not）に理由を残す。

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
3. QA test-plan の Test Matrix が主要 AC と、存在する場合の INV を最低 1 つの確認手段へ割り当て、影響する DEC の review scope を示していることを確認する。
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
  - AC-002: decision の Why / Change freedom が記録され、必要な場合だけ intent-derived invariant に基づくテストまたは validator が存在する。
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
  - AC-009: First Viewの00 baselineは、210svhの親区間で同じ表面への光の入射角だけをscroll進捗で変え、Principleと同じ白を保持してから下流contentを見せる。
  - AC-010: surface whiteへの終盤washは進捗0.74から1.00へ分散し、一度の標準的なwheel入力で色面から全面白へ切り替わらない。
  - AC-011: First Viewの`otibo`はsurface whiteへのwashと同じ進捗で薄くなり、全面白と同時に見えなくなる。
  - AC-012: First Viewの光は狭い白芯、暖色の内側光、低強度haloを区別でき、白飛びを広げずに周辺との輝度差を持つ。
  - AC-013: material detailの比較では光、scroll、wordmarkを固定し、局所的な焦点を加えず、微細法線・微細鏡面・粒径差・微細孔による高周波情報だけを変える。
  - AC-014: height map解像度は生成式とpixel-spaceの傷・孔を固定して比較した2048x4096を00 baselineへ採用し、本線3000で表示できる。
  - AC-015: 2048x4096の素材比較は3000を変更せず、3001の紙、3002の石／漆喰、3003の布が、色・光・scroll・wordmarkの差ではなく表面起伏だけで一見して判別できる。
  - AC-016: 素材比較の第二ラウンドは3003の布を保持し、3001の紙v2は繊維束がパルプ層へ埋まり、3002の石v2は縁取られた円形孔を持たず、3004の砂と3005の砂利は粒子が連続面／個体として読める差を持つ。
  - AC-017: First Viewは時間経過だけでは変化せず、初期化・scroll・resize・context復帰時だけ同じscroll位置の決定的な像を描画する。
  - AC-018: 3006は布60%・紙v2 10%・砂30%を周波数帯の役割へ分けて合成し、3007は同じ三素材を同じ比率で純粋に画素加重平均した対照として、共通の光・scroll・wordmark条件で比較できる。
  - AC-019: 3008は布・紙v2・砂の周期、長繊維、粒という素材同定手掛かりを複数方向へ再配置して中和し、局所的な解像感と複数周波数の情報量を保ちながら特定素材へ同定しにくい第三案として比較できる。
  - AC-020: 3009は3006の出力分散と0.6 / 0.1 / 0.3比率を保ち、布を低周波、砂を中周波、紙v2を高周波へ限定した強い周波数分担として比較できる。
  - AC-021: 3009の強い周波数分担を再生成可能なcanonical baselineとして3000へ採用し、3001に元の布、3002に新baselineの比較鏡像だけを残して他variantをactive portから外せる。
  - AC-022: 新baselineを固定したまま、3003〜3005で低周波carrierの連続位相を周期的な等方carrierへ25%・45%・60%置換し、同じ帯域配分と情報量で布への同定を段階的に弱める3案を操作比較できる。
  - AC-023: 位相置換25%の3003を再生成可能なcanonical baselineとして3000へ収束し、3001の元の布を維持する。その上で3002はheight map内の微細粒子、3003は静的なpost-shader粒子として、粒子の挿入位置だけを操作比較できる。
  - AC-024: 3072x6144の非均一microstructureをcanonical baselineとして3000へ採用し、texel基準の法線・曲率と単一channel `R8` texture uploadにより、WQHDで選択した解像感を保ちながらGPU常駐量を18 MiBへ抑え、単一assetの配信上限を満たす。
  - AC-025: 3000のshader・height map・engine・wordmark・scrollを変更せず、単一の光路距離`t`から半影・Gaussian幅・強度・素材応答を導く弱勾配と強勾配の2案を、shaderだけが異なる比較portで操作確認できる。
  - AC-026: 強勾配の半影6倍・Gaussian幅3倍を保ち、同じ`t`軸の応答減衰だけを遠端強度0.64・素材応答0.784へ戻した中間案を、3006との差が2係数だけのshader variantとして比較できる。
  - AC-027: 3007の強幾何・中間応答を固定し、同じ`t * pathGradient`から暗部の遠景teal化・低コントラスト化と光帯境界の短波長・低振幅化を導く案を、material座標と本線3000を変更せず比較できる。
  - AC-028: 本線3000のshader / height map / engine / policy / wordmarkを不変とし、閾値近傍の暗部構造、detailの光相関偏在、構造従属の微小輝点を複合しない3つのshader-only variantとして30秒比較できる。
  - AC-029: 本線3000のshader / height map / engine / policy / wordmarkを不変とし、白芯面積と最大輝度を増やさず周囲の素材応答を洗うグレア、閾値近傍構造を残した深い暗部、その複合、意図的な探索端を、3004 / 3006 / 3007 / 3008のshader-only variantとして比較できる。
  - AC-030: 本線3000のshader / height map / engine / policy / wordmarkを不変とし、解析的な面・有限面光源・半平面遮蔽体から直射と寒色ambientを計算するL1、同一scene parameterへheight-map自己遮蔽だけを加えるL2、同じ直射輝度場の周辺積分からveiling glareだけを加えるL3を、3004 / 3006 / 3007でarchitecture比較できる。
  - AC-034: 本線3000のbeam mask・光層・色・白飛び・scroll / responsive挙動を不変の比較基準として、同一height mapの法線を既存光場へ接続するLambert、局所roughnessを用いた低強度GGX、ambient-only AO、必要時のみ弱い局所self-shadowを累積checkpointとして比較できる。有限面光源・物理遮蔽物・bloom・最終RGB maskは導入せず、各checkpointは独立workspaceとportで再確認できる。
  - AC-035: オーナーが採用した3019のshaderを本線3000へbyte-identicalに収束し、height map / engine / policy / wordmarkを変更しない。写真だけを背景とする3020はshader本線へ混ぜず、原本画像と独立workspaceを維持した比較用3001として再確認できる。
  - AC-036: 3000の光帯の重心・方向・白芯位置を保ちながら、完成RGB同士のmixを廃止し、寒色ambientと暖色direct irradiance、直射可視率、Lambert / GGXを単一のscene-referred radianceへ統合する。height mapはnormal / roughness / ambient visibilityを介してのみ見た目へ作用し、固定scroll位置の決定性、mobile構図、exit washを維持する。
  - AC-037: Layeredの寒色背景、cream色の中間光、暖色高輝度域、白芯への色軌跡を、完成RGBではなく正規化した入射chromaticityとsensor responseから再現する。height mapはnormal / roughness / ambient visibility / bounded direct self-visibilityを介して一つのradiance計算へ作用し、teal-green偏り、赤橙の帯、白芯への唐突な遷移を解消しながらmacro構図、決定性、responsive、scroll / exit washを維持する。
  - AC-038: DEC-012のcheckpointを基準に、既存macro field内の半影、fragmentごとの入射方向、height-mapのdirect response、高輝度radiance由来glareを一つの仮想面光源と遮蔽物へ接続する。広い面光源と同心の小coreをsample単位で積分し、狭いcoreの応答は同じ遮蔽物に対するsource coverageを保持する。emitter radianceは遮蔽状態から独立して固定し、遮蔽で失われたcore energyを広い粗いlobeやambientへ再配分しない。広いemitterと小coreはそれぞれのdiffuse / specular、visible solid angle、BRDFを保ったままradiance合算まで分離する。可視microstructureは単一のcanonical height近傍から得る法線・曲率・roughness・tangent・visibilityだけで構成し、補助ridge、波形、遠隔height sampleの合成、画面空間grainは使わない。scrollでsourceが正面寄りへ移動してもcanonical normalのbase response自体は減衰させず、入射方向、radiance、sensor saturationから見え方を変える。高輝度coreのglareは同じ遮蔽物を跨ぐ解析PSF半径の範囲だけに残し、光源がその範囲外まで隠れた位置へ固定の輝度floorを残さない。desktop / mobileの進捗0・中間・wash前では、完全に見えるcoreがsensor飽和を越える密な白芯を作り、部分遮蔽がcream→暖色→飽和白の輝度ladderを作る。境界softness、凹凸の明暗、白芯周辺のにじみが同じ光源方向へ同意し、microhighlightは一様な白点noiseではなくhalf-vectorと揃うfacet群だけに選択的に現れる。背景と照射域の局所contrast、高周波の焦点階層、暗い谷と方向整合した微細反射が同時に読める。終端白は完成RGBのwhite mixではなくscene radianceへのscroll同期露光とsensor saturationから到達する。Layeredの斜め構図、寒色背景、cream→暖色→飽和白の階層、決定性、responsive、exit washを維持し、数値は回帰guardrailに限定する。
  - AC-039: checkpoint 52を固定emitter transportの構造証拠として保全し、checkpoint 58〜61のpixel-footprint covariance系は白点を減らしても局所contrastを平均化した不採用経路として扱う。canonical heightのfine / coarse slopeを同一近傍から分離し、coarseを抑えたmicro slopeを平均法線やcovariance lobeへ潰さず、同じ有限面光源のdiffuse / anisotropic GGXへ直接渡す。detail専用mask / radiance / final RGB加算なしで、暗部では細部が沈み、中間光で微細な織りが解像し、同心coreのsensor飽和で白芯へ連続的に消えることをdesktop / mobileで目視する。波、亀裂、salt-and-pepper粒子、均一な織目、receiver-space面塗りを再発させず、Layeredの斜め構図・寒暖階層・意図的な白飛びをcheckpoint 69以上に保つ。
- **Steps**:
  1. [x] `Site-Enhance-14`のshader-only local baselineを完了する
  2. [x] 4段階それぞれのcontent contractを定義する
  3. [ ] owner copy、掲載product、status、asset、link、contact / legal導線をcontractへ充足する（文言とMedo logoは初版反映済み。実在mediaがないproductのproduction placeholderは除去済み）
  4. [x] 全体compositionとproduct紹介の候補表現を試作・判定する
  5. [ ] responsive / motion / semantic / keyboard behaviorを実装する（`@otibo/ui@0.4.0` primitiveへの組み直しを進行中）
  6. [ ] static build / Workers dry-run / browser QA / owner reviewを実施する
  7. [ ] verificationがPASSになった完成ページだけをdeploy candidateにする
  8. [x] First Viewのscroll-linked入射光表現を比較し、現状案を詳細調整の00 baselineへ収束する
  9. [x] First Viewの白飛び面積、グロー、周辺コントラストを一軸比較し、光の輝度分布を収束する
  10. [ ] 2048x4096のFirst View素材感を、紙v2、孔のない石v2、布、砂、砂利で比較して選択する
  11. [x] 1024x2048と2048x4096のheight mapを生成式固定で比較し、2048x4096へ収束する
  12. [x] shaderの時間driftと常時frame loopを廃止し、scroll-linked描画だけへ収束する
  13. [x] 布60%・紙v2 10%・砂30%の周波数分担blendと純加重平均を3006 / 3007で比較可能にする
  14. [x] 布・紙v2・砂の識別特徴を中和し、解像感と情報量を保つ3008を比較可能にする
  15. [x] 3006のぼけ量を基準に、帯域の重なりだけを狭めた強い周波数分担を3009で比較可能にする
  16. [x] 3009をcanonical generatorから再現可能な3000 baselineへ収束し、比較環境を3001の布と3002の新baselineだけへ整理する
  17. [x] 新baselineの情報量と周波数分担を保ち、布由来の位相連続性を3段階で弱める案を3003〜3005で比較可能にする
  18. [x] 位相置換25%を3000へ収束し、3001の布を保持したまま微細粒子のheight-map案とpost-shader案を3002 / 3003で比較可能にする
  19. [x] 3072x6144のmicrostructure案をR8 textureとして3000へ収束し、canonical再生成、WQHD visual、配信互換性を検証する
  20. [x] 光路距離`t`による弱勾配・強勾配をshader-only variantとして比較し、オーナー判断後に採否を決める
  21. [x] 強勾配の幾何を保ち、遠端応答の床だけを上げた中間案を比較し、オーナー判断後に採否を決める
  22. [x] 中間応答を固定し、暗部の大気参加と光帯境界の細部圧縮を同じ`t`へ同意させた案を比較し、オーナー判断後に採否を決める
  23. [x] INV-002 / INV-021の適用範囲限定を前提に、閾値近傍の暗部構造、detailの光相関偏在、構造従属の微小輝点を独立variantとして起動・検証する
  24. [x] INV-020の再解釈を前提に、白芯面積を変えないグレア、深い暗部、複合、探索端をshader-only variantとして起動・検証する
  25. [x] 手置きの光症状を停止し、有限面光源と半平面遮蔽体を共有するL1 / L2自己遮蔽 / L3計算輝度グレアを3004 / 3006 / 3007で起動・検証する
  26. [x] 3000の演出的光場を固定し、height由来のLambert / roughness+GGX / ambient-only AO / optional local self-shadowだけを段階的に累積したhybrid checkpointを実装・比較する
  27. [x] 3019を本線3000へ収束し、写真背景3020を独立した3001として残して最終比較portを整理する
  28. [x] 3019をチェックポイント保存し、完成RGBの合成をambient + visibility × direct BRDFへ置き換え、desktop / mobile / scroll / debug fieldで検証する
  29. [x] Layeredの色軌跡を入射chromaticityとsensor responseへ移し、bounded self-visibilityをdirect irradianceへ接続して、desktop / mobile / scrollでmacro構図・色遷移・局所応答を収束する
  30. [ ] macro field内の半影・入射方向・height responseを一つの仮想面光源と遮蔽物へ接続し、単一canonical height由来の微細反射へ収束する（checkpoint 69でdesktop初期像の方向性はowner accepted。完成判定、追加refinement、mobile / scroll / exit washは残る）
  31. [x] canonical heightのfine / coarse slopeを分離し、coarseを抑えたmicro slopeを平均化せずfinite-source diffuse / anisotropic GGXへ直接渡す。広い暖色radianceと同心coreのshared sensor pathで、中間光の微細解像と飽和白芯を両立する（checkpoint 69）
- **Description**:
  - Context: 旧Products / About / Contact / Footerはshaderとvisual canon確立前の初期実装で、Panda CSS stylesheetも実配信されていなかった。旧構成の修復ではなく、site purposeから下流を再設計する。
  - Notes: 「First View → principle的な短文 → product紹介 → contact / 所在」を上位情報骨格とする。これは責務と読む順序であり、固定section templateやproduct cardを必須にしない。shader-only状態はproduction deploy禁止。First Viewの親区間は線形scrollの210svhを確定値とし、終盤washを進捗0.74〜1.00へ分散する。wordmarkはwashの逆数で薄くし、全面白では残さない。素材baselineは3072x6144の非均一microstructureとtexel基準の法線・曲率へ収束した。GPU textureは単一channel `R8`で保持し、4096x8192案の階層性をWQHDで許容範囲内に保ちながら配信可能な単一assetへ閉じる。光路距離`t`の探索は不採用で閉じ、後続の見入り比較はINV-002 / INV-021の適用範囲限定を前提とする。dynamic range再訪も物理的一貫性を欠くため不採用で閉じる。L1〜L3は局所的なmaterial realismを示した一方で3000の構図を失ったため不採用とした。3000の光場を仮想入射光として固定したhybrid material responseは3019で比較を完了し、オーナー判断により本線3000へ採用した。次段では3019を保全したうえで、構図fieldだけを拘束し、完成RGBのmixをscene-referredなambient / direct radianceへ置き換える。写真背景3020は別方向の価値を持つためshaderへ混ぜず、独立した3001として維持する。
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
  - Notes: Medo ストア公開日が確定するまでは着手不能。Play ストア提出後は `/medo/account-deletion` URL の変更禁止(ストア審査要件)。`Size XS` かつ `Risk Low` のため Plan / Intent / QA は不要。
- **Plan**: None
- **Intent**: None
- **QA**: None
- **Verification**: None

---

## Ready

-

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
