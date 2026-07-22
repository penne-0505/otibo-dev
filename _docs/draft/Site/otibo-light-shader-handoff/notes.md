---
title: "Draft: otibo first view light shader handoff"
status: proposed
draft_status: paused
created_at: 2026-07-10
updated_at: 2026-07-17
references:
  - "_docs/draft/Site/top-page-exhibition/notes.md"
  - "_docs/reference/Site/visual-canon/reference.md"
  - "_docs/guide/Site/visual-canon/usage.md"
  - "_docs/intent/Site/otibo-dev-site-purpose/decision.md"
  - "_docs/intent/App/top-page-initial/decision.md"
  - "_docs/intent/Site/first-view-light-shader/decision.md"
  - "_docs/intent/Site/top-page-rebuild/decision.md"
  - "_docs/intent/Site/design-system-full-adoption/decision.md"
  - "_docs/qa/Site/top-page-rebuild/verification.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/draft/Site/otibo-light-shader-handoff/notes.md -->
<!-- first view light shader prototype のセッション handoff。 -->

## Purpose

現在の first view 方針:

**光の場の中に `otibo` だけを置き、一瞥の印象を作る。**

目的は、光そのものを作品化することではない。光は、説明やプロダクト確認へ進む前に、
`otibo` という名前を記憶させるための first view の装置である。

## Current Prototype

- Prototype file: `prototypes/otibo-light-shader/index.html`
- Current visual baseline: `layered-v5`
- Working comparison image: `_docs/draft/Site/otibo-light-shader-handoff/assets/layered-v5-comparison.png`
- Working desktop capture: `_docs/draft/Site/otibo-light-shader-handoff/assets/layered-v5-desktop.jpg`
- Working mobile capture: `_docs/draft/Site/otibo-light-shader-handoff/assets/layered-v5-mobile.jpg`

これらの画像は production integration の比較基準であり、visual canon 全体の代替ではない。`tmp/`
消失時にも再開できるよう handoff 配下へ複製した。reference への昇格は統合後の visual review で判断する。

この prototype は探索履歴と比較基準として保持する。本番実装は prototype を iframe 化せず、
Next.js の First View component と standalone WebGL engine へ移植する。

ローカル確認:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

その後、次を開く:

```text
http://127.0.0.1:8765/prototypes/otibo-light-shader/index.html
```

## Current Judgment

光表現そのものは、主 blocker として扱う段階を一度抜けてよい。

2026-07-10 にオーナーが「光の表現」としての PoC 完了を判断した。次は `layered-v5` を比較基準として、
本番 First View の component boundary、lifecycle、fallback、static deployment を成立させる。

- `otibo` の位置と濃度は適切か。
- desktop / mobile の画面比率で first view が成立するか。
- motion は過剰ではないか。
- first view の責務だけに留まっているか。
- shader を一回限りの絵ではなく、調整可能な部品として扱えるか。

## Light Baseline Notes

最後の探索で重要だった補正:

**dynamic range を広げて解決しない。黒落ちを避けながら、光の層を保つ。**

`layered-v5` では、一度単純化で失われた光の層を戻している。

- `hotCore` / `apertureSpark`: 局所的な白い芯。
- `outerContactSkin`: 光境界の外側にある冷たい接触膜。
- `upperApertureSkin`: 上端境界の内側にある暖かい薄膜。
- `innerWarmShelf`: 光帯内部の広い暖色層。
- `warmVeil`: 光全体にかかる cream 色の拡散膜。
- `lowerBlueVeil`: 下側に残る青い散乱。

変数名自体は実装詳細だが、意図は重要。光を単一の淡い帯に戻さない。

## Do Not Reopen Yet

次セッションで避けること:

- first view 検証の前に、広い image generation 探索へ戻らない。
- shader は改善余地があるという理由だけで触り続けない。
- 「光感」を戻すために暗部を黒く落とさない。これは dynamic range 過多として一度退けた。
- 内部の光層を削って、単一の滑らかな帯へ戻さない。
- 比較対象を明確にせず、material と light を同時に動かさない。
- first view に tagline / product name / CTA / UI component / 説明文を追加しない。

## First View Responsibilities

first view の責務:

- 一瞥で「ここには視覚的な質がある」と感じさせる。
- `otibo` という名前を光の場と結びつける。
- 下の説明へ進むための余韻を残す。

first view の非責務:

- otibo が何かを説明する。
- プロダクトを見せる。
- 機能を広告する。
- UI component を実演する。
- brand manifesto として完結させる。

## Production Integration Decision (2026-07-10)

- `@otibo/ui@0.2.0` の公開と React 19 peer 対応を確認した。
- Next.js 16 / React 19 / Panda CSS 1.11 へ先に更新する。
- Cloudflare Workers Static Assets を変更不可の deployment invariant とする。
- framework baseline を検証後、First View を `app/page.tsx` へ統合する。
- First View より下の copy / information architecture はこの作業で再設計しない。

## Next Action

次の有効な作業は、光探索の継続ではなく production integration。

推奨順序:

1. Next.js 16 / React 19 / Panda CSS 1.11 / Wrangler の Workers static export baseline を閉じる。
2. 軽量な shader debug mode と WebGL engine を production module として分離する。
3. 同期 height texture 生成を precomputed asset に置換し、animation lifecycle と fallback を整える。
4. First View を本番 page component として統合する。
5. desktop/mobile、motion、failure、static export、Workers dry-run を検証する。

実装準備の正本:

- TODO: `Site-Enhance-14`
- Plan: `_docs/plan/Site/first-view-light-shader/plan.md`
- Intent: `_docs/intent/Site/first-view-light-shader/decision.md`
- QA: `_docs/qa/Site/first-view-light-shader/test-plan.md`

## Restart Audit (2026-07-10)

現行 prototype と保存画像を再確認した結果:

- 1440x900 / 390x844 とも `layered-v5` 相当の描画を再現した。shader 由来の error はなかった。
- 通常時は時間差で描画が変化する。`prefers-reduced-motion: reduce` では時間差 screenshot が一致し、見た目は静止する。
- reduced motion 時も `requestAnimationFrame` 自体は継続する。page visibility と context loss の処理はない。
- WebGL2 取得失敗と shader compile/link error 向けの gradient fallback は既に実装済み。旧 Next Action の fallback は新規作成ではなく拡張として扱う。
- 390x844 の再読込は in-app browser の参照環境で約 4.4 秒だった。1024x2048 の height texture を main thread で同期生成してから最初の shader frame へ進む構造が主因と推論する。
- repo は `4a75bf6` (`origin/dev`) の detached HEAD で、shader 以外を含む既存の未コミット変更がある。再開時も既存差分を保護する。

## Open Questions

- working baseline は handoff 配下へ複製済み。オーナー判定後、durable な reference へ昇格するか。
- named diagnostic view の選択方式は実装詳細とし、通常表示や公開 API には露出しない。
- product / about / contact flow は現状を維持し、First View の integration と分離する。

## Verification So Far

セッション内で最後に確認したこと:

- `layered-v5` は in-app browser で desktop / mobile ともに描画された。
- v5 capture 後、shader / page 由来の relevant error / warning はなかった。
- `layered-v5` は bounded dynamic range を保っていた。screenshot metrics 上、黒落ちした dark region は出ていない。

これは観測ベースの確認である。次セッションでは、screenshots を current truth として扱う前に再確認する。

## Current Handoff — 2026-07-13

この節を再開時の入口とする。上記の2026-07-10時点の記録は探索履歴として保持しているが、
`Production Integration Decision`と`Next Action`の一部は既に完了しており、現在状態の説明ではない。

### Repository / runtime state

- Working branch: `codex/first-view-production`
- Base commit: `4a75bf6`
- worktreeには本作業全体と、それ以前からの未コミット差分がある。現状はcommit済みの完成状態ではない。
- Next.js `16.2.10`、React `19.2.7`、`@otibo/ui@0.4.0`へ更新済み。
- page compositionはCSS Modules、共通primitive / semantic token / typography roleは`@otibo/ui`を使用する。
- Cloudflare Workers Static Assetsをdeployment invariantとして維持している。
- `/`は`FirstView`と`TopPageContent`を順にrenderする。shader-only baselineやwireframe prototypeは
  production routeへ含めない。

主要ファイル:

- `app/page.tsx`
- `app/_components/first-view/FirstView.tsx`
- `app/_components/first-view/LightShader.client.tsx`
- `app/_components/first-view/light-engine.ts`
- `app/_components/first-view/first-view.module.css`
- `app/_components/top-page/TopPageContent.tsx`
- `app/_components/top-page/top-page.module.css`

### Confirmed page structure

上位構成は次の順で合意済み。ここから構造を再考するのではなく、各部のvisual tuningを行う。

1. First View: light shaderと`otibo`のみ。
2. Principle: 読むフェーズへ切り替えるowner-authored copy。
3. Products: status、logo / fallback、name、description、UI image rail。
4. Contact / footer: `mailto:contact@otibo.dev`とlegal route。

section / product境界は余白、surface、typographyで示す。外枠やdivider lineを反復しない。
product mediaはGoogle Play phone screenshotの仮合わせとしてportrait `9:16`を使い、可視captionは置かない。
画像は1枚を必須とし、2枚以上ある場合だけhorizontal railとして並べる。

### Product content / assets

- Medo、Sarae、Stashのname / description / statusを初版へ入れているが、公開値としての最終承認は未完了。
- Medo iconだけ実assetを使用している: `public/products/medo/icon.png`。
- Sarae / Stash logoは`LogoFrameFallback`。全productのUI imageは`MediaFrameEmpty` placeholder。
- アプリ本体が未完成であるため、UI screenshotを推測生成してproduction asset扱いしない。
- destination / store linkは未充足。説明下の導線はstoreまたはproduct pageへのlinkを想定している。

### Design-system boundary

- 通常UIのcolor、spacing、size、radius、typographyはsystem token / primitiveを第一選択とする。
- `Badge`、`LogoFrame`、`MediaFrame`、`ScrollArea`、`Link`、`textStyle`を適用済み。
- shaderとfallbackの光学色、page composition固有値はsite CSSに残す。
- 2026-07-13の色彩監査では、shader / fallback以外に未整理の独自色は見つかっていない。

### Confirmed visual baseline: First View wordmark

2026-07-14に、wordmarkを小さな右下配置で確定した。現在値は
`--first-view-wordmark: rgb(235 217 180 / 42%)`、font-sizeは
`clamp(var(--font-sizes-lg), 2.25vw, var(--font-sizes-3xl))`である。

調整履歴:

1. systemの濃色`fg` + element opacity `0.58`: 暗いshader背景へ沈み、視認性が低かった。
2. 光から拾った暖色`rgb(235 217 180 / 78%)`: 文字の主張が強く、graphicを主役にするFirst Viewと競合した。
3. 同色を`42%`へ低下し、文字サイズを縮小して左上へ配置。
4. 同じ文字条件で中央左と右下を比較し、右下を採用。

右下ではwordmarkが見出しではなく署名として働き、shaderを先に見た視線の着地点になる。
次のshader調整ではこの位置・サイズ・濃度をbaselineとして固定し、shaderとwordmarkを同時に変更しない。

### Verification state

- `@otibo/ui@0.4.0`移行後にlint / typecheck / Vitest / static build / Workers dry-runをPASS済み。
- 2026-07-13に`npm run build`を再実行し、9 static routesの生成をPASSした。
- wordmark `42%`反映後、localhostでcomputed color
  `rgba(235, 217, 180, 0.42)`を確認し、対象CSSのBiome checkをPASSした。
- Top page全体のverification verdictは`PARTIAL`。実UI asset、product destination、reduced-motion / 全keyboard
  QA、production visualと3秒 / 30秒体験のowner approvalが残っている。

### Resume order

1. wordmark baselineを固定したまま、First View shader本体を一軸ずつ調整する。
2. Principle → Products → Contactのsurface / spacing / typographyを一つずつvisual reviewする。
3. productの公開文言、status、destinationをオーナー確認し、実在assetができた時点でplaceholderを置換する。
4. desktop / mobile、reduced motion、keyboard、static build、Workers dry-runを再検証する。
5. オーナーのproduction visual approval後にのみ`Site-Feat-17`をPASS / deploy candidateとする。

## Scroll-linked 00 baseline — 2026-07-14

First Viewを操作可能な状態で比較し、scroll反応の方向性を次へ収束した。

- 同じ表面とheight mapを固定し、scroll進捗を光源の入射角として扱う。
- 進捗に従って光帯が広がり、凹凸影が短くなり、暗部へ光が回る。
- First View sectionは一画面高のまま、210svhの親区間でstickyにする。
- 線形の総区間を180〜400svhから段階的に比較し、210svhを操作の急さと待ち時間の境界として採用した。
- wordmarkはwash開始までは右下の署名として残し、surface whiteのwash値を`1 - wash`で共有して
  薄くする。全面白と白保持ではopacity 0とし、Principleへ文字を持ち越さない。
- 進捗1まではPrincipleを見せず、照明変化だけを操作できる。
- scroll進捗はsticky移動量の前半85%で完了し、surface whiteへ収束した残り15%を保持してからPrincipleを見せる。
- reduced motionでは進捗を0へ固定する。

比較した回転、速度圧縮、表面残像は、静止像の光と操作後の反応が同じ現象としてつながらないため
不採用とした。オーナーは入射角案を「ずば抜けている」と判断し、現状表現を細部調整の00 baselineへ
指定した。これはscroll表現の方向性に対する承認であり、ページ全体のproduction visual最終承認ではない。

## Light luminance distribution comparison — 2026-07-14

00 baselineの構図、height map、210svh、scroll入射角、wordmarkを固定し、光の現象感だけを比較する
一時variantを作成した。本線3000は変更していない。

- 3001: 白飛び面積。広いsuper-Gaussianの白い芯を加え、中心の表面情報を露出飽和として薄くする。
- 3002: 厚いグロー。狭い白い芯、内側の暖色光、外側の低強度haloを別の減衰幅で重ねる。
- 3003: 周辺コントラスト。光帯の形は維持し、S字のtone curveと小さなpeak liftで相対輝度差を広げる。

desktopの進捗0と0.505で3案を確認した。いずれもshader statusは`ready`、進捗0.505ではexit wash 0を
維持し、同じscroll位置へ追従した。候補の採否と係数はオーナー比較後に決定する。

### Convergence

オーナー判断により、3002の多段haloを母体に3003の周辺コントラストを加える案へ収束した。3001の
広い白飛びは、最大輝度へ張り付く面積が広く、光帯内部の中間階調を失うため不採用とした。本線は
狭い白芯をtone curveからmaskし、外側の暖色光とhaloへ相対輝度差を残す。desktop / 390x844の初期像、
desktopの進捗0.505 / 0.74 / 0.87 / 1.00でshader status、scroll値、wash / wordmark同期を確認した。

## Material detail comparison — 2026-07-14

3000の光、210svh、scroll入射角、wordmarkを固定し、画面全域へ連続する中間スケールdetailだけを
変更した一時variantを作成した。局所的な焦点、孤立した強反射、物体として読める形は加えていない。

- 3001: 面の起伏。低周波のwarped heightと勾配を加え、照射面と暗部の双方に連続した起伏を出す。
- 3002: 層理。光軸に近い方向へ歪んだ層と細いridgeを重ね、面に方向性を与える。
- 3003: 粗さ / 散乱。連続するroughness fieldでhalo、白芯の減衰、微細反射の密度を変える。

desktopの初期像と同一scroll入力後、390x844の初期像をBrowserで確認した。全案でshader描画、
stickyなscroll反応、wordmark位置は維持されている。3000は比較基準として変更しておらず、候補の選択と
係数の収束はオーナー比較後に行う。

この中間スケール比較は、drawing bufferがnative解像度でも低解像に見える問題へ直接作用しなかったため、
2026-07-15の高周波detail比較へ置き換えた。

## Micro detail comparison — 2026-07-15

Browser実測でcanvasとCSS表示領域が同寸、DPR 1であることを確認した。低解像感の主因を出力画素数ではなく、
隣接pixel間の素材応答差が少ないことと捉え、3001〜3003を次の案へ更新した。

- 3001: 微細法線。72 / 146周期のheight差分を照明方向へ投影し、pixel-scaleの凹凸を明瞭にする。
- 3002: 微細鏡面。92 / 184周期のroughness fieldから小さなfacet応答を作り、白芯周辺へ分布させる。
- 3003: 複合粒径。42 / 104 / 196周期を重ね、暗部から照射面まで複数粒径の応答を連続させる。
- 3004: 微細孔。2層のcellular distance fieldで小さな凹みと縁反射を作り、毛羽立ちではない細部を加える。

3001と3003は高周波量を判断しやすい強めの探索端、3002は光学分布を保つ抑制側、3004は焼き物や
柑橘皮に近い微細な空隙を使う別素材側である。desktopの初期像とscroll進捗0.505、390x844の初期像で
全案のshader status `ready`を確認した。局所的な焦点、孤立した強反射、物体形状は加えておらず、
3000の基準は変更していない。

## Optical path distance comparison — 2026-07-16

3072x6144 / R8の本線3000を固定し、既存の光学要素を単一の光路距離`t`で再パラメータ化する
shader-only variantを作成した。`t = smoothstep(0.02, 0.98, 1.0 - uv.x)`とし、画面右端を光源側の
0、左端を遠端の1とする。半影、`core` / `hotCore` / `apertureSpark` / halo / `warmVeil`の幅、
光強度、relief / height / curvatureの振幅はすべてこの`t`を共有する。incidenceが1へ近づくと差を
漸減させ、material座標、height map、engine、wordmark、scroll policyは変更していない。

- 3004: 弱勾配。遠端の半影3倍、Gaussian幅1.8倍、強度0.718、素材応答0.760。
- 3006: 強勾配。遠端の半影6倍、Gaussian幅3倍、強度0.476、素材応答0.554。

desktop `1280x720`の初期像と進捗`0.501`、進捗`0.740 / 0.870 / 1.000`、mobile `390x844`の
初期像で両案ともstatus `ready`、横overflowなしを確認した。固定進捗`0.501`の1.1秒差captureは
各案でSHA-256が一致し、render countも`3`のままだった。Browserにpage由来のerror / warningと
framework overlayはなく、Electron自身の開発時CSP warningだけを観測した。

セルフチェックでは、両案とも右の光源側でエッジと芯が狭く、左下の遠端へ進むほど半影が広がり、
輝度と素材応答が弱まる。強案は左側の芯が弱案より早く拡散する。孤立反射、局所焦点、物体形状、
後付けの模様や変形は加わっていない。採否と係数の収束はオーナー比較後に行う。

### Strong geometry / mid response variant

オーナー評価により、3006の空間読解を作る幾何勾配は維持し、遠端の階調と素材応答だけを戻す3007を
追加した。3006からの変更は`distanceAttenuation`の係数`0.45 → 0.25`と、
`materialPathResponse`のmix係数`0.15 → 0.40`だけである。`t`、`pathGradient`、半影6倍、
Gaussian幅3倍、その他のshader構造は変更していない。

- 3007: 強幾何・中間応答。遠端強度`0.640`、遠端素材応答`0.784`。

指定値でdesktop初期像を比較したところ、左半分の平均輝度は3006の`0.395`から3007の`0.436`、
標準偏差は`0.171`から`0.217`、Laplacian標準偏差は`0.101`から`0.143`へ上がった。視覚上も
3006と同じ右鋭・左広の輪郭を保ちながら、左側の素材粒と光帯内部の階調が明確になったため、
許容された±20%の追加調整は行わず指定係数を最終値とした。

desktop `1280x720`の初期像、進捗`0.501`、進捗`0.740 / 0.870 / 1.000`、mobile
`390x844`の初期像でstatus `ready`、横overflowなしを確認した。固定進捗`0.501`の1.1秒差captureは
SHA-256 `0bcc61aa85ad8abe137c64b55809c8ecee1db49977cfe8611f2f59f0807676f5`で一致し、
render countは`3`のままだった。page由来のconsole error / warningとframework overlayはない。
採否と本線への収束はオーナー比較後に行う。

### Atmospheric field / compressed boundary variant

3007でも奥行きが傾き・湾曲・ぼけ位置の差から分離できなかったため、3007の強幾何・中間応答を
固定し、暗部の大気参加と光帯境界の細部圧縮を同じ`t * pathGradient`へ加えた3008を起動した。
3007からの差は`light.frag`だけで、material座標、height map sampling、半影6倍、Gaussian幅3倍、
遠端強度`0.640`、素材応答`0.784`は変更していない。

- 暗部: `coolAir = vec3(0.455, 0.535, 0.545)`へ遠端最大`0.14`でmixする。暗部fbmは平均を保ったまま
  遠端振幅を`0.75`倍にする。指定範囲の中央値で、持ち上げ量を新しい発光や逆vignetteとして
  読ませず、右上の光源側を変更しないためこの値とした。
- 境界: 既存`t`の積分から位相連続な`edgeWarpX`を作り、遠端の局所周波数を`1.82`倍、波長を
  `0.549`倍にする。`edgeNoise` / `fineEdge` / `lowerEdgeNoise`は0.5中心の振幅を遠端`0.75`倍にする。
  光源側の局所周波数と位相を維持し、incidenceが1へ近づくと周波数・振幅とも3007へ戻る。

desktop初期像の上端12%を暗部ROI、左右それぞれ`x=0.02〜0.48 / 0.52〜0.98`としてlinear sRGBの
Rec.709輝度とHSV彩度を測った。3008は左の平均輝度`0.063349`、彩度`0.492966`、右は
`0.051279` / `0.549179`で、遠端が高輝度・低彩度になった。対照の3007は左`0.050258` /
`0.562174`、右`0.048791` / `0.564797`だった。

desktop `1280x720`の初期像、進捗`0.502`、進捗`0.740 / 0.870 / 1.000`、mobile `390x844`の
初期像でstatus `ready`、横overflowなしを確認した。固定進捗`0.502`の1.1秒差captureはSHA-256
`44551d18337333c4032a52e69763edf2c4ea495d80a4384249a53d11aecf3cf3`で一致し、render countは`3`。
page由来のconsole error / warningとframework overlayはなく、Electron hostのCSP warningだけを
除外した。dev asset cacheを避け、最終shader hashをqueryへ付けたfresh navigationで証跡を取得した。

セルフチェックでは、暗部が左へ向かって明るく低彩度になり、平坦な暗い面ではなく光帯と同じ遠近を
持つ場として読める。境界ゆらぎは右で粗く大きく、左で細かく小さくなり、6倍半影の中で新しい模様、
縞、位相切れ、aliasingを作らない。画面全体から左を遠端とする読みが立つが、採否と本線への収束は
オーナー比較後に行う。

## Goal redefinition — 2026-07-16

オーナーレビューでは、3004の弱勾配、3006の強勾配、3007の中間応答、3008の大気参加・境界細部圧縮の
いずれも、初見で奥行きとして傾きや湾曲から区別されなかった。評価は「微妙」であり、光路距離`t`を
単一軸とする探索は、奥行きの読解にも見入りの持続にも結び付かなかったため、ここで終了する。

オーナー写真にある暗部へ沈む布の皺、カーテンの織り目、ハンガーの点光と比較し、First Viewの課題を
「奥行きの欠如」から「像が情報を数十秒かけて払い出さないこと」へ変更した。現状は初見の1秒で情報を
読み切れ、2秒目以降の発見が残らない。以後の目標は奥行き自体ではなく、見入りの持続である。奥行きは
その目標へ寄与する場合に限る手段候補へ戻す。

次の探索方向は、細部密度が光と相関して偏在すること、暗部に視認閾値近傍の起伏やむらを沈めること、
素材構造に従属して独立形状を主張しない疎らな微小輝点、場所ごとに異なる質感統計である。統計的一様性を
完成条件にせず、形状として同定可能な反復要素や孤立した強反射は引き続き避ける。

## Micro-discovery comparison — 2026-07-16

本比較は「INV-002 / INV-021の適用範囲限定を前提とした探索」である。INV-013 / INV-025の
scroll入射角と時間非依存、INV-020の白芯を避けたtone curve、INV-012のwordmarkは停止しない。
光路距離系の3004 / 3006 / 3007 / 3008を停止し、3004をP1、3006をP2、3007をP3へ再割り当てした。
3008は停止のままとし、3000は参照用canonical baselineとして起動した。

- P1 / 3004: `upperShadow`上方の暗部だけをmaskし、低周波fbmを別のfbmでwarpした。輝度の
  scalar乗算に限定し、`shadowRetention`でincidence増加時に減衰する。
- P2 / 3006: `d - upperEdge`のGaussian帯で既存relief / height / fineHeight / curvature /
  micro-specularのみを重み付けた。上端境界は1.0、光帯中央と暗部深部は0.29で、振幅比は
  `3.448`。新しい粒や反射点は追加していない。
- P3 / 3007: `fineHeight`の`0.89〜0.955`を狭いsmoothstepで選択し、法線と
  `warmBeamLight`の整合、`lightField`、白芯除外から輝点を導いた。配置textureや独立seedはない。
  初稿の加算係数0.052では既存microstructureとの区別が弱かったため、選択率とmaskを固定したまま
  0.095へ上げた。

本線3000のshader / height map SHA-256は
`884848a8c676fa246de7646b2fe47e191fa91bfbceddcf528d6dd897615c44df` /
`48d0637db927bbf1da36db2f80e8a07ec33358fb1344a077a4384797d79b6f5e`のまま。P1 / P2 / P3のshaderは
`bbb72c1417d4dbe13e11ec1272845d4d2c52936c829956036915afa30f4c6a3c` /
`40596dd79ce0122f8f22b5dcc1b08796503e00d3949e918664eeb30dd86385ea` /
`0134d65da549b3f1cde2dcdfcd38f286bf6c3cf6247a735662f0bffb63e4f2f4`。各workspaceの本線との差分は
`public/first-view/light.frag`だけで、height mapは三案と3000と一致する。

P1の1280x720相当の暗部mask数値評価は平均輝度変化`-0.120%`、最大局所変化`1.623%`、
係数から得る絶対上限`3.335%`。完全表示後の3000対照captureでも暗部ROIの平均輝度差は
`+0.149%`だった。P3の910,800画素に対する`microPeak > 0`は8,156画素、`0.895%`で、
白芯除外後の実働率はこれ以下。較正後P3と3000のcapture差分は1,478画素`0.164%`、
最大channel差が`3 / 255`を超える点は56、`4 / 255`を超える点は29だった。

desktop `1280x720`で各案の初期像、進捗`0.501 / 0.740 / 0.870 / 1.000`、mobile
`390x844`で初期像を確認した。全案status `ready`、mobileはcanvas `375x844`、document幅`375`、
viewport幅`390`で横overflowなし。washは`0.000 / 0.000 / 0.503 / 1.000`。進捗`0.501`の
1.1秒差captureは各案でSHA-256まで一致し、render countも`3`のままだった。page由来の
console error / warningはなく、Electron hostの開発時CSP warningだけを除外した。

30秒セルフチェックでは、P1は初見で光帯を読んだ後、上側暗部の大きな明暗むらを発見でき、
暗部内の緩い峰間に視線が移る。輪郭や皺としては同定しない。P2は上端境界の粒度差に数秒後に
気づき、視線が左下から右上へ境界線沿いに移る。深い暗部と光帯中央は対照的に静かである。P3は
初見では素材粒に溶けるが、数秒後に暖色の小さな点が光帯内を飛び石状に結ぶことを発見でき、
視線は点間を移る。暗部にも少数が残るが、haloや独立物体の輪郭は作らない。三案の採否はオーナー比較後に
行うため、ここでは決定しない。

## Dynamic-range excess comparison plan — 2026-07-17

P1 / P3は既存テクスチャの視覚マスキングに対して振幅が小さく、初見で変化を知覚できなかった。
P2は知覚されたが注視時間を短縮したため、目標を「最初の1秒の強度と見入りの持続を、処理しきれない
過剰の提示という同一機構で作る」へ更新する。今回は見えるかではなく、霧・汚れ・故障ではない
光の強さとして読めるかを比較し、迷う場合は強い側へ較正する。

dynamic range軸の再訪だが、広い白飛びによる中間階調の喪失と、完全な黒へ暗部を潰す手段は使わない。
V1は白芯近傍から上端境界を越えるveiling glare、V2はP1由来の閾値近傍構造を残した深い遠端、
V3は両者の複合、V4は意図的な探索端とする。3004 / 3006 / 3007を停止・再割当し、3008を再起動する。
3000のcanonical shader / height map、engine、policy、wordmarkは変更しない。

本比較は、白芯そのものの面積拡大を禁じるINV-020の再解釈を前提とした探索である。グレア膜によって
白芯周囲の局所コントラストと素材応答を同じmaskで抑え、可視域が狭まることを光強度の証拠として扱う。
intentの正式改訂はオーナー採否後に行う。INV-012 / INV-013 / INV-021 / INV-025は停止しない。

### Implementation and calibration

旧P1 / P2 / P3を停止し、3004=V1、3006=V2、3007=V3へ再割り当て、3008=V4を起動した。
V1はbeamMaskに依存しない非対称Gaussianで白芯近傍から上端境界の暗部側までveilを広げ、同じ
`glareVeil`で暖白へのmixとrelief / height / fineHeight / curvature / micro-specularの応答を抑える。
白芯は`glareCoreExclusion`でveilから除外した。V2は左上の遠端を`deepShadowMask`で深化し、P1の
warpした低周波fbmを絶対振幅を下げて沈め直し、深さとともに彩度を落とした。V3はV1 / V2の最終係数を
そのまま併用し、V4だけveil幅、detail抑制、暗部の最深係数を探索端へ強めた。

初回定量でV1のveil域における高周波応答減衰が`48.64%`、V2の暗部ROIが3000比`0.2449`となった。
目安の境界へ入れるため、V1 / V3の最大detail抑制を`72% → 76%`、V2 / V3のdeep factorを
`0.45 + 0.23 → 0.44 + 0.22`へ一段戻した。V3固有の係数調整は行っていない。最終値では、
veil域の局所高周波応答減衰がV1`54.10%`、V3`64.32%`、V4`72.72%`。暗部ROIのlinear sRGB
Rec.709平均輝度は3000`0.045052`に対してV2`0.011618`、V3`0.011509`で、3000比
`0.2579 / 0.2555`となった。V2 / V3の最深部sRGB輝度は`0.067269 / 0.063347`でRGB 0へ
到達しない。V4は広いveilが同ROIへ侵食するため平均は`0.012660`だが、1 percentile`0.040085`、
最小`0.032242`まで下がり、意図した探索上限になった。

本線3000のshader / height map SHA-256は
`884848a8c676fa246de7646b2fe47e191fa91bfbceddcf528d6dd897615c44df` /
`48d0637db927bbf1da36db2f80e8a07ec33358fb1344a077a4384797d79b6f5e`で作業前後を通して不変。
V1 / V2 / V3 / V4のshader SHA-256は
`612a499e474e09b7d553a0d9a09c3f1d19e89f7123de671873319355dcb3bd0c` /
`ab15cf169e5218025d29e2d5f66b6e63b9dc7a04c2ecc5d8c8175fd74761fee3` /
`3b3b79903c47fb0aa9323b966aa84261da6b6e5d2f11f4b494d4a185a22b6529` /
`c44b5caebfbeec5c73792526141fba2ff5d2f853457c96de580dfa18d4e0da89`である。

### Owner verdict — 2026-07-17

V1〜V4は不採用。オーナー評価は「光っぽいものと影っぽいものの物理的な一貫性が乏しく、キャンバスに
色が塗られている印象を抜けない」。強度は上がったが、暗さを作る遮蔽の論理がなく、グレアが境界を
越える一方で隣の影の縁は硬いままなど、症状間の矛盾が振幅増で可視化された。

## Session handoff — 2026-07-17 (orchestration)

この節は次セッションの orchestrator の入口である。体制: オーナーが実装者へ指示文を仲介し、
orchestrator は指示文の作成、diff / hash / docs の検証、視覚評価、方向判断を担う。usage 節約のため
subagent は使わず、実装完了はオーナー経由で通知される。

### 経緯と診断

1. 初期課題「のっぺり・圧倒感不足」に対し、光路距離`t`軸(3004弱 / 3006強 / 3007中間応答 /
   3008大気参加)を比較。オーナーは初見で奥行きを傾き・湾曲から区別できず、軸を終了。
2. 目標を「数十秒かけて情報を払い出す像(見入り)」へ再定義。INV-002 / INV-021 を核へ縮小する
   intent 改訂を実施済み(decision.md 反映済み)。
3. P1閾値暗部 / P2偏在 / P3輝点を比較。P1 / P3 は変化が知覚されず(既存テクスチャの視覚マスキング
   を過小評価した振幅指定が原因)、P2 は知覚されたが注視時間を短縮した(着地点は滞在ではなく
   読み切りを加速する)。
4. 目標を「最大瞬間風速と見入りは、処理しきれない過剰の提示という同一機構で作る」へ更新。
5. V1グレア / V2暗部深化 / V3複合 / V4探索端を比較。強度は出たが、上記 Owner verdict のとおり
   物理的一貫性の欠如が可視化され不採用。
6. 診断: 現 shader は光源・遮蔽・幾何という原因を持たず、約20個の手置き Gaussian / mask で症状を
   塗る architecture である。振幅を上げると症状間の矛盾が露呈し、下げるとのっぺりへ戻る両側詰み。
   全探索(手掛かり追加・偏在・輝点・グレア)の失敗はこの単一原因へ還元される。

### 決定と次作業

- オーナーは方向 B「照明を実際に計算する再構築」を承認した(2026-07-17)。height map の面、
  画面外の面光源(開口)、影を落とす遮蔽体を明示的な scene として定義し、半影・減衰・陰影・
  グレアを同一の光輸送計算から導出する。INV-025(scroll 時の単発 frame のみ)により per-pixel の
  多数 sampling が許される点が実現可能性の根拠。
- 比較方法は従来どおり: 本線 3000 不変、比較 port に L1(最小物理scene)/ L2(+自己遮蔽)/
  L3(+計算輝度由来グレア)を立て、採否はオーナー比較。ただし従来と異なり diff は係数ではなく
  architecture 全体になるため、docs には比較の性質の違いを明記する。
- L1〜L3 の指示文はオーナーへ渡し済み(本 handoff と同時)。
- 採用後の残作業: INV-020 の再解釈を含む intent 正式改訂、TODO / AC の整理、比較 port の収束。

### 再発防止の教訓

- 単独の手掛かり・症状の追加は「加工・模様・塗り」として読まれる。原因を共有しない症状は
  何個足しても統合されない。
- テクスチャの上に沈める閾値近傍構造は、無地基準の検出閾値の数倍の振幅が必要(視覚マスキング)。
- 実装者の知覚セルフチェックには作者バイアスがある(仕込み位置を知る目は発見できてしまう)。
  測定として扱えるのはオーナーの観測のみ。
- 「30秒眺められるか・何秒目に何を発見したか・視線がどこで離脱したか」をオーナーレビューの
  観測形式とする。初見 QA だけでは今の目的変数を測れない。

## Physical lighting architecture comparison — 2026-07-17

手置きのGaussian / beam mask / shadow mask / glare ellipseを停止し、fragment shader内にheight-map面、
有限面光源、半平面遮蔽体、寒色ambientを持つ解析sceneを実装した。48点の決定的Vogel patternから
面光源をsampleし、receiver / emitter cosine、距離二乗減衰、遮蔽体との交差可視率から直射を計算する。
scrollが変更するscene parameterは光源の高さだけで、進捗0.74〜1.00のexit washは最終色へのmixとして
維持した。uniformは既存6個だけで、height map / engine / policy / wordmarkには触れていない。

三案は同一shader sourceを共有し、先頭のcompile-time flagだけが異なる。L1 / 3004は直射とambient、
L2 / 3006は8 stepの短距離height-map self-shadow、L3 / 3007は6周辺点で各48光源sampleの直射を
再計算し、その輝度積分からveiling glareを加える。従来の係数差比較ではなく、同一sceneに対して
自己遮蔽または計算輝度由来glareという光輸送段階を追加するarchitecture比較である。

| Variant | Port | Shader SHA-256 | Workspace |
| --- | ---: | --- | --- |
| L1 | 3004 | `f052f43feedb51b26cf7ec464a640fe497e4d4973f46c06609289fc4ba99fe7b` | `/tmp/otibo-first-view-p1-threshold-20260716` |
| L2 | 3006 | `7b35062944dbcfdb5c0b11d63b54b7757aab58cfb42eb981208be8e57afeea89` | `/tmp/otibo-first-view-p2-correlated-detail-20260716` |
| L3 | 3007 | `0024769bce811fbbe0d0d900d36fce6e0655b9c740c5fed9f0fb01a555df9263` | `/tmp/otibo-first-view-p3-micro-spark-20260716` |

本線3000のshader / height map SHA-256は
`884848a8c676fa246de7646b2fe47e191fa91bfbceddcf528d6dd897615c44df` /
`48d0637db927bbf1da36db2f80e8a07ec33358fb1344a077a4384797d79b6f5e`で作業前後とも不変。
各variantのheight mapも同じhashで、比較workspaceと本線の`public/first-view`差分は`light.frag`だけ。
旧V4の3008は停止し、L1〜L3の三portだけを比較用に維持している。

Browser QAはdesktop `1280x720`の進捗0 / 約0.501 / 0.740 / 0.870 / 1.000とmobile
`390x844`初期像で実施した。全案status `ready`、横overflowなし、page由来console error / warningなし。
desktopのscroll後単発frameを入力からcapture完了までのwall timeで概測すると`18.89〜32.80 ms`、mobileの
初回readyはL1 / L2 / L3が`832.59 / 902.95 / 893.92 ms`だった。約0.501の1.1秒差captureは各案で
SHA-256が一致し、固定progressの時間非依存を確認した。

debug fieldでは、初期像の三断面で遮蔽edge横断幅が`57 / 56 / 57 px`、影側へ戻る単調性違反は0。
進捗約0.501では`25 / 25 / 26 px`へ狭まり、edgeは約`83〜89 px`上方へ移動した。平均可視率は
`0.541710 → 0.685693`、平均直射fieldは`0.130083 → 0.286854`となり、同じ光源仰角から投影境界、
影の短縮、暗部への回り込みが同時に変わる。L2は直射画素の`3.7356%`にheight-map自己遮蔽が現れた。
L3の直射とglareの相関は`0.868032`で、高直射域 / 低直射域の平均glareは`0.448946 / 0.010632`。

較正上の残差として、L1〜L3は本線3000より単一遮蔽edgeの因果が明瞭で、height map由来の縞・織りを
強く露出する。旧shaderの複数haloや下側の青い加算層は再現していない。初期構図は右上から左下の
対角光帯、上側の寒色影、帯内の暖色、右寄りの最輝部を維持するが、「同じ作品の再照明」としての
最終採否はオーナー比較に委ねる。採用前なのでINV-020を含む正式なintent改訂は行っていない。
