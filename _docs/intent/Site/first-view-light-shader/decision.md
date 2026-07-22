---
title: "Intent: First View light shader local foundation boundary"
status: active
draft_status: n/a
intent_schema: 2
created_at: 2026-07-10
updated_at: 2026-07-22
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

### DEC-012: Layeredの色軌跡を入射光とsensor responseへ移し、heightの局所可視率を同じ光輸送へ接続する

- **What**: Layeredで成立していた寒色ambient、cream色の中間光、暖色の高輝度域、白芯への色軌跡を、完成RGBの目標色ではなく輝度正規化した入射光のchromaticityとsensor responseとして再構成する。macroのbeam / halo / shelf / veilはscalar energy fieldのまま保持し、height mapはnormal、roughness、ambient visibility、direct-onlyのbounded self-visibilityを介して同じradiance計算へ作用させる。高輝度域の白はcomponent別の色塗りではなく、scene radianceに対するluminance-preserving shoulderと高輝度crosstalkから生じさせる。scroll終端のsurface whiteも完成RGBへ白をmixせず、scene radianceへ決定的な露光倍率を掛けてsensor response内で各channelを飽和させる。
- **Why**: DEC-011のRadianceは背景から中間光への勾配を改善した一方、ambientがteal / greenへ、directの中間域が赤橙へ偏り、白芯との遷移が唐突になった。またheight由来の法線を弱める保護により、物理scene比較で確認した局所的な粒立ちと光方向への因果が十分に戻らなかった。色の階層を光源・散乱・sensorの条件として扱い、局所遮蔽をdirect irradianceへ閉じれば、Layeredの構図美と一つの光輸送を両立できるため。
- **Change freedom**: chromaticity basis、sensor matrix、tone shoulder、高輝度crosstalk、self-shadowのstep数と寄与量、将来のHDR radiance由来bloomは、Layeredの色軌跡、macro構図、局所因果、決定性、responsive / scroll / exit washを満たす限り変更できる。
- **Why not**: Layeredのpaletteや終端白を最終RGBへmix / addする方式、L1〜L3の物理scene全体によるbeam geometryの置換、height / curvatureのRGB直接加算、任意位置のglowは採らない。no-bloom像の輸送とsensor responseが成立する前にmulti-pass bloomで差を隠さない。
- **Revisit when**: no-bloom像で高輝度radianceに由来する画面内散乱だけが不足し、オーナー比較と計測の双方でHDR由来bloomの追加価値が確認されたとき。

### DEC-013: 構図field内の光学手掛かりを一つの仮想光源と遮蔽物へ従属させる

- **What**: 既存のbeam / halo / shelfをLayered由来のmacro envelopeとして維持し、その内側のfragmentごとの入射方向、有限光源による半影、height-mapのdirect response、高輝度radiance由来のveiling glareを、一つの仮想面光源と遮蔽物の配置から派生させる。面光源は同じ中心を共有する広い基礎radianceと狭い高輝度coreのradiance増分としてsampleし、遮蔽、距離減衰、emitter / receiver cosine、anisotropic GGXをsample単位で積分してからmacro energyへ接続する。emitter radianceは遮蔽状態にかかわらず固定し、各fragmentが見るsource coverage / solid angleとBRDFだけで受光量を変える。広いemitterと小coreはそれぞれのdiffuse / specularを別radiance pathとして保持し、遮蔽で失ったcore energyを粗いlobeやambientへ再配分しない。BRDFを入射量で正規化する場合も狭いcoreのsource coverageを保持し、遮蔽されたcoreが半影外縁へ鋭いglintを作らないようにする。高輝度core由来の解析PSFは同じ遮蔽物の投影距離へ従い、PSF半径の範囲だけ境界を跨いでglareを残す。可視microstructureは単一のcanonical height近傍だけから導き、同じ高さ場のfine / broad normal、curvature、roughness、tangent、ambient visibility、direct-only self-visibilityとして光輸送へ作用させる。scrollでsourceを正面寄りへ動かしてもcanonical normalの計測結果自体は弱めず、入射方向、source geometry、radiance、sensor saturationによってdetailの見え方を変える。macro envelopeはscene全体を置換するmaskではなく、仮想sceneの照射域を構図へ拘束するenergy fieldとして扱う。
- **Why**: DEC-012のcheckpointは色軌跡と局所detailを改善した一方、境界softness、法線応答、白芯周辺のにじみが独立した数式として見え、同じ物理原因を示さなかった。規則的なheight detailも暗部から明部まで同じ向きで読めるため、実在光より模様のある面へ明るい帯を塗った印象が残った。その後のcheckpoint 42〜50では、遮蔽で失ったcore energyを広いlobeへ補償し、broad / core incident energyを一つのmaterial responseへ通したため、白芯がsensor飽和へ届かず、lit / unlit contrastが低下し、高周波responseが選択的なfacet反射ではなく白点noiseとして読まれた。固定emitter radianceとvisible solid angleへ戻し、広いsourceと小coreのBRDF pathを分ければ、部分遮蔽のladder、密な飽和白芯、half-vectorに揃うmicrohighlightを同じ原因から生じさせられるため。
- **Change freedom**: 光源位置と広い成分 / coreの面積、遮蔽物の仮想距離、決定的sample数、canonical height近傍のsample幅、direct normal / roughness、anisotropy、HDR由来glareとsensor露光の範囲は、一瞥で同じ光源方向と遮蔽物を推定でき、Layeredの構図・色階層・白芯、決定性、responsive / scroll / exit washを保つ限り反復できる。参照写真は表面形状の模倣ではなく、微細構造へ当たる光の選択性と焦点階層を判断する材料として使う。目視した物理的整合と中間光部の微細表現を採否の主判断とし、面積・重心・frame時間は回帰guardrailに限定する。
- **Why not**: 独立したshadow色、任意位置のglow、遮蔽されたsourceへ残す非ゼロのglare floor、遮蔽で失ったcore energyを粗いlobe / ambientへ補償する処理、broad / core incident energyをBRDF評価前に一つへ混ぜる処理、画面空間grainの一様増幅、固定周期の波形、補助ridge / wave / carrier、回転・倍率・offsetの異なる遠隔height sampleの合成、遮蔽率を正規化で失ったcore glint、孤立した輝点、L1〜L3の物理sceneによるmacro構図全体の置換は採らない。一つの表面と追跡できない形状を追加して見かけ上の情報量だけを増やさない。
- **Revisit when**: 単一passで高輝度radiance由来の画面内散乱を十分に表現できず、no-glare像との操作比較でmulti-pass bloomだけが不足要因だと確認されたとき。

### DEC-014: 平均法線ではなくpixel footprint内の局所法線分布を光輸送へ渡す

- **What**: macro構図は光源、開口、遮蔽物のgeometryとemitter座標上の固定radianceから導き、receiver-spaceのGaussian luminance / exposure fieldをmaterial responseへ掛けない。macro receiverはほぼ平面として扱い、広域height slopeをdirect normalやtangentへ混ぜない。canonical heightは一つの画面pixelが覆うfootprint内で複数点の勾配を採り、平均法線ではなくlocal normal distributionとして同じincident radianceのdiffuse / specular評価へ渡す。まずsensor responseとglareを外した高sample runtime referenceを作り、成立後に限りcanonical R8から決定的に生成するcompact moment texture等へ近似する。sensor、白芯、glare、Layeredの色軌跡はlinear transportと局所選択性が成立した後段で接続する。
- **Why**: checkpoint 52では固定emitter transportを追跡できた一方、長いsample stepから作るbroad slope / tangent、receiver-space macro energy、core diffuseの大きな平均輝度、単一の平均法線、広いglareと早いsensor clipが局所分散を消した。その結果、microcontrastは誤った波状面の上だけで増え、canonical heightの微細構造はぼけ、白点は法線分布に従う連結したhighlightではなくnoiseとして読まれた。BRDFは非線形なので、平均法線を評価した値はfootprint内の各法線応答の平均と一致しない。高sample referenceで後者を直接評価すれば、height map・輸送・撮像のどこで解像を失うかを分離できるため。
- **Change freedom**: footprint sample pattern / sample数、勾配幅、residual roughness、local distributionの表現、source sample数、compact momentのchannel / 解像度 / mip構成は、runtime referenceとの目視一致、決定性、runtime資源、responsiveを満たす限り変更できる。source形状も、stripやslitが視覚目的と因果整合の双方で必要と確認された場合に限り変更できる。数値は回帰guardrailであり完成条件として固定しない。
- **Why not**: diffuseとspecularへ異なるincident radianceを与える処理、receiver-spaceの輝度field、単一平均法線、広域heightを地形や波としてdirect normalへ混ぜる処理、後付けsharpen、白点noise、補助ridge、bloomによる救済、reference成立前のfull-resolution moment textureは採らない。小coreをdiffuseから機械的に切ることも目的化せず、同じradianceの下で平均輝度と局所分散を別に制御する。
- **Revisit when**: 高sample runtime referenceでもcanonical heightから選択的で連結したmicrohighlightが生じず、source sample収束や表示解像度で説明できないとき。その場合はcanonical heightの量子化、帯域、方向性、生成式を再設計する。

### DEC-015: canonical heightを尺度分離し、微細法線を平均せず有限光源へ直接応答させる

- **What**: canonical heightの同一近傍からscreen / texel基準のfine slopeとcoarse slopeを計測し、fineからcoarseの大部分を差し引いたband-limited micro slopeを光学的な微細法線とtangentへ使う。coarse slopeはreceiverが完全な平面に見えない範囲の低い寄与だけ残し、fineと同程度のdirect contrastを与えない。pixel footprint内の複数法線を平均法線やcovariance lobeへ畳み込まず、各fragmentのband-limited facetへ同じ有限面光源を直接積分する。diffuseはflat receiver responseを一部保持して溝が黒線になるのを防ぎ、specularは同じfacet、tangent、roughness、incident radianceへ従属させる。広い暖色emitterが中間光で微細構造を露出し、同心の高輝度coreが同じdiffuse / specular / sensor経路を飽和させることで、細部は暗部で沈み、中間光で解像し、白芯で連続的に消える。
- **Why**: checkpoint 58〜61のlocal normal distribution / covariance近似は、isolated white pointを減らした一方、pixel footprint内の分散を連続lobeへ平均して像を平滑化し、光域全体を均一な織目として見せた。平均を外してraw fine slopeを直接使うと解像感は戻ったが、canonical heightに含まれる雲状の低周波起伏まで強いdirect normalになり、波・亀裂・暗い線として読まれた。checkpoint 65〜69ではfine / coarseを分離し、micro slopeを直接finite-source responseへ渡したことで、波、ぼけ、白点noiseを避けながら微細な織りが中間光へ戻った。広い暖色radianceと高輝度coreを同じsensor pathへ接続すると、Layeredのcream層と意図的な白飛びも共存した。オーナーはcheckpoint 69を完成ではないが「確実にこの方向性」と明示的に採用したため、この因果を今後の反復の基準とする。
- **Change freedom**: fine / coarseのsample幅、coarse subtraction比、diffuse / specular normalの残存比、flat diffuseとの混合、roughness、anisotropy、source sample数、broad / coreのradianceと面積、sensor shoulderは変更できる。ただし変更後も、低周波面が波や亀裂として前景化しないこと、微細構造が平均化でぼけないこと、白点へ分解しないこと、暗部→中間光→飽和白芯の順序、Layeredの斜め構図と寒暖階層を実見で維持する。
- **Why not**: broad slopeをfineと同程度にnormalへ戻す処理、pixel covariance / moment lobeで局所facetを置換する処理、screen-space grain / sharpen / ridge / wave / carrier、別height sampleの回転合成、receiver-space detail mask、白芯近傍だけへ後付けするfocus mask、detail専用のincident radiance、最終RGBへのtexture加算は採らない。これらは情報量を増やして見えても、波、ぼけ、白粒、均一模様のいずれかへ戻り、checkpoint 69で成立した「光が微細構造を見せている」因果を失うため。
- **Revisit when**: checkpoint 69の方向性を保った反復でも素材の局所選択性が頭打ちになり、band separation、facet response、source geometry、sensor saturationのどこが原因かを操作比較で特定できたとき。単なる係数変更や別模様の追加を理由にこのdecisionを破棄しない。

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
- DEC-012では、色basisがenergyから分離されていること、高輝度の白がsensor responseから連続的に現れること、local self-visibilityがdirect項だけへ作用すること、Layeredの色軌跡とmacro構図が保たれることを別々に確認する。
- DEC-013では、境界の半影、fragmentごとの入射方向、height response、広い光源と同心coreの反射、glareが同じ仮想光源・遮蔽物へ追跡できることを確認する。中間光部では均一な布目や孤立glintではなく、canonical heightの微差のうち入射・粗さ条件が揃う箇所だけが狭く解像し、隣接する暗部との局所コントラストとしてdetailが読めることを確認する。数値guardrailより、desktop / mobile / scrollの各像が一瞥で実在光として読めるかを優先する。
- DEC-014では、sensor / glareなしのruntime referenceでpixel footprint内の複数法線が同じincident radianceへ応答し、平均法線では失われる選択的な細部が連結したhighlightとして現れることを確認する。波状の面的明暗、salt-and-pepper粒子、均一な織目を解像感として数えない。compact表現はreferenceとの目視一致後にのみ採用する。
- DEC-015では、canonical heightのcoarse slopeが微細法線へ強く再混入していないこと、band-limited facetが有限光源へ直接応答すること、detail専用mask / radiance / final RGB加算がないことを確認する。採否は係数一致ではなく、波・ぼけ・孤立白点が再発せず、暗部では沈み、中間光で解像し、白芯で飽和する視覚因果がcheckpoint 69以上に保たれるかで判断する。

## Intent-derived Invariants

- INV-003 (from DEC-001): diagnostic viewは明示的な開発時opt-inなしに通常表示へ現れない。
- INV-005 (from DEC-003): WebGL2不在、shader error、context lossのいずれでもfallbackと`otibo`が表示される。
- INV-008 (from DEC-003): default routeはstatic export可能で、Workers Static AssetsにWorker scriptを要求しない。
- INV-009 (from DEC-001): shader-only状態をproduction deployしない。
- INV-016 (from DEC-002): reduced motionではscroll-linked進捗を0へ固定する。
- INV-034 (from DEC-015): canonical heightのcoarse slopeをfine slopeと同程度のdirect normalへ戻さず、band-limited micro slopeを平均法線 / covariance lobe / screen-space detailで置換しない。

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
- DEC-015 / INV-034: `light.frag`のfine / coarse slope分離、local facetへのfinite-source積分、broad / core / sensorの共有radiance path、checkpoint 69との目視比較。

## Rollback / Follow-ups

- First View component と asset 単位で戻せる変更に保つ。
- local baselineのvisual review後、`Site-Feat-17`へ進む。
- working baseline assetのreference昇格は完成ページのvisual review後に判断する。
- DEC-008の達成確認までは、比較readinessとproduction visual承認を分けて記録する。
