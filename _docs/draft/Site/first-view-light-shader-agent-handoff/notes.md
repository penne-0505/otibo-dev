---
title: "Draft: First View light shader agent handoff 2026-07-22"
status: proposed
draft_status: paused
created_at: 2026-07-22
updated_at: 2026-07-22
references:
  - "_docs/draft/Site/otibo-light-shader-handoff/notes.md"
  - "_docs/plan/Site/first-view-light-shader/plan.md"
  - "_docs/intent/Site/first-view-light-shader/decision.md"
  - "_docs/qa/Site/first-view-light-shader/test-plan.md"
  - "_docs/qa/Site/first-view-light-shader/verification.md"
  - "_docs/reference/Site/visual-canon/reference.md"
  - "_docs/guide/Site/visual-canon/usage.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/draft/Site/first-view-light-shader-agent-handoff/notes.md -->
<!-- 2026-07-22時点の会話・実装・視覚評価を共有するpaused snapshot。作業指示や実装計画ではない。 -->

## Document Boundary

この資料は、First View light shaderについて、長期の探索で何が重視され、何が採用・不採用となり、
現在どのartifactと評価が残っているかを共有するためのcontext snapshotである。

実装手順、推奨する変更、作業順序、完了までの指示は含めていない。正式な要件と判断理由は、
front-matterで参照しているPlan / Intent / QAをsource of truthとする。

## Snapshot Summary

- 対象はトップページFirst ViewのWebGL fragment shaderである。
- 視覚上の中心価値は、Layered由来の斜め構図、寒色背景、creamから暖白と飽和白芯へ進む階層である。
- 一方、局所的なmaterial responseは、光源・遮蔽物・height mapを物理的に接続した探索案の方が
  Layeredより圧倒的に精密だった。
- 長期目標は、この二つを同居させ、一瞥で「色を塗った面」ではなく「静止面へ実際の光が当たった光景」
  と読める状態である。
- 現行sourceはcheckpoint 50相当だが、オーナーの最新レビューでは完成候補として不採用である。
- TODOのAC-038とstep 30は未完了、QA verdictは`PARTIAL`のままである。
- 最新レビュー後、shader sourceへの追加変更はない。

## Aesthetic Contract Recovered from Conversation

### Preserved visual value

- 右上から左下へ単純に減衰する一般的なスポットライト構図ではなく、Layeredが持っていた斜めの光帯と
  複数の光層が作品性の基準になっている。
- 背景は寒色で、照射域はcream、暖色高輝度、飽和白へ連続する。
- 白飛びは欠陥ではない。輝度が増した先を視覚センサが捉えきれないという認識を生み、モニタ上でも
  眩しく感じさせるための意図的な表現である。
- First Viewの通常表示要素は光の場と`otibo` wordmarkだけである。
- desktop / mobile / scrollで同じ表面と光景が連続して読めることが必要とされている。

### Material and microdetail value

- 「微細さゆえの美麗さ・圧巻さ」は、波、織り、粒などの形状を表面へ描き足すことではない。
- canonical height mapの微細構造のうち、入射方向、法線、粗さ、遮蔽、焦点条件が揃った箇所だけが
  選択的に解像することが望まれている。
- 白い点が一様または無関係に出る状態は、material responseではなくノイズとして評価される。
- 微細表現は画面空間grain、固定周期wave、補助ridge、遠隔height sampleの合成から作らないという
  判断がDEC-013へ記録されている。

### Motion and saturation policy

- `u_time`と常時animation loopはない。固定scroll位置では決定的な一枚を描く。
- scrollはmaterial座標を動かさず、同じ表面に対する光源位置・入射方向・露光の変化として扱う。
- 終端whiteは完成RGBへのwhite mixではなく、scene radianceへのscroll同期露光とsensor saturationから
  到達する。
- wordmarkは同じexit washへ従い、surface white到達時に見えなくなる。

## Terminology Used During the Conversation

会話中に仮称として以下が使われた時期がある。

- `Layered`: 当時の3000。構図、色階層、眩しさに最も強い到達点。
- `Radiance`: 当時の3011。完成RGBの合成をscene-referred radianceへ移した中間系統。
- `Photo`: 3001。提供写真だけをFirst View背景にした独立案。

portは探索中に再利用されており、現在のport内容とこの歴史的な呼称は完全には一致しない。
checkpoint directory名とshader hashがartifact同定の確実な手掛かりである。

## Chronological Decision History

### Layered baseline and early material comparisons

- 初期3000は、光の輪郭、中央右寄りの白芯、暖色と寒色の階層、眩しさにおいて長く保険として残された。
- 紙、石、布、砂、砂利、複数素材blendを同一shader条件で比較した。
- height mapは最終的に3072x6144の非均一microstructureへ収束した。
- texture uploadは単一channel `R8`、GPU常駐量は18 MiBである。
- 固定位置の時間driftと再帰frame loopは除去された。

### Physical-scene variants

- 3004 / 3006 / 3007では、解析的な面、有限面光源、半平面遮蔽物、height self-shadow、計算輝度由来glare
  を段階的に比較した。
- この系統は局所的なmaterial realismで3000を大きく上回った。
- 一方で構図は、右上から光が差し左下へ減衰する一般的な見え方へ寄り、Layeredの美しさを失った。
- 物理scene全体の採用ではなく、局所material responseの知見をLayeredのmacro構図へ持ち込む方向へ戻った。

### Hybrid checkpoints and 3019 convergence

- Layeredの光場を固定し、height由来Lambert、GGX、ambient-only AO、局所self-shadowを累積する
  hybrid checkpoint群を作成した。
- 視認上の改善として、オーナーは`3000→3008`、`3009→3010`、`3011→3012`、`3012→3013`
  の変化を明確に評価した。
- checkpoint 3019が、baselineの良さを消さず改善した案として採用され、本線3000へ収束した。
- 写真背景3020はshaderへ統合せず、独立した3001として維持された。

### Radiance transport and palette problem

- 3019の完成RGB layer合成を、ambient + direct diffuse + specularのscene-referred radianceへ置換した。
- heightはnormal、roughness、ambient visibility、bounded direct self-visibilityを介して作用する構造になった。
- 初期Radianceはteal / greenへ偏り、中間光が赤橙へ寄り、白芯との遷移が唐突になった。
- 右下の中間部から背景へのgradientは改善したが、Layeredのpaletteと局所material realismの双方を
  十分に活用していないと評価された。
- この状態がcommit`214156f`、`chore(wip): checkpoint Radiance first view`としてmainへ残っている。

### Finite-source microdetail attempt and rejection

- physical-coherence checkpoint 20〜29では、有限面光源sample、procedural ridge、core specular、
  reflection chainを用いて微細表現を強めた。
- 海面写真は「微細さゆえの圧巻さ」のreferenceだったが、表面の波形として解釈された。
- checkpoint 29は、光の中に人工的な線や粒があるだけと評価され、不採用になった。
- 海面の形状模倣と、screen-space grainによる解像感の追加は、この時点で明確に否定された。

### DSCF0627 reference and canonical-height correction

- `/home/penne/Pictures/image_edit/edited/DSCF0627_edited.jpg`が、今回のmaterial感に近いreferenceとして
  提示された。
- この写真も布形状の模倣対象ではなく、微細構造に当たる光の選択性を示す資料と位置付けられた。
- checkpoint 30〜39でprocedural ridge / carrierを除去し、単一canonical height近傍のfine / broad normal、
  curvature、roughness、tangent、ambient visibility、direct-only self-visibilityへ再構成した。
- checkpoint 39の方向性はオーナーから肯定された。
- checkpoint 40〜41で3x3 Sobel slopeと中間光域へ集中するcore specularが加わった。

### Coverage, sensor saturation, and scroll response

- checkpoint 42で狭いcore responseを同じ遮蔽物のsource coverageへ再接続した。
- checkpoint 43で失われたenergyを広い粗いlobeへ再配分した。
- checkpoint 44で完成RGBへの終端white mixを廃止し、scene exposureとsensor responseへ移した。
- checkpoint 45〜47で終端露光curveを比較し、checkpoint 47は全面飽和を終端側へ寄せた。
- checkpoint 48〜49では、sourceの正面化と一緒にcanonical normal responseまで弱めていた二重変化を確認した。
- checkpoint 49でdirect / ambientのbase normal responseをscroll進捗から独立させた。

### Causal glare visibility and checkpoint 50

- checkpoint 49のglareには、`topCut == 0`でも26%を残す固定floorがあり、sourceが隠れた位置でも
  glareだけが残る因果不整合があった。
- checkpoint 50は、glare profileから解析PSF半径を導き、同じ`occluderDistance`と
  `sourceProjectionRadius`へ接続した。
- checkpoint 49から50へのsource差分は、このglare visibility修正だけである。
- desktop / mobile contact sheetでは、構図、半影、暖白芯、microdetail、terminal whiteに明確な回帰はなく、
  read-only visual reviewも50を小幅な改善と判定した。
- オーナーは途中時点で、直近像について「いい感じ」「その方向性で良さそう」と述べた。
- その後の本レビューで、下記の最新評価が提示され、checkpoint 50は完成候補として受理されなかった。

## Latest Owner Review

2026-07-22時点の最新評価は以下である。この評価が、それ以前の「方向性は良さそう」という評価より新しい。

- 白飛びがない。
- materialの質感は増しているが、ぼんやり・のっぺりしており、高解像感がない。
- 白い粒々が単なるノイズになっている。
- contrastが低く、のっぺり感を増している。

このレビューにより、checkpoint 50の構造上の因果改善と、最終的な視覚品質の達成は分けて扱われている。
現行QA verificationにはcheckpoint 50の目視PASS証拠が残っているが、最終owner採否は未了であり、
最新のowner reviewはその候補品質を否定している。

## Current Implementation Snapshot

### Repository and commit

- Repository: `/home/penne/dev/active/otibo-dev`
- Branch: `main`
- HEAD: `214156f90c19a3bb3b1acdf2b7b725014069177e`
- HEAD subject: `chore(wip): checkpoint Radiance first view`
- Working treeはcleanではない。2026-07-22 00:24 JST時点で`git status --short`は136 entriesだった。
- docs-driven template migrationと別領域の既存変更が同じworking treeに含まれている。
- 当該shader作業の中心差分は`TODO.md`、First ViewのPlan / Intent / QA、`public/first-view/light.frag`である。

### Canonical source and assets

- Shader source: `public/first-view/light.frag`
- Build output: `out/first-view/light.frag`
- Canonical height: `public/first-view/light-height-map.png`
- Build height: `out/first-view/light-height-map.png`
- Shader SHA-256: `627221ca624bf9bece66a92881ee83632ffb7f6179c1e1152e6762fda5badeb0`
- Height SHA-256: `48d0637db927bbf1da36db2f80e8a07ec33358fb1344a077a4384797d79b6f5e`
- `public`と`out`はshader / heightともbyte一致している。

### Current shader structure

- Layered由来の`beam` / `halo` / `shelf`はmacro energy envelopeとして残る。
- 上端境界は有限disk source visibilityから`topCut`を求める。
- fragmentごとの`sourceVector`から入射方向と距離応答を求める。
- 可視microstructureはcanonical height近傍のnormal、curvature、roughness、tangent、visibilityから得る。
- 広いarea responseと同心の小core responseを固定Vogel sampleで積分する。
- core responseは正規化後にsource coverageを戻す。
- direct / ambientのbase normal responseはscroll進捗で弱めない。
- glareは解析PSF半径と同じoccluder distanceへ従う。
- 最終色はambient radiance、diffuse radiance、specular radiance、glare radianceを合成し、sensor responseへ通す。
- exit washはsensor exposureへ変換され、終端で各channelが飽和する。

### Checkpoint storage

- Current checkpoint:
  `/home/penne/dev/scratch/temp/otibo-first-view-physical-coherence-20260721/checkpoint-50-causal-glare-visibility`
- Previous scroll-normal checkpoint:
  `/home/penne/dev/scratch/temp/otibo-first-view-physical-coherence-20260721/checkpoint-49-source-normal-invariant`
- Previous terminal-saturation checkpoint:
  `/home/penne/dev/scratch/temp/otibo-first-view-physical-coherence-20260721/checkpoint-47-terminal-biased-saturation`
- Rejected ridge / wave endpoint:
  `/home/penne/dev/scratch/temp/otibo-first-view-physical-coherence-20260721/checkpoint-29-balanced-crest-source`
- Adopted hybrid 3019 snapshot:
  `/home/penne/dev/scratch/temp/otibo-first-view-material-hybrid-20260719/checkpoint-11-scroll-converged-3019`
- Photo variant:
  `/home/penne/dev/scratch/temp/otibo-first-view-photo-background-20260719/variant-3020`

## Reference Images and Their Meaning

- `/home/penne/Downloads/Screenshot_20260717-164804.png`
  - 海面の波形を模倣する資料ではない。
  - 微細であること自体が生む美麗さ・圧巻さのreference。
- `/home/penne/Pictures/image_edit/edited/DSCF0627_edited.jpg`
  - 今回のmaterial感により近いreference。
  - 布の織り形状を移植する資料ではなく、微細構造へ当たる光の選択性のreference。
- `/home/penne/Pictures/image_edit/edited/DSCF0598_edited.jpg`
  - shaderとは別路線の写真First View用原本。
  - 3001で写真とwordmarkだけを表示する独立案に使われている。

## QA and Verification State

- Active acceptance criterion: `TODO.md`のAC-038。
- Active TODO step: Site-Feat-17 step 30。
- Decision scope: DEC-011、DEC-012、DEC-013。中心はDEC-013。
- QA test-plan: `_docs/qa/Site/first-view-light-shader/test-plan.md`
- Verification: `_docs/qa/Site/first-view-light-shader/verification.md`
- Verification front-matter: `qa_status: partial`
- Body verdict: `PARTIAL`
- AC-038とstep 30は閉じていない。

checkpoint 50までに記録されたPASS evidence:

- `glslangValidator -S frag public/first-view/light.frag`
- `npm test`: 2 files / 19 tests
- `npm run typecheck`
- `npm run lint`: 32 files、fixなし
- `npm run build`: static 9 routes
- `npm run deploy:dry-run`: 495 assets
- `./scripts/check-docs.sh`
- targeted `git diff --check`
- desktop settled二captureのbyte一致:
  `db825a857d0ef2819deafce78a9b6f55af4cf8cf4297d7adcbdde69ed4d27c2c`

これらはcompile、build、決定性、artifact整合の証拠であり、最新owner reviewが否定した視覚品質の達成証拠ではない。

## Current Runtime State

2026-07-22 00:24 JST時点で、以下の静的serverがlistenしている。

- `127.0.0.1:3000`
  - workdir: `/home/penne/dev/active/otibo-dev`
  - content: current canonical `out`
  - process: `python3 -m http.server 3000 --bind 127.0.0.1 --directory out`
- `127.0.0.1:3001`
  - workdir: `/home/penne/dev/scratch/temp/otibo-first-view-photo-background-20260719/variant-3020`
  - content: photo variant static `out`
  - process: `python3 -m http.server 3001 --bind 127.0.0.1 --directory out`
- `127.0.0.1:3011`
  - workdir: `/home/penne/dev/scratch/temp/otibo-first-view-material-hybrid-20260719/checkpoint-04-self-shadow-3011`
  - content: older comparison checkpoint static `out`
  - process: `python3 -m http.server 3011 --bind 127.0.0.1 --directory out`

3001の再構築では、workspace外を指す`node_modules` symlinkをTurbopackが拒否した。
`npx next build --webpack`ではstatic exportが成功した。symlink自体は変更していない。

in-app BrowserのQA tabは0、viewport overrideはreset済みである。

## Interrupted Audit State

最新owner reviewを受け、候補50の実像、輝度分布、shader energy pathを再監査する作業へ入ったが、
ユーザー指示により途中で中断した。

- `implementation-prep`、`docs-prep`、`qa-prep`、Browserの手順を読み直した。
- TODO / Plan / Intent / QAとcurrent shaderのradiance blockを再読した。
- `3000`へ1600x900で接続するBrowser tabを作成した。
- Browser runtimeが`waitForLoadState(networkidle)`をsupportしなかった位置で中断した。
- screenshot取得、輝度測定、shader edit、checkpoint 51作成は行われていない。
- 中断後、Browser tabを閉じ、viewport overrideをresetした。
- current sourceはcheckpoint 50のままである。

## Unresolved Observations

以下は最新レビュー時点で解決していない観察事項であり、解決策の決定ではない。

- 初期表示で、意図した飽和白芯がオーナーの視覚上成立していない。
- broad ambientまたは粗いspecular lobeが局所contrastを平均化している可能性がある。
- canonical height由来の高周波responseが、構造に従うmicro-highlightではなく白点noiseとして読まれている。
- material情報量の増加と、高解像感・焦点階層・立体感の増加が一致していない。
- checkpoint 50の物理的なglare因果修正は、これらの視覚問題を解消していない。
- 最新レビュー後の原因切り分けとvisual evidenceは未取得である。

## Documentation State

- 旧handoff `_docs/draft/Site/otibo-light-shader-handoff/notes.md` は、layered-v5とproduction integration
  初期の文脈を保持している。
- 現行Plan / Intent / QAはcheckpoint 50まで反映済みである。
- verification末尾のcheckpoint 50節は、最新owner reviewより前のvisual evidenceを記録している。
- 本資料はpaused context snapshotであり、Plan、Intent、QA、Verificationの代替ではない。

