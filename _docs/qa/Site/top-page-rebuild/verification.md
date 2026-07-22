---
title: "QA Verification: Top page rebuild"
status: active
draft_status: n/a
qa_status: partial
risk: Medium
qa_schema: 2
created_at: 2026-07-11
updated_at: 2026-07-22
references:
  - "_docs/intent/Site/top-page-rebuild/decision.md"
  - "_docs/plan/Site/top-page-rebuild/plan.md"
  - "_docs/qa/Site/top-page-rebuild/test-plan.md"
  - "_docs/intent/Site/first-view-light-shader/decision.md"
  - "_docs/qa/Site/first-view-light-shader/test-plan.md"
  - "_docs/qa/Site/first-view-light-shader/verification.md"
  - "../../../../prototypes/top-page-product-wireframe/design-qa.md"
related_issues: []
related_prs: []
---

<!-- Canonical path: _docs/qa/Site/top-page-rebuild/verification.md -->

# QA Verification: `Site-Feat-17` — Top page rebuild

## Summary

2026-07-11時点の中間verification。オーナーの手描きスケッチをsource visualとして、Products領域の
product module構造だけをproduction外prototypeで確認した。Site-Feat-17全体のpage composition、
実asset / destination、principle / contact統合は未完了であり、本verificationは完了判定ではない。

2026-07-17のwhy-first migrationでは、トップページ固有の現行QAをDEC-001〜DEC-010と6件のstrict
invariantへ再分類した。First Viewの値・比較variant・実験条件は専用intent / QAを正本とし、下記の
過去コマンド、manual QA、AC-009〜AC-020、旧INV-014〜INV-030の証跡は履歴として保持する。

## Verification Verdict

Verdict: PARTIAL

product module wireframeは局所的にPASS。Site-Feat-17は完了不可で、TODOに残す。

2026-07-11追記: Figma上でdesktop / mobileの4段階full-page compositionを作成し、責務順を確認した。
その後、mobile frameをFirst View一画面高、owner-authored Principle、mailto-only Contactへ同期し、同じ構造を
Next.js初版へ実装した。copy / statusの公開前確認、実logo / UI image / destination、production visual
approvalは未完了のためverdictはPARTIALを維持する。

2026-07-13追記: `@otibo/ui@0.4.0`へ更新し、productのlogo / fallbackを`LogoFrame`、UI image /
empty stateを`MediaFrame`、display / body / eyebrowを`textStyle`へ移行した。site CSSにはproduct情報列と
media railのcompositionだけを残した。desktop / mobileでsystem primitive適用後の表示を確認したが、
実UI imageと公開前のowner visual approvalは未完了のためverdictはPARTIALを維持する。

同日のvisual QAで、Products外枠、heading divider、product Separator、caption divider、mobileの
custom Scrollbarを除去した。section / product間は余白とsurface差で識別し、status badgeの細線と
link underlineだけを意味のある例外として残した。mobile media railはScrollbarなしで
`scrollLeft: 156`まで操作でき、document-level overflowも発生していない。

Google Playの公式preview asset要件を確認し、phone screenshotの推奨portrait比率`9:16`、推奨最小
`1080 × 1920px`をplaceholder寸法へ採用した。アプリ本体未完成のため中身は作らず、captionも
機能を断定しない内部識別子`Preview 01 / 02`へ変更した。可視captionは情報価値がないため表示しない。
1枚だけのproductはdesktopで2枚分の幅へ引き伸ばさない。

2026-07-14追記: First View wordmarkの左上、中央左、右下を操作可能なvariantとして比較し、
小さな暖色低alpha文字を右下の署名として置く案をオーナーが採用した。First Viewのwordmark方向は
収束したが、shader本体と下流を含むproduction visual全体は未承認のためverdictはPARTIALを維持する。

同日追記: scroll-linked候補を操作可能な3001〜3004で比較した。光帯の回転、速度圧縮、表面残像は
静止像の光と反応が同じ現象としてつながらず不採用とし、同じ表面への入射角を斜光から正面寄りへ
持ち上げる案をオーナーが00 baselineとして承認した。本線3000へ収束し、比較用3001〜3004は停止した。
この承認はFirst Viewのscroll方向に限り、細部とページ全体の3秒 / 30秒判定は継続する。

同日追記: 退出直前にPrincipleの白い面が細く先行して見える状態を調整した。総区間180svhは維持し、
scroll進捗をsticky移動量の前半85%で完了、shaderをsurface whiteへ収束して残り15%を保持する。
desktop実操作で、全面白の保持後に同じ白面のままPrincipleへ入れ替わることを確認した。

同日追記: その後、線形の総区間を180〜400svh、200〜280svh、210 / 230svhの順に実操作比較した。
オーナー判断により210svhへ収束し、上記180svhの判断を置き換えた。前半85%で照明進捗を完了し、
残り15%でsurface whiteを保持する配分は維持する。これはFirst Viewの操作区間に限る承認であり、
product facts / assetsとページ全体のproduction visual判定は未完了のためverdictはPARTIALを維持する。

同日追記: 終盤washが一度のscroll入力で全面白へ切り替わる状態を調整し、wash開始を進捗0.82から
0.74へ前倒しした。210svh、白到達点1.00、白保持15%は変えていない。desktop実操作では進捗0.74から
120px送った0.918でも色と表面が残り、1.00で全面白、以降の保持区間へ接続することを確認した。

同日追記: 全面白にFirst View wordmarkが残る状態を解消した。shaderとwordmarkは同じexit-wash
policy値を共有し、wordmarkは`1 - wash`で薄くなる。進捗0.87でopacity約0.5、全面白と白保持で0、
戻しscrollで同じopacityへ復元することをdesktop実操作で確認した。

同日追記: First Viewの光学的な輝度分布を詰めるため、本線3000を固定したまま、白飛び面積、厚い
グロー、周辺コントラストの一時variantを3001〜3003へ分離した。desktopの進捗0 / 0.505で全案の
shader status `ready`、同一scroll追従、進捗0.505でexit wash 0を確認した。採用案は未決定のため、
First Viewのproduction visual判定とverdictはPARTIALを維持する。

同日追記: オーナー判断により、厚いグロー案と周辺コントラスト案を統合して本線3000へ収束した。
広い白飛び案は光帯内部の中間階調を失うため不採用とした。desktop / 390x844の初期像とdesktopの
進捗0.505 / 0.74 / 0.87 / 1.00を確認したが、ページ全体のproduction visualは未承認のためverdictは
PARTIALを維持する。

2026-07-15追記: material detailの解像度仮説を分離するため、build-time height mapを512x1024から
1024x2048へネイティブ再生成した。生成式とpixel-spaceの傷・孔の個数／半径は補正せず、解像度変更に
伴う見かけのスケール変化も比較対象に含める。2回の再生成とHTTP取得は同一SHA-256になり、assetは
2,010,347 bytes、desktop canvasは初期表示と480px scroll後の双方でstatus `ready`を維持した。
見た目の採否は未判定のため、material detailと全体verdictはPARTIALを維持する。

同日追記: 上記1024x2048を3000の基準として、3001に生成式固定の2048x4096、3002に微細孔・粒、
3003に中間粒径の候補を起動した。全案のshader、drawing buffer、scroll、wordmarkを固定し、
1505x1289の初期像と480px scroll後でcanvas status `ready`、page由来のconsole warning / errorなしを
確認した。オーナー選択前のためStep 10 / 11は継続し、verdictはPARTIALを維持する。

同日追記: オーナー判断により2048x4096のresolution-only案を本線3000へ採用した。生成式、
pixel-spaceの傷・孔、shader、drawing bufferは変えず、初期表示と480px scroll後でcanvas status
`ready`を再確認した。微細孔・粒と中間粒径は採用せず、比較用3001〜3003を停止した。素材種別と
ページ全体のproduction visualは未決定のため、verdictはPARTIALを維持する。

同日追記: 素材族を一見して判別できる濃度で比較するため、3001に紙、3002に石／漆喰、3003に布の
2048x4096 height mapを起動した。3000のasset、shader、drawing buffer、scroll、wordmarkは固定し、
desktopの初期像と480px scroll後、mobile初期像で全案のcanvas status `ready`を確認した。三案の
比較環境は成立したが、オーナー選択と本線への収束は未実施のためverdictはPARTIALを維持する。

同日追記: 石案の不快感を孔の形状へ切り分け、3001の紙v2、3002のrim付き孔を除いた石v2、保持した
3003の布、3004の砂、3005の砂利を起動した。3000と布のasset hash、全案のshader hashは不変。
desktop初期像と480px scroll後で全案がcanvas status `ready`、mobile `390x844`の石v2 / 砂利もreadyで
横overflowなし。砂は連続した粒状面、砂利は個々の礫として判別でき、rim付き円形孔の反復はない。
素材選択と本線への収束は未実施のためverdictはPARTIALを維持する。

2026-07-16追記: First Viewから時間driftと常時frame loopを除き、変化要因をscrollだけへ限定した。
3000〜3005のdesktop固定位置で1.1秒差のrender countとscreenshot hashが一致し、3005はscrollY
`0 → 480`でcountが`2 → 3`、progressが`0.000 → 0.713`へ更新された後、再び静止した。mobile
`390x844`でも固定位置のcount / hash一致と横overflowなしを確認した。First Viewの局所修正はPASSだが、
素材選択とページ全体のproduction visual承認は未完了のためverdictはPARTIALを維持する。

同日追記: 3001の紙v2、3003の布、3004の砂を同じ入力として、布60%・紙v2 10%・砂30%を
周波数分担した3006と、同じheight pixelを純加重平均した3007を起動した。両案は2048x4096、
入力hash、比率、shaderを共有し、blend方式だけが異なる。desktop `1280x720`の初期像とscrollY
`480`、mobile `390x844`の初期像でready、横overflowなし。固定位置の1.1秒差captureは一致した。
比較環境はPASSだが、素材選択とページ全体のproduction visual承認は未完了のためPARTIALを維持する。

同日追記: 上記blendの目的を、素材名の模倣ではなく「解像感 / 情報量はあるが何であるかを同定
できない」状態と明確化し、3008を追加した。同じ三素材から低・中・高周波を分け、格子・長繊維・
均質粒の方向性を複数方向へ再配置した。height mapの標準偏差0.167799、隣接pixel差はx=0.122604、
y=0.127090で、3007より局所情報を保つ。desktop / mobileでready、固定位置の時間差capture一致、
scroll時だけ更新を確認した。比較環境はPASSだが、オーナー選択前のためPARTIALを維持する。

同日追記: 3006の光帯のぼけを保ちながら周波数分担を強めた3009を追加した。布を低周波、砂を
中周波、紙v2を高周波へ限定し、入力、0.6 / 0.1 / 0.3比率、RMS正規化、出力分散、shaderは3006と
共有する。周期境界filterで反復位置の継ぎ目を除き、desktop `1280x720`の初期像とscrollY `480`、
mobile `390x844`でready、固定位置の1.1秒差capture一致、横overflowなしを確認した。比較環境は
PASSで、現generatorによる3006〜3008の再生成hashも従来値を維持した。オーナー選択と本線への
収束前のためPARTIALを維持する。

同日追記: オーナー判断により3009を新しいFirst View baselineとして3000へ収束した。canonical
generatorは布・紙v2・砂の生成からstrong-frequency blendまでを一時assetなしで再現し、出力SHA-256
`2d2574eae859921c937d33a451330ed0bcb549c349bf6420f23e59dc2cd4646c`は3009と一致する。比較は
3001の元の布と3002の新baselineだけに整理し、他portを停止した。desktopの3000 / 3002 captureは
完全一致し、固定位置では時間変化せず、scroll時だけ描画が更新された。mobile `390x844`もreadyで
横overflowなし。First Viewのbaseline収束はPASSだが、product facts / assetsとページ全体のproduction
visual判定は未完了のためverdictはPARTIALを維持する。

同日追記: 新baselineに残る布の位相連続性を比較するため、3003〜3005へ等方carrier置換率
25% / 45% / 60%の3案を追加した。2048x4096、0.6 / 0.1 / 0.3帯域配分、出力分散、shader、
scroll、wordmarkを固定し、3案の生成SHA-256は反復実行で一致した。3000のcanonical hashは不変、
3000〜3005はHTTP 200、shader hashも全portで一致する。最終値への更新後にin-app Browser接続が
切れたため、desktop / mobileの最終captureとscroll interaction、オーナー選択は未確認であり、
verdictはPARTIALを維持する。

同日追記: オーナー判断により位相置換25%を新しいFirst View baselineへ採用した。canonical generatorは
旧3003と同じSHA-256`900b6527353b75dc813c1e2305594bd067cb99c209ea9ee7b475fb7544674ed1`を
一時assetなしで再生成する。3001の元の布を保持し、3002へheight-map微粒子、3003へ静的な
post-shader微粒子を追加した。3000 / 3002はshader、3000 / 3003はheight mapを共有する。
desktop `1280x720`の初期像とscrollY `480`、mobile `390x844`の初期像でready、横overflowと
page由来errorなし。固定位置では描画が停止し、3003の粒子はexit wash 1.000でwordmarkとともに消える。
比較環境はPASSだが、粒子案の選択とページ全体のproduction visual承認は未完了のためPARTIALを維持する。

同日追記: 2048x4096 / 3072x6144 / 4096x8192を同条件でWQHD比較し、3072x6144をFirst Viewの
canonicalへ収束した。PNGは17,364,753 bytes、再生成SHA-256一致、runtimeはR8で18 MiBを使用する。
4096案は単一asset 25 MiB上限を超えたが、3072案は495 assetsのWorkers dry-runを完了した。
WQHD / mobileともready、横overflowなし、固定位置で静止しscroll時だけ描画を更新する。First Viewの
解像度軸はPASSだが、実product assetとページ全体のproduction visual承認は未完了のためPARTIALを維持する。

## Commands Run

```bash
# 2026-07-16 First View material blends
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
browser QA at 1280x720 and 390x844 for 3006 / 3007 / 3008 / 3009

# 2026-07-16 First View scroll-only rendering
npx biome check app/_components/first-view/light-engine.ts app/_components/first-view/light-policy.ts app/_components/first-view/light-policy.test.ts
npm run typecheck
npm test
rg -n "u_time|elapsedSeconds|lastFrameTime|shouldRunLightAnimation|time \\*|materialUv = uv \\+" app/_components/first-view public/first-view/light.frag
sha256sum the 3000..3005 shader assets
browser QA at 1280x720 for 3000..3005 fixed-position renderCount and screenshot hash
browser QA at 1280x720 for 3005 scrollY 0 / 480 and post-scroll stability
browser QA at 390x844 for 3005 fixed-position stability and horizontal overflow
node --check scripts/generate-light-height-map.mjs
regenerate canonical 3072x6144 asset and compare SHA-256 / bytes
npx biome check app/_components/first-view/light-engine.ts app/_components/first-view/light-engine.test.ts
npm run lint
npm run typecheck
npm test -- --run
npm run build
npm run deploy:dry-run
browser QA for 3000 at 2560x1440 and 390x844, fixed-position stability and scroll-only rendering
browser QA at 1280x720 for 3000..3003 initial render, scrollY 480, fixed-position stability, and exit wash
browser QA at 390x844 for 3002 / 3003 initial render and horizontal overflow
npm run build
npm run deploy:dry-run
sha256sum public/first-view/light-height-map.png
git diff --check

cd prototypes/top-page-product-wireframe
npm install
npm run build

cd /home/penne/dev/active/otibo-dev
npx biome check app/page.tsx app/_components/top-page/TopPageContent.tsx app/_components/top-page/top-page.module.css
npm run typecheck
npm test -- --run
npm run build
npm run deploy:dry-run
DD_SCOPE_PATHS=... deno run --allow-read --allow-env --allow-run=git scripts/validate-frontmatter.mjs
deno run --allow-read scripts/validate-todo.mjs
DD_SCOPE_PATHS=... deno run --allow-read --allow-env --allow-run=git scripts/validate-doc-links.mjs
DD_SCOPE_PATHS=... deno run --allow-read --allow-env --allow-run=git scripts/validate-qa.mjs
git diff --check

# 2026-07-15 First View recognizable material variants
node scripts/generate-light-height-map.mjs --material paper --output /tmp/.../light-height-map.png
node scripts/generate-light-height-map.mjs --material stone --output /tmp/.../light-height-map.png
node scripts/generate-light-height-map.mjs --material cloth --output /tmp/.../light-height-map.png
file / sha256sum the 3000..3003 height-map assets
sha256sum the 3000..3003 shader assets
deno fmt --check scripts/*.mjs
node --check scripts/generate-light-height-map.mjs
npm run typecheck
npm test
npm run build
npm run deploy:dry-run
browser QA at 1520x1289 and 390x844 for 3001..3003

# 2026-07-15 First View material variants round 2
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

# 2026-07-13 component migration
npm run lint
npm run typecheck
npm test -- --run
npm run build
npm run deploy:dry-run
./scripts/check-docs.sh

# 2026-07-14 First View wordmark convergence
npx biome check app/_components/first-view/first-view.module.css
npm run typecheck
npm test -- --run
DD_SCOPE_PATHS=... deno run ... scripts/validate-frontmatter.mjs
deno run --allow-read scripts/validate-todo.mjs
DD_SCOPE_PATHS=... deno run ... scripts/validate-doc-links.mjs
DD_SCOPE_PATHS=... deno run ... scripts/validate-qa.mjs
curl http://127.0.0.1:3000/
git diff --check

# 2026-07-14 First View scroll-linked 00 convergence
npx biome check app/page.tsx app/page.module.css app/_components/first-view/light-engine.ts app/_components/first-view/light-policy.ts app/_components/first-view/light-policy.test.ts
npm run typecheck
npm test
curl http://127.0.0.1:3000/
browser QA at 1280x720 and 390x844 for scroll progress 0 / mid / 1
browser QA at 1280x720 for color stage / surface white hold / Principle entry

# 2026-07-14 First View 210svh convergence
npx biome check app/page.module.css
npm run typecheck
npm test
DD_SCOPE_PATHS=... deno run ... scripts/validate-frontmatter.mjs
deno run --allow-read scripts/validate-todo.mjs
DD_SCOPE_PATHS=... deno run ... scripts/validate-doc-links.mjs
DD_SCOPE_PATHS=... deno run ... scripts/validate-qa.mjs
curl http://127.0.0.1:3000/
git diff --check
browser QA at 1280x720 for the 210svh start / mid / white / hold / sticky-release boundaries

# 2026-07-14 First View exit-wash distribution
npm run typecheck
npm test
git diff --check
browser QA at 1280x720 for progress 0.74 / +120px / 0.87 / 1.00 / white hold

# 2026-07-14 First View wordmark scroll fade
npx biome check app/_components/first-view/first-view.module.css app/_components/first-view/light-engine.ts app/_components/first-view/light-policy.ts app/_components/first-view/light-policy.test.ts
npm run typecheck
npm test
git diff --check
browser QA at 1280x720 for wordmark opacity at progress 0 / 0.74 / 0.87 / 1.00 / hold / reverse

# 2026-07-15 First View native-resolution height map trial
node --check scripts/generate-light-height-map.mjs
npm run assets:first-view
sha256sum public/first-view/light-height-map.png
npm test
npm run build
curl -fsS http://127.0.0.1:3000/first-view/light-height-map.png | sha256sum
./scripts/check-docs.sh # FAIL: pre-existing App verification residual-risk findings x3
git diff --check
browser QA at 1505x1289 for canvas ready at scrollY 0 / 480
browser QA at 1505x1289 for 3000..3003 height-map variants at scrollY 0 / 480

# 2026-07-15 First View 2048x4096 convergence
node --check scripts/generate-light-height-map.mjs
npm test
npm run build
npm run deploy:dry-run
file public/first-view/light-height-map.png
stat -c '%s bytes' public/first-view/light-height-map.png
sha256sum public/first-view/light-height-map.png
curl -fsS http://127.0.0.1:3000/first-view/light-height-map.png | sha256sum
DD_SCOPE_PATHS=... deno run ... scripts/validate-frontmatter.mjs
deno run --allow-read scripts/validate-todo.mjs
DD_SCOPE_PATHS=... deno run ... scripts/validate-doc-links.mjs
DD_SCOPE_PATHS=... deno run ... scripts/validate-qa.mjs
./scripts/check-docs.sh # FAIL: pre-existing App verification residual-risk findings x3
git diff --check

# 2026-07-16 First View strong-frequency baseline convergence
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
```

Browser QA:

- Codex in-app BrowserでNext.js初版を`1440x900`と`390x844`で確認。
- First View高はdesktop `900px`、mobile `844px`で各viewport高と一致。
- document-level horizontal overflowなし。mobile media railは2枚時だけproduct内で横送りになる。
- `Privacy` footer linkから`/medo/privacy/`へ遷移し、既存routeのtitle / contentを確認。
- desktopのcopy / media上端差を`0px`へ修正。
- mobileのpage-level horizontal overflowなし。
- Medoのprototype linkを一意に解決し、遷移を確認。
- local page由来のconsole warning / errorなし。
- 2026-07-13に`1440x900`でMedoの2枚media、`390x844`で局所horizontal railとContactへの接続を再確認。
- 2026-07-13のmobile documentは`scrollWidth === clientWidth`でpage-level horizontal overflowなし。
- 修正後の新規DOM snapshotにframework overlayなし。Browser console APIは同じbrowser sessionの修正前
  `textStyle()` RSC errorを履歴として返すため、現在状態の判定にはDOM snapshotとproduction buildを使用した。

## Automated Test Results

| Check | Result | Evidence |
| --- | --- | --- |
| Prototype build | PASS | Vite production build生成 |
| Root static build | PASS | Next.js static route 9件。prototype routeの混入なし |
| Biome / TypeScript / Vitest | PASS | 対象3ファイル、typecheck、10 tests |
| Workers dry-run | PASS | `out/`の495 assetsを読取り、bindingsなしでdry-run終了 |
| Scoped docs validators | PASS | front-matter / TODO / links / QA |
| Diff whitespace | PASS | `git diff --check` |
| `@otibo/ui@0.4.0` migration | PASS | lint / typecheck / 10 tests / static build / Workers dry-run |
| First View scroll / wordmark policy | PASS | 対象3ファイルのBiome、typecheck、18 tests |
| First View scroll-only rendering | PASS | `u_time`と再帰frameなし。3000〜3005の固定位置でcount / hash一致、scroll時だけ更新 |
| 2048x4096 height map convergence | PASS | resolution-only案を本線へ採用し、asset hashとcanvas readyを確認 |
| Recognizable material variants | PASS | 紙、石／漆喰、布の2048x4096生成、hash、同一shader、canvas readyを確認 |
| Material variants round 2 | PASS | 紙v2、孔のない石v2、布、砂、砂利の2048x4096生成、hash、同一shader、canvas readyを確認 |
| Strong-frequency blend | PASS | 3009は3006と入力・比率・出力分散・shaderを共有し、低・中・高周波へ分担。生成hash一致 |
| 3072x6144 First View convergence | PASS | canonical再生成hash一致、R8常駐18 MiB、単一PNG 25 MiB未満、Workers dry-run成功 |
| Docs wrapper | FAIL (pre-existing) | 今回のscope外にある過去3件のPASS verification residual-risk表記を検出 |

## Manual QA Results

| Check | Result | Evidence |
| --- | --- | --- |
| Source sketch comparison | PASS | `prototypes/top-page-product-wireframe/artifacts/comparison-final.png` |
| Badge placement | PASS | logo / product nameの上にstatus badge |
| One / multiple media | PASS | Sarae 1枚、Medo / Stash 2枚の同一contract |
| Desktop reading order | PASS | badge → identity → description → links、右側media |
| Mobile reading order | PASS | 情報列の後にmedia rail |
| Production isolation | PASS | root build route listにprototypeなし |
| Full-page responsibility order | PASS | Figma desktop `4:3` / mobile `4:93`で4段階を接続 |
| Next.js desktop / mobile composition | PASS | `1440x900` / `390x844`でFirst View → Principle → Products → Contact |
| Mobile overflow boundary | PASS | document `scrollWidth === clientWidth`、media railだけ局所overflow |
| Legal route interaction | PASS | footer `Privacy` → `/medo/privacy/` |
| Editorial primitives | PASS | MedoはLogoFrameImage、Sarae / StashはLogoFrameFallback、全mediaはMediaFrameEmptyを表示 |
| Border / divider reduction | PASS | Products外枠、heading / product / caption divider、mobile Scrollbarを除去 |
| Mobile rail interaction | PASS | custom Scrollbarなしでhorizontal scrollが`0 → 156`へ変化 |
| First View wordmark position | PASS | 左上 / 中央左 / 右下の比較後、オーナーが右下の署名案を採用 |
| First View scroll direction | PASS | 入射角案をオーナーが00 baselineとして採用 |
| Scroll-only interval | PASS | 210svhのdesktop区間で進捗1までPrinciple非表示、sectionは一画面高 |
| White hold before Principle | PASS | scrollY 674〜792で全面白を保持し、同じ白面のままPrincipleへ接続 |
| Exit-wash distribution | PASS | progress 0.74から120px後の0.918でも色面が残り、1.00で全面白になる |
| First View wordmark fade | PASS | opacityはprogress 0 / 0.74で1、0.87で0.4973、1.00と白保持で0 |
| First View luminance variants | PASS | 多段haloと周辺tone curveを本線3000へ収束。広い白飛び案は不採用 |
| Native-resolution height map load | PASS | 1505x1289 canvasは初期表示と480px scroll後の双方でstatus `ready` |
| Height map resolution selection | PASS | 2048x4096を本線3000へ採用し、素材種別の追加表現を分離 |
| First View material comparison | PASS | 3001=紙、3002=石／漆喰、3003=布をdesktop / mobileで判別可能 |
| First View material round 2 | PASS | 3001=紙v2、3002=孔のない石v2、3003=布、3004=砂、3005=砂利をdesktopで比較可能。石v2 / 砂利はmobileもready |
| First View fixed-position motion | PASS | desktop全portとmobile 3005で時間差capture / render countが一致。3005はscroll時だけ更新 |
| First View material blends | PASS | 3006=周波数分担、3007=純加重平均を同じ三入力・比率・shaderで比較可能。desktop / mobileともready |
| First View feature-neutral blend | PASS | 3008は単一素材の方向性を中和し、3007より高い局所変動を維持。desktop / mobileともready |
| First View strong-frequency blend | PASS | 3009は周期境界の継ぎ目なく低・中・高周波を分担。desktop / mobileともready |
| First View baseline convergence | PASS | 3000 / 3002はasset・shader・desktop captureが一致。3001だけclothを保持し、他比較portはinactive |
| First View phase replacement variants | PASS | 25% / 45% / 60%を比較し、オーナー判断により25%を新baselineへ収束 |
| First View particle insertion variants | PASS | 3002=height-map微粒子、3003=静的post-shader微粒子をdesktop / mobileで比較可能 |
| First View 3072 resolution | PASS | WQHD比較後に3072x6144を採用。WQHD / mobileでready、固定位置では静止しscroll時だけ更新 |

## Acceptance Criteria Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| AC-001 | PASS | prototypeはproduction route / static exportへ含まれない |
| AC-002 | PASS | FigmaとNext.js初版で4段階の責務を同順に接続し、固定section templateを要件化していない |
| AC-003 | PASS | First Viewの局所契約と証跡を専用intent / QAへ委譲し、トップページ側では下流接続だけを判定する |
| AC-004 | PARTIAL | 全page体験は実装。product facts / assetsの公開前確認が未完了 |
| AC-005 | PARTIAL | Principle / contact / legalは追跡可。product status / destination / assetは未承認 |
| AC-006 | PARTIAL | desktop / mobile / semantic / internal keyboard linkを確認。全keyboard巡回とreduced-motion browser QAは未実施 |
| AC-007 | PASS | root static buildとWorkers dry-run成功 |
| AC-008 | PARTIAL | First View wordmarkはオーナー承認済み。shader本体と3秒 / 30秒のproduction visual全体は未承認 |

## Decision Conformance

| ID | Result | Why the implementation remains aligned |
| --- | --- | --- |
| DEC-001 | PARTIAL | prototypeとshader-only stateはproduction routeから隔離されているが、実asset / factsとowner approvalが未完了でdeploy candidateにはできない |
| DEC-002 | PASS | 旧sectionやPanda classを互換条件として復元せず、新しいcompositionを実装した |
| DEC-003 | PASS | First Viewの局所実装と実験証跡は専用intent / QAへ委譲し、トップページ側では下流との接続だけを扱う |
| DEC-004 | PASS | FigmaとNext.jsで「見る → 読む → 確認する → 所在」の責務順を確認し、固定section templateを要件化していない |
| DEC-005 | PARTIAL | prototype copyをfinal owner copyとして扱っていないが、product description / statusの公開前確認が残る |
| DEC-006 | PASS | 現行product moduleは初版仮説に留まり、card / UI断片 / gridや固定media数を恒久要件にしていない |
| DEC-007 | PARTIAL | Medo icon以外の欠落を補作していない一方、product facts / destinations /実assetの確認が残る |
| DEC-008 | PASS | legal route、static export、Workers Static Assets dry-runを維持した |
| DEC-009 | PASS | logo / media / typography roleを`@otibo/ui@0.4.0`へ委譲し、site CSSはcompositionを所有する |
| DEC-010 | PASS | section / product境界を余白とsurfaceで表現し、意味のない外枠 / dividerを除去した |

## Invariant Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| INV-001 | PASS | shader-only / wireframeをdeploy candidateにしていない |
| INV-005 | PASS | prototype copyをfinal owner copyとして扱っていない |
| INV-007 | PARTIAL | placeholderはproduction外だが、production用product facts / assetsは未確定 |
| INV-008 | PASS | legal route、static export、asset-only deploymentを変更していない |
| INV-009 | PARTIAL | name / description / statusのslotはあるが、公開値のowner確認が残る |
| INV-010 | PARTIAL | 欠落assetを補作していないが、実asset / destinationの充足が残る |

## Historical First View Acceptance Evidence

以下は旧top-page-rebuild QAでACとして検証した履歴である。現行の契約と再検証は
`_docs/qa/Site/first-view-light-shader/test-plan.md`と`verification.md`を正本とする。

| Legacy ID | Historical Result | Historical Evidence |
| --- | --- | --- |
| AC-009 | PASS | 入射角00 baselineを210svhで本線へ収束し、全面白の保持後にPrincipleへ接続することを確認 |
| AC-010 | PASS | washを進捗0.74〜1.00へ分散し、開始点から120pxで全面白へ切り替わらないことを確認 |
| AC-011 | PASS | wordmarkはwashと同期して薄くなり、全面白と白保持で見えなくなる |
| AC-012 | PASS | 同じ光学条件で紙、石／漆喰、布をheight map起伏だけから判別できる |
| AC-013 | PASS | 紙v2、孔のない石v2、布、砂、砂利を同条件で比較し、砂と砂利を連続面／個体として判別できる |
| AC-014 | PASS | 固定scroll位置では時間差capture / render countが一致し、scroll後だけ入射角とwashを更新 |
| AC-015 | PASS | 同じ布・紙v2・砂と0.6 / 0.1 / 0.3比率から、3006の周波数分担と3007の純加重平均を比較可能 |
| AC-016 | PASS | 3008は三素材の識別特徴を中和し、3007より高い隣接pixel差を持つ第三案として比較可能 |
| AC-017 | PASS | 3009は3006と同じ入力・比率・出力分散・shaderで、低・中・高周波の分担だけを強調 |
| AC-018 | PASS | 3009を再生成可能な3000 baselineへ採用し、3001の布と3002の新baselineだけをactive comparisonとして残した |
| AC-019 | PASS | 25% / 45% / 60%を同条件で比較し、位相置換25%を新しい00へ収束した |
| AC-020 | PASS | 3000の位相置換25%、3001の布、3002のheight-map微粒子、3003のpost-shader微粒子をdesktop / mobileで操作比較可能 |

## Legacy ID Disposition and Historical Evidence

旧INVのうちstrict invariantではない項目は、判断理由と変更自由度を持つDEC、First View正本、
またはsupersededな実験履歴へ移した。結果欄は移行前に得た証跡であり、現行INV coverageではない。

| Legacy ID | Current Disposition | Historical Result | Historical Evidence |
| --- | --- | --- | --- |
| INV-002 | DEC-002 | PASS | 旧sectionを復元していない |
| INV-003 | DEC-003 | PASS | First Viewへ下流要素を追加していない |
| INV-004 | DEC-004 | PASS | FigmaとNext.jsで4段階の責務順を統合 |
| INV-006 | DEC-006 | PASS | card / UI断片 / gridをproduction仕様へ固定していない |
| INV-011 | DEC-003 / First View正本 | PASS | desktop / mobileともFirst View高がviewport高と一致 |
| INV-012 | DEC-009 | PASS | logo / media / typography roleを`@otibo/ui@0.4.0`へ委譲 |
| INV-013 | DEC-010 | PASS | section / product境界を余白とsurfaceで表現し、反復dividerを除去 |
| INV-014 | First View正本 | PASS | scrollをmaterial座標へ加えず、入射角だけを変更 |
| INV-015 | First View正本 | PASS | 光帯幅、影、正面fillを単一の`u_scroll_progress`から派生 |
| INV-016 | First View正本 | PASS | 210svhのdesktop区間で一画面高とPrinciple露出境界を確認 |
| INV-017 | First View正本 | PASS | reduced motion時の進捗0固定をunit testで確認 |
| INV-018 | First View正本 | PASS | 進捗完了後のsurface white保持とPrinciple露出境界をbrowser確認 |
| INV-019 | First View正本 | PASS | washの単調変化とengineに遅延追従がないことを確認 |
| INV-020 | First View正本 | PASS | shaderとwordmarkが同じpolicy由来のwash値を共有 |
| INV-021 | First View正本 / 実験履歴 | PASS | 素材比較の一軸条件を保持 |
| INV-022 | First View正本 / 実験履歴 | PASS | 石v2 / 砂利の比較条件とasset hashを確認 |
| INV-023 | First View正本 | PASS | shaderの時間入力とengineの常時frame loopを除去 |
| INV-024 | First View正本 / 実験履歴 | PASS | 3006 / 3007でblend方式だけを変更 |
| INV-025 | First View正本 / 実験履歴 | PASS | 3008で局所detailを維持して特徴を再配置 |
| INV-026 | First View正本 / 実験履歴 | PASS | 3009で通過帯域だけを狭め、継ぎ目を除去 |
| INV-027 | superseded | PASS (historical) | strong-frequency baselineの収束証跡。後続baselineに置き換えられ、現行契約ではない |
| INV-028 | First View正本 / 実験履歴 | PASS | 位相置換3案を同条件で決定的に再生成 |
| INV-029 | First View正本 / 実験履歴 | PASS | canonical、cloth、height-map粒子、post-shader粒子の比較条件を確認 |
| INV-030 | First View正本 / 実験履歴 | PASS | 3072x6144、texel基準shader、R8 upload、Workers dry-runを確認 |

## Deferred / Not Covered

- productごとの公開可能なdescription / status / destination。
- Sarae / Stashの製品固有logoと、Medo / Stashの実UI image。
- full pageのreduced motion / 全keyboard巡回。
- production visualと3秒 / 30秒体験のオーナー承認。
- First Viewの現行係数、asset、実験baselineの残課題は専用verificationを正本とする。

## Residual Risks

- wireframe placeholderや仮linkをproductionへ転用するとINV-007 / INV-010に違反する。
- 現Next.js初版にはlogo / UI image placeholderがあるためdeploy candidateではない。
- product description / statusはprototype値であり、公開事実としての再確認が必要。
- media枚数とmobile横送りは、実assetのaspect ratio次第で再調整が必要になる。
- 110svhの照明操作区間が30秒以内の理解を遅らせる可能性があり、ページ全体のowner reviewが必要。
- `./scripts/check-docs.sh`は今回の変更外にある`App/top-page-initial`、`App/ui-integration`、`App/scaffold`の
  過去verification 3件を理由にFAILする。今回更新したtop-page-rebuild文書の追加エラーはない。
- 3072 PNGは17,364,753 bytesある。4096の見た目を再追求する場合は単一PNGへ戻さず、分割texture、
  圧縮形式、段階読込みを別の性能比較として扱う必要がある。

## Follow-up TODOs

- `Site-Feat-17` Step 3を継続し、product facts / destinations /実assetを充足する。
- 実asset反映後にresponsive / reduced motion / keyboard QAとproduction visual reviewを行う。
- First Viewの次の調整は専用intent / QAで扱い、このverificationには全体接続の結果だけを反映する。

## Product Asset Inventory — 2026-07-11

- Medoの製品固有iconを`/home/penne/dev/active/backcast/assets/images/medo_icon.png`から取得した。
- SaraeのQA screenshotは掲載用assetではないため不採用とした。
- Stashの現行AppIconはFlutter標準assetのため、製品logoとして不採用にした。
- Medo iconだけを先行反映した。Sarae / Stash logo、全product UI image、全product destinationは未確認のまま補作していない。

## 2026-07-22 production placeholder removal

- `Product.media`を実在する`src`必須の任意情報へ変更し、実在mediaがないMedo / Sarae / Stashから制作時の`Preview 01 / 02`配列と`MediaFrameEmpty`を除去した。mediaが0件ならrail自体をrenderせず、name / description / statusと実在logo / fallbackだけでproduct紹介を成立させる。
- desktop `1600x900`とmobile `390x844`でProductsを実見した。`UI image`文字とmedia frameはDOM / 画面に残らず、product単位のreading order、Contact / legalへの接続、横overflowなしを維持した。
- PASS: `npm test` — 4 files / 38 tests、`npm run typecheck`、`npx biome check app/_components/top-page/TopPageContent.tsx app/_components/top-page/top-page.module.css`。
- PASS: `npm run build` — static 9 routes。最終のWorkers dry-runとdocs validationはFirst View checkpoint 52と同一closure runで確認する。
- **Verdict remains PARTIAL.** production placeholderというINV-007 / INV-010違反要因は除去した。product description / status / destinationの公開直前確認、実assetが加わる場合のmedia QA、full-page reduced motion / keyboard、3秒 / 30秒とproduction visualのowner承認は未完了である。
