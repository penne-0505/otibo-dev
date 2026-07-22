---
title: "Plan: First View light shader local production foundation"
status: active
draft_status: n/a
created_at: 2026-07-10
updated_at: 2026-07-22
references:
  - "_docs/draft/Site/otibo-light-shader-handoff/notes.md"
  - "_docs/intent/Site/first-view-light-shader/decision.md"
  - "_docs/qa/Site/first-view-light-shader/test-plan.md"
  - "_docs/draft/Site/top-page-exhibition/notes.md"
  - "_docs/reference/Site/visual-canon/reference.md"
  - "_docs/intent/Site/otibo-dev-site-purpose/decision.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/plan/Site/first-view-light-shader/plan.md -->

## Overview

`prototypes/otibo-light-shader/index.html` の `layered-v5` は、オーナー判断により光表現の PoC として
完了した。比較基準を保ったまま、Next.jsのproduction-quality component、lifecycle、fallback、
height texture assetへ再構成し、トップページ再設計前のshader-onlyローカル制作基盤とする。
production integration後の局所探索では、同じ表面に当たる光の入射角をscrollで持ち上げる案を
オーナーが00 baselineとして選択した。以後はこの方向の細部を調整し、別系統の効果へ広げない。

## Scope

- Server-rendered First View と client-side canvas の責務分離。
- material、主要 light contribution、final composite を切り替えられる開発時 named diagnostic view。
- 初期化・scroll・resize・context復帰に限定したevent-driven frame lifecycle。
- 初期描画、WebGL2 取得失敗、compile/link error、context loss の fallback。
- 1440x900 / 390x844 を中心とした文字位置・文字濃度・構図・motion の比較。
- shader 初期化が CSS fallback と `otibo` の初期描画を妨げない構造。
- runtime procedural generation を precomputed height texture asset へ置換する。
- Next.js static export と Cloudflare Workers Static Assets dry-run。
- browser default marginを除去し、shaderをviewport全面へ表示する。
- 旧Products / About / Contact / Footerをローカル制作基盤から外す。
- First Viewを一画面に固定したまま、下流contentを見せず照明だけを変えられるscroll区間。
- 210svhの総区間を使い、前半85%で照明変化と白への収束を終え、残り15%で白を保持してから下流へ抜ける。
- surface whiteへのwashを進捗0.74〜1.00へ分散し、終盤だけが一度のwheel入力で切り替わる状態を避ける。
- wordmarkはwash開始まで現在の濃度を保ち、washの進行に反比例して薄くなり、全面白でopacity 0へ到達する。
- 初期光は狭い白芯、暖色の内側光、低強度haloを異なる減衰幅で重ね、周辺だけのtone curveで相対輝度差を作る。
- 光の収束後は、drawing bufferを増やすのではなく、微細法線、微細鏡面、複数粒径、微細孔の高周波情報を比較する。
- height mapは生成式とpixel-spaceの傷・孔を固定して比較した2048x4096を00 baselineとする。紙・石・布など素材種別の選択は次の比較軸へ分離する。
- 素材比較では3000の00を固定し、紙の短繊維と毛羽、石／漆喰の粒径差と孔、布の縦横の織りを2048x4096のheight mapとして3001〜3003へ分離する。
- 第二ラウンドでは3003の布を保持する。3001の紙は孤立した短線を減らして繊維束をパルプ層へ埋め、3002の石は縁取られた円形孔を廃止して割れた面、鉱物粒、途切れた筋へ置き換える。3004は締まった砂、3005は個々の礫が読める砂利とする。
- 第三ラウンドでは同じ布・紙v2・砂の2048x4096素材信号を60%・10%・30%で使い、3006は布を基底、砂を中高周波、紙を高周波へ分担したblend、3007は画素ごとの純加重平均として、混合方式だけを対照比較する。
- 3008では同じ三素材から低・中・高周波を抽出し、素材を同定させる単一方向の格子、長繊維、均質な粒を複数角度・位相へ再配置する。特定素材の模倣ではなく、解像感と局所情報量を保った識別困難な表面を作る。
- 3009では3006のRMS正規化後の0.6 / 0.1 / 0.3比率と出力分散を固定し、布を低周波、砂を中周波、紙v2を高周波へ限定する。3006と同じshaderのぼけを基準に、素材間の帯域重複を減らした場合の階層性だけを比較する。低周波抽出はheight mapの反復境界を跨いで畳み込み、継ぎ目を作らない。
- 3009を新しい00 baselineとして3000へ収束する。canonical generatorは布・紙v2・砂を内部生成して同じstrong-frequency blendを再現し、prebuildで一時assetへ依存しない。比較環境は3001の元の布と3002の新baselineだけをactiveに残す。
- 新baselineを固定した次の比較では、2048x4096、素材帯域、0.6 / 0.1 / 0.3配分、RMS正規化、出力分散を共有する。3003〜3005は布由来の低周波carrierだけを周期的な等方carrierへ25%・45%・60%置換し、位相連続性の残量を一軸比較する。
- 位相置換25%を次の00 baselineとして3000とcanonical generatorへ収束する。3001の元の布は比較基準として維持し、3002はbaseline height mapへ高周波の微細凹凸を加え、3003はbaseline height mapを変えずtone mapping後に静的な画面空間粒子を加える。粒子は固定seedで時間変化せず、白芯では抑制し、surface whiteへのwashで消える。
- 2048x4096、3072x6144、4096x8192を同じ非均一microstructure生成式とtexel基準shaderで比較し、4096の見た目をWQHDで許容範囲内に保つ3072x6144を3000へ採用する。height textureは単一channel `R8`としてuploadし、GPU常駐量を18 MiB、PNGを約17.36 MBへ抑える。
- First Viewの動きはscroll-linked入射角だけへ限定し、固定scroll位置では光帯、表面座標、edge noise、grainを時間経過で動かさない。描画は初期化・scroll・resize・context復帰時だけ行う。
- 物理scene比較で得た局所的なmaterial realismは、scene全体を採用せず3000の既存光場へ還元する。beam mask、光層、色、白飛び、scroll / responsiveを固定し、height法線によるLambert、局所roughness付き低強度GGX、ambient-only AO、必要時のみ弱い局所self-shadowを累積checkpointとして比較する。
- hybrid比較では有限面光源・物理遮蔽物・bloom・最終RGB maskを導入しない。照射面と青背景のmaterial responseは別係数で制御し、macro compositionを変えずに微細な光相関だけを増やす。
- オーナー比較で採用された3019を本線3000へshader-onlyで収束する。height map、engine、policy、wordmark、page構造は比較時の3000を維持する。
- 写真背景3020はhybrid shaderへ統合せず、提供画像を無加工のcover背景として使う独立workspaceを3001で保持する。通常時の表示要素は写真と`otibo` wordmarkだけとする。
- 3019はチェックポイントとして保全し、次段ではbeamの重心・方向・白芯位置をirradiance / visibility fieldとして再利用する。完成RGBの`cool` / `lit` mix、height / curvatureの最終RGB加算、影色の減算を廃止し、ambient + visibility × direct BRDFから単一のscene-referred radianceを作る。multi-pass bloomはこの段階へ含めない。
- Radianceの次段では、Layeredの寒色背景からcream色の中間光、暖色高輝度域、白芯へ進む知覚色軌跡を、完成RGBではなく正規化した入射chromaticityとsensor responseへ移す。height由来のnormal / roughness / ambient visibilityにboundedなdirect self-visibilityを加え、高輝度域はluminance-preserving shoulderとcrosstalkで連続的に白へ飽和させる。
- DEC-012のcheckpointを次段の基準点とし、macro field内の半影、入射方向、height response、高輝度glareを一つの仮想面光源と遮蔽物へ接続する。構図fieldは置換せず照射energyの外枠として残し、物理sceneは局所的な空間同意を作るために使う。採否は数値類似度ではなく、desktop / mobile / scrollの各像を見たときに実在光として読めるかを優先する。
- AC-038の収束では、低い有限面光源を決定的disk sampleで積分し、同心の小coreを狭い高輝度radiance増分として使う。emitter radianceを遮蔽状態から独立した定数として扱い、各fragmentが見るsource coverage / solid angleとBRDFだけで受光量を変える。遮蔽で失われたcore energyを広い粗いlobeやambientへ補償せず、広いemitterと小coreはそれぞれのdiffuse / specularを別radiance pathとして合算まで分離する。coreが完全に見える領域はsensor飽和を越え、部分遮蔽域はcoverage自体からcream→暖色→飽和白のladderを作る。可視microstructureは単一のcanonical height近傍へ限定し、fine / broad normal、curvature、roughness、方向性tangent、ambient visibility、direct-only self-visibilityを同じ高さ場から導く。microhighlightはfacet normalとcore half-vectorが揃う箇所に限り、画面全体へ白点を散布しない。補助ridgeや波形を描かず、front-facing時のambient / bounceが局所contrastを先に洗わない範囲へ抑える。sourceの正面化を理由にcanonical normalのbase response自体は弱めず、入射方向とradianceから局所contrastを変える。glareは同じcore radianceから導く解析PSFと遮蔽物の投影距離を共有し、PSF半径外まで隠れたsourceへ非ゼロの固定floorを残さない。終端白は完成RGB mixではなくscene exposureとsensor saturationで作る。checkpointはsource / captureだけで保存し、追加serverを常駐させない。
- checkpoint 52は固定emitter transportの構造証拠として残し、checkpoint 58〜61のpixel-footprint covariance系は白点を減らしても局所contrastを平均化した不採用経路として扱う。checkpoint 69ではcanonical heightの同一近傍からfine / coarse slopeを分離し、coarseの大部分を差し引いたmicro slopeを平均化せずfinite-source diffuse / anisotropic GGXへ直接渡した。広い暖色emitterと同心の高輝度coreをshared sensor pathへ接続し、暗部で細部が沈み、中間光で微細な織りが解像し、白芯で飽和して消える階層を作った。オーナーは完成ではないがこの方向性を明示的に採用したため、次段はDEC-015 / INV-034を保ち、波・亀裂・ぼけ・孤立白点を再発させず局所material responseを詰める。coarse slopeの強い再混入、covariance平均への回帰、detail / focus mask、screen-space grainは使わない。checkpoint 69を下回らないdesktop初期像を優先し、完成候補が成立してからmobile / scroll / exit washを検証する。
- 光路距離比較では、強幾何・中間応答の3007を固定し、暗部の大気参加と光帯境界の細部圧縮を同じ`t * pathGradient`から導くshader-only案を追加する。細部圧縮は境界noiseだけへ適用し、material座標とheight map samplingは変更しない。
- 光路距離`t`の探索はオーナー判断で不採用として閉じる。次の比較は本線3000のcanonical shader / height mapを母体とし、閾値近傍の暗部構造、detailの光相関偏在、height mapと光に従属する微小輝点をそれぞれ単独のshader-only variantとする。
- 三案の探索中はINV-002 / INV-021の適用範囲限定を前提とする。INV-013 / INV-025のscrollと決定性、INV-020の白芯とtone curve、INV-012のwordmarkは維持する。
- 見入りの目標を、初見1秒の強度と処理しきれない情報による持続を同じ過剰提示で作ることへ更新する。dynamic range軸を再訪し、3004は白芯から境界を越えて広がるveiling glare、3006は閾値近傍構造を残した深い暗部、3007は両者の複合、3008は意図的な探索端とする。
- この四案はINV-020の再解釈を前提とした探索であり、白芯そのものの面積と最大輝度は増やさない。グレア膜が周囲の局所コントラストと素材応答を抑えることによる可視域狭窄を比較し、intentの正式改訂はオーナー採否後に行う。INV-012 / INV-013 / INV-021 / INV-025は停止しない。
- dynamic range四案は症状間の物理的一貫性を作れなかったため停止する。次の比較では面、画面右上外の有限面光源、面から高さを持つ半平面遮蔽体をfragment shader内の解析的sceneとして共有し、32〜64点の決定的sampleから可視率、距離減衰、法線応答、寒色ambientを計算する。
- 3004=L1は直射とambientだけ、3006=L2は同一scene parameterへheight mapの短距離self-shadow raymarchだけ、3007=L3は同じ直射輝度場の周辺再評価から得るveiling glareだけを加える。三案の差は係数ではなくarchitectureであり、本線3000、height map、engine、policy、wordmark、uniform契約は変更しない。

## Non-Goals

- 00 baseline確定後に、表面移動、速度反応、残像など別系統のscroll効果へ探索を広げない。
- material detail比較では局所的な焦点、孤立した強反射、物体として読める形を加えない。
- 物理scene比較では手置きのsoftness、glare楕円、光帯mask、影色maskを追加しない。半影、明暗境界、glareの位置はscene geometryまたは計算済み直射輝度場から導く。
- 素材名を色、照明強度、scroll速度、wordmarkの変更で説明しない。
- 石や砂利の粒子を、暗い中心と明るい縁を持つ孔として描かない。
- scroll入力がない状態へambient driftや時間noiseを残さない。
- `layered-v5` を visual canon 全体の代替として扱わない。
- tagline、説明、product、UI component、CTA を First View に追加しない。
- First Viewより下のinformation architecture、copy、section designは`Site-Feat-17`で扱う。
- 診断 UI や shader parameter を公開プロダクト API にしない。
- shader-only状態をproduction deployしない。
- 3072x6144への収束と同時に、lossy圧縮、低解像度への自動切替、progressive texture swapを導入しない。

## Requirements

- **Functional**:
  - 通常表示は光の場と `otibo` のみで成立する。
  - 明示的な開発時 opt-in で named diagnostic view を選択できる。
  - fallback は shader の準備前から表示可能で、失敗後も `otibo` を読める。
  - context loss でpending frameを停止し、fallback へ移行する。
  - `app/page.tsx` は Server Component のまま、canvas lifecycle だけを Client Component に閉じる。
  - scroll進捗0から1を、同じ表面への斜光から正面寄りの入射光への変化として描画する。
  - 同じscroll位置とviewportでは時間を空けても同じframeを描画する。
  - L1〜L3は有限面光源上の決定的な32〜64 sampleへshadow rayを張り、半平面遮蔽体との解析交差から直射可視率を得る。
  - L2の自己遮蔽とL3のglareを除き、三案はscene parameterとtone mappingを共有する。
  - transport統合後はheight mapがnormal、roughness、ambient visibilityだけを介してradianceへ作用し、direct shadowは可視率として直射項だけを減衰させる。
  - palette anchorは完成RGBへ戻さず、入射chromaticity、散乱、sensor responseの入力としてenergyから分離する。
  - local self-visibilityはboundedな短距離samplingとし、beam maskやambient項を変えずdirect irradianceだけへ作用する。
- **Non-Functional**:
  - motion preferenceに関係なく常時animation loopを持たず、必要なイベントごとに一枚だけ描画する。
  - `document.visibilityState === "hidden"` では新しいframeをscheduleしない。
  - 現行の同期 1024x2048 height texture 生成を既定経路の初期描画 blocker として残さない。
  - `powerPreference: "high-performance"` を前提にせず、実測上必要な場合だけ採用する。
  - light layer を単一の淡い帯へ縮退させず、暗部を黒落ちさせない。
  - 広い白飛びで光帯内部の中間階調を消さず、白芯からhaloまでの輝度段階を残す。
  - material座標をscrollで動かさず、光帯幅、影の残存量、正面からの回り込みを単一の進捗から派生させる。
  - scroll終端はPrincipleの`--colors-surface`と同じ白へ収束し、色面の境界を先に露出させない。
  - white washは進捗0.74から開始して1.00で完了し、時間遅延を加えずscroll位置と決定的に対応する。
  - wordmark fadeとshaderのwhite washは同じpolicy値を共有し、別々の曲線や時間transitionを持たない。
  - `output: "export"` と Wrangler Static Assets の asset-only deployment を維持する。
  - shader-only状態はdeploy candidateとして扱わない。

## Tasks

1. `App-Enhance-15` の Next.js 16 / Workers Static Assets baseline を完了する。
2. prototype の shader contribution を production module へ分離し、開発時 diagnostic mode を残す。
3. Server-rendered fallback / heading と Client canvas を分け、first frame 後だけ canvas を表示する。
4. event-driven frame、reduced motion、page visibility、context loss / restore の lifecycle を実装する。
5. procedural height texture を build-time に生成した precomputed asset へ置換する。
6. `app/page.tsx`をFirst Viewだけのlocal baselineへ縮退し、browser default marginを除去する。
7. unit / build / Workers dry-run と desktop/mobile browser QA を実施する。
8. verificationにvisual canon照合、local-only境界、次taskへのhandoffを記録する。
9. scroll-linked候補を操作可能な別portで比較し、選択案だけを00 baselineとして本線へ収束する。
10. 白飛び面積、halo、周辺コントラストを別portで比較し、多段haloと周辺tone curveへ収束する。
11. 光とscrollを固定し、紙、石／漆喰、布を表面起伏だけで一見して判別できる3方向として比較する。
12. 生成式とpixel-space markを固定し、1024x2048と2048x4096を比較して後者を本線へ収束する。
13. 初回素材案のfeedbackを受け、紙v2、孔のない石v2、布、砂、砂利を同じ光学条件で比較する。
14. shaderから時間入力を除き、render loopをevent-drivenな単発frameへ置き換える。
15. 布60%・紙v2 10%・砂30%の同じ入力から、周波数分担blendと純加重平均を生成して3006 / 3007で比較する。
16. 三素材の周期・方向・粒径の識別手掛かりを中和し、複数周波数の密度を再合成した3008を追加する。
17. 3006と同じ入力・比率・出力分散から、素材ごとの通過帯域を狭めた3009を追加する。
18. 3009をcanonical generatorのdefaultと本線3000へ採用し、元の布を3001、新baselineを3002へ整理する。
19. 新baselineを不変に保ち、低周波carrierの連続位相を周期的な等方carrierへ25%・45%・60%置換した3案を3003〜3005へ追加する。
20. 位相置換25%をcanonical baselineへ収束し、微細粒子をheight mapへ入れる3002とpost-shaderへ入れる3003を追加する。
21. 3007の強幾何・中間応答を保ち、暗部の遠景化と光帯境界の細部圧縮を単一の光路距離へ追加したvariantを比較可能にする。
22. 光路距離系の比較portを停止し、閾値近傍の暗部構造、detailの光相関偏在、構造従属の微小輝点を複合しない三つのshader-only variantとして起動・比較する。
23. micro-discovery比較portを停止し、グレア優位、暗部優位、複合、探索端の四案を3004 / 3006 / 3007 / 3008へ割り当て、白芯不変・固定進捗の決定性・定量ROI・desktop / mobileを検証する。
24. dynamic range比較portを停止し、解析的な面・有限面光源・半平面遮蔽体を共有するL1、L1+自己遮蔽のL2、L1+計算輝度由来glareのL3を3004 / 3006 / 3007へ割り当て、hash・描画時間・決定性・desktop / mobile・物理整合を検証する。
25. 3000の光場を固定した複製workspaceへLambert、roughness+GGX、ambient-only AO、必要時のみlocal self-shadowを順に累積し、各checkpointを独立portで保存して構図不変と微細リアリティを比較する。
26. 3019のshaderを本線3000へbyte-identicalに採用し、写真背景3020を独立workspaceの3001へ割り当て、探索portを停止する。
27. 3019を外部checkpointへ保全し、3000のmacro fieldをambient / direct irradianceとvisibilityへ分解して、単一radiance計算へ統合する。shader compile、debug field、desktop / mobile / scroll / exit wash、固定位置の決定性を検証する。
28. Layeredの知覚色軌跡を正規化した入射光とsensor responseへ再構成し、bounded self-visibilityと高さ由来BRDFを同じdirect irradianceへ接続する。desktop / mobile / scrollで色遷移、白芯、局所応答、macro構図を反復比較し、必要なcheckpointを外部workspaceへ保存して収束する。
29. DEC-012のcheckpointを保全し、既存macro fieldの内側へ仮想面光源と遮蔽物を導入する。同じscene parameterから半影、空間的入射方向、height response、高輝度radiance由来glareを導き、追加portを常時起動せずcheckpoint source / captureで反復する。checkpoint 29の補助ridgeは、参照写真の「微細さ」を表面形状として誤読し、人工的な線と粒として見えたため不採用とする。DSCF0627の参照は織り形状の模倣ではなく、微細構造へ当たる光の選択性を示す材料として扱い、checkpoint 30〜39で単一canonical height由来のmulti-scale normal、roughness、anisotropic GGX、cavity visibility、direct-only self-visibilityへ再構成する。方向性承認を得たcheckpoint 39を保全し、40ではcanonical 3x3 slopeで局所facetの連続性を高め、41では微細鏡面を中間光域へ集中した。42〜43では狭いcoreを遮蔽物のcoverageへ再接続し、失うenergyを広い粗いlobeへ移した。44〜47ではfront-facing ambientを抑え、完成RGBのwhite mixをscene exposureへ置換し、終端側へ寄せた連続露光でLayeredの手掛かりを残してから全面飽和させた。48〜49ではsourceの正面化と一緒にnormal responseまで人工的に弱める処理を段階比較し、49でbase normalを入射進捗から独立させた。50では遮蔽後にも固定量を残していたglareを、同じ遮蔽物と解析PSF半径から求める可視率へ置き換えた。50は最新owner reviewで白芯不飽和、低contrast、白点noise、高解像感不足として不採用となった。42〜43のenergy再配分を撤回し、51では面光源sampleの面積・距離・emitter cosine・遮蔽を含む未正規化積分へ戻し、広いemitterと小coreを固定radianceの別pathとして合算まで分離した。52ではその白芯・contrast・microhighlightを保ったままdiffuse normalの応答だけを僅かに抑え、過度なemboss感を避ける現行候補へ収束した。

## QA Plan

- QA document: `_docs/qa/Site/first-view-light-shader/test-plan.md`
- Risk level: Medium
- Test strategy:
  - Unit: diagnostic view の mode 解決とscroll policyを対象化する。
  - Integration: WebGL 初期化、fallback、context loss、event-driven frameの接続を browser で確認する。
  - E2E: 指定 viewport と motion preference で DOM・screenshot・console error を確認する。
  - Manual QA: visual canon、文字位置・濃度、motion 量をオーナーが判定する。
  - Scroll QA: 進捗0 / 中間 / 1で、同じ面の連続性、下流contentの非表示区間、退出時の接続を確認する。
  - Exit QA: scroll進捗1とsticky解除の間に白だけを保持する区間があり、その後にPrincipleが入ることを確認する。
  - Physical-light QA: debug field、半影の可視率勾配、scrollによる投影境界・影長・回り込みの同時変化、L2 / L3の単独差分を確認する。
  - Hybrid-material QA: 3000とのlight mask IoU、輝度重心、white / near-white / warm面積、背景色、照射面と暗部の高周波応答をcheckpointごとに比較し、material responseだけが増えていることを確認する。
  - Performance QA: `EXT_disjoint_timer_query_webgl2`が利用可能なら単発frameのGPU時間を、利用不能ならscroll入力から描画完了までのwall timeをdesktop / mobileで概測する。
  - Validator / static check: `scripts/check-docs.sh` と prototype 対象の lint/static review。

## Deployment / Rollout

- shader-only状態の本番deployは行わず、static exportとWrangler dry-runは技術互換確認に限定する。
- deploy source は `out/` のまま維持し、Worker script や runtime binding を追加しない。
- 回帰時は First View component と asset の差分を戻せる単位に保つ。既存 prototype や途中成果物は削除しない。
- 完成ページへの展開は`Site-Feat-17`で行う。
