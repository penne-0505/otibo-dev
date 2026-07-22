---
title: "QA Test Plan: First View light shader local foundation"
status: active
draft_status: n/a
qa_status: planned
risk: Medium
qa_schema: 2
created_at: 2026-07-10
updated_at: 2026-07-22
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
加えて、00 baselineのscroll反応が同じ表面への照明条件の変化として連続して読めることを確認する。

今回の見入り比較はDEC-006のChange freedomとAC-031の範囲で、
視認閾値近傍の暗部構造と、光に相関するdetail偏在・height mapに従属する微小輝点を
比較対象に含める。三案でもDEC-002 / DEC-004 / DEC-005の理由は維持する。

次のdynamic range比較はDEC-006の光層を探索するAC-032として扱う。白芯そのものの面積拡大と
最大輝度の変更は引き続き禁止し、光学的散乱の膜が白芯周囲と暗部側の素材応答を洗うことで
可視域を狭める案を比較対象に含める。暗部は完全な黒へ落とさず、閾値近傍構造を保持する。
この探索は本線採用ではなく、DEC-002 / DEC-004 / DEC-005の理由を変更しない。

dynamic range四案の不採用後は、光源・遮蔽・幾何を共有原因として持つL1〜L3へ比較軸を切り替える。
本比較は係数差ではなく照明architecture全体の比較である。L1は有限面光源と半平面遮蔽体から直射と
ambientを計算し、L2は同じsceneへheight-map自己遮蔽だけ、L3は同じ直射輝度場の周辺積分からglare
だけを加える。本線採用はオーナー採否後とし、DEC-002 / DEC-004 / DEC-005 / DEC-007の理由を維持する。

## Acceptance Criteria

- AC-001: 通常表示は光の場と `otibo` のみで、`layered-v5` の層と bounded dynamic range を維持する。
- AC-002: 開発時 named diagnostic view で material、主要 light contribution、final composite を個別確認できる。
- AC-003: 1440x900 / 390x844 を含む複数 viewport の比較記録がある。
- AC-004: 全modeで常時描画を行わず、reduced motion、非表示タブ、context lossでlifecycleが意図どおりに変わる。
- AC-005: WebGL2 不在、shader error、context loss の全経路で fallback と `otibo` が表示される。
- AC-006: fallback と `otibo` は shader 初期化を待たず、同期 1024x2048 height texture 生成を既定経路の初期描画 blocker にしない。
- AC-007: browser default marginによる白い枠がなく、First Viewがviewport全面を占める。
- AC-008: 旧下流sectionを外し、shader-only状態をproduction deployしない境界が記録される。
- AC-009: static export / Workers dry-runを技術互換確認として通す。
- AC-010: scroll進捗0 / 中間 / 1で、materialを固定したまま斜光から正面寄りの光へ連続して変化する。
- AC-011: 進捗1までは下流contentを見せず、reduced motionではscroll-linked変化を0へ固定する。
- AC-012: 210svh親区間のsticky移動量の前半85%でshaderがsurface whiteへ収束し、残り15%は白を保持してからPrincipleを見せる。
- AC-013: surface whiteへのwashを進捗0.74〜1.00へ分散し、wash開始点から120pxのscrollで全面白へ到達しない。
- AC-014: wordmarkはwash開始まで現在の濃度を保ち、wash中間で薄くなり、全面白と白保持で見えなくなる。
- AC-015: 初期光は狭い白芯、暖色の内側光、低強度haloの輝度段階を保ち、周辺コントラストを加えても白飛び面積を広げない。
- AC-016: material detailの4案は光、scroll、wordmarkを共有し、局所的な焦点を加えず微細法線 / 微細鏡面 / 複合粒径 / 微細孔だけを比較できる。
- AC-017: source resolutionだけを比較した2048x4096 height mapが00 baselineへ採用され、本線3000でshader、drawing buffer、scroll、wordmarkを維持する。
- AC-018: 3001の紙、3002の石／漆喰、3003の布が、同じ2048x4096、shader、drawing buffer、scroll、wordmarkの条件で、表面起伏だけから一見して判別できる。
- AC-019: 第二ラウンドは3003の布を保持し、紙v2の埋まった繊維束、孔のない石v2、連続面の砂、個体が重なる砂利を同じ光学条件で比較できる。
- AC-020: 固定scroll位置では時間差を置いても像が変化せず、scroll後だけ入射角とwashが新しい位置へ更新される。
- AC-021: 3006は布60%・紙v2 10%・砂30%の周波数分担blend、3007は同じ入力と比率の純画素加重平均として、同じ光学条件で比較できる。
- AC-022: 3008は三素材の識別特徴を複数方向・周波数帯へ再配置し、3007より高い局所変動を保ちながら布・紙・砂のいずれにも直ちに同定しにくい第三案として比較できる。
- AC-023: 3009は3006と同じ入力、比率、出力分散、表示条件を使い、布の低周波、砂の中周波、紙v2の高周波という分担を強めた案として比較できる。
- AC-024: 3009のstrong-frequency blendをcanonical generatorのdefaultと3000へ採用し、3001の元の布、3002の新baselineだけをactive comparisonとして残せる。
- AC-025: 3003〜3005は新baselineの情報量と光学条件を保ち、低周波carrierの位相連続性だけを25%・45%・60%の3段階で弱めた案として操作比較できる。
- AC-026: 位相置換25%を3000へ収束し、3001の布を保持する。3002のheight-map微粒子と3003の静的post-shader粒子を、他の光学条件を変えずに操作比較できる。
- AC-027: 3072x6144の非均一microstructureとtexel基準の法線・曲率を3000へ収束し、R8 texture uploadでGPU常駐量を18 MiBへ抑えながらWQHDで4096案に近い解像感を維持する。
- AC-028: 本線3000のshader / height mapを変更せず、単一の光路距離`t`から半影・Gaussian幅・強度・素材応答を導く弱勾配と強勾配を、`light.frag`だけが異なる比較variantとして操作確認できる。
- AC-029: 強勾配の半影6倍・Gaussian幅3倍を維持し、同じ`t`軸の応答減衰だけを遠端強度0.64・素材応答0.784へ戻した中間案を、3006との差が2係数だけのshader variantとして比較できる。
- AC-030: 3007の強幾何・中間応答を固定し、同じ`t * pathGradient`から暗部の遠景teal化・低コントラスト化と光帯境界の短波長・低振幅化を導く案を、material座標と本線3000を変更せず比較できる。
- AC-031: 本線3000のshader / height mapを不変に保ち、P1は暗部のみの低周波構造、P2は上端境界に最大化した3〜4倍のdetail振幅比、P3はheight mapと光に従属する1%未満の微小輝点のみを、独立したshader-only variantとして30秒比較できる。
- AC-032: 本線3000を不変に保ち、3004は白芯面積を増やさず素材応答を50〜80%抑える広い非対称veil、3006は遠端平均輝度を3000の1/2.5〜1/4へ下げてP1由来の閾値近傍構造を残す暗部、3007は両係数を流用した複合、3008は両効果を意図的に強めた探索端として比較できる。
- AC-033: 本線3000のshader / height map / engine / policy / wordmarkを不変に保ち、3004=L1は解析的な面・有限面光源・半平面遮蔽体から直射とambientだけを計算し、3006=L2は同じscene parameterへ短距離self-shadow raymarchだけ、3007=L3は同じ直射輝度場の周辺積分からglareだけを加える。三案はuniform契約、決定的sample pattern、tone mappingを共有し、desktop / mobileで比較できる。
- AC-034: 本線3000のmacro compositionを不変に保ち、Lambert、局所roughness付き低強度GGX、ambient-only AO、必要時のみ弱いlocal self-shadowを累積checkpointとして比較できる。各案はshader以外のasset / engine / policy / wordmarkを共有し、有限面光源・world-space遮蔽物・bloom・最終RGB maskを含まない。
- AC-035: 採用3019のshaderが本線3000へbyte-identicalに収束し、height map / engine / policy / wordmarkは比較時から変わらない。写真背景3020は原本hashを保ち、canvas / shader / overlay / filterを持たない独立3001としてdesktop / mobileで再確認できる。
- AC-036: 3019をチェックポイントとして保全し、3000の光帯の重心・方向・白芯位置を維持したまま、完成RGBのmixをambient + visibility × direct BRDFへ置き換える。height mapはnormal / roughness / ambient visibilityだけを介し、固定scroll位置の決定性、desktop / mobile、exit washを維持する。
- AC-037: Layeredの寒色背景、cream色の中間光、暖色高輝度域、白芯への色軌跡を、完成RGBではなく正規化した入射chromaticityとsensor responseから再構成する。height mapはnormal / roughness / ambient visibility / bounded direct self-visibilityだけを介してradianceへ作用し、teal-green偏り、赤橙の帯、白芯への唐突な遷移を解消する。macro構図、固定scroll位置の決定性、desktop / mobile、exit washを維持する。
- AC-038: DEC-012のcheckpointを保全し、macro field内の半影、fragmentごとの入射方向、height-mapのdirect response、高輝度radiance由来glareを一つの仮想面光源と遮蔽物へ接続する。同心の広い面光源 / 小coreをsample単位で積分し、狭いcoreは正規化後も同じsource coverageを保持する。可視microstructureは単一のcanonical height近傍から得るnormal / curvature / roughness / tangent / visibilityだけで構成する。sourceの正面化と一緒にcanonical normalのbase responseを弱めず、方向とradianceだけからscroll時のdetail変化を導く。desktop / mobileの進捗0・中間・wash前で、境界softness、凹凸の明暗、白芯周辺のにじみが同じ光源方向へ同意し、中間光部が描き足した線、固定周期、孤立glint、画面空間grainではなく、暗い谷と方向整合した微細反射として読める。終端白は完成RGBのwhite mixでなくscene exposureとsensor saturationから到達する。Layeredの斜め構図、寒色背景、cream→暖色→飽和白の階層、決定性、responsive、exit washを維持する。定量値は回帰guardrailとし、採否は目視を優先する。
- AC-039: checkpoint 52を固定emitter transportの構造証拠として保全し、checkpoint 58〜61のpixel-footprint covariance系は白点を減らしても局所contrastを平均化した不採用経路として扱う。canonical heightのfine / coarse slopeを同一近傍から分離し、coarseを抑えたmicro slopeを平均せず有限面光源のdiffuse / anisotropic GGXへ直接渡す。detail専用mask / radiance / final RGB加算なしで、暗部では細部が沈み、中間光で微細な織りが解像し、同心coreのsensor飽和で白芯へ連続的に消えることをdesktop / mobileで目視する。波、亀裂、salt-and-pepper粒子、均一な織目、receiver-space面塗りを再発させず、Layeredの斜め構図・寒暖階層・意図的な白飛びをcheckpoint 69以上に保つ。

## Decision Review Scope

- DEC-001: 通常表示のcontent purity、diagnostic opt-in、shader-only no-deploy境界をreviewする。
- DEC-002: 固定scroll位置の決定性、event-driven frame、reduced motionをreviewする。
- DEC-003: fallback、precomputed asset、Server / Client境界、static asset-only deliveryをreviewする。
- DEC-004: material座標を固定し、scrollを一つの入射角原因として扱うことをreviewする。
- DEC-005: surface white、white hold、wordmarkが同じscroll進捗へ接続されることをreviewする。
- DEC-006: 光の階調と、物体・異物として独立しないmaterial detailをreviewする。
- DEC-007: canonical height representationの決定的再生成、texel基準、単一channel効率をreviewする。
- DEC-008: 2秒目以降の発見と視線移動が生じるかを、比較readinessと採用判断に分けてreviewする。
- DEC-009: 3000のmacro compositionを固定し、heightからradianceへのmaterial responseだけを物理化する境界をreviewする。
- DEC-010: 採用3019と写真案を折衷せず、canonical 3000と独立対照3001へ分ける収束をreviewする。
- DEC-011: macro fieldを完成色ではなくirradiance / visibilityとして再解釈し、materialからの出射光を一つのradiance計算へ統合することをreviewする。
- DEC-012: Layeredのpalette anchorをenergyから分離した入射chromaticityとsensor responseとして扱い、bounded self-visibilityをdirect項だけへ接続することをreviewする。
- DEC-014: macro geometryとsurface microstructureを分離し、pixel footprint内の局所法線分布を同じincident radianceへ渡すこと、runtime reference成立前にcompact近似や撮像効果へ進まないことをreviewする。
- DEC-015: canonical heightのfine / coarse slopeを分離し、band-limited local facetを平均化せず有限光源へ渡すこと、detail maskやscreen-space grainを追加せずbroad / core / sensorの共有pathで解像と飽和を作ることをreviewする。

## Intent-derived Invariants

- INV-003: diagnostic viewは明示的な開発時opt-inなしに通常表示へ現れない。
- INV-005: WebGL2不在、shader error、context lossのいずれでもfallbackと`otibo`が表示される。
- INV-008: default routeはstatic export可能で、Workers Static AssetsにWorker scriptを要求しない。
- INV-009: shader-only状態をproduction deployしない。
- INV-016: reduced motionではscroll-linked進捗を0へ固定する。

## Risk Assessment

- **Risk level**: Medium
- **Risk rationale**: 視覚・motion・性能・GPU failure を同じ First View が担い、回帰を静止画像一枚では判定できない。
- **Regression risk**: 診断用変更が default composite を変える、fallback が通常表示へ残る、motion 停止後に再開しない、scroll区間が下流contentを早く露出する可能性。
- **Data safety risk**: なし。外部入力、永続データ、通信を扱わず、本番 deploy も実行しない。
- **Security / privacy risk**: なし。secret、個人情報、外部 API を扱わない。
- **UX risk**: motion discomfort、初期表示の長い暗転、文字と光の衝突、mobile での構図崩れ。
- **Agent misbehavior risk**: shader 探索へ戻る、下流 section まで再設計する、guide の checklist 充足を visual canon 判定と取り違える、debug control を通常表示へ残す。

## Test Strategy

- **Unit**: mode 解決と lifecycle state を純粋関数へ分離した場合に追加する。分離しない場合は no-test rationale を verification に記録する。
- **Integration**: WebGL 初期化、first frame、fallback、context loss、visibility change の接続を browser で確認する。
- **E2E**: viewport と motion preference を固定し、DOM snapshot、時間差 screenshot、console error を記録する。
- **Scroll E2E**: desktop / mobileで進捗0 / 中間 / 1を操作し、canvas状態、sticky範囲、下流content位置を記録する。
- **Manual QA**: visual canon、First View の責務、文字位置・濃度、motion 量をオーナーが判定する。
- **Validator / static check**: `bash scripts/check-docs.sh`、`npm run lint`、prototype の mode / lifecycle / fallback diff review。
- **Diff review**: pageがServer Componentのまま、First Viewだけに縮退し、通常表示にdebug controlがないことを確認する。

## Test Matrix

| ID | Source | Requirement / Invariant | Test Type | Command / File | Expected Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AC-001 | TODO | default composite と First View 責務 | E2E + Manual | default URL を 1440x900 / 390x844 で screenshot | 光の場 + `otibo` のみ。baseline の層を維持 | planned |
| AC-002 | TODO | named diagnostic view | Integration | 各 named mode を browser で選択し screenshot | material / light contribution / final を区別できる | planned |
| AC-003 | TODO | viewport 比較 | E2E + Manual | 1440x900 / 390x844 と追加 extreme viewport | 文字・光が切れず、比較記録が残る | planned |
| AC-004 | TODO | motion lifecycle | E2E | 通常 / reduced motion の時間差 screenshot + visibility の frame count | 全modeで常時frameなし。reducedは進捗0、hiddenはpending frameなし | planned |
| AC-005 | TODO | fallback 全経路 | Integration | WebGL2 null、compile error、`WEBGL_lose_context` | 各経路で canvas を退避し fallback + `otibo` 表示 | planned |
| AC-006 | TODO | 初期表示と同期 blocker 解消 | Performance + Static | reload timing、initial paint capture、初期化 diff review | fallback + `otibo` が先に表示され、巨大同期生成を待たない | planned |
| AC-007 | TODO | full-viewport表示 | Browser + Computed style | html / body / main / First View | margin 0、viewport全面 | planned |
| AC-008 | TODO | shader-only local boundary | DOM + Docs | `/` DOM、TODO / Plan | 下流sectionなし、deploy禁止を明記 | planned |
| AC-009 | TODO | static compatibility | Build + Deployment | `npm run build`、`npm run deploy:dry-run` | static exportとdry-run成功 | planned |
| AC-010 | owner decision | 入射角による連続変化 | Browser + Manual | scroll進捗0 / 中間 / 1のscreenshot | 同じ表面のまま光帯が広がり影が短くなる | verified |
| AC-011 | owner decision | sticky区間とreduced motion | Browser + Unit | desktop / mobile、`light-policy.test.ts` | 進捗1まで下流非表示、reducedは進捗0 | verified |
| AC-012 | owner feedback | white holdからPrincipleへ接続 | Browser + Unit | 210svhの進捗完了点 / sticky解除点 | 前半85%で白、残り15%を保持後にPrinciple露出 | verified |
| AC-013 | owner feedback | 終盤washの急変抑制 | Browser + Static | progress 0.74 / +120px / 0.87 / 1.00 | +120pxでは全面白へ到達せず、1.00で白になる | verified |
| AC-014 | owner feedback | wordmarkのscroll fade | Browser + Unit | progress 0 / 0.74 / 0.87 / 1.00 / hold | opacity 1 / 1 / 中間 / 0 / 0 | verified |
| AC-015 | owner feedback | 光の輝度分布 | Browser + Diff | progress 0 / 0.505、`light.frag` | 狭い白芯、内側光、haloを区別でき、広い白飛びを再導入しない | verified |
| AC-016 | owner constraint | material detailの一軸比較 | Browser + Diff | 3001〜3004、progress 0 / 0.505 | 光・scroll・wordmarkは同一で、微細法線 / 微細鏡面 / 複合粒径 / 微細孔だけが異なる | verified |
| AC-017 | owner decision | 2048x4096へ収束 | Asset + Browser + Diff | 3000、generator / PNG | 本線が2048x4096を使用し、shaderと生成条件を維持する | verified |
| AC-018 | owner decision | 判別可能な素材3案 | Asset + Browser + Manual | 3001〜3003、progress 0 / mid | 同条件で紙、石／漆喰、布を一見して区別できる | verified |
| AC-019 | owner feedback | 素材第二ラウンド | Asset + Browser + Manual | 3001〜3005、progress 0 / mid | 紙v2、孔のない石v2、布、砂、砂利を区別できる | verified |
| AC-020 | owner feedback | scroll外の静止 | Browser + Screenshot | progress 0 / midで時間差capture、scroll後capture | 固定位置のcaptureは一致し、scroll後だけ表示が変わる | verified |
| AC-021 | owner request | 素材blendの対照比較 | Asset + Browser + Diff | 3006 / 3007、generator、asset metadata / hash | 同じ三素材・比率から周波数分担と純加重平均を比較できる | verified |
| AC-022 | owner clarification | 高情報量で識別困難な表面 | Asset + Browser + Manual | 3008、周波数統計、progress 0 / mid | 局所detailを保ち、布・紙・砂の単一特徴が支配しない | verified |
| AC-023 | owner request | 周波数分担の強調 | Asset + Browser + Diff | 3006 / 3009、generator、asset統計 / hash | 同じ比率とぼけ量で、3009の帯域重複だけが小さい | verified |
| AC-024 | owner decision | strong-frequency baselineへの収束 | Asset + Browser + Process | 3000 / 3001 / 3002、canonical generator、listener | 3000 / 3002が新baseline、3001がclothで、他比較portはinactive | verified |
| AC-025 | owner direction | 同じ情報量で素材同定を弱める | Asset + Browser + Manual | 3000 / 3003〜3005、progress 0 / mid | 光学条件を共有し、低周波carrierの位相置換量だけが異なる3案を比較できる | verified |
| AC-026 | owner direction | 微細粒子の挿入位置比較 | Asset + Browser + Manual | 3000〜3003、progress 0 / mid / exit | 3000は位相置換25%、3001は布、3002は光応答粒子、3003は静的post粒子として比較できる | verified |
| AC-027 | owner direction | 3072x6144とR8の収束 | Unit + Asset + Browser + Manual | generator、light engine、3000、3003 / 3004 WQHD capture | 3072案が4096案に近い見た目を保ち、R8常駐18 MiB、PNG 25 MiB未満になる | verified |
| AC-028 | owner direction | 光路距離`t`による奥行き比較 | Static + Diff + Browser + Manual | 3000 / 3004 / 3006、progress 0 / 0.505 / 0.74以降、390x844、時間差capture | 3000不変、variantはshaderだけが異なり、単一`t`から弱3倍・強6倍の半影と同方向の幅・強度・素材応答を導く | verified |
| AC-029 | owner feedback | 強幾何と中間応答の分離比較 | Static + Diff + Browser + Manual | 3000 / 3006 / 3007、progress 0 / 0.501 / 0.74以降、390x844、時間差capture | 3007は3006の半影6倍・Gaussian幅3倍を保ち、距離減衰0.25と素材mix 0.40だけが異なる | verified |
| AC-030 | owner diagnosis | 大気参加と境界細部圧縮の同軸比較 | Static + Quantitative + Browser + Manual | 3000 / 3006 / 3007 / 3008、progress 0 / 0.501 / 0.74以降、390x844、時間差capture | 3008は3007の既存係数を保ち、暗部の左半分が高輝度・低彩度、境界noiseが左で短波長・低振幅になる | verified |
| AC-031 | owner request | 数十秒かけて情報を払い出す三案の独立比較 | Static + Quantitative + Browser + Manual | 3000 / P1 / P2 / P3のshader / asset hash、desktop progress 0 / 0.501 / 0.74 / 0.87 / 1.00、mobile初期像、時間差capture、30秒セルフチェック | 各variantの差分が当該機構だけで、P1は暗部平均輝度差1%未満・局所差4%以内、P2は境界/非境界振幅比3〜4倍、P3は加算対象画素1%未満。同一進捗の像は時間で変わらない | verified |
| AC-032 | owner request | dynamic range過剰四案の独立比較 | Static + Quantitative + Browser + Manual | 3000 / V1〜V4のshader / asset hash、desktop progress 0 / 0.501 / 0.74 / 0.87 / 1.00、mobile初期像、時間差capture、ROI計測、初見1秒セルフチェック | 3000不変、差分は各variantの`light.frag`のみ。V1 / V3 / V4は同一veil maskで暖白化と素材応答減衰が連動し、V2 / V3 / V4は黒落ちせず深い暗部を作る。全案はincidenceとwashで3000へ収束する | verified |
| AC-033 | owner request | 物理scene L1〜L3 architecture比較 | Static + Quantitative + Browser + Manual | 3000 / L1〜L3のshader / asset hash、uniform一覧、desktop progress 0 / 0.501 / 0.74 / 0.87 / 1.00、mobile初期像、時間差capture、frame時間、debug field | 3000不変、variant差分は`light.frag`のみ。L1〜L3はscene parameterを共有し、L2は自己遮蔽、L3は計算輝度glareだけがL1へ加わる。可視率はedge横断で単調、scroll時は投影境界・影・回り込みが同時に変わる | verified |
| AC-034 | owner direction | 3000光場と物理material responseのhybrid比較 | Static + Quantitative + Browser + Manual | 3000 / Lambert / GGX / AO / optional self-shadowのshader・asset hash、desktop progress 0 / 0.501 / 0.74 / 0.87 / 1.00、mobile初期像、時間差capture、ROI / edge / centroid / frame時間 | 3000とasset / engine / policy / wordmarkを共有し、light mask IoU 0.99以上、輝度重心差が画面対角0.5%以内、white / near-white面積差が相対10%以内を初期guardrailとする。照射面と背景の高周波応答が増え、孤立glint、物体化、scroll時の構図変化を作らない | verified |
| AC-035 | owner decision | 3019採用と写真案の独立保全 | Hash + Diff + Browser + Build | rootと3019のshader hash、3001の写真hash / DOM / computed style、1440x900 / 390x844、scroll進捗、active listener、標準test / build | 3000 shaderが3019とbyte一致し、他runtime assetは不変。3001は原本写真とwordmarkだけを表示し、canvas / overlay / filterなし。active review portは3000 / 3001へ収束する | verified |
| AC-036 | owner direction | radiance transport統合 | Static + Shader compile + Browser + Manual | 3019 checkpointと現行shaderのdiff、debug light field、1440x900 / 390x844、progress 0 / mid / exit、時間差capture | 完成RGB mix・height直接加算・影色減算がなく、ambient + visibility × direct BRDFから像を作る。macro重心・方向・白芯位置、決定性、responsive、exit washを維持する | verified |
| AC-037 | owner critique | Layered色軌跡と局所光輸送の収束 | Static + Shader compile + Browser + Quantitative + Manual | Layered / Radiance / checkpointの1440x900・390x844、progress 0 / mid / exit、背景・中間光・白芯ROI、edge / high-frequency response、時間差capture | palette anchorを完成RGBへ戻さず、入射chromaticityとsensor responseから寒色背景→cream→暖色→白を連続して作る。bounded self-visibilityはdirect項だけへ作用し、macro構図、決定性、responsive、exit washを維持する | verified |
| AC-038 | owner review | 同一scene由来の照明整合と中間光の微細表現 | Static + Shader compile + Browser + Visual review | DEC-012 checkpoint、checkpoint 50、固定emitter候補の1600x900・390x844、progress 0 / 約0.43 / 約0.71 / 0.76〜0.91 / 1.00、settled capture、source / output hash | emitter radianceは固定で、遮蔽で失ったcore energyをbroad lobe / ambientへ補償しない。broad / coreは別BRDF pathを保ち、完全露出coreは密な飽和白芯、部分遮蔽はcream→暖色→白のladderを作る。microhighlightはhalf-vectorと揃うfacet群だけに現れ、白点noiseにならない。背景と照射域のcontrast、高周波の焦点階層、Layeredの構図・色階層・終端whiteを同時に保ち、owner採否を得る | planned |
| AC-039 | owner critique + checkpoint 69 direction acceptance | band-separated local facetによる選択的解像 | Shader compile + Browser + Visual review | checkpoint 52、checkpoint 58〜69、1600x900・390x844、Layered baseline、DSCF0627 reference | coarse slopeが波として前景化せず、micro slopeが平均化でぼけず、孤立白点へ分解しない。暗部→中間光の微細解像→飽和白芯が同じradiance / sensor pathから現れ、Layered構図と寒暖階層を保つ | covered |
| INV-003 | DEC-001 | diagnostic opt-in境界 | E2E + Static | default URLと開発opt-in URL | defaultへdiagnostic state / controlが漏れない | verified |
| INV-005 | DEC-003 | WebGL failure fallback | Integration | WebGL2 null、compile error、`WEBGL_lose_context` | 全対象経路でfallbackと`otibo`が読める | verified |
| INV-008 | DEC-003 | asset-only deployment | Build + Deployment | `npm run build && npm run deploy:dry-run` | Worker scriptなしでstatic outputを受理する | verified |
| INV-009 | DEC-001 | no shader-only deploy | Docs review | TODO / Plan / verification | local制作基盤をproduction candidateにしない | verified |
| INV-016 | DEC-002 | reduced motion固定 | Unit + Static | `light-policy.test.ts` / engine | scroll-linked進捗が0に固定される | verified |

## Manual QA Checklist

- [ ] 1440x900 で `otibo` の位置・濃度・光との重なりが適切である。
- [ ] 390x844 で `otibo` と光の主軸が切れず、desktop の縮小版に見えない。
- [ ] 追加の wide / short viewport で構図が破綻しない。
- [x] 固定scroll位置で待っても光帯・表面・grainが動かない。
- [ ] reduced motion で見た目が静止し、連続描画も止まる。
- [ ] fallback が単なる障害画面ではなく、`otibo` を記憶させる最小表示として成立する。
- [ ] 一瞥で「良い」が成立するかをオーナーが判定した。
- [ ] 様式名へ即座に回収されず、分析を要求しないかを visual canon と照合した。
- [x] wordmarkが右下の署名として光の場と競合せず、オーナーが比較後に採用した。
- [x] 通常motionのscroll中間点で、初期像と反応が同じ光学現象として読めるとオーナーが判断した。
- [x] desktop / mobileで進捗1まで下流contentが見えない。
- [x] reduced motionでscrollしても入射角が変化しない。
- [x] shaderが白へ収束した後、Principle露出前に白だけを保持する区間がある。
- [x] wash開始点から120px送っても全面白へ切り替わらず、色と表面が残る。
- [x] wordmarkがwash開始までは残り、中間で薄く、全面白と白保持では見えない。
- [x] 3006と3007を初期像とscroll中間で見比べ、周波数分担と純加重平均の差を判断できる。
- [x] 3008は単一の格子・長繊維・均質粒が支配せず、3007より局所detailが残る。
- [x] 3009は3006の光帯のぼけ方を保ちながら、布の低周波・砂の中周波・紙の高周波という階層をより明確に読める。
- [x] 位相比較開始前に3000 / 3002が同じbaseline、3001が元の布であることを確認し、現在はAC-026の粒子比較へ置き換えた。
- [x] 3003〜3005は情報量を落とさず、低周波carrierの位相連続性を段階的に弱める3案として比較できる。
- [x] 3000が位相置換25%へ収束し、3001の布、3002のheight-map微粒子、3003のpost-shader微粒子を比較できる。
- [x] WQHDで2048 / 3072 / 4096を比較し、3072x6144を解像感と単一asset上限の両方を満たす本線として選択した。
- [x] 3004 / 3006で、右の光源側から左下の遠端へ半影が広がり、輝度と素材応答が同じ`t`に沿って弱まる。
- [x] 3007は3006と同じ半影勾配を保ち、左半分の素材粒と光帯内部階調を3006より明瞭にする。
- [x] 3008の暗部が平坦な2D面ではなく、左を遠端とする場として読める。
- [x] 3008の光帯境界は右で粗く大きく、左で細かく小さいゆらぎとして読める。
- [x] 3008全体から「左が遠い」という読みが立ち、光帯の傾き・湾曲だけへ回収されない。
- [x] 弱勾配 / 強勾配の採否をオーナーが比較し、光路距離軸を不採用と決定した。
- [x] 中間応答3007をオーナーが比較し、光路距離軸とともに不採用と決定した。
- [x] 大気参加・境界細部圧縮3008をオーナーが比較し、光路距離軸とともに不採用と決定した。
- [x] P1を30秒眺め、2秒目以降に暗部の非均質性を新しく見つけられるか、視線の着地・回遊が起きるかを記録した。
- [x] P2を30秒眺め、2秒目以降に上端境界のdetail偏在を新しく見つけられるか、視線の着地・回遊が起きるかを記録した。
- [x] P3を30秒眺め、2秒目以降にheight map従属の微小輝点を新しく見つけられるか、視線の着地・回遊が起きるかを記録した。
- [x] V1〜V4を各1秒見て、3000との差を誤認なく知覚でき、光の強さとして読めるかを記録する。
- [x] V1 / V3 / V4のveilが霧・画面の汚れ・故障ではなく、白芯近傍から境界を越える散乱膜として読めるかを記録する。
- [x] V2 / V3 / V4の深い暗部が表示欠けではなく、閾値近傍構造を残した光の届かない空間として読めるかを記録する。
- [x] L1〜L3の初期像が、右上から左下の対角境界、上側の寒色影、光帯内の暖色、右寄りの最輝部を持ち、本線3000と同じ作品の再照明として読める。
- [x] debug mode 2で、遮蔽edgeを横切る可視率が影側から直射側へ単調に変化し、手置きのsoftness境界を持たない。
- [x] scroll進捗0 / 0.501で、面光源の仰角変化から投影境界、影の短縮、暗部への回り込みが同時に変化する。
- [x] L2の微細影はheight mapの起伏と光源方向に従属し、L3のglareは計算済み直射高輝度域の周囲だけへ現れる。
- [x] オーナーが3000との比較後に3019を採用し、baselineの良さを消さず改善していると判断した。
- [x] オーナーが写真背景3020を独立方向として保持する価値があると判断した。
- [x] 進捗0 / 中間 / wash前の境界softness、凹凸の明暗、白芯周辺のにじみから、同じ光源位置と遮蔽物を矛盾なく推定できる。
- [ ] desktop / mobileの初見で、規則的なheight patternへ明るい帯を塗った像より先に、静止面へ実際の光が当たる光景として読める。
- [ ] 進捗0のdesktop / mobileで、暖色ladderに囲まれた密な飽和白芯があり、広いwhite washではなく局所的なsensor clippingとして読める。
- [ ] 中間光部のmicrohighlightが一様な白点noiseではなく、同じ光源half-vectorへ揃うfacet群の帯・patchとして選択的に現れる。
- [ ] 寒色背景、半影、照射域、飽和白芯の局所contrastが分離し、material情報量の増加がぼけ・低contrastではなく高解像感として読める。

## Regression Checklist

- [ ] `layered-v5` の light contribution を単一の帯へ戻していない。
- [ ] 暗部に黒落ちした領域を再導入していない。
- [ ] default URL に diagnostic control や mode label が見えない。
- [ ] fallback から shader への切替で `otibo` の位置が跳ねない。
- [ ] resize 後に canvas resolution と viewport が一致する。
- [ ] `/`の旧下流sectionを外し、法務routeは変更していない。
- [ ] browser console に shader / page 由来の error がない。
- [x] `u_time`、時間drift、常時requestAnimationFrame loopを再導入していない。
- [ ] shader調整に伴ってwordmarkの位置・サイズを同時に変更していない。
- [x] 本線3000が3072x6144を使い、texel基準の法線・曲率、R8 upload、shader、scroll、wordmarkを維持している。
- [x] 紙は短繊維と毛羽、石／漆喰は粒径差と孔、布は縦横の織りとして一見して区別できる。
- [x] 3000のasset hashと表示が素材比較前から変化していない。
- [x] 石v2と砂利が、暗い中心と明るい縁を持つ孔の集合として見えない。
- [x] 砂は粒子の連続面、砂利は個々の礫の重なりとして区別できる。
- [x] 3003の布asset hashと表示が第二ラウンド前から変化していない。
- [x] 3006 / 3007の入力素材hashと0.6 / 0.1 / 0.3比率が一致し、shaderやwordmarkを案ごとに変更していない。
- [x] 3008は3006 / 3007と入力素材・解像度・shaderを共有し、固定scroll位置で時間変化しない。
- [x] 3009は3006と入力素材・比率・出力分散・shaderを共有し、固定scroll位置で時間変化しない。
- [x] AC-024の収束時点では再生成hashとlistener境界を確認し、現在のcanonical hashとlistener境界はAC-026 / AC-027で再検証した。
- [ ] 方向性variantの生成後も3000のasset hashとshaderが変わらず、各variantの反復境界に継ぎ目がない。
- [x] 微細粒子variantに時間入力や常時frame loopがなく、3002はshader、3003はheight mapをbaselineと共有する。
- [x] canonical 3072 assetが決定的に再生成でき、PNGは25 MiB未満、GPU常駐量は18 MiBである。
- [ ] material座標をscrollで移動していない。
- [ ] 進捗1より前にPrincipleがviewportへ入らない。
- [x] 色の残ったFirst ViewとPrincipleの白い面を同時に見せていない。
- [ ] `bash scripts/check-docs.sh` が通る。
- [x] 光路距離variantで`materialUv = uv`、時間uniformなし、event-driven描画を維持している。
- [x] 大気参加と境界細部圧縮の追加後も3000 / 3006 / 3007のhash、3007の既存係数、material座標、wash収束を維持している。
- [x] 見入り三案の生成後も3000のshader / height map hashが変わらず、engine / policy / wordmarkに差分がない。
- [x] P1 / P2 / P3にu_time、実行時乱数、独立した点配置texture、material座標のscroll移動を追加していない。
- [x] P1 / P2 / P3はDEC-006の白芯とtone curve、DEC-005のwordmarkを変更していない。
- [x] V1〜V4の生成後も3000のshader / height map hashが不変で、各workspaceとの差分が`public/first-view/light.frag`だけである。
- [x] V1 / V3 / V4の白芯最大輝度と面積が3000から増えず、同じveil maskが暖白化と素材応答減衰を駆動する。
- [x] V2 / V3 / V4の最深部がRGB 0へ到達せず、P1由来のwarpした低周波構造が時間非依存で残る。
- [x] L1〜L3の作成後も3000のshader / height map hashが不変で、各variantとの差分が`public/first-view/light.frag`だけである。
- [x] L1〜L3に`u_time`、frame依存seed、追加uniform、手置きのbeam / shadow / glare shapeを追加していない。
- [x] L2 / L3はL1のscene parameterとtone mappingを変更せず、自己遮蔽 / 輝度積分以外の差分を持たない。
- [x] desktop / mobileの固定進捗captureが時間差でSHA-256一致し、status `ready`、横overflowなし、page由来console error / warningなしである。
- [x] hybrid比較後も本線3000のshader / height mapが不変で、3019のruntime差分は`public/first-view/light.frag`だけである。
- [x] 3019は有限面光源、world-space遮蔽物、bloom、最終RGB mask、時間入力、自己遮蔽raymarchを持たない。
- [x] 3019はdesktop / mobileの初期像でlight mask、輝度重心、white / near-white面積のguardrailを満たし、scroll終端で3000へ一致する。
- [ ] hybrid checkpointを3000と同じ順序で30秒ずつ観察し、構図より先に凹凸が主張せず、照射面と青背景の双方で光方向に従う微細応答が増えている。
- [x] root 3000のshaderが採用3019とbyte一致し、height map / engine / policy / wordmarkに収束起因の差分がない。
- [x] 3001は提供写真とwordmark以外のcanvas / shader / fallback / overlay / filterを表示しない。
- [x] 3008〜3020の探索listenerを停止し、3000 / 3001だけを最終レビュー入口として維持する。
- [x] AC-038のarea transportは固定sample patternを使い、各sampleで遮蔽・距離・emitter / receiver cosine・GGXを積分してからmacro energyへ接続している。
- [x] checkpoint 29を人工的な線 / 粒の表面形状として不採用にし、checkpoint 30〜47で可視microstructureを単一canonical height近傍へ収束した。
- [x] checkpoint 50のdesktop / mobileで進捗0・中間・wash前・露光上昇・surface whiteを目視し、構図・色階層・wordmark / wash policy・横overflow 0を維持している。
- [x] checkpoint 50のsettled固定位置二captureがbyte一致し、render countも不変である。追加checkpoint serverを起動せず、Browserのviewport overrideをresetしてQA tabを閉じる。
- [x] 狭いcore responseは同じ遮蔽物のsource coverageへ従い、遮蔽で失うenergyを広い粗いlobe以外へ再配置していない。
- [x] glareは同じ遮蔽物の投影距離と解析PSF半径から可視率を求め、完全に隠れたsourceへ独立した輝度floorを残していない。
- [x] 終端白は完成RGBのwhite mixを持たず、scene radianceへのscroll同期露光とsensor responseだけで全面飽和へ到達する。
- [x] broad / core radiance path間に遮蔽energyの補償がなく、各pathの未正規化source coverage / solid angleが受光量を決める。
- [x] checkpoint 52のdesktop / mobileで進捗0・中間・wash前・露光上昇・surface whiteを実見し、密な飽和白芯、cream→暖色→白のladder、暗い背景とのcontrast、連続した材質highlight、横overflowなしを確認する。
- [x] checkpoint 52のdesktop初期像を1.2秒離してcaptureし、byte一致と時間入力なしを確認する。
- [ ] 固定emitter候補の最終像についてowner採否を得る（checkpoint 50は不採用、checkpoint 52は実装・内部目視・構造QA済み）。
- [ ] checkpoint 52を視覚候補から外し、sensor / glareなしのruntime multi-tap referenceとsingle averaged normalを同条件で比較する。
- [ ] runtime referenceで局所highlightが光源方向とcanonical heightへ整合した連結detailとして現れ、波状面、白点noise、均一な織目へ見えないことを実見する。
- [ ] source sample数の2段階比較で像が収束し、compact表現へ進む場合はruntime referenceとの目視一致を確認する。

## High-risk Checklist

本タスクは Risk Medium のため適用しない。

## Agent misbehavior checks

- [ ] 00確定後に速度反応、表面移動、残像など別系統のscroll探索へ戻っていない。
- [ ] First View に tagline、説明、product、UI component、CTA を追加していない。
- [ ] guide の構造項目を満たすこと自体を visual canon の合格条件にしていない。
- [ ] diagnostic view を公開 API や常設 panel にしていない。
- [ ] WebGL engine 全体を React component state に入れていない。
- [ ] Workers runtime が不要なまま OpenNext や binding を追加していない。

## Out of Scope

- shader-only状態のproduction domainへのdeploy。
- First Viewより下の新しいinformation architectureとvisual composition。
- First View 下の What / Makes / Where セクション設計。
- 00 baselineとは別系統のshader美観方向、image generation、materialとlightの同時変更。
- material detail比較中の局所的な焦点、孤立した強反射、物体形状。
- `@otibo/ui` component の展示。
- L1〜L3のオーナー採否、正式なintent改訂、本線3000への収束。
- 3019採用後の追加hybrid tuningと、写真案をshaderへ合成する折衷案。

## Open Questions

- visual validation 後、working baseline asset を `_docs/reference/` へ昇格するか。
- shader parameter を内部 preset として維持するか、固定値へ閉じるかは production diff review で判断する。
- 初回 shader frame の数値 budget は実測を verification に残し、必要なら follow-up で SLO 化する。
