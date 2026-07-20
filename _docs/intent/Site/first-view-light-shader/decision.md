---
title: "Intent: First View light shader local foundation boundary"
status: active
draft_status: n/a
intent_schema: 2
created_at: 2026-07-10
updated_at: 2026-07-20
references:
  - "_docs/plan/Site/first-view-light-shader/plan.md"
  - "_docs/qa/Site/first-view-light-shader/test-plan.md"
  - "_docs/draft/Site/otibo-light-shader-handoff/notes.md"
  - "_docs/draft/Site/top-page-exhibition/notes.md"
  - "_docs/reference/Site/visual-canon/reference.md"
  - "_docs/intent/Site/otibo-dev-site-purpose/decision.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/intent/Site/first-view-light-shader/decision.md -->

## Context

First View は、光の場と `otibo` を結びつけ、一瞥の印象を作る入口である。`layered-v5` はオーナーに
よって光表現の PoC 完了と判断され、同期 texture 生成、render lifecycle、WebGL failure を本番ページの
責務へ分離した。統合後の比較では、scrollに対して画像属性を個別に動かす案より、同じ表面への入射角を
一軸で変える案だけが初期像と操作後の像を同じ現象として接続した。

2026-07-16のオーナーレビューでは、光路距離`t`から半影、幅、強度、素材応答、大気参加、境界細部圧縮を
導いた3004 / 3006 / 3007 / 3008を比較したが、奥行きは傾きや湾曲から区別されず、見入りも持続しなかった。
課題は奥行きの欠如ではなく、像が初見の1秒で全情報を払い出し、2秒目以降の発見を残さないことだと
再定義した。

## Decisions

### DEC-001: 通常表示を光と名前だけに保つ

- **What**: 通常の First View は光の場と `otibo` だけで構成し、diagnostic は明示的な開発時 opt-in に限定する。旧下流sectionを外したshader-only状態はlocal制作基盤であり、production deployしない。
- **Why**: 入口の役割を一瞥の印象へ限定しないと、説明contentや調整UIが光と名前の記憶を競合し、未完成のlocal基盤を完成ページとして公開し得るため。
- **Change freedom**: 下流information architecture、diagnosticの内部実装、wordmarkの具体的な造形は、通常表示へ説明やcontrolを漏らさず、production境界を保つ限り変更できる。
- **Why not**: 旧Products / About / Contact / Footerの互換維持や常設parameter editorは、入口と制作道具の責務を再び混在させるため採らない。

### DEC-002: 描画を入力イベントへ限定する

- **What**: WebGLは初期化・scroll・resize・context復帰時だけ単発描画し、固定scroll位置では時間で像を変えない。reduced motionはscroll進捗を0へ固定し、非表示タブとcontext lossではpending frameを実行しない。
- **Why**: 入力が止まった後も像が動くとscrollと照明反応の因果が崩れ、同じ位置の再現性、motion preference、GPU消費を同時に損なうため。
- **Change freedom**: frame予約API、engine内部状態、性能最適化は、同一入力から決定的な像を返し、不要な連続描画を作らない限り変更できる。高性能GPU指定は実測で必要性を示せる場合に限り再検討できる。
- **Why not**: ambient drift、時間uniform、再帰的requestAnimationFrame、既定の`high-performance`要求は、入力との対応を曖昧にするか未計測の消費を増やすため採らない。

### DEC-003: 初期表示とGPU lifecycleを分離する

- **What**: fallbackと`otibo`をServer-rendered initial viewとして先に成立させ、height textureはbuild-time assetにする。page本体はServer Component、WebGL lifecycleだけをClient Componentへ閉じ、WebGL2不在・compile/link error・context lossを同じfallback契約で扱う。
- **Why**: GPU能力、shader compile、texture生成の成否が入口全体を空白にせず、初回描画を大規模な同期CPU処理やReactのframe更新へ依存させないため。
- **Change freedom**: fallbackの描画方式、asset形式、resource再構築手順、module境界は、初期表示を待たせず、障害時に名前を残し、static asset-only deliveryを保つ限り変更できる。
- **Why not**: prototype iframe、runtime procedural texture、engine全体のReact state化は、document・lifecycleを分断するか初期描画とframe reconciliationを重くするため採らない。

### DEC-004: scrollを静止面への入射角として読む

- **What**: scroll進捗は同じ表面に対する光源の入射角だけを表し、material座標とheight mapを移動させない。光帯、凹凸影、暗部への回り込みは一つの進捗から派生させる。
- **Why**: scroll前後を同じ光学現象として読めれば、静止画像へparallaxやfilter変化を後付けした印象を避け、操作と反応の因果を保てるため。
- **Change freedom**: 入射角曲線、光源モデル、派生応答、scroll区間の数値は、materialを静止させ、同じ原因から照明変化を導く限り比較・調整できる。
- **Why not**: 光帯回転、速度圧縮、表面残像、material座標移動、時間遅延追従は、初期像と操作後の像を別現象に見せるため採らない。

### DEC-005: white transitionとwordmarkを同じ進捗へ接続する

- **What**: First Viewは終盤でPrincipleと同じsurface whiteへ収束し、下流content露出前に白だけを保持する。wordmarkは光より後に認識される署名とし、同じwash値に同期して全面白では消す。
- **Why**: 色の残ったFirst View、Principleの白面、wordmarkが別々に遷移すると、入口の終端が複数に割れ、戻しscrollで同じ位置と見た目を再現できないため。
- **Change freedom**: 210svh、前半85% / 残り15%、wash 0.74〜1.00、wordmarkの位置・色・大きさは現行ACであり、連続した白面、位置同期、署名としての従属を保つ比較によって変更できる。
- **Why not**: shaderとwordmarkへ別の時間transitionを与える案は、全面白後に文字だけを残し、scroll位置との決定的対応を失うため採らない。

### DEC-006: 層を持つ光と物体化しない素材を両立する

- **What**: 光は狭い白芯、暖色の内側光、低強度halo、青い散乱の階調を持ち、素材detailは光へ従属する起伏として扱う。輪郭を持つ反復形状、大きな模様、孤立した強反射で物体や異物を作らない。
- **Why**: 広い白飛びや黒潰れは光帯内部の情報を消し、rim付き孔や独立した輝点は光の場より先に別の物体として読まれ、見入りの経路を単一の形へ固定するため。
- **Change freedom**: material生成法、周波数配分、detailの空間偏在、tone mapping、暗部の視認閾値近傍構造は、光の階調を保ち、detailが独立形状を主張しない限り変更・比較できる。
- **Why not**: 広い白芯、完全な黒、色差だけの素材比較、暗い中心を明るいrimが囲う孔、画面空間の強い孤立反射は、必要な階調か非物体性を失うため採らない。

### DEC-007: 高さの正本を再生成可能な単一channel assetにする

- **What**: canonical height mapはbuild-timeに決定的に再生成し、runtimeは高さだけを単一channel textureとしてuploadする。法線と曲率はheight texel間隔から導く。
- **Why**: 比較結果を一時assetやdrawing buffer寸法へ依存させず再現し、未使用channelのGPU常駐量と配信asset容量を抑えながら解像感を保つため。
- **Change freedom**: 現行3072x6144、`R8` / `RED`、PNG、生成式、blend係数はACと採用履歴であり、決定的再生成、texel基準、配信上限、単一channel相当の効率を検証できれば変更できる。
- **Why not**: 4096x8192の単一PNGは配信上限を超え、RGBA8 uploadは未使用channelを常駐させるため現行baselineに採らない。

### DEC-008: 情報を時間差で発見できる像を目標にする

- **What**: First Viewの視覚目標を奥行きの付与ではなく、情報を時間をかけて払い出し、2秒目以降も発見と視線移動を生む像とする。奥行きはこの目標へ寄与するときだけ手段候補になる。
- **Why**: 光路距離、半影、素材応答、大気参加を同軸化しても奥行きとして読まれず、初見の1秒で像を処理できる問題と見入りの短さを解消しなかったため。
- **Change freedom**: detail密度の偏在、暗部の閾値近傍構造、height map従属の微小輝点、場所ごとの質感統計、物理照明architectureなど、発見の時間差を比較できる機構を探索できる。
- **Why not**: 光路距離`t`を単一軸にする案とdynamic range症状を個別に塗る案は、持続へ作用しないか物理的一貫性を欠いたため採用しない。
- **Revisit when**: オーナー比較またはユーザー観察で、初見後の新規発見、視線の着地・回遊、ページ理解との両立を再現可能に確認できたとき。

### DEC-009: 3000の演出的光場を仮想入射光としてmaterial responseだけを物理化する

- **What**: 3000のbeam mask、光層、色、中央白飛び、scroll / responsiveをmacro compositionの正本として固定し、同一height mapの法線を既存光方向へ接続するLambert、局所roughness付き低強度GGX、ambient-only AO、必要時のみ弱い局所self-shadowを段階的に加える。
- **Why**: 有限面光源と遮蔽体を持つ物理sceneは局所的な凹凸応答を大きく改善した一方、3000の輪郭、重心、暖色階層、白飛び構造を置き換えた。価値があったのはsceneの構図ではなくheightからradianceへの変換なので、既存光場を入射条件として再利用すれば両者を独立に最適化できるため。
- **Change freedom**: Lambert / GGX / AO / local self-shadowの式、係数、checkpoint数、保存portは、3000のmacro compositionを比較可能に保ち、detailがheightと光方向へ従属する限り変更できる。
- **Why not**: 有限面光源、world-space遮蔽物、scene全体の距離減衰、bloom、最終RGB maskは、material response以外の構図と階調まで同時に変え、前回のトレードオフを再導入するため採らない。
- **Revisit when**: 3000のmacro compositionを保つ範囲では局所的な光相関が不足し、オーナー観察でも有限光源由来のpenumbraが必要と確認されたとき。

### DEC-010: 3019をshader正本へ採用し、写真案を独立した比較基準として残す

- **What**: 3000のmacro compositionへboundedなLambert / GGX / ambient AOを加えた3019をcanonical shaderとして本線3000へ収束する。提供写真だけを背景にする3020はshaderへ混ぜず、独立workspaceの3001として保持する。
- **Why**: 3019はオーナー観察で3000の構図美を失わず微細リアリティを増やした。一方、写真案は別路線ながら実在光が持つ情報密度と静けさに固有の価値があり、shaderへ折衷すると両案の判断軸が曖昧になるため、正本と独立対照へ分ける。
- **Change freedom**: canonical shaderの係数や写真のcrop位置は、それぞれの方向性を単独で評価でき、3000と3001が異なる描画architectureであることを保つ限り調整できる。比較port番号は運用上の入口であり、production APIではない。
- **Why not**: 写真をshaderのtextureやoverlayとして合成する案、3019の上へ写真由来の色・光を模倣する案は、今回確認した二つの価値を分離できなくするため採らない。
- **Revisit when**: ページ全体のproduction visualを決める段階で、写真とshaderのどちらか一方がsite purposeやperformance要件を満たさないと確認されたとき。

### DEC-011: macro構図をirradiance fieldとして保ち、materialからの出射光を一つの光輸送へ統合する

- **What**: 3019の光帯の重心、方向、白芯位置、scroll時の広がりを構図fieldとして保つが、`cool`と`lit`の完成RGBをmaskで混ぜる方式は継承しない。寒色ambient irradiance、暖色direct irradiance、直射可視率、Lambert / GGXをscene-referred radianceへ統合し、height mapはnormal、roughness、ambient visibilityを介してのみ出力へ作用させる。
- **Why**: 3019は構図と微細表現を両立した一方、色面を先に完成させてから物理応答を加えるため、表面が光を受けているのではなく暖色を塗られたように見える。macro fieldを光量と可視率へ再解釈すれば、既存構図を保持しながら、影・拡散・鏡面・飽和を同じ入射光の結果として接続できるため。
- **Change freedom**: irradiance、visibility、albedo、roughness、tone responseの式と係数は、光帯の重心・方向・白芯位置、決定性、scroll / responsive / exit washを比較可能に保つ限り変更できる。局所的な境界勾配と色遷移は光輸送に従って3019から変化してよい。
- **Why not**: height、fine height、curvatureを最終RGBへ直接加算する方式、影色の減算、完成した寒色面と暖色面のopacity mixは、異なる光学要因を同じ見た目へ独立に描き足し、光量の因果を追えなくするため採らない。本段階ではmulti-pass bloomを導入せず、まずno-bloomの出射光を成立させる。
- **Revisit when**: scene-referred radianceだけでは意図した眩しさに到達せず、高輝度域から派生するsensor response / bloomが必要と、比較表示で確認されたとき。

## Consequences / Impact

- shader source、resource 初期化、render loop を production module として責務分離する。
- context loss 後の resource 再構築を採る場合は、texture、buffer、program を全て再生成する必要がある。
- 通常時も必要イベント以外のGPU描画を行わず、reduced motion、非表示タブ、context lossでは
  さらにscroll進捗またはpending frameを抑制できる。
- initial fallback が baseline と大きく異なる場合、切替時の視覚差が新しい QA 対象になる。
- localの`/`は一時的にshader-onlyとなり、サイトパーパスを満たす完成ページではなくなる。
- 下流sectionは`Site-Feat-17`でゼロから再構成する。
- build-time asset が増える一方、初回表示時の大規模な同期 CPU 処理はなくなる。
- canonical PNGは3072x6144、約17.36 MBとなる。R8 uploadによるGPU textureは18 MiBで、単一assetの配信上限を満たす。
- First ViewからPrincipleへ進むまで110svh分の操作区間が増える。これは説明を遅らせるコストを持つため、
  3秒 / 30秒のページ全体QAで再評価する。

## Quality Implications

- default と diagnostic の境界漏れを regression として扱う。
- visual canon の判定は画像と reference に遡り、guide の項目充足を完成条件にしない。
- fallback は障害表示ではなく、First View の最小責務を満たす表示として検収する。
- 固定scroll位置でrender countと時間差captureが一致し、scroll時だけ単発frameが増えることを確認する。
- performance は特定端末の数値だけでなく、初期描画を同期生成に依存させない構造で確認する。
- static export と Wrangler dry-run を page integration の deployment gate にする。
- scroll中間点を静止画だけで判定せず、同じ面の連続性と下流contentの非表示を実操作で確認する。
- DEC-008は現行baselineが達成済みとはみなさず、30秒比較とオーナー採否をverificationへ残す。
- DEC-009の比較では、macro compositionの一致とmaterial responseの増加を別指標で評価し、構図差を微細リアリティの改善として扱わない。
- DEC-010の収束では、3000のshader hashが採用3019と一致し、3001にcanvas / shader / overlayが混入しないことを別々に確認する。
- DEC-011では、height由来の値がmaterial parameter以外から最終RGBへ加算されていないこと、shadow fieldがdirect visibilityとして作用すること、macro構図とscroll / responsiveが保たれることを別々に確認する。

## Intent-derived Invariants

- INV-003 (from DEC-001): diagnostic viewは明示的な開発時opt-inなしに通常表示へ現れない。
- INV-005 (from DEC-003): WebGL2不在、shader error、context lossのいずれでもfallbackと`otibo`が表示される。
- INV-008 (from DEC-003): default routeはstatic export可能で、Workers Static AssetsにWorker scriptを要求しない。
- INV-009 (from DEC-001): shader-only状態をproduction deployしない。
- INV-016 (from DEC-002): reduced motionではscroll-linked進捗を0へ固定する。

## Legacy invariant reclassification

schema v1でINVとして扱っていた条件は、現行実装値を永久契約にしないよう次へ再分類した。実測値、
比較hash、variant別証跡はQA verificationに保持する。

| Legacy IDs | Disposition |
| --- | --- |
| INV-001 / INV-010 / INV-011 | DEC-001のcontent boundaryとAC-001 / AC-007 / AC-008へ移行。 |
| INV-002 / INV-020 / INV-021 | DEC-006の理由とAC-015 / AC-031 / AC-032へ移行。 |
| INV-004 / INV-025 | DEC-002とAC-004 / AC-020へ移行。 |
| INV-006 / INV-007 | DEC-003とAC-006へ移行。 |
| INV-012 / INV-015 / INV-017 / INV-018 / INV-019 | DEC-005とAC-011〜AC-014へ移行。 |
| INV-013 / INV-014 | DEC-004とAC-010へ移行。 |
| INV-022 | **Superseded**。2048x4096の一時baselineはDEC-007 / AC-027の3072x6144収束に置き換えた。 |
| INV-023 / INV-024 | DEC-006の素材比較履歴とAC-018 / AC-019へ移行。 |
| INV-026 / INV-027 / INV-028 | AC-021〜AC-023の比較統制と実験履歴へ移行。 |
| INV-029 | **Superseded**。3009収束時点の一時条件は後続の位相置換・3072収束に置き換え、AC-024の履歴に保持する。 |
| INV-030 / INV-031 | AC-025 / AC-026の比較統制と実験履歴へ移行。 |
| INV-032 | DEC-007とAC-027へ移行。 |
| INV-033 | **Obsolete**。光路距離`t`による奥行き軸を不採用としたため、AC-028〜AC-030の実験履歴にのみ保持する。 |

## Enforced in (optional)

- DEC-001 / INV-003 / INV-009: First View componentのdefault / diagnostic境界、TODO・Plan・verificationのdeploy boundary。
- DEC-002 / INV-016: light engineのframe scheduling、motion preference分岐、時間差capture。
- DEC-003 / INV-005 / INV-008: Server / Client component境界、fallback lifecycle、build / Wrangler dry-run。
- DEC-004: `light.frag`のscroll uniformとmaterial座標、scroll前後のbrowser QA。
- DEC-005: `light-policy.ts`、wordmark CSS、white hold境界のbrowser QA。
- DEC-006: shaderの光層、material generator、比較variantのvisual review。
- DEC-007: canonical generator、height texture upload、asset再生成・容量・WQHD比較。
- DEC-008: 30秒比較、オーナー採否、First Viewから下流までの3秒 / 30秒QA。
- DEC-009: checkpoint shader差分、3000との定量画像比較、照射面 / 背景の局所応答、禁止したscene / post-effectの不在。

## Rollback / Follow-ups

- First View component と asset 単位で戻せる変更に保つ。
- local baselineのvisual review後、`Site-Feat-17`へ進む。
- working baseline assetのreference昇格は完成ページのvisual review後に判断する。
- DEC-008の達成確認までは、比較readinessとproduction visual承認を分けて記録する。
