---
title: "QA Verification: First View light shader local foundation"
status: active
draft_status: n/a
qa_status: partial
risk: Medium
qa_schema: 2
created_at: 2026-07-10
updated_at: 2026-07-20
references:
  - "_docs/qa/Site/first-view-light-shader/test-plan.md"
  - "_docs/intent/Site/first-view-light-shader/decision.md"
  - "_docs/plan/Site/first-view-light-shader/plan.md"
  - "_docs/draft/Site/otibo-light-shader-handoff/notes.md"
  - "_docs/reference/Site/visual-canon/reference.md"
  - "_docs/plan/Site/top-page-rebuild/plan.md"
  - "TODO.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/qa/Site/first-view-light-shader/verification.md -->

# QA Verification: `Site-Enhance-14`

## Summary

PoC完了済みの`layered-v5`をServer-rendered First View、Client canvas、standalone WebGL engine、
precomputed height textureへ再構成した。旧Products / About / Contact / Footerを`/`から外し、browser
default marginのないshader-onlyローカル制作基盤として閉じた。この状態はproduction deployしない。
2026-07-17のwhy-first移行ではruntime・数値・test挙動を変えず、既存の検証証跡をDEC / AC /
strict INVへ再分類した。

## Verification Verdict

Verdict: PARTIAL

既存foundationのAC、DEC-001〜DEC-007、strict INVはunit、static review、production artifactの
browser QA、build / dry-runで
確認済み。位相置換25%を母体に3072x6144のmicrostructureを新しい00へ収束し、WQHD / mobileで
操作確認した。DEC-008の見入り持続とページ全体のproduction visual判定が残るためverdictはPARTIALとする。

2026-07-14追記: wordmarkの位置・サイズだけを比較軸として、左上、中央左、右下の操作可能な3案を
同一shader上で比較した。オーナー判断により、小さな暖色低alpha文字を右下の署名として置く案を
current baselineへ採用した。shader本体の値は変更していない。

同日追記: scroll-linked候補として光帯の回転、速度による圧縮、表面残像、入射角変化を操作可能な
別portで比較した。オーナー判断により、同じ表面への入射角を斜光から正面寄りへ持ち上げる現状案を
00 baselineへ採用した。material座標を固定し、光帯幅、凹凸影の残存量、暗部への回り込みだけを
単一のscroll進捗から派生させる。

同日追記: 00の退出時に色の残ったFirst ViewとPrincipleの白い面が同時に見える問題を調整した。
180svhの総区間は維持し、scroll進捗をsticky移動量の前半85%で完了させる。shader終盤は
`--colors-surface`と同じ白へ収束し、残り15%は白だけを保持してからPrincipleへ抜ける。

同日追記: 上記180svhを起点に、線形の総区間を180〜400svh、次に200〜280svh、最後に210 / 230svhで
実操作比較した。オーナー判断により210svhへ収束し、180svhは操作が急、230svh以上は白への移行を
待つ時間が目立つ案として置き換えた。進捗配分は前半85%で完了、残り15%でsurface whiteを保持する
既存方針を変更していない。

同日追記: 終盤の色面から全面白までが一度のscroll入力で切り替わる状態に対し、surface whiteへの
wash開始を進捗0.82から0.74へ前倒しした。白到達点1.00、210svh、前半85% / 白保持15%は維持し、
時間補間は加えていない。進捗0.74から120px送った0.918でも青い外縁と暖色の面が残ることを確認した。

同日追記: 全面白でもwordmarkが残る状態を解消するため、shaderとwordmarkへ同じexit-wash policy値を
渡した。wordmarkは`1 - wash`で薄くなり、進捗0.87ではopacity約0.5、進捗1.00と白保持では0になる。
独立したCSS transitionは加えず、戻しscrollでも同じ位置に同じopacityが復元される。

同日追記: 白飛び面積、厚いグロー、周辺コントラストを別portで比較し、厚いグローを母体に周辺
コントラストだけを加える案へ収束した。狭い白芯、暖色の内側光、低強度haloを別の減衰幅で重ね、
白芯maskの外側だけへtone curveを適用した。広い白飛び案は光帯内部の中間階調を失うため不採用とした。

2026-07-15追記: 1024x2048の00を固定し、3001を生成式とpixel-space mark固定の2048x4096、
3002を1024x2048の微細孔・粒増加、3003を1024x2048の中間粒径層追加として起動した。
全案でshader、drawing buffer、scroll、wordmarkは同一。1505x1289の初期像と480px scroll後に
canvas status `ready`、page由来のconsole warning / errorなしを確認した。比較環境は成立したが、
オーナー選択前のため本線3000は1024x2048のまま維持した。

同日追記: オーナー判断により、解像感が好ましい2048x4096を00 baselineへ採用した。生成式、
pixel-spaceの傷・孔、shader、drawing bufferは比較時のresolution-only条件から変更せず、本線3000の
height mapだけを置き換えた。assetは8,038,333 bytes、SHA-256は
`cbb267ce97a829bf2fc9d89767caddca6872941483f34e3e1e6e5cb1b7d81611`。初期表示と480px scroll後で
canvas status `ready`、page由来のconsole warning / errorなしを再確認した。微細孔・粒と中間粒径は
採用せず、紙・石・布など素材種別の選択は次の比較軸へ分離する。

同日追記: 2048x4096を固定し、3001に短繊維と毛羽の紙、3002に複数粒径と孔の石／漆喰、
3003に縦横の織りと交差部の上下を持つ布を起動した。三案とも色、shader、drawing buffer、scroll、
wordmarkは同一で、素材差はheight mapだけに限定した。desktop `1520x1289`の初期像とscrollY `480`、
mobile `390x844`の初期像でcanvas status `ready`、page由来のconsole warning / errorなしを確認した。
3000のasset SHA-256は`cbb267ce97a829bf2fc9d89767caddca6872941483f34e3e1e6e5cb1b7d81611`
から変化していない。三案は素材族として判別可能だが、採用判断は未実施のため本線へ収束しない。

同日追記: 初回feedbackを受け、3001を繊維束がパルプへ埋まる紙v2、3002をrim付き円形孔のない石v2、
3003を保持した布、3004を連続した粒状面の砂、3005を個々の礫が隆起する砂利として再起動した。
すべて2048x4096の8-bit grayscale PNGで、shader hashは3000〜3005で同一。desktop `1280x720`の
初期像とscrollY `480`で全案がcanvas status `ready`を維持し、page由来のconsole warning / errorと
framework overlayはなかった。石v2 / 砂利はgeneratorからrim付きpitを除き、browserでも暗い中心を
明るい縁が囲う円形孔の反復を認めなかった。mobile `390x844`でも石v2 / 砂利はready、横overflowなし。
3000と3003のasset hashは変更していない。比較環境はPASSだが、素材選択は未実施である。

2026-07-16追記: 固定scroll位置でも残っていた時間driftを廃止した。shaderから`u_time`を除き、光帯
輪郭、edge noise、material座標、grainをscroll位置とviewportだけで決まる値へ固定した。engineは
初期化・scroll・resize・context復帰時に一枚だけ描画し、描画後に次frameを再帰予約しない。
3000〜3005のdesktop `1280x720`で1.1秒差のscreenshot SHA-256と`renderCount`が全案一致した。
3005ではscrollY `0 → 480`で`renderCount 2 → 3`、scroll progress `0.000 → 0.713`へ更新され、
その後1.5秒のcaptureとcountは再び一致した。mobile `390x844`も固定位置で静止し、横overflowなし。

同日追記: 現在3001 / 3003 / 3004で表示している紙v2・布・砂の2048x4096 assetを入力として、
布60%・紙v2 10%・砂30%のblendを追加した。3006は布の全帯域、砂の中高周波、紙の高周波を
RMS正規化後に合成し、3007は同じheight pixelを直接加重平均した。入力hashとshader hashは両案で
一致し、出力hashは3006が`3a88acf77f23f886ee19541a54f88dcef995faf357c1350cb56d80530028f325`、
3007が`88347ea162e9472637146d6a276dbc52c85ef1e637e0566c247a6b043cfad07f`。再生成hashも一致した。
desktop `1280x720`の初期像とscrollY `480`、mobile `390x844`の初期像で両案がready、横overflowなし。
固定位置の1.1秒差captureは両案で一致し、scroll時だけrender countが`2 → 3`へ更新された。

同日追記: 「解像感 / 情報量はあるが、何であるかを同定できない」状態を目的として3008を追加した。
同じ三入力から低・中・高周波を分け、布の格子と紙の長繊維は複数のaffine方向で交差させ、砂は
中高周波の粒度として再配置した。height mapの標準偏差は0.167799、隣接pixel差はx=0.122604、
y=0.127090で、純加重平均3007のx=0.051619、y=0.047468を上回る。単一方向の周期は支配しない。
出力SHA-256は`5f810909da057e1412a9f143b280927b1e4486cd5e1e19f95b09c15d53f55b1d`で再生成一致。
desktop `1280x720`の初期像とscrollY `480`、mobile `390x844`でready、横overflowなし、page由来の
warning / errorなし。固定位置の1.1秒差captureは一致し、scroll時だけrender countが`2 → 3`になった。

同日追記: 3006の周波数分担を強めた3009を追加した。布はradius 18の低周波、砂はradius 2〜18の
中周波、紙v2はradius 1未満の高周波へ限定し、各信号をRMS正規化して0.6 / 0.1 / 0.3で合成した。
出力分散は3006と同じ0.165で、height mapの標準偏差は3006の0.164593に対し3009は0.164797。
filterは周期境界で畳み込み、初稿で発生した反復位置の縦の継ぎ目を除いた。出力SHA-256は
`2d2574eae859921c937d33a451330ed0bcb549c349bf6420f23e59dc2cd4646c`で、3回の生成結果が一致した。
shader SHA-256は3006と同じ`a370f53c71b9b425d54a4e0115c0d4e89565e0ae24a108d8c8bd9c4d167cd502`。
現generatorで3006〜3008も再生成し、既存の三つの出力SHA-256が変更されていないことを確認した。
desktop `1280x720`の初期像とscrollY `480`、mobile `390x844`でready、横overflowなし、反復位置の
継ぎ目なし。固定位置の1.1秒差captureは一致し、scroll時だけrender countが`2 → 3`になった。

同日追記: オーナー判断により3009を新しい00 baselineとして3000へ収束した。canonical generatorは
布・紙v2・砂を内部生成し、周期境界filter、RMS正規化、0.6 / 0.1 / 0.3比率、出力分散0.165までを
一時assetなしで再現する。再実行後の2048x4096 PNGは7,732,371 bytes、SHA-256は3009と同じ
`2d2574eae859921c937d33a451330ed0bcb549c349bf6420f23e59dc2cd4646c`。3001には元の布
`10fc2856b8365e01af68f7f4775de55b117ff1d97e02eb3ffffb8cb05af511b8`、3002には新baselineを残し、
3000〜3002のshaderは同じ`a370f53c71b9b425d54a4e0115c0d4e89565e0ae24a108d8c8bd9c4d167cd502`。
active listenerは3000 / 3001 / 3002だけで、他variant directoryは削除せず`/tmp`内へ退避した。
desktopの3000 / 3002 captureは完全一致し、3001だけが布として異なる。固定位置1.2秒差captureも
一致し、480px scroll時だけrender countが`2 → 3`へ更新された。mobile `390x844`はreadyで横overflow
なし、3000〜3002のpage由来warning / errorもなかった。

同日追記: 新baselineに残る布の位相連続性を一軸比較するため、3003〜3005へ等方carrier置換率
25% / 45% / 60%の3案を追加した。各案は2048x4096、0.6 / 0.1 / 0.3帯域配分、RMS正規化、
出力分散0.165、shader、scroll、wordmarkを共有する。SHA-256は順に
`900b6527353b75dc813c1e2305594bd067cb99c209ea9ee7b475fb7544674ed1`、
`0c88fe592c7b8d7ce35b93de52f7d2a6e28282a5cde4e370afa97bcf1c0fe2b0`、
`3c5868be029b830a9bc4625b0deb4729598da1f66b3ab8cc0f82a818429f3f5c`で、再生成結果が一致した。
標準偏差は0.164745 / 0.164614 / 0.164544、3000のhashは不変、3000〜3005はHTTP 200、
全portのshader hashも一致する。初稿の68% / 90%はshader上で微細応答を失ったため採用せず、
最終比較範囲を60%以下へ狭めた。最終値への更新後にin-app Browser接続が切れたため、desktop / mobile
の最終captureとscroll interactionは未確認として残す。

同日追記: オーナー判断により位相置換25%を新しい00として3000へ収束した。canonical generatorの
2048x4096出力は旧3003と同じSHA-256
`900b6527353b75dc813c1e2305594bd067cb99c209ea9ee7b475fb7544674ed1`で、2回の再生成結果も一致した。
3001は元のcloth hash`10fc2856b8365e01af68f7f4775de55b117ff1d97e02eb3ffffb8cb05af511b8`を保持する。
3002は同じbaselineへ2〜4px帯の周期的な微細凹凸を加え、3003はbaseline height mapを変えず、
白芯を避けた静的な画面空間粒子をtone mapping後へ加えた。3002のasset SHA-256は
`403b3f32dd367fac9cdbd22dd17c3fd976d8922806458f33d4d7bccdd8c7ce28`。3000 / 3002のshader hash、
3000 / 3003のheight-map hashはそれぞれ一致する。desktop `1280x720`とmobile `390x844`で全案ready、
横overflowとpage由来errorなし。scrollY `0 → 480`でrender countと進捗が更新され、固定後は停止した。
3003はscrollY `600`でexit wash `0.622`、`700`でwash `1.000`、wordmark opacity `0`となり粒子も白へ
消える。3004 / 3005は停止し、active comparisonを3000〜3003へ整理した。

同日追記: 2048x4096、3072x6144、4096x8192を同じgenerator、shader、texel基準の法線・曲率、
R8 uploadで比較し、オーナー判断により3072x6144を3000へ収束した。canonical PNGは17,364,753 bytes、
SHA-256は`48d0637db927bbf1da36db2f80e8a07ec33358fb1344a077a4384797d79b6f5e`で、`--force`による
再生成結果とbyte一致した。runtimeはR8 / RED / UNSIGNED_BYTEでuploadし、GPU常駐量は18 MiB。
4096x8192案はR8で32 MiBかつPNG 30,778,657 bytesとなり、Cloudflare Workersの単一asset 25 MiB上限を
超えてdry-runが失敗した。3072版は495 assetsのdry-runを完了した。WQHD `2560x1440`では固定位置1.1秒で
`renderCount 4`のまま、scrollY `0 → 620`で進捗`0.000 → 0.460`、count `4 → 5`へ更新した。
mobile `390x844`もready、横overflowなし、scrollY `0 → 340`で進捗`0.000 → 0.431`、count `2 → 3`。
page由来warning / errorはない。

## Commands Run

2026-07-17 why-first migration closure:

```text
DD_SCOPE_PATHS=... deno run --allow-read --allow-env --allow-run=git scripts/validate-frontmatter.mjs
DD_SCOPE_PATHS=... deno run --allow-read --allow-env --allow-run=git scripts/validate-intent.mjs
DD_SCOPE_PATHS=... deno run --allow-read --allow-env --allow-run=git scripts/validate-doc-links.mjs
DD_SCOPE_PATHS=... deno run --allow-read --allow-env --allow-run=git scripts/validate-qa.mjs
node --check scripts/generate-light-height-map.mjs
node --check scripts/blend-light-height-maps.mjs
deno fmt --check scripts/generate-light-height-map.mjs scripts/blend-light-height-maps.mjs
npm test -- --run app/_components/first-view/light-policy.test.ts app/_components/first-view/light-engine.test.ts
git diff --check -- <owned paths>
./scripts/check-docs.sh # FAIL: out-of-scope App/workers-static-export-next16 intent is missing Rollback / Follow-ups
```

```text
node --check scripts/blend-light-height-maps.mjs
deno fmt --check scripts/blend-light-height-maps.mjs
generate frequency / average blend assets twice and compare SHA-256
generate feature-neutral blend asset twice and compare SHA-256
generate strong-frequency blend asset three times and compare SHA-256
generate phase-soft / phase-medium / phase-strong assets twice and compare SHA-256
generate canonical phase-soft and phase-particle assets twice and compare SHA-256
identify / ImageMagick statistics for source and blend assets
compare x/y adjacent-pixel difference for 3006 / 3007 / 3008 / 3009
sha256sum the 3006 / 3007 / 3008 / 3009 shader and height-map assets
curl http://127.0.0.1:3006..3009/
browser QA at 1280x720 for 3006 / 3007 at scrollY 0 / 480 and fixed-position stability
browser QA at 390x844 for 3006 / 3007 initial render and horizontal overflow
browser QA at 1280x720 and 390x844 for 3008 initial / scroll / fixed-position stability
browser QA at 1280x720 and 390x844 for 3009 initial / scroll / fixed-position stability
npx biome check app/_components/first-view/light-engine.ts app/_components/first-view/light-policy.ts app/_components/first-view/light-policy.test.ts
npm run typecheck
npm test
rg -n "u_time|elapsedSeconds|lastFrameTime|shouldRunLightAnimation|time \\*|materialUv = uv \\+" app/_components/first-view public/first-view/light.frag
sha256sum the 3000..3005 shader assets
browser QA at 1280x720 for 3000..3005 fixed-position renderCount and screenshot hash
browser QA at 1280x720 for 3005 scrollY 0 / 480 and post-scroll fixed-position stability
browser QA at 390x844 for 3005 fixed-position stability and horizontal overflow
browser QA at 1280x720 for 3000..3003 initial render, scrollY 480, fixed-position stability, and exit wash
browser QA at 390x844 for 3002 / 3003 initial render and horizontal overflow
npm run build
npm run deploy:dry-run
sha256sum public/first-view/light-height-map.png
git diff --check
npm run assets:first-view
npm run lint
npm run typecheck
npm test
npm run build
npm run deploy:dry-run
npm start
browser QA at 1440x900 and 390x844
browser QA with prefers-reduced-motion: reduce
browser QA with ?light-debug=material|light|fallback
browser QA with WEBGL_lose_context
computed style / DOM inspection for shader-only baseline
npx biome check app/_components/first-view/first-view.module.css
npm run typecheck
npm test -- --run
scoped front-matter / TODO / doc-link / QA validators
curl http://127.0.0.1:3000/
git diff --check
npx biome check app/page.tsx app/page.module.css app/_components/first-view/light-engine.ts app/_components/first-view/light-policy.ts app/_components/first-view/light-policy.test.ts
npm run typecheck
npm test
browser QA at 1280x720 and 390x844 for scroll progress 0 / mid / 1
browser QA at 1280x720 for color stage / surface white hold / Principle entry
npx biome check app/page.module.css
npm run typecheck
npm test
scoped front-matter / TODO / doc-link / QA validators
browser QA at 1280x720 for the 210svh start / mid / white / hold / sticky-release boundaries
curl http://127.0.0.1:3000/
git diff --check
npm run typecheck
npm test
browser QA at 1280x720 for progress 0.74 / +120px / 0.87 / 1.00 / white hold
npx biome check app/_components/first-view/first-view.module.css app/_components/first-view/light-engine.ts app/_components/first-view/light-policy.ts app/_components/first-view/light-policy.test.ts
npm run typecheck
npm test
git diff --check
browser QA at 1280x720 for wordmark opacity at progress 0 / 0.74 / 0.87 / 1.00 / hold / reverse
npm run typecheck
npm test -- --run
git diff --check
browser QA at desktop and 390x844 for luminance progress 0 / 0.505 / 0.74 / 0.87 / 1.00
generate 1024x2048 baseline / micro-detail / multiscale assets and 2048x4096 resolution-only asset
file / stat / sha256sum public/first-view/light-height-map.png for all four variants
curl http://127.0.0.1:3000..3003/ and each height-map asset
browser QA at 1505x1289 for 3000..3003 at scrollY 0 / 480
adopt 2048x4096 resolution-only asset on 3000 and stop 3001..3003
node --check scripts/generate-light-height-map.mjs
npm test
npm run build
npm run deploy:dry-run
file / stat / sha256sum public/first-view/light-height-map.png
curl http://127.0.0.1:3000/first-view/light-height-map.png | sha256sum
scoped front-matter / TODO / doc-link / QA validators
./scripts/check-docs.sh # FAIL: pre-existing App verification residual-risk findings x3
git diff --check
node scripts/generate-light-height-map.mjs --material paper --output /tmp/otibo-material-paper-20260715/public/first-view/light-height-map.png
node scripts/generate-light-height-map.mjs --material stone --output /tmp/otibo-material-stone-20260715/public/first-view/light-height-map.png
node scripts/generate-light-height-map.mjs --material cloth --output /tmp/otibo-material-cloth-20260715/public/first-view/light-height-map.png
file / sha256sum the paper / stone / cloth assets
sha256sum the 3000..3003 shader and height-map assets
curl http://127.0.0.1:3000..3003/ and each height-map asset
deno fmt --check scripts/*.mjs
node --check scripts/generate-light-height-map.mjs
npm run typecheck
npm test
npm run build
npm run deploy:dry-run
browser QA at 1520x1289 for 3001..3003 at scrollY 0 / 480
browser QA at 390x844 for 3001..3003 at scrollY 0
generate paper v2 / stone v2 / sand / gravel assets at 2048x4096
file / stat / sha256sum the 3000..3005 height-map and shader assets
curl http://127.0.0.1:3000..3005/ and each height-map asset
deno fmt --check scripts/*.mjs
node --check scripts/generate-light-height-map.mjs
npm run typecheck
npm test
npm run build
npm run deploy:dry-run
browser QA at 1280x720 for 3001..3005 at scrollY 0 / 480
browser QA at 390x844 for stone v2 / gravel at scrollY 0
node --check scripts/generate-light-height-map.mjs
deno fmt --check scripts/generate-light-height-map.mjs scripts/blend-light-height-maps.mjs
npm run assets:first-view
file / stat / sha256sum the canonical, cloth, and strong-frequency assets
sha256sum the 3000 / 3001 / 3002 shader assets
ss -ltnp for ports 3000..3009
npm run typecheck
npm test
npm run build
npm run deploy:dry-run
npm run lint
DD_SCOPE_PATHS=... deno run ... scripts/validate-frontmatter.mjs
deno run --allow-read scripts/validate-todo.mjs
DD_SCOPE_PATHS=... deno run ... scripts/validate-doc-links.mjs
DD_SCOPE_PATHS=... deno run ... scripts/validate-qa.mjs
./scripts/check-docs.sh # FAIL: pre-existing App verification residual-risk findings x3
git diff --check
browser QA for 3000 / 3001 / 3002 at 1042x958, 390x844 mobile, fixed-position and scroll-only rendering
node --check scripts/generate-light-height-map.mjs
node scripts/generate-light-height-map.mjs --material baseline --width 3072 --height 6144 --output /tmp/otibo-canonical-3072x6144-verification.png --force
cmp and sha256sum canonical 3072 asset against regenerated output
identify public/first-view/light-height-map.png
npx biome check app/_components/first-view/light-engine.ts app/_components/first-view/light-engine.test.ts
npm run lint
npm run typecheck
npm test -- --run
npm run build
npm run deploy:dry-run
browser QA for 3000 at 2560x1440 and 390x844, fixed-position stability and scroll-only rendering
```

## Automated Test Results

- Vitest: diagnostic boundary、scroll進捗、reduced motion固定、wash / wordmark同期、R8容量契約の19 tests PASS。
- Height map baseline: canonical generatorからstrong-frequency blendの`2048x4096`、7,732,371 bytesのPNGを再生成。
- Height map comparison: 1024x2048 baseline、2048x4096 resolution-only、1024x2048のmicro / multiscaleを
  比較し、resolution-only条件を本線へ採用。各HTTP取得hashは生成assetと一致。
- Material variants: paper 7,229,174 bytes、stone 7,710,240 bytes、cloth 7,387,262 bytes。すべて
  2048x4096の8-bit grayscale PNGで、HTTP取得hashは生成assetと一致。
- Material variants round 2: paper v2 6,964,355 bytes、stone v2 7,770,294 bytes、cloth
  7,387,262 bytes、sand 7,532,216 bytes、gravel 4,359,257 bytes。すべて2048x4096の8-bit
  grayscale PNGで、HTTP取得hashは生成assetと一致。3000とclothのhashは初回比較から不変。
- Material blend variants: 3006の周波数分担は標準偏差0.164593、3007の純加重平均は0.109601。
  両案とも同じ三入力と0.6 / 0.1 / 0.3比率を使い、2回の生成hashが一致した。
- Feature-neutral variant: 3008は標準偏差0.167799、隣接pixel差x=0.122604 / y=0.127090で、
  3007より局所変動を保つ。2回の生成hashは一致した。
- Strong-frequency variant: 3009は標準偏差0.164797で3006の0.164593と同等。布・砂・紙v2を
  低・中・高周波へ限定し、周期境界filterで継ぎ目を除いた。3回の生成hashが一致し、3006〜3008の
  再生成hashも従来値を維持した。
- Baseline convergence: canonical outputと3009のSHA-256は
  `2d2574eae859921c937d33a451330ed0bcb549c349bf6420f23e59dc2cd4646c`で一致。3001はcloth hashを
  保ち、3000 / 3001 / 3002だけがlistenしている。
- Phase replacement variants: 3003〜3005は2048x4096、標準偏差0.164745 / 0.164614 / 0.164544。
  2回の生成SHA-256が一致し、3000のcanonical hashと全portのshader hashは不変。HTTP 200を確認。
- Particle convergence: canonical 3000は位相置換25%を旧3003と同じSHA-256で再生成する。3001はcloth、
  3002はheight-map微粒子、3003はpost-shader微粒子で、3000〜3003だけがlistenしている。
- 3072 convergence: canonical 3000は3072x6144、17,364,753 bytes、SHA-256
  `48d0637db927bbf1da36db2f80e8a07ec33358fb1344a077a4384797d79b6f5e`。明示再生成とbyte一致し、
  texel基準の法線・曲率、R8 / RED upload、18 MiBのGPU常駐量をunit / browserで確認した。
- Biome / TypeScript / Next.js build / Wrangler dry-run: PASS。
- static build: `/`と法務6 route、`/_not-found`をstatic prerender。
- Wrangler dry-run:495 assets、`No bindings found`、exit 0。

## Manual QA Results

- 通常 / reduced motionとも固定scroll位置では時間変化なし。通常時はscroll入力時だけ入射角を更新し、
  reduced motionはscroll進捗を0へ固定する。
- 3000〜3005で1.1秒差のrender countとscreenshot SHA-256が一致。3005はscroll時だけcountとhashが変化し、停止後は再び一致。
- 3006 / 3007は初期像とscrollY 480で差を比較でき、固定位置では1.1秒差のcaptureが一致した。
- 3008は初期像とscrollY 480で単一素材の特徴が支配せず、固定位置では1.1秒差のcaptureが一致した。
- 3009は初期像とscrollY 480で低・中・高周波の階層を比較でき、固定位置では1.1秒差のcaptureが
  一致した。desktop / mobileとも反復位置の継ぎ目と横overflowはない。
- 3000 / 3002の1042x958初期captureはSHA-256まで一致し、3001だけが布として異なる。3000の固定位置
  1.2秒差captureは一致し、480px scroll時だけrender countが`2 → 3`へ更新された。390x844でもready、
  横overflowなし、3000〜3002のpage由来warning / errorなし。
- 3002 / 3003はdesktop初期像とscrollY 480、mobile 390x844でready。3002は高さ場内で光へ応答する
  微粒子、3003は画面空間に固定した粒子として分離できる。固定位置の時間差captureは一致し、3003は
  exit wash 1.000で粒子とwordmarkが白へ消える。page由来errorとframework overlayはない。
- 3072版3000はWQHD `2560x1440`とmobile `390x844`でready。WQHDの固定位置1.1秒ではcount不変、
  620px scroll時だけ進捗`0.460`とcount `5`へ更新した。mobileも横overflowなしで340px scroll時だけ更新した。
- forced fallback: canvas opacity `0`、`otibo` visible、status `forced-fallback`。
- material / light diagnostic: screenshot hashが異なり、named contributionを区別できた。
- context loss / restore: `ready → context-lost → ready`を確認。
- 1440x900 shader-only artifact:
  - body margin `0px`、document `1440x900`、First View rect `[0, 0, 1440, 900]`。
  - `main`の子は1、直下sectionは1、見出しは`otibo`だけ、canvas status `ready`。
- 390x844 shader-only artifact:
  - body margin `0px`、document `390x844`、First View rect `[0, 0, 390, 844]`。
  - `main`の子は1、見出しは`otibo`だけ、canvas status `ready`。
- Workers local artifact由来のbrowser console error / warningなし。
- 2026-07-14のinteractive variant比較で、オーナーが右下案をwordmark baselineとして採用。
- 変更後の本線は`127.0.0.1:3000`でHTTP 200。比較用の3001 / 3002は停止済み。
- scroll-linked 00 baselineは本線`127.0.0.1:3000`へ収束し、比較用3001〜3004を停止した。
- desktop `1280x720`: 進捗`0.521`でsection top `0`、Principle top `996`、下流content非表示。
- desktop退出境界: scrollY `570` / 進捗`0.990`ではPrinciple top `726`で非表示、scrollY `580` /
  進捗`1.000`でtop `716`となり、First Viewと同時に移動を開始した。
- mobile `390x844`: scrollY `340` / 進捗`0.504`でsection高`844`、top `0`、Principle top
  `1179.1875`、下流content非表示。page由来のconsole errorなし。
- white exit調整後のdesktop `1280x720`: scrollY `430` / 進捗`0.878`では光の色と質感が残り、
  scrollY `500` / 進捗`1.000`で全面白、Principle top `796`で非表示。
- scrollY `570`でも進捗`1.000`の白を保持し、Principle top `726`で非表示。scrollY `580`で
  First View top `-4`、Principle top `716`となり同じ白面のまま入れ替わりを開始。console errorなし。
- 210svh収束後のdesktop `1280x720`: 親区間は`1512px`、First View sectionは`720px`。
- scrollY `337` / 進捗`0.501`でPrinciple top `1175px`、照明変化だけが表示される。
- scrollY `674`で進捗`1.000`、Principle top `838px`となり、viewport内はsurface whiteだけになる。
- scrollY `750`でも進捗`1.000`とsurface whiteを保持し、Principle top `762px`で非表示。
- sticky解除境界のscrollY `792`ではPrinciple top `720px`でviewport直下にあり、色の残ったFirst Viewと
  同時表示されない。page由来のconsole errorなし。
- wash分散後のdesktop `1280x720`: scrollY `498` / 進捗`0.740`を開始点とし、120px送ったscrollY
  `618` / 進捗`0.918`でも青い外縁と暖色の面が残り、全面白へ切り替わらない。
- scrollY `586` / 進捗`0.870`で中間wash、scrollY `674` / 進捗`1.000`で全面白となる。
- scrollY `750`でも進捗`1.000`の白を保持し、Principle top `762px`で非表示。console errorなし。
- wordmark fade後のdesktop `1280x720`: 進捗`0.000`と`0.740`でcomputed opacity `1`、進捗
  `0.870` / wash `0.503`でopacity `0.4973`、進捗`1.000`と白保持でopacity `0`。
- 白保持から進捗`0.870`へ戻すとopacity `0.4973`へ復元し、scroll位置との決定的な対応を確認。
- 輝度分布収束後もdesktop / 390x844でshader status `ready`。進捗`0.505`ではexit wash `0`を保ち、
  狭い白芯から暖色層、halo、青緑の周辺まで中間階調が残る。
- material detail比較は旧中間スケール案を置き換え、3001を微細法線、3002を微細鏡面、3003を
  複合粒径、3004を微細孔として起動した。desktopの初期像と進捗0.505、390x844の初期像でstatus
  `ready`を確認し、局所的な焦点は加えず、3000の基準は未変更。
- 2026-07-15の再比較は3000を1024x2048 baseline、3001を2048x4096 resolution-only、3002を
  微細孔・粒、3003を中間粒径とした。全案で初期表示と480px scroll後のcanvas status `ready`、
  同一の1505x1289 drawing buffer、page由来のconsole warning / errorなしを確認。
- オーナー選択後は2048x4096 resolution-only条件を本線3000へ収束した。初期表示と480px scroll後の
  canvas status `ready`を再確認し、素材種別を示す追加detailは加えていない。
- 収束後は3000だけがHTTP 200を返し、比較用3001〜3003は停止している。
- 素材比較では3001を紙、3002を石／漆喰、3003を布として再起動した。紙は不規則な短繊維、
  石／漆喰は強い孔と粒、布は規則性を崩した縦横の織りとして初期像から区別できる。
- 三案ともdesktopでscrollY `0 → 480`後もcanvas status `ready`。mobile `390x844`でもreadyを保ち、
  布の織りに表示破綻や顕著なモアレは見られない。page由来のconsole warning / errorなし。
- 第二ラウンドの3001〜3005はdesktop `1280x720`でscrollY `0 → 480`後もcanvas status `ready`。
  砂は連続した微粒状面、砂利は輪郭を持つ個々の礫として区別できる。石v2と砂利にrim付き円形孔の
  反復はなく、stone v2 / gravelのmobile `390x844`でも横overflowとframework overlayはない。

## Acceptance Criteria Coverage

- AC-001: PASS — First Viewは光と`otibo`のみでbaselineの光層を維持。
- AC-002: PASS — development buildのnamed diagnostic 3種とforced fallbackを確認。
- AC-003: PASS — 1440x900 / 390x844の寸法と視覚比較を記録。
- AC-004: PASS — policy unit test、全modeのevent-driven scheduling、reduced / visibility lifecycleのstatic review。
- AC-005: PASS — WebGL2 null / compile / linkは同じfallback契約へ接続し、forced fallbackと実context loss / restoreをbrowser確認。
- AC-006: PASS — SSR heading / CSS fallbackとprecomputed assetを確認し、runtime procedural generationなし。
- AC-007: PASS — body margin 0、documentとviewport寸法一致、白枠なし。
- AC-008: PASS — `/`はFirst View一つ。local-only / no-deploy境界をPlan・Intent・TODOへ記録。
- AC-009: PASS — static exportとWorkers dry-run成功。本番deployは未実施。
- AC-010: PASS — 進捗0 / 中間 / 1で同じ表面を維持し、光帯の拡張、影の短縮、面への回り込みを確認。
- AC-011: PASS — desktop / mobileのsticky境界と、unit testによるreduced motion進捗0固定を確認。
- AC-012: PASS — 210svh親区間の前半85%で進捗が完了し、surface whiteを保持後にPrincipleが入る。
- AC-013: PASS — wash開始点から120px送った進捗0.918でも色と表面が残り、進捗1.00で全面白になる。
- AC-014: PASS — wordmarkはwash開始までopacity 1を保ち、中間で薄くなり、全面白と白保持で0になる。
- AC-015: PASS — 多段haloと白芯外のtone curveを本線へ統合し、広い白飛びを再導入していない。
- AC-016: PASS — 光、scroll、wordmarkを共有したまま、微細法線 / 微細鏡面 / 複合粒径 / 微細孔を別portで比較できる。
- AC-017: PASS — 生成式とpixel-space markを固定して比較し、選択された2048x4096を本線3000へ採用した。
- AC-018: PASS — 紙、石／漆喰、布を同じ2048x4096と光学条件で起動し、表面起伏だけから判別できる。
- AC-019: PASS — 紙v2、孔のない石v2、布、砂、砂利を同じ光学条件で起動し、砂と砂利を連続面／個体として判別できる。
- AC-020: PASS — 3000〜3005の固定位置で時間差captureとrender countが一致し、3005はscroll時だけ更新された。
- AC-021: PASS — 同じ布・紙v2・砂と0.6 / 0.1 / 0.3比率から、3006の周波数分担と3007の純加重平均を比較できる。
- AC-022: PASS — 3008は3007より高い隣接pixel差を持ち、布の単一格子、紙の長繊維、砂の均質粒が支配しない第三案として表示できる。
- AC-023: PASS — 3009は3006と同じ入力・比率・出力分散・shaderを使い、布・砂・紙v2を低・中・高周波へ限定した強い分担として表示できる。
- AC-024: PASS — 3009を3000へ採用し、3001の布と3002の新baselineだけをactive comparisonとして残した。
- AC-025: PASS — 25% / 45% / 60%を同条件で比較し、オーナー判断により25%を新しい00へ収束した。
- AC-026: PASS — 3000の位相置換25%、3001の布、3002のheight-map微粒子、3003のpost-shader微粒子をdesktop / mobileで操作比較できる。
- AC-027: PASS — 3072x6144をWQHD比較後に3000へ採用し、R8常駐18 MiBと単一PNG 25 MiB未満を維持した。
- AC-028: PASS — 光路距離`t`の弱・強勾配をshader-only variantとして比較し、オーナー判断で不採用として閉じた。
- AC-029: PASS — 強幾何と中間応答を2係数差で比較し、光路距離軸とともに不採用として閉じた。
- AC-030: PASS — 大気参加と境界細部圧縮を同じ`t`へ接続して比較し、奥行き・見入りに寄与しないと確認した。
- AC-031: PASS — P1〜P3の差分境界、定量条件、固定進捗の決定性、30秒比較readinessを確認した。
- AC-032: PASS — dynamic range四案の差分境界、ROI、決定性、desktop / mobile比較readinessを確認し、不採用として閉じた。
- AC-033: PASS — L1〜L3のscene共有、決定的sample、物理field、desktop / mobile比較readinessを確認した。本線採用は未実施。

## Decision Conformance

| ID | Result | Why the implementation remains aligned |
| --- | --- | --- |
| DEC-001 | PASS | 通常DOMは光、fallback、canvas、`otibo`に限定され、diagnosticは開発opt-in、shader-only状態はno-deployとして記録されている。 |
| DEC-002 | PASS | `u_time`と再帰frame loopを持たず、固定進捗captureとrender countが一致し、入力イベント時だけ単発描画する。 |
| DEC-003 | PASS | Server-rendered fallback、precomputed asset、Client canvas境界、failure lifecycle、static build / dry-runを確認した。 |
| DEC-004 | PASS | `materialUv = uv`を維持し、scroll進捗から入射角、光帯、影、回り込みを導く。 |
| DEC-005 | PASS | surface white、white hold、wordmark opacityは同じscroll policyへ接続され、独立した時間transitionを持たない。 |
| DEC-006 | PASS | 多段の光階調と非物体的material detailを維持し、比較案の孤立形状・広い白芯・完全な黒をreviewした。 |
| DEC-007 | PASS | canonical 3072x6144 assetの決定的再生成、texel基準の法線・曲率、`R8` / `RED` upload、配信上限を確認した。 |
| DEC-008 | PARTIAL | P1〜P3、dynamic range、L1〜L3の比較readinessは確認したが、見入りの持続を満たす本線採用とページ全体評価は未完了である。 |

## Invariant Coverage

- INV-003: PASS — production buildはquery diagnosticを無効化し、visible controlなし。
- INV-005: PASS — WebGL2 null / compile / link、forced fallback、実context loss / restoreでfallbackと`otibo`を確認。
- INV-008: PASS — static exportとasset-only Wrangler dry-run / local deliveryを確認。
- INV-009: PASS — shader-only stateをproduction deployしないとTODO / Plan / Intentへ記録。
- INV-016: PASS — `resolveLightScrollProgress`はreduced motion時に常に0を返す。

## Legacy Invariant Coverage (historical)

以下はschema v1時点のcoverageを証跡として保持したもので、現行のactive invariantではない。
INV-022とINV-029は後続baselineによりsuperseded、INV-033は光路距離軸の不採用によりobsoleteである。

- INV-001: PASS — First View DOMはfallback、canvas、`h1`のみ。
- INV-002: PASS — baseline shader contributionとbounded rangeを維持。
- INV-003: PASS — production buildはquery diagnosticを無効化し、visible controlなし。
- INV-004: PASS — reduced motion進捗0のpure policy testと、visibility / context lifecycle review。
- INV-005: PASS — AC-005と同じ。
- INV-006: PASS — precomputed assetとServer-rendered fallbackを確認。
- INV-007: PASS — pageはServer Component、canvas lifecycleだけclient boundary。
- INV-008: PASS — static exportとasset-only Wrangler dry-run / local deliveryを確認。
- INV-009: PASS — shader-only stateをproduction deployしないとTODO / Plan / Intentへ記録。
- INV-010: PASS — 旧下流sectionをDOMと`app/page.tsx`から外し、`Site-Feat-17`へ分離。
- INV-011: PASS — global resetとcomputed style / rectでfull-viewport表示を確認。
- INV-012: PASS — 右下の小さなwordmarkを署名として採用し、shader値を同時に変更していない。
- INV-013: PASS — `materialUv = uv`でscroll項と時間driftを持たず、scrollは入射角uniformだけへ入る。
- INV-014: PASS — `u_scroll_progress`から入射角、光帯幅、影の残存量、正面fillを派生。
- INV-015: PASS — 210svhのdesktop section / content rectと`resolveLightScrollProgress` unit testで確認。
- INV-016: PASS — `resolveLightScrollProgress`はreduced motion時に常に0を返す。
- INV-017: PASS — unit testで85%完了後の値1固定、browserでscrollY 674〜792の全面白保持を確認。
- INV-018: PASS — `light.frag`はwashを進捗0.74〜1.00へ単調に分散し、engineに遅延追従を加えていない。
- INV-019: PASS — shaderとCSSは同じpolicy由来のwash値を共有し、wordmarkは`1 - wash`で同期する。
- INV-020: PASS — `opticalCoreMask`で白芯をtone curveから除外し、進捗0 / 0.505でhalo階調を確認。
- INV-021: PASS — 全案の高周波成分は画面全域へ分布し、局所的な焦点や大きな模様へ集約していない。
- INV-022: PASS — 本線3000は2048x4096 assetを使い、shader、drawing buffer、生成式、pixel-space markを
  比較時から変更せず、素材種別の追加表現も含まない。
- INV-023: PASS — 3000のasset hashとshaderを維持し、三案の差を2048x4096 height mapだけに限定した。
- INV-024: PASS — 3000と布のhashを保持し、石v2 / 砂利にrim付き円形孔を使わず、全案のshaderを同一にした。
- INV-025: PASS — `u_time`と再帰frameを除き、全portの固定位置でcount / capture一致、scroll時の単発更新を確認した。
- INV-026: PASS — 3006 / 3007は入力asset・比率・解像度・shaderを共有し、blend方式だけを変更した。
- INV-027: PASS — 3008は同じ三入力と表示条件を使い、複数方向への特徴再配置で局所detailを維持した。
- INV-028: PASS — 3009は3006と入力・比率・出力分散・shaderを共有し、通過帯域だけを狭めた。周期境界filterにより反復位置へ継ぎ目を作らない。
- INV-029: PASS — canonical generatorの再実行結果は3009と同じSHA-256で、3000 / 3002のassetと表示も一致した。3001は元のcloth hashを保持し、他比較portはinactiveである。
- INV-030: PASS — 3案は同じ帯域配分・分散・解像度・shaderを共有し、固定seedの周期carrierで決定的に再生成できる。3000 hashは不変。
- INV-031: PASS — canonical再生成hashとcloth hashを保持し、3002はassetだけ、3003はshaderだけが異なる。固定位置で静止し、exit washで粒子が消える。
- INV-032: PASS — 3072x6144のcanonical再生成hashが一致し、runtimeはtexel基準の法線・曲率とR8 / RED uploadを使用する。Workers dry-runも成功した。
- INV-033: PASS at comparison time / OBSOLETE — 大気参加と境界細部圧縮の同軸比較証跡は後続の2026-07-16 sectionに保持し、光路距離軸自体は不採用とした。

## Deferred / Not Covered

- production domain deploy。shader-only stateでは実行禁止。
- First View以降のinformation architecture、copy、proof unit、CSS stack選定。`Site-Feat-17`で扱う。
- GPU vendor / browserを横断したperformance profile。
- baseline captureのdurable reference昇格。
- 110svhの操作区間が30秒以内のページ理解へ与える影響。`Site-Feat-17`の全体QAで扱う。
- repo全体の`./scripts/check-docs.sh`は対象外の
  `_docs/intent/App/workers-static-export-next16/decision.md`に`Rollback / Follow-ups`がないため停止した。
  First Viewのscoped validatorは全てPASSした。

## Residual Risks

- 3072 PNGは単一asset上限内だが17,364,753 bytesある。4096の見た目を再追求する場合は、単一PNGへ戻さず
  分割texture、圧縮形式、段階読込みのいずれかを別の性能比較として設計する必要がある。

## Follow-up TODOs

- `Site-Feat-17`: proof unitを一つ選び、完成トップページをFirst View foundationから再設計する。
- 次のFirst View調整は3072x6144 / R8を固定した上で一軸ずつ比較する。

## 2026-07-16 Optical path distance variant verification

### Scope

本線3000を変更せず、単一の光路距離`t`から既存の半影、Gaussian幅、光強度、素材応答を導く
弱勾配3004と強勾配3006を比較可能にした。採否と本線への収束はオーナー比較後へdeferする。

### Static / diff evidence

- 3000 shader SHA-256: `884848a8c676fa246de7646b2fe47e191fa91bfbceddcf528d6dd897615c44df`
- 3004 shader SHA-256: `d2d373dca329da1a220f95d483c60c6776dc81d43ddc49ac15fbf0184fe15e0f`
- 3006 shader SHA-256: `092eb96ebc1a40f775309fdf2beafd884ae3522b8b09c565c5f8ffa5f2c76fd4`
- 全portのheight map SHA-256: `48d0637db927bbf1da36db2f80e8a07ec33358fb1344a077a4384797d79b6f5e`
- repoと各variantのsource diffは`public/first-view/light.frag`だけ。Next devが自動更新した
  `next-env.d.ts`は起動後に本線と同じ内容へ戻して比較境界を維持した。
- 弱案は`t=0→1`で半影`1→3`、Gaussian幅`1→1.8`、強度`1→0.718`、素材応答`1→0.760`。
- 強案は`t=0→1`で半影`1→6`、Gaussian幅`1→3`、強度`1→0.476`、素材応答`1→0.554`。
- `materialUv = uv`を維持し、`u_time`、時間drift、engine変更、常時frame loopはない。

### Browser evidence

- Environment: Codex in-app Browser、desktop `1280x720`、mobile `390x844`。
- 3004 / 3006ともdesktop初期像、進捗`0.501`、mobile初期像でstatus `ready`。
- 進捗`0.740 / 0.870 / 1.000`でwash `0.000 / 0.503 / 1.000`を両案とも維持した。
- 固定進捗`0.501`で1.1秒待ったcapture SHA-256は、3004が
  `9a80ad8a2ab612f62874a66b44f28ddfbde73d2c4d59d350ed21a35c4e5d0b1f`、3006が
  `fc36a9381e55153e368142cabf845ae2c3205d3c246d373cbb208627e995d246`で前後一致し、render countは
  いずれも`3`のままだった。
- mobileはcanvas `375x844`、document幅`375`、viewport幅`390`で横overflowなし。
- page由来のconsole error / warning、framework overlayはなし。Electronの開発時CSP warningは
  variant外のBrowser host由来として除外した。

### Perceptual self-check

- PASS: 右の光源側から左下の遠端へ、光帯エッジのぼけ幅が連続して広がる。
- PASS: 軸方向の最大輝度が右側にあり、遠端へ向かって芯・halo・素材応答が弱まる。
- PASS: 既存の光帯と連続面だけで成立し、模様、ぼかしfilter、変形、孤立反射、物体形状の追加に
  読める要素はない。
- PASS: incidenceが増えると`t`差が漸減し、既存washとINV-018の収束を維持する。

### Scoped verdict

**PASS — comparison readiness.** AC-028とINV-002 / INV-012 / INV-013 / INV-018 / INV-020 /
INV-021 / INV-025の比較前条件は満たした。オーナーによる弱案・強案の採否は未実施のため、文書全体の
`PARTIAL` verdictと`Site-Feat-17`の未完了状態は変更しない。

### Closure checks

- PASS: `npm test -- app/_components/first-view/light-policy.test.ts app/_components/first-view/light-engine.test.ts`
  — 2 files / 19 tests。
- PASS: `npm run typecheck`。
- PASS: `npm run lint` — 29 files、fixなし。
- PASS: First View対象のscoped front-matter / doc-link / QA validators、TODO validator、対象4文書の
  `git diff --check`。
- FAIL（対象外の既存状態）: `bash scripts/check-docs.sh`は`App/top-page-initial`、
  `App/ui-integration`、`App/scaffold`のPASS verificationにResidual Risksが残る3件で停止した。
  First Viewの対象文書にvalidator findingはないため、本比較のscoped verdictは変更しない。

### Strong geometry / mid response follow-up

#### Diff / hash evidence

- 3007 shader SHA-256: `ade91cec523ae386776d3f33096c7047fd78da8c08ba356129c2e6fc280f04ba`
- 3000 shader / height mapは前回と同じ
  `884848a8c676fa246de7646b2fe47e191fa91bfbceddcf528d6dd897615c44df` /
  `48d0637db927bbf1da36db2f80e8a07ec33358fb1344a077a4384797d79b6f5e`。
- 3006と3007のsource diffは`light.frag`の2係数だけ。`penumbraSpread = 1.0 + 5.0 * t * pathGradient`と
  `gaussianSpread = 1.0 + 2.0 * t * pathGradient`は一致する。
- `distanceAttenuation`を`0.25`、`materialPathResponse`のmixを`0.40`とし、遠端強度`0.640`、
  遠端素材応答`0.784`とした。指定値で知覚目標を満たしたため追加調整はない。

#### Browser evidence

- 3007はdesktop `1280x720`の初期像と進捗`0.501`、mobile `390x844`の初期像でstatus `ready`。
- 進捗`0.740 / 0.870 / 1.000`でwash `0.000 / 0.503 / 1.000`を維持した。
- 固定進捗`0.501`の1.1秒差captureはSHA-256
  `0bcc61aa85ad8abe137c64b55809c8ecee1db49977cfe8611f2f59f0807676f5`で一致し、render countは`3`。
- mobile canvasは`375x844`、document幅`375`、viewport幅`390`で横overflowなし。
- page由来のconsole error / warningとframework overlayはない。Electronの開発時CSP warningだけを
  Browser host由来として除外した。

#### Perceptual self-check

- PASS: 3006とのshader diffで幾何係数が同一であり、右鋭・左広の半影勾配と光条の空間読解を保つ。
- PASS: desktop初期像の左半分は、3006→3007で平均輝度`0.395→0.436`、標準偏差
  `0.171→0.217`、Laplacian標準偏差`0.101→0.143`となり、素材粒と光帯内部階調が増えた。
- PASS: 白芯からhaloの階調、暗部、wordmark、material座標、時間非依存、wash収束を維持する。
- PASS: 局所焦点、孤立反射、新しい模様・物体形状・軸・つまみを追加していない。

#### Scoped verdict

**PASS — comparison readiness.** AC-029とINV-002 / INV-012 / INV-013 / INV-018 / INV-020 /
INV-021 / INV-025の比較前条件を満たした。3007の採否は未実施のため、文書全体の`PARTIAL` verdictと
`Site-Feat-17`の未完了状態は変更しない。

#### Closure checks

- PASS: First View policy / engineの2 files / 19 tests、TypeScript、Biome 29 files。
- PASS: First View対象のscoped front-matter / doc-link / QA validators、TODO validator、対象4文書の
  `git diff --check`。
- FAIL（対象外の既存状態）: repo全体の`bash scripts/check-docs.sh`は前回と同じApp領域3文書の
  PASS / Residual Risks不整合で停止した。First View対象文書に新しいfindingはない。

### Atmospheric field / compressed boundary follow-up

#### Diff / hash evidence

- 3008 shader SHA-256: `2a6fb0194863ea4b3fbf5be00fb1099b184ab18c3b77a83be51c018fdd76b95c`
- 3000 shader / height map、3006 shader、3007 shaderは前回と同じ
  `884848a8c676fa246de7646b2fe47e191fa91bfbceddcf528d6dd897615c44df` /
  `48d0637db927bbf1da36db2f80e8a07ec33358fb1344a077a4384797d79b6f5e`、
  `092eb96ebc1a40f775309fdf2beafd884ae3522b8b09c565c5f8ffa5f2c76fd4`、
  `ade91cec523ae386776d3f33096c7047fd78da8c08ba356129c2e6fc280f04ba`。
- 3007と3008のworkspace差分は`public/first-view/light.frag`だけ。Next devが変更した`next-env.d.ts`は
  3007と同じ内容へ戻した。
- `coolAir = vec3(0.455, 0.535, 0.545)`、遠端air mix`0.14`、暗部fbm振幅`0.75`倍。
- 境界noiseは既存`t`の位相連続な積分座標を使い、遠端局所周波数`1.82`倍（波長`0.549`倍）、
  振幅`0.75`倍。`pathGradient`によりincidence→1で周波数・振幅とも3007へ漸減する。
- `materialUv = uv`、height map sampling、半影6倍、Gaussian幅3倍、距離減衰`0.25`、素材mix`0.40`
  を維持した。独立uniform、時間入力、追加axisはない。

#### Quantitative evidence

- desktop初期像の上端12%、左右`x=0.02〜0.48 / 0.52〜0.98`を暗部ROIとした。linear sRGBの
  Rec.709平均輝度 / HSV平均彩度は、3008左が`0.063349 / 0.492966`、右が
  `0.051279 / 0.549179`。左の遠端は右の近端より高輝度・低彩度。
- 同じROIの3007は左`0.050258 / 0.562174`、右`0.048791 / 0.564797`。3008では暗部の
  左右差が大気参加の方向へ増えた。

#### Browser evidence

- Environment: Codex in-app Browser、desktop `1280x720`、mobile `390x844`、3008。
- desktop初期像と進捗`0.502`、mobile初期像でstatus `ready`。mobile canvasは`375x844`、
  document幅`375`、viewport幅`390`で横overflowなし。
- 進捗`0.740 / 0.870 / 1.000`でwash `0.000 / 0.503 / 1.000`を維持した。
- 固定進捗`0.502`の1.1秒差captureはSHA-256
  `44551d18337333c4032a52e69763edf2c4ea495d80a4384249a53d11aecf3cf3`で一致し、render countは`3`。
- page由来のconsole error / warningとframework overlayはない。Electron hostの開発時CSP warningだけを
  除外した。dev asset cacheを避け、最終shader hashをqueryへ付けたfresh navigationで取得した。

#### Perceptual self-check

- PASS: 暗部は左へ向かって明るく低彩度になり、平坦な2D面ではなく光帯と同じ遠近を持つ場として読める。
- PASS: 境界ゆらぎは右で粗く大きく、左で細かく小さい。6倍半影の中で新しい模様、縞、位相切れ、
  aliasingを作らない。
- PASS: 光帯単体ではなく画面全体から左を遠端とする読みが立ち、incidence増加とwashで追加差が漸減する。

#### Scoped verdict

**PASS — comparison readiness.** AC-030とINV-002 / INV-012 / INV-013 / INV-018 / INV-020 /
INV-021 / INV-025 / INV-033の比較前条件を満たした。3008の採否は未実施のため、文書全体の
`PARTIAL` verdictと`Site-Feat-17`の未完了状態は変更しない。

#### Closure checks

- PASS: First View policy / engineの2 files / 19 tests。
- PASS: `npm run typecheck`、`npm run lint`（29 files、fixなし）。
- PASS: First View対象のscoped front-matter / doc-link / QA validators、TODO validator、対象6文書の
  `git diff --check`。
- FAIL（対象外の既存状態）: repo全体の`bash scripts/check-docs.sh`は前回と同じApp領域3文書の
  PASS / Residual Risks不整合で停止した。First Viewの対象文書に新しいfindingはない。

## 2026-07-16 Micro-discovery variant verification

### Scope / intent boundary

光路距離`t`の探索をオーナー判断で不採用として閉じ、本線3000の初期像から「2秒目以降の発見」を
作る三機構を独立variantで比較可能にした。本比較は「INV-002 / INV-021の適用範囲限定を
前提とした探索」である。INV-012 / INV-013 / INV-020 / INV-025は停止していない。

旧光路距離portの3004 / 3006 / 3007 / 3008を停止し、3004=P1、3006=P2、3007=P3へ再割り当てした。
3008は停止のまま、3000は参照用canonical baselineとして起動した。採否はオーナーの30秒比較後とし、
本verificationでは決定しない。

### Static / hash evidence

- 3000 shader / height map SHA-256:
  `884848a8c676fa246de7646b2fe47e191fa91bfbceddcf528d6dd897615c44df` /
  `48d0637db927bbf1da36db2f80e8a07ec33358fb1344a077a4384797d79b6f5e`。作業前後で不変。
- P1 / 3004 shader SHA-256: `bbb72c1417d4dbe13e11ec1272845d4d2c52936c829956036915afa30f4c6a3c`。
- P2 / 3006 shader SHA-256: `40596dd79ce0122f8f22b5dcc1b08796503e00d3949e918664eeb30dd86385ea`。
- P3 / 3007 shader SHA-256: `0134d65da549b3f1cde2dcdfcd38f286bf6c3cf6247a735662f0bffb63e4f2f4`。
- 各variantのheight map SHA-256は3000と同じ
  `48d0637db927bbf1da36db2f80e8a07ec33358fb1344a077a4384797d79b6f5e`。
- 各workspaceとrepoの差分は`public/first-view/light.frag`だけ。engine / policy / height map /
  wordmark / pageにvariant固有差分はない。三案にu_time、実行時乱数、独立texture、material座標変更はない。
- P1はwarpした低周波fbmのscalar乗算だけ。P2は`d - upperEdge`の帯域weightだけ。
  P3は`fineHeight`上位域、法線と光源方向、`lightField`、白芯除外から導く加算だけ。

### Quantitative evidence

- P1: 1280x720相当の暗部mask数値評価で平均輝度変化`-0.120%`、平均絶対変化
  `0.487%`、最大局所変化`1.623%`。fbm振幅と係数から得る絶対上限は`3.335%`。完全表示後の
  3000対照captureの暗部ROIは平均輝度差`+0.149%`。色はscalar乗算のため彩度係数を持たない。
- P2: 上端境界のweightは`1.0`、光帯中央と暗部深部は`0.29`。振幅比は`3.448`で、
  非境界にもdetailの床を残す。
- P3: 910,800画素中`microPeak > 0`は8,156画素、`0.895%`。白芯除外後の実働率はこれ以下。
  最終係数0.095のP3と3000の完全表示capture差分は1,478画素`0.164%`、最大channel差が
  `3 / 255`を超える点は56、`4 / 255`を超える点は29。輪郭やhaloは加えていない。

### Browser evidence

- Environment: Codex in-app Browser、desktop `1280x720`、mobile `390x844`。
- P1 / P2 / P3はdesktop初期像、進捗`0.501 / 0.740 / 0.870 / 1.000`でstatus `ready`。
  washはそれぞれ`0.000 / 0.000 / 0.503 / 1.000`。
- 進捗`0.501`の1.1秒差capture SHA-256はP1
  `d5204942089c10e185e696837fd0884bcffb039c7b758d0189273eb79c3c3a1b`、P2
  `33848ff470ae659eb9e7964ae29e81c0bb197ca1354302fd258499036178d485`、P3
  `a5efca6ebc0c19da050ca888899ae6b9c6df8c47bc86febb5b894c0f72bd1343`で各案の前後が一致。render countも`3`のまま。
- mobile初期像は全案status `ready`、canvas `375x844`、document幅`375`、viewport幅`390`、
  横overflowなし。完全表示後capture SHA-256はP1
  `9ddca658f791fde25442d72242c8e2d78bbfdc8f2f9c5047b94bfd7a6f664cc4`、P2
  `59b58039a93d291f0ce0af8935a8777d270e606c1b308363753bb7e96cd200a3`、P3
  `22f7bae00786768e15cb10ad9599d86f6762d38758025625f5eb8e9032fe7012`。
- P3は初期進捗の30秒差captureもSHA-256
  `7c7a035c276ebb2b2b2557ba19025ad7a1ecd2e3492e9df2ced707a9fb403226`で前後一致し、render countは`2`。
- page由来のconsole error / warning、framework overlayはない。Electron hostの開発時CSP warningだけを除外した。

### 30-second perceptual self-check

- P1: PASS。初見で光帯を読んだ後、上側暗部に大スケールの明暗むらを発見できる。視線は暗部内の
  緩い峰間を移るが、物体や皺の輪郭としては同定しない。
- P2: PASS。数秒後に上端境界の粒度密度が光帯中央・暗部深部と異なることに気づく。視線は
  左下から右上へ上端境界に沿って移る。直線の縁取りではなくfbm境界に追従する。
- P3: PASS。初見では素材粒に溶けるが、数秒後に暖色の小さな点が光帯内を飛び石状に結ぶことを
  発見できる。視線は点間を移り、暗部に残る少数の点へも離れる。白芯の広がり、halo、高彩度色点はない。

### Scoped verdict

**PASS — comparison readiness.** AC-031とINV-012 / INV-013 / INV-020 / INV-025を確認し、INV-002 / INV-021は
明記した適用範囲限定の内側でのみ探索した。三案の採否はオーナー比較後のため、文書全体の
`PARTIAL` verdictと`Site-Feat-17`の未完了状態は変更しない。

### Closure checks

- PASS: `npm test -- app/_components/first-view/light-policy.test.ts app/_components/first-view/light-engine.test.ts`
  — 2 files / 19 tests。
- PASS: `npm run typecheck`。
- PASS: `npm run lint` — 29 files、fixなし。
- PASS: First View対象のscoped front-matter / doc-link / QA validators、TODO validator、
  `deno fmt --check scripts/*.mjs`、対象5文書の`git diff --check`。
- FAIL（対象外の既存状態）: repo全体の`bash scripts/check-docs.sh`は従来と同じ
  `App/top-page-initial`、`App/ui-integration`、`App/scaffold`のPASS verificationにResidual Risksが残る
  3件で停止した。First View対象文書に新しいfindingはない。

## 2026-07-17 Dynamic-range excess variant verification

### Scope / intent boundary

P1 / P3が初見で知覚されず、P2が注視時間を短縮したオーナー比較を受け、最初の1秒の強度と
見入りの持続を、処理しきれない過剰の提示という同じ機構で作る四案へ置き換えた。3004=V1
veiling glare、3006=V2 deep far field、3007=V3 compound、3008=V4 deliberate excessとした。

本比較は「INV-020の再解釈を前提とした探索」である。白芯そのものの面積拡大と最大輝度の変更は禁止を
維持し、白芯周囲の散乱膜が局所コントラストと素材応答を洗うことによる可視域狭窄を比較対象にした。
intentの正式改訂と採否はオーナー比較後へdeferする。INV-012 / INV-013 / INV-021 / INV-025は停止していない。

### Static / hash evidence

- 3000 shader / height map SHA-256:
  `884848a8c676fa246de7646b2fe47e191fa91bfbceddcf528d6dd897615c44df` /
  `48d0637db927bbf1da36db2f80e8a07ec33358fb1344a077a4384797d79b6f5e`。作業前後で不変。
- V1 / 3004 shader SHA-256: `612a499e474e09b7d553a0d9a09c3f1d19e89f7123de671873319355dcb3bd0c`。
- V2 / 3006 shader SHA-256: `ab15cf169e5218025d29e2d5f66b6e63b9dc7a04c2ecc5d8c8175fd74761fee3`。
- V3 / 3007 shader SHA-256: `3b3b79903c47fb0aa9323b966aa84261da6b6e5d2f11f4b494d4a185a22b6529`。
- V4 / 3008 shader SHA-256: `c44b5caebfbeec5c73792526141fba2ff5d2f853457c96de580dfa18d4e0da89`。
- 各workspaceと本線の差分は`public/first-view/light.frag`だけ。height map / engine / policy /
  wordmark / pageは一致し、u_time、実行時乱数、material座標変更を追加していない。
- V1 / V3は`glareVeil`を暖白mixと全素材寄与のvisibilityへ共有し、最大detail抑制`76%`。
  V2 / V3は同じdeep mask、desaturation`0.62`、deep factor`0.44 + 0.22`、閾値構造振幅`0.045`を
  共有する。V3固有調整はない。V4はdetail抑制`90%`、暖白mix`0.70`、deep factor
  `0.55 + 0.30`、閾値構造振幅`0.030`へ意図的に強めた。
- `hotCore`から`closeLight`までの白芯・halo定義blockは3000 / V1 / V2 / V3 / V4で同一SHA-256
  `97a3ee5e790b140f1faef2a737fa168c88f33998b27ae0e0b21c651dfa119a06`。`1265x720`、
  incidence 0の`opticalCoreMask >= 0.5`は全案56,613画素、mask最大値1.0で同一。表示captureの
  最大輝度も全案1.0である。高輝度に見える周辺面積の増加は白芯maskではなくveilである。

### Quantitative evidence

- 暗部ROIはdesktop初期像の`y=15〜154 / x=20〜444`。linear sRGB Rec.709平均輝度は3000
  `0.045052`、V2`0.011618`、V3`0.011509`で、3000比`0.2579 / 0.2555`、約1/3.88 / 1/3.91。
  sRGB輝度の最小値はV2`0.067269`、V3`0.063347`で、完全な黒へ到達しない。
- V4は広いveilが同ROIまで侵食するためlinear平均`0.012660`だが、sRGB 1 percentile
  `0.040085`、最小`0.032242`で、V2 / V3より最深部を視認限界側へ振ったbracketになった。
- veil域は、比較対照からのsRGB輝度上昇`> 0.04`、対照輝度`0.16〜0.88`、browser overlayを
  除いた範囲として抽出した。Gaussian radius 2との差分RMSで測った局所高周波応答減衰は、
  V1対3000が`54.10%`、V3対V2が`64.32%`、V4対3000が`72.72%`。V3対V2は同じ暗部係数を
  共有するためglare寄与だけを比較する。
- 3000との差が最大channel`12 / 255`を超える画素率はV1`66.300%`、V2`58.785%`、
  V3`83.868%`、V4`92.904%`。全案とも初見で誤認しようのない差を作った。

### Browser evidence

- Environment: Codex in-app Browser、desktop `1280x720`、mobile `390x844`。
- 全案はdesktop初期像と進捗`0.501 / 0.740 / 0.870 / 1.000`でstatus `ready`、横overflowなし。
  washは`0.000 / 0.000 / 0.503 / 1.000`。
- 進捗`0.501`でscrollbarが静止した後の1.1秒差full-viewport captureは、V1
  `66706fb602fcf513f3e2182e93ed87ef83a899b10019ee11cd4041ae277b96d1`、V2
  `4647100c258c70719c89ff61e2222f53ccdacad7fe8a30e3841226095c56cf92`、V3
  `a3f653a293af6809f75820b187af1c8dc5c0121787817524b1c5236926337782`、V4
  `bef1d4ba59bb5bfcad48154bcef876d1ba86c8ba252ec6ff2803eb7f39eb8dff`で各案の前後がSHA-256まで一致。
  render countも`3`のままだった。
- 進捗1.000の全案と3000はcapture SHA-256
  `47734e59498c22eaa3053fe37ef7a2e8b2086c6e02645bbca97f27ad563d62c0`で一致し、incidenceとwashによる
  3000への収束を確認した。
- mobile初期像は全案status `ready`、canvas `375x844`、document / body幅`375`、viewport幅`390`で
  横overflowなし。capture SHA-256はV1
  `6e8510a87d60508437065f898d7e4ddbb92a23459aa86b211c1ccf1390f6a242`、V2
  `9adc08249345c227da20f005cb5e96b5bc89207d01547cf2ad4959e548d786c6`、V3
  `aeb09cfa585c6e8c7ffec45b39d1b6052c57cadce13678bf6ffd460aaca3418e`、V4
  `5af42961cc199a2890518e67f05de33f6545207d919b0f89ce6d8bc8d27be9b3`。
- page由来のconsole error / warningとframework overlayはない。Electron hostの開発時CSP warningは
  比較対象外として除外した。

### One-second perceptual self-check

- V1: PASS。3000より白芯が眩しく感じられ、上端境界の暗部側だけが淡く洗われる。veilは光帯軸に
  沿って非対称に広がり、画面全体へ一様に載らないため、汚れよりin-eye scatterとして読める。
- V2: PASS。左上が初見で深くなり、低彩度tealの面より光が届かない空間として読める。最深部にも
  warpした低周波構造が残り、矩形の欠けや完全な黒には見えない。
- V3: PASS。光帯中央と左上の両端で素材が読めず、中間帯だけに表面情報が残る。V1 / V2単体係数の
  併用で境界の段差や過度な中間帯狭窄は発生していない。
- V4: PASS — bracket only。白芯周囲は細部消失へ達し、左上は表示欠けと区別しにくくなる直前まで
  深い。veilは霧に近づき始めており、採用候補ではなくV3側の採用域を挟む「やりすぎ」として成立する。

### Scoped verdict

**PASS — comparison readiness.** AC-032とINV-012 / INV-013 / INV-021 / INV-025を確認し、INV-020は
明記した再解釈前提の内側だけで探索した。四案のオーナー採否とintent改訂は未実施のため、文書全体の
`PARTIAL` verdictと`Site-Feat-17`の未完了状態は変更しない。

### Closure checks

- PASS: First View policy / engineの2 files / 19 tests。
- PASS: `npm run typecheck`。
- PASS: `npm run lint` — 29 files、fixなし。
- PASS: `deno fmt --check scripts/*.mjs` — 8 files。
- PASS: First View対象のscoped front-matter / doc-link / QA validators、TODO validator、対象5文書の
  `git diff --check`。
- PASS: `docs-cleanup`でactiveなdraft / planをオーナー採否前の比較記録としてlive pathへ維持し、
  intent / QAをarchive対象にしていない。
- FAIL（対象外の既存状態）: `bash scripts/check-docs.sh`は従来と同じ
  `App/top-page-initial`、`App/ui-integration`、`App/scaffold`のPASS verificationにResidual Risksが残る
  3件で停止した。First View対象文書のscoped validatorは全てPASSした。

## 2026-07-17 Physical lighting L1〜L3 verification

### Scope / intent boundary

V1〜V4が「光と影の症状を個別に塗るため物理的一貫性を持たない」というオーナー診断で不採用になった
ことを受け、比較軸を係数差から照明architecture差へ置き換えた。3004=L1は有限面光源・半平面遮蔽体・
height-map面による直射と寒色ambient、3006=L2は同一sceneへの自己遮蔽、3007=L3は同じ直射輝度場から
導いたglareである。

INV-012 / INV-013 / INV-014 / INV-017 / INV-018 / INV-025 / INV-032を維持し、INV-002は影をambientで
浮かせつつ人為的な輝度床を追加しない解釈、INV-020は計算輝度のtone mappingとして仮適用した。
正式なintent改訂、本線採用、比較portの収束はオーナー採否後へdeferする。

### Static / architecture evidence

- 本線3000 shader / height map SHA-256は
  `884848a8c676fa246de7646b2fe47e191fa91bfbceddcf528d6dd897615c44df` /
  `48d0637db927bbf1da36db2f80e8a07ec33358fb1344a077a4384797d79b6f5e`で作業前後とも不変。
- L1 / 3004 shader SHA-256:
  `f052f43feedb51b26cf7ec464a640fe497e4d4973f46c06609289fc4ba99fe7b`。
- L2 / 3006 shader SHA-256:
  `7b35062944dbcfdb5c0b11d63b54b7757aab58cfb42eb981208be8e57afeea89`。
- L3 / 3007 shader SHA-256:
  `0024769bce811fbbe0d0d900d36fce6e0655b9c740c5fed9f0fb01a555df9263`。
- 全variantのheight mapは本線と同じSHA-256。比較workspaceと本線の`public/first-view`差分は
  `light.frag`だけで、engine / policy / wordmark / page / generatorは不変。
- L1〜L3のsource diffは`VARIANT_SELF_SHADOW` / `VARIANT_GLARE`の各1行だけ。面光源位置・半径・
  強度・色、遮蔽edge・高さ、ambient、48点sample pattern、tone mappingを共有する。
- uniformは`u_resolution` / `u_scroll_progress` / `u_exit_wash` / `u_height_map` /
  `u_height_map_size` / `u_debug_mode`の6個だけ。`u_time`、frame依存seed、追加textureはない。
- L1は48点の決定的Vogel patternを用い、遮蔽可視率、receiver / emitter cosine、距離二乗減衰から
  直射を計算する。L2は中心光方向へ8 stepの短距離height raymarch、L3は6周辺点それぞれで48点の
  直射を再評価し、その輝度積分からveiling radianceを得る。手置きsoftness、beam / shadow mask、
  glare ellipse、加算detail、vignetteはない。
- `glslangValidator -S frag`は三shaderすべてPASSした。debug mode 1はnormal.xy / height、mode 2は
  visibility / direct fieldと、L2ではself visibility、L3ではglare fieldを返す。

### Browser / performance evidence

- Environment: Codex in-app Browser、desktop `1280x720`、mobile `390x844`。
- desktopは全案で初期像と進捗約`0.501 / 0.740 / 0.870 / 1.000`を確認し、status `ready`、
  canvas `1265x720`、横overflow 0、page由来console error / warningなし。washは進捗
  `0.740 / 0.870 / 1.000`で`0.000 / 0.503 / 1.000`。
- scroll後の単発frameを入力からcapture完了までのwall timeで概測した。L1は`20.00〜32.80 ms`、
  L2は`18.89〜32.71 ms`、L3は`19.04〜21.73 ms`。GPU timerではなくend-to-end値だが、scroll操作で
  描画待ちの体感停止はなかった。
- mobile初期像はL1 / L2 / L3の順に`832.59 / 902.95 / 893.92 ms`でreadyになった。全案でcanvas
  `375x844`、document / body幅`375`、viewport幅`390`、横overflow 0、page由来console error /
  warningなし。
- mobileの上部影 / 左下 / 右下ROIの平均輝度は、L1が`0.2595 / 0.5370 / 0.6409`、L2が
  `0.2595 / 0.5314 / 0.6343`、L3が`0.2595 / 0.5601 / 0.6705`。いずれもnear-black画素はなく、
  寒色ambientで影面を保持した。

### Determinism / physical-field evidence

- 進捗約0.501で1.1秒離したfull-viewport captureは、L1
  `921371e3fb01f5472210da313212383f587b1ef5f44c78070545a12b64f2aad8`、L2
  `8f63501b77f0544513dcabf2cc5893db3ecfc53175936b11b56e0954ee10d34d`、L3
  `558148214bb4780de68826f0c84a9e3f1a38878fb03c778463bc349fe1ebe7e8`で、各案の前後が
  SHA-256まで一致した。render countも固定され、時間・frame依存samplingはない。
- debug mode 2の初期像でedgeを横切る三断面の可視率遷移幅は`57 / 56 / 57 px`、影側へ戻る
  単調性違反は0。面と遮蔽体の高さが固定のためedge沿いの半影幅はほぼ一定で、手置きsoftnessではなく
  有限光源投影から得られる。進捗約0.501では`25 / 25 / 26 px`へ狭まり、edgeは約`83〜89 px`上方へ
  移動した。
- L1の平均可視率は進捗0から約0.501で`0.541710 → 0.685693`、平均直射fieldは
  `0.130083 → 0.286854`。光源高さだけの変更から投影境界、影の短縮、暗部への回り込みが同時に
  変化した。
- L2は直射画素420,602のうち15,712画素、`3.7356%`にheight-map自己遮蔽が現れた。L3のdirect /
  glare相関は`0.868032`で、高direct域 / 低direct域の平均glareは`0.448946 / 0.010632`。自己遮蔽と
  glareの位置は、それぞれheight / light directionと計算直射fieldへ従属する。

### Calibration self-check

L1〜L3の初期像は右上から左下の対角光帯、上側の暗いteal、帯内の暖色、右寄りの最輝部を維持した。
本線3000より単一遮蔽edgeの因果が明瞭で、height mapの縞・織りが強く露出する一方、旧shaderの
複数haloと下側の青い加算層は再現しない。「同じ作品の照明を計算し直した」という較正目標への
self-checkはPASSとするが、作者バイアスを除いた採否はオーナーの比較観測を待つ。

### Scoped verdict

**PASS — comparison readiness.** AC-033と指定された不変条件、決定性、desktop / mobile ready、
物理fieldの同時変化を確認した。L1〜L3の採否、INV-020を含む正式なintent改訂、本線3000への収束は
未実施なので、文書全体の`PARTIAL` verdictと`Site-Feat-17`の未完了状態は変更しない。

### Closure checks

- PASS: First View policy / engineの2 files / 19 tests。
- PASS: `npm run typecheck`。
- PASS: `npm run lint` — 29 files、fixなし。
- PASS: `glslangValidator -S frag` — L1〜L3の3 files。
- PASS: First View対象のscoped front-matter / doc-link / QA validators、TODO validator、
  `deno fmt --check scripts/*.mjs` — 8 files、対象5文書の`git diff --check`。
- FAIL（対象外の既存状態）: repo全体の`bash scripts/check-docs.sh`は従来と同じ
  `App/top-page-initial`、`App/ui-integration`、`App/scaffold`のPASS verificationにResidual Risksが残る
  3件で停止した。First View対象文書に新しいfindingはない。

## 2026-07-19 Hybrid material-response checkpoint verification

### Scope / intent boundary

L1〜L3で確認した局所的なmaterial realismを3000の演出的な光場へ還元した。rootの3000は保険として
変更せず、Lambert、低強度GGX、ambient-only AO、任意self-shadowを独立workspaceへ段階追加した。
self-shadowは構図への寄与に対して費用と微細影の主張が大きいため最終候補から外し、3019は既存法線と
曲率だけからroughness / AOを導く。有限面光源、world-space遮蔽物、bloom、最終RGB maskは導入していない。

### Static / checkpoint evidence

- 3000 shader / height map SHA-256:
  `3486db2a910857271c2b3cb1583f727b1295cac5d53a507c519d6d5480810b4f` /
  `48d0637db927bbf1da36db2f80e8a07ec33358fb1344a077a4384797d79b6f5e`。比較前後で不変。
- checkpointは3008〜3019の独立workspace / portとして保存した。3019 shader SHA-256は
  `763a41ca321f1f1a97497edabb7517ffd9e68e46d7c90c63e0eda897a67111fb`。
- build生成物を除く3019のruntime差分は`public/first-view/light.frag`だけ。height map、engine、
  policy、wordmark、pageは3000と共通である。
- 3019のheight sampling回数は3000と同じで、追加のtexture readを持たない。`u_time`、実行時乱数、
  raymarch、有限面光源、world-space遮蔽物、bloom、最終RGB maskを持たない。
- `glslangValidator -S frag public/first-view/light.frag`は3019でPASSした。

### Browser / quantitative evidence

- Environment: Playwright Chromium、desktop `1440x900`、mobile `390x844`。event-driven WebGLの
  backbufferを確定するため、各capture前に実wheel入力で再描画した。
- desktop初期像の3019対3000はlight mask IoU `0.991563`、輝度重心差約`6.3 px`
  （画面対角の約`0.37%`）、white面積差`+1.37%`、near-white面積差`-9.3%`。背景と照射面の
  高周波応答はそれぞれ`+22.8% / +63.8%`。
- mobile初期像はlight mask IoU `0.995455`、輝度重心差約`1.5 px`、white面積差`+1.7%`、
  near-white面積差`-8.4%`。背景と照射面の高周波応答はそれぞれ`+25.4% / +57.6%`。
  statusは`ready`、横overflowはない。
- desktop進捗`0.501`のlight mask IoUは`0.997177`、進捗`0.74 / 0.871 / 1.00`では`1.0`。
  物理material responseをscrollに伴って減衰させ、全面白では3000とpixel単位で一致した。
- 進捗`0.501`で1.2秒離した二captureはSHA-256
  `f82fe6322b2681ab7e7a8df31d60e8cdde58a5dbe28f861caa1bd8a46a172db4`で一致し、
  ImageMagick AEは`0`、render countは`3`のままだった。
- GPU timer extensionを利用できなかったため、実wheel入力から単発描画完了までをwall timeで概測した。
  desktop中央値は3000の`151.5 ms`に対して3019は`166.5 ms`（約`+10%`）、mobileは
  `52.5 ms`に対して`54 ms`（約`+3%`）。automation overheadを含む比較値である。

### Scoped verdict

**PASS — comparison readiness.** AC-034の独立checkpoint、3000不変、macro composition guardrail、
決定性、desktop / mobile / scroll、静的禁止事項を確認した。3019を実装者推奨候補とするが、
30秒観察によるオーナー採否と3001への収束は未実施である。したがって文書全体の`PARTIAL` verdictと
`Site-Feat-17`の未完了状態は変更しない。

### Closure checks

- PASS: First View policy / engineの2 files / 19 tests、および全`npm test`。
- PASS: `npm run typecheck`、`npm run lint`、`npm run build -- --webpack`。
- PASS: `bash scripts/check-docs.sh`、`git diff --check`。
- PASS: `docs-cleanup`でPlan / Intent / QAをlive pathへ維持した。比較候補のオーナー採否と
  `Site-Feat-17`本体が未完了のため、handoff draftを含む文書のarchiveは行わない。

## 2026-07-20 3019 adoption and photo-baseline convergence verification

### Owner decision and perceptual evidence

オーナーは最終比較で、3019が3000の良さを消さずに改善していると判断し、本線への採用を決定した。
checkpoint間で視認上の向上が明確だった境界は`3000 → 3008`、`3009 → 3010`、
`3011 → 3012`、`3012 → 3013`である。これはLambertの導入、AO、Lambert強度の較正、
hybrid統合の寄与を将来再調整するときの優先証跡として扱う。写真背景3020も独立方向として保持する
価値があると判断され、shaderと折衷せず3001へ割り当てた。

### Static / convergence evidence

- root `public/first-view/light.frag`と採用3019はSHA-256
  `763a41ca321f1f1a97497edabb7517ffd9e68e46d7c90c63e0eda897a67111fb`でbyte一致した。
- canonical height mapはSHA-256
  `48d0637db927bbf1da36db2f80e8a07ec33358fb1344a077a4384797d79b6f5e`のまま変更していない。
  engine / policy / wordmark / pageへ収束固有の変更は加えていない。
- 写真原本と3001 workspaceのassetはSHA-256
  `0cb4884c71f8bae1a8936108565fa739166b06bdc416fb020592058d81eed9e8`で一致した。
- 3008〜3020の探索listenerを停止し、workspaceとcheckpoint sourceは削除せず保持した。
  最終レビュー入口は3000 / 3001だけで、両portのHTTP 200を確認した。

### Browser evidence

- Browser pluginのChrome profileではWebGLが`server-fallback`になったため、3001のDOM / computed
  style確認へ使用し、3000のGPU描画と固定viewportはPlaywright Chromiumへfallbackした。
- 3000はdesktop `1440x900`、mobile `390x844`でcanvas status `ready`、横overflow 0。
  desktopで実wheel `450px`を入力するとscroll進捗は`0.000 → 0.535`、render countは`2 → 3`となり、
  採用前3019と同じevent-driven scroll応答を維持した。
- 3001は両viewportで写真が`cover`表示され、section直下は`otibo` heading一つ、canvas 0、filter
  `none`、横overflow 0。desktopで実wheel `450px`後もsection topは0、heightは900pxでstickyを維持した。
- 3000のconsoleはfavicon 404とscreenshot readback時のWebGL driver performance warningだけで、
  page / shader由来errorはない。3001のconsole error / warningは0。

### Decision conformance

- **DEC-009: PASS.** 3019をshaderだけで採用し、有限面光源、world-space遮蔽物、bloom、最終RGB
  maskを追加せず、既存macro compositionへheight由来material responseだけを接続した。
- **DEC-010: PASS.** 採用shaderと写真案を合成せず、canonical 3000と独立対照3001へ分離した。

### Scoped verdict

**PASS — AC-035 convergence.** 3019採用、3001の写真案保全、desktop / mobile / scroll、hash、
listener整理、DEC-009 / DEC-010 conformanceを確認した。`Site-Feat-17`の下流ページとproduction
visualは未完了なので、文書全体の`PARTIAL` verdictとtaskのactive状態は変更しない。

### Closure checks

- PASS: `glslangValidator -S frag public/first-view/light.frag`。
- PASS: `npm test -- --run` — 2 files / 19 tests。
- PASS: `npm run typecheck`、`npm run lint` — 32 files、fixなし。
- PASS: `npm run build -- --webpack` — canonical asset current、static 9 routes生成。
- PASS: `bash scripts/check-docs.sh`、`git diff --check`。
- PASS: `docs-cleanup`でIntent / QAをlive pathへ維持した。Planとhandoff draftは`Site-Feat-17`本体が
  未完了のためarchiveせず、比較workspaceも削除していない。

## 2026-07-20 scene-referred radiance transport verification

### Implementation and checkpoint evidence

- 採用3019を`/home/penne/dev/scratch/temp/otibo-first-view-transport/3019`へ保全した。shaderの
  SHA-256は`763a41ca321f1f1a97497edabb7517ffd9e68e46d7c90c63e0eda897a67111fb`、
  height mapは`48d0637db927bbf1da36db2f80e8a07ec33358fb1344a077a4384797d79b6f5e`である。
- transport-v1〜v4を独立static buildとして同scratch rootへ保存し、v5をcanonical 3000へ採用候補として
  反映した。最終shaderと`out/first-view/light.frag`はSHA-256
  `bd04337a0d1140df4f516426605af7a0fb509902671461d9cb074902311f2899`で一致する。
- 完成RGBの`cool` / `lit` mix、height / fine height / curvatureの最終RGB直接加算、影色のRGB減算を
  廃止した。macro fieldは`directIrradiance`、`directVisibility`、`ambientLevel`へ分け、
  `ambientRadiance + diffuseRadiance + specularRadiance`を一つのscene radianceとしてsensor shoulderへ渡す。
- height mapはnormal、roughness、ambient visibilityのmaterial parameterだけを介して出力へ作用する。
  multi-pass bloomはtransport誤差を隠さないため本段階へ含めていない。

### Macro composition and saturation evidence

- desktop `1440x900`初期像の68%輝度maskは3019の面積`0.286731`に対して採用候補`0.289328`で、
  相対差は約`+0.9%`。重心は`(826.13, 556.95)`から`(814.238, 556.584)`へ約12px移動し、
  画面対角比約`0.7%`。長軸角度は`162.483°`から`161.988°`で差は約`0.5°`だった。
- 94% near-white面積は3019の`0.145108`から`0.111748`へ縮小したが、中心のclippingは明確に残し、
  青緑材から琥珀、cream、暖白、飽和へ至る領域を広げた。最終視覚採否はオーナー比較へ残す。
- scroll進捗`0.499`では直射スペクトルが斜光の琥珀から正面寄りの暖白へ移り、ambient fillも同時に増える。
  進捗`0.974`、exit wash`0.973`でほぼsurface whiteへ収束した。

### Browser and deterministic evidence

- production static buildを3000へ公開し、Browser pluginでtitle `otibo`、canvas status `ready`、First View
  `900px`、横overflow`0`、console error / warning`0`を確認した。実scroll `420px`後は進捗`0.499`、
  render count`2 → 3`、Principle top`1470px`で、wordmarkはwash開始前のopacity`1`を維持した。
- GPU描画可能なPlaywright Chromiumでdesktop `1440x900`初期像とmobile `390x844`進捗`0.494`を確認した。
  両viewportでcanvas status `ready`、R8 `3072x6144`、横overflow`0`、page / shader error`0`だった。
- desktop初期像の二captureはSHA-256
  `04900e84a6e918035ffb485361641c4fae3eb837e29e1b270e550c8e478028cc`で一致し、
  ImageMagick AEは`0`。同じcaptureはtransport-v5 checkpointともbyte一致した。

### Decision conformance

- **DEC-011: PASS.** macro構図をirradiance / visibilityとして再利用し、materialからの出射光を一つの
  radiance計算へ統合した。禁止した完成RGB mix、height直接加算、影色減算、bloom再導入はない。
- **DEC-009: superseded for this stage.** 3019の完成RGB固定はオーナー指示により再訪し、構図fieldだけを
  拘束するDEC-011へ進んだ。3019自体は比較可能なcheckpointとして保全している。

### Scoped verdict

**PASS — AC-036 comparison readiness.** transport統合、3019 checkpoint、macro guardrail、決定性、
desktop / mobile / scroll / exit wash、build / deployment compatibilityを確認した。最終視覚採否と後続の
HDR bloom / sensor responseはオーナー判断待ちであり、文書全体の`PARTIAL` verdictと`Site-Feat-17`の
active状態は変更しない。

### Closure checks

- PASS: `glslangValidator -S frag public/first-view/light.frag`。
- PASS: `npm test -- --run` — 2 files / 19 tests。
- PASS: `npm run typecheck`、`npm run lint` — 32 files、fixなし。
- PASS: `npm run build -- --webpack` — canonical height map current、static 9 routes生成。
- PASS: `npm run deploy:dry-run` — `out`の527 assetsを受理。
- PASS: `bash scripts/check-docs.sh`、対象fileの`git diff --check`。
- PASS: `docs-cleanup`でPlan / Intent / QAをlive pathへ維持した。`Site-Feat-17`とオーナー採否が未完了のため、
  Plan / handoff draft / checkpoint workspaceはarchiveしていない。
