---
title: "QA Verification: Top page rebuild"
status: active
draft_status: n/a
qa_status: partial
risk: Medium
qa_schema: 2
created_at: 2026-07-11
updated_at: 2026-07-31
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
| AC-006 | PARTIAL | desktop / mobile / semantic / keyboardを確認。keyboardは2026-07-30に実操作でPASS（tab order 5要素、focus ring contrast 8.58:1 / 6.51:1、初回Tab跳躍後もshader健全）。reduced-motionの体験判断とmobile階層逆転が残る |
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
| DEC-011 | PARTIAL | sizeは`textStyle` roleが持ち、site側の上書きはmobile段下げ1例外へ縮小した（2026-07-30）。ただし参照する`display.sm`が未publishのため、上書き削除を確定扱いにできない |

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
- ~~`./scripts/check-docs.sh`は`App/top-page-initial`、`App/ui-integration`、`App/scaffold`の過去verification
  3件を理由にFAILする~~ 2026-07-30時点で解消。`./scripts/check-docs.sh`はexit 0（78 PASS）で通る。
- **production buildが未publishの依存に乗っている。** principle見出しの63pxは`@otibo/ui`の未publish `dist`を
  node_modulesへ手で置いた状態に依存し、clean installや`npm install`で5.5remへ巻き戻る。publish完了まで
  現buildをdeploy candidateとして扱えない。退避元は`@otibo/ui@0.4.0`のdist backup。
- 3072 PNGは17,364,753 bytesある。4096の見た目を再追求する場合は単一PNGへ戻さず、分割texture、
  圧縮形式、段階読込みを別の性能比較として扱う必要がある。

## Follow-up TODOs

- `Site-Feat-17` Step 3を継続し、product facts / destinations /実assetを充足する。
- 実asset反映後にresponsive / reduced motion QAとproduction visual reviewを行う（keyboardは2026-07-30にPASS）。
- `@otibo/ui`の`display.sm`をcommit → bump → publishし、otibo-devの依存を更新してnode_modulesの手差し替えを解消する。
  publishはowner実行（不可逆・passkey必須）。
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

## 2026-07-28 content truth re-confirmation and Publication Gate audit

`Site-Feat-17` step 3のために、Content ContractとPublication Gateへ現行実装を照合した。First Viewは
DEC-017で凍結済みであり、本監査でshader / height map / engine / policyは変更していない。

### Publication Gate audit

| Gate | 判定 | 根拠 |
|------|------|------|
| owner-authored principle copyが確定している | PASS | 2026-07-28、オーナーが現行copy（見出し + 2段落）を承認済みとして公開可と明示した。 |
| 各productのname / description / statusが公開直前に再確認されている | PASS | 下記 product truth correction を参照。 |
| 任意assetとlinkが実在し現状と一致している | PASS | 実在assetはMedo iconのみ。UI image、destination linkはどこにも置いていない。 |
| contact / legal routeが到達可能である | PASS | `contact@otibo.dev`のmailto、`/tokushoho/`、Medoのprivacy / terms / account-deletionがfooterから到達可能。 |
| 未確定値をplaceholderや生成copyで完成済みに見せていない | PASS | logo未所持productは頭文字fallbackのみ。捏造したlogo / 画面 / linkはない。 |

### Product truth correction

repo実態を確認し、2026-07-11 inventoryの誤りを訂正した。詳細は
`_docs/plan/Site/top-page-rebuild/plan.md`の§Product source re-confirmation — 2026-07-28。

- **Medo**: `プロトタイプ` → `テスト中`。オーナー確認により、ストア公開が近い実態へ更新した。
- **Sarae**: `プロトタイプ` → `構想中`。**実装が存在しない**。repoは2026-07-14のinitial commit以降、
  docs-driven templateと設計ドキュメントのみで構成され、application codeを含まない。
  掲載中のdescriptionは`_docs/draft/Core/product-concept/notes.md`（sarae repo、2026-07-22更新）と
  整合するため文言は維持し、statusだけを実態へ合わせた。
- **Stash**: `開発中`のまま。`lib`配下に41のDartファイルがあり、記載と整合する。

`プロトタイプ`はContent Contractのstatus例（`公開中` / `テスト中` / `開発中` / `構想中`）に含まれない
表記でもあった。今回の訂正で3製品ともcontract例の語へ揃った。

### Incidental fix

- `npm run lint`が`worktrees/first-view-shader/biome.json`をnested root configurationとして検出し、
  check全体を中断していた。`biome.json`の`files.includes`へ`!**/worktrees`を追加して解消した。
  この中断により`tsconfig.json`のformat差分が長期間検出されていなかったため、併せて`lint:fix`で整えた。
  worktree自体は削除していない。

### Evidence

- PASS: `npm run lint` — 35 files、fixなし。
- PASS: `npm run typecheck`。
- PASS: `npm test` — 4 files / 38 tests。
- PASS: `npm run build` — static 9 routes。
- PASS: `npm run deploy:dry-run` — `out`の495 assetsをasset-onlyで受理。
- PASS: `./scripts/check-docs.sh` — exit 0。
- PASS (AC-041 / DEC-017): `public/first-view/light.frag`のSHA-256は
  `19c1a1279209ecc1946378b9fe39a09bd0cdb26de39f82d4c9bf7b824ce463f8`のまま。凍結境界を越えていない。

### Residual gaps

- desktop / mobileでの実見は未実施。Browser paneが表示されずagent側から描画取得ができなかった。
  status表記の変更は視覚的にBadgeのテキスト長へ影響するため、step 5 / 6のresponsive QAで確認する。
- reduced motion、keyboard navigation、semantic structure（AC-006）は未検証。step 5の対象。
- 3秒 / 30秒体験とproduction visualのowner承認（AC-008）は未了。
- Saraeを実装のないproductとして掲載し続けるかは、contract上は許容だがowner判断の余地が残る。

### Verdict

- **AC-005（principle、product情報、contact / legal導線の承認済みsource追跡）: PASS.**
- **step 3: 完了。** Publication Gateの5項目すべてが根拠つきで満たされた。
- **Verdict remains PARTIAL.** AC-006 / AC-008とresponsive / motion / keyboardが未了のため、
  `Site-Feat-17`全体は完了不可。次はstep 5。


### Decision Conformance — 2026-07-28

- **DEC-005 / INV-005: PASS.** principle copyはオーナー執筆・承認済みとして確定した。生成文で公開可能状態を
  作っていない。承認の事実を本verificationへ記録し、Publication Gateの該当項目を根拠つきで閉じた。
- **DEC-007 / INV-007: 違反を検出し是正した。** 本監査以前、Saraeのstatus`プロトタイプ`は存在しない
  prototypeを主張しており、「実在しないproduct、status、UI componentを展示材料にしない」に反していた。
  repoに実装がないことを確認のうえ`構想中`へ訂正し、INV-007を回復した。Medoの`テスト中`もowner確認済みの
  実態へ揃えた。**この誤りはDEC-007のWhyがまさに防ごうとしたものであり、statusを実装実態から独立に
  書けてしまう構造が原因である。**再発防止として、plan §Product source re-confirmationへ根拠列を持つ
  表を追加し、statusの変更が根拠なしに行われない形にした。
- **DEC-007 / INV-009: PASS.** 3製品ともname、owner確認済みdescription、確認時点に即したstatusを備える。
  `プロトタイプ`はContent Contractのstatus例に無い語でもあり、今回3件ともcontract語彙へ収束した。
- **DEC-007 / INV-010: PASS（変更なし）.** 実在assetはMedo iconのみ。logo未所持productは頭文字fallbackで、
  捏造したlogo / UI画像 / 外部linkはない。意図的な省略として維持されており、「埋めて直す」ことをしていない。
- **DEC-001 / INV-001: PASS.** pageはshader-only状態ではなくprinciple以降を持つ。本セッションでdeployは
  実行していない。
- **DEC-008 / INV-008: PASS.** 法務routeは変更せず、static export 9 routesとWorkers dry-run 495 assetsが成功した。
- **DEC-009 / DEC-010: 本監査の対象外。** editorial primitiveのdesign system正本化とresponsive / typography
  境界はstep 5で扱う。本セッションでは`top-page.module.css`を変更していない。
- **First View DEC-017: PASS.** `light.frag`のSHA-256は
  `19c1a1279209ecc1946378b9fe39a09bd0cdb26de39f82d4c9bf7b824ce463f8`のまま。凍結境界を越えていない。
  AC-038のdeferredとAC-040のnot-applicable、wordmarkの低視認性という意図的な省略は、いずれも
  「直されて」おらず、Intent / QAに可視のまま残っている。

### Verdict — step 3

- **Verdict: PARTIAL.**
- **qa_status: partial.**
- step 3のAC-005（承認済みsourceへの追跡可能性）は満たされた。Publication Gateの5項目も根拠つきで閉じた。
- 残リスク:
  - AC-006（responsive / motion / semantic / keyboard）未検証。status文字列の変更がBadge幅へ与える影響も未実見。
  - AC-008（3秒 / 30秒とproduction visualのowner承認）未了。
  - desktop / mobileの目視証拠を本セッションで取得できていない（Browser pane非表示）。
  - Saraeを実装のないproductとして掲載し続けるかは、contract上許容だがowner判断の余地が残る。
- Follow-up: `Site-Feat-17` step 5 / 6 / 7が未完了のまま残る。TODOからの削除は行わない。


## 2026-07-28 typography role realignment (DEC-011)

`Site-Feat-17` step 5の一部として、typography roleのsize委譲を実施した。First ViewはDEC-017で凍結済みで、
本作業でshader / height map / engine / policyは変更していない（`light.frag` SHA-256は
`19c1a1279209ecc1946378b9fe39a09bd0cdb26de39f82d4c9bf7b824ce463f8`のまま）。

### Root cause

`textStyle("display")`を3箇所へ当てながら、site側が別々のclampでfont-sizeを上書きしていた。

| 要素 | 変更前のsite上書き | desktop 1600x900 実測 |
|------|-------------------|----------------------|
| principle見出し | `clamp(2xl, 4.4vw, 4xl)` | 70.4px |
| Products見出し | `clamp(2xl, 4.0vw, 3xl)` | 54px |
| product名 | `clamp(2xl, 4.2vw, 4xl)` | 67.2px |

4.4 / 4.0 / 4.2vwに設計上の意味はなくdriftであり、結果として**h3のproduct名67.2pxがh2のsection見出し
54pxを上回る階層逆転**が生じていた。

### Change

- Products見出し: `textStyle("display")` → `textStyle("heading.lg")`、site側のfont-size / weight上書きを削除。
- product名: `textStyle("display")` → `textStyle("heading.md")`、同上。
- 本文: clamp上書きを削除し`body` roleへ委譲。desktopでは20.25pxで実測変化なし（clampが既にmdへ解決していた）。
- principle見出し: `display` roleを維持し、font-sizeのみ`clamp(2xl, 4vw, 3.5rem)`で抑える暫定上書きを残す。

### Owner decision — principle見出し

DSのscaleは`heading.lg` 2.25rem → `display` 5.5remが2.44倍跳んでおり、他の刻み（1.17〜1.33倍）に対して
不連続である。principle見出しに必要な段が存在しないため、3案を実画面比較した。

| 案 | 実測 | 判定 |
|----|------|------|
| `display` | 99px、2行 | 大きすぎる |
| `heading.lg` | 40.5px | section見出しと同サイズ。かつbody書体へ落ち本文の延長に見える |
| **63px暫定上書き** | **63px、1行** | **採用** |

63pxは2.25remと5.5remの幾何平均にあたり、上下とも1.57倍で揃う。オーナーは63pxと72pxを別ポート
（3063 / 3072）で並べて比較したうえで63pxを採用した。`heading.lg`が不適だった主因はサイズではなく
**書体がbodyへ変わること**であり、この知見はDS側への依頼へ反映した。

### Result — desktop 1600x900 実測

principle 63px > Products 40.5px > product名 31.5px > 本文 20.25px。階層逆転は解消した。
横overflowなし（`scrollWidth` = `innerWidth` = 1600）。

### Incidental fixes

- **日本語本文のmeasure**: `.productCopy > p`が`max-width: 32ch`だった。`ch`は"0"の字幅基準のため
  全角では約20字にしかならず行が詰まりすぎていた（実測409px / 20字）。全角1字≒1emを前提に`34em`へ変更。
- **lint断絶**: `npm run lint`が`worktrees/first-view-shader/biome.json`をnested root configurationとして
  検出し、check全体を中断していた。`biome.json`の`files.includes`へ`!**/worktrees`を追加。この中断により
  `tsconfig.json`のformat差分が長期間未検出だったため、併せて`lint:fix`で整えた。worktreeは削除していない。

### Evidence

- PASS: `npm run lint` — 35 files、fixなし。
- PASS: `npm run typecheck`。
- PASS: `npm test` — 4 files / 38 tests。
- PASS: `npm run build` — static 9 routes。
- PASS: `npm run deploy:dry-run` — `out`の495 assetsをasset-onlyで受理。
- PASS: `./scripts/check-docs.sh` — exit 0。
- PASS: desktop 1600x900のcomputed font-size実測（上表）と横overflow不在。

### Residual gaps

- **mobile 390x844で階層逆転が残る**: principle見出し31.5px < Products見出し40.5px。`display` roleが
  390px幅に収まらないためsite側で段下げしているが、下げ幅がsection見出しを下回る。**この逆転は本変更で
  作り込んだものではなく、変更前から同じ値で存在していた**（変更前もprinciple 31.5px / Products 40.5px）。
  解消には、mobileでsection見出しを下げるか、principleの段下げ量を見直すかの判断が要る。未決。
- keyboard操作とreduced motionの実挙動は未検証。focus指定はDS側に22の`focus-visible`ルールがあり、
  site CSSはoutlineを一切上書きしていないことを静的に確認したのみ。
- 3秒 / 30秒体験とproduction visualのowner承認（AC-008）は未了。
- principleセクションは高さ1044pxに対し内容390px（充填率37%）。読む速度への影響は指摘済みで未着手。

### Follow-up

`@otibo/ui`へ`display.sm`（3.5rem、display書体を継承）を追加する依頼をDS側へ渡した。実装は完了報告済みだが
**Unreleased段階でありconsumerでの描画未確認**。publish前に`dist/styles.css`差し替えによる実画面確認を
行う方針で、publishはowner確認（不可逆・passkey必須）を前提とする。リリース後、
`.principle h2`の暫定上書きを削除し`textStyle("display.sm")`へ差し替える。

### Verdict

- **DEC-011: PASS.** typography roleのsize委譲が成立し、例外2箇所は解消条件つきで追跡可能である。
- **Verdict remains PARTIAL.** step 5は未完了。mobile階層逆転、keyboard / reduced motionの実挙動、
  AC-008のowner承認が残る。


## 2026-07-28 AC-006 static analysis (keyboard / reduced motion)

実操作の前に、source readingで確定できる範囲を切り分けた。実挙動の確認は未了である。

### 確定: reduced motionで下流contentへ到達できなくなることはない

First Viewの固定は純粋なCSSである。`app/page.module.css`の`.firstViewScroll`が`height: 210svh`を持ち、
その直下の`section`が`position: sticky; top: 0`で貼り付く。scrollの解放をJSの進捗値が制御していない。

したがって`resolveLightScrollProgress`がreduced motionで`0`を返しても（`light-policy.ts:52`）、
page scroll自体は通常どおり動作し、Principle以降へ到達できる。「進捗が0に固定されると下流が
永久に露出しない」という失敗様式は、この構造では発生しない。

### 未確定: reduced motion時の体験

進捗0固定により、**終盤のexit washが一度も発生しない**。reduced motion利用者は210svhの不変な像を
scrollし、Principleが白への遷移なしに現れる。wordmarkも`resolveLightExitWash(0) = 0`のため
opacity 1のまま残る（DEC-005の「署名が光の場より長生きしない」という意図とは整合する）。

破損ではないが、設計上の接続が欠落した状態である。許容可否はowner判断を要する。

### 未確定: keyboard

focusable要素はページ全体で5つ（contactのmailto link、footerの法務link 4つ）。First Viewには存在しない。

- **focus ringの視認性**: DS側に`focus-visible`ルールが22件あり、site CSSはoutlineを一切上書きして
  いないことを静的に確認した。ただしaccent outlineが`--colors-bg-sunken`（contact）と`--colors-bg`
  （footer）の各面に対して十分なコントラストを持つかは、描画を見ないと判定できない。
- **初回Tabの挙動**: focusable要素が210svhより下にしか存在しないため、読み込み直後のTabでbrowserが
  contact linkまで自動scrollする。実質skip linkとして機能するが、その急なscrollがstickyおよび
  scroll-linked描画と競合しないかは未確認。

### 方法上の注記

`light-policy.test.ts`の38 testsは「reduced motionで進捗が0を返す」ことを保証するが、
**0を返したときにpageが使えるか**は保証しない。構造QAのPASSを実挙動のPASSへ読み替えない。
本節で構造側は確定したが、視覚・操作側は残る。

### Residual

- reduced motion実環境でのscroll一往復（emulation可否は未確認。OS設定の一時変更が要る可能性がある）。
- Tab 5回によるfocus ring目視とtab orderの確認。
- **AC-006: 未了。** 構造は安全と確定、見え方と操作は未確認。


## 2026-07-30 display.sm consumerでの描画確認とAC-006 keyboard

### display.sm: consumer描画を確認、site上書きを解消

`@otibo/ui`のUnreleased `dist`をconsumerの`node_modules/@otibo/ui/dist`へ差し替え、
`.principle h2`のfont-size上書きを削除して`textStyle("display")`を`textStyle("display.sm")`へ移した。

先の想定と異なり、`textStyle()`は`textStyle_${role}`を返すだけの純粋関数であり、runtimeはrole文字列を
選ばない（`src/theme/typography.ts`）。したがって描画は`styles.css`だけで成立し、型定義だけがtypecheckを
止める。dist一式を差し替えたのは型を通すためである。

実測（1345x1289、DevTools計測ではなくgetComputedStyle）:

| 要素 | role | computed |
| --- | --- | --- |
| principle見出し | `display.sm` | 63px / display / 600 / ls -1.26px / lh 68.04px |
| Products見出し | `heading.lg` | 40.5px |
| product名 | `heading.md` | 31.5px |

site側の上書きを外した状態で63pxが出ているため、この値はDS roleが担っている。既存の`display`は
`5xl`を保持しており（`.textStyle_display { font-size: var(--font-sizes-5xl) }`）、他usageへの退行はない。

### AC-006 keyboard: PASS

前回の静的分析で未確定としていた2点を実操作で確認した。

- **focusable数と順序**: 5要素（contact mailto → 特商法 → Privacy → Terms → Account deletion）。
  tab orderは視覚順と一致し、想定外の要素は挟まらない。
- **focus ringの視認性**: `2px solid` accent `rgb(42,68,130)`、offset 2px、`:focus-visible`が一致。
  canvas経由でsRGBへ変換して測ったcontrastは`--colors-bg`に対し**8.58:1**、`--colors-bg-sunken`に
  対し**6.51:1**。WCAG 2.1 SC 1.4.11の非テキスト最小3:1を両面で上回る。両面のringを実画面で目視した。
- **初回Tabの自動scroll**: `scrollY` 0 → 4180へ跳ぶ。210svhのFirst Viewを飛び越えるが、跳躍後も
  下流contentは正常に描画され、top復帰後もWebGL contextは`isContextLost() === false`、shaderは
  checkpoint 69の像を保つ。sticky / scroll-linked描画との競合は観測されない。

### 実行したgate

`npm run lint` / `typecheck` / `test`（38 tests）/ `build` / `deploy:dry-run`（495 assets）いずれも成功。

lintは一度失敗した。原因は`.mobileBreak`直後の二重空行で、前セッションで`.principle p`ブロックを
削除した際の残りである。`biome format --write`で解消した。

### Decision Conformance — 2026-07-30

| ID | Result | 判断 |
| --- | --- | --- |
| DEC-011 | PARTIAL | 本変更はDEC-011の`Revisit when`が指示した動作そのものである。site側の恒久的な独自scaleを作らずDS側へ段を追加した点は`Why not`と一致し、上書き例外はmobile段下げ1件へ減った。ただし`Revisit when`の条件は「`@otibo/ui`へ`display.sm`が入ったとき」であり、実際にはpublish前のdistを手で置いた状態で先行実施した。条件は完全には満たしていない |
| DEC-009 | PASS | typography roleの委譲先を`@otibo/ui`に保ち、site CSSはcomposition（width / white-space / text-align）だけを持つ。primitiveの外観をsite側で再定義していない |
| DEC-003 | PASS | First Viewのshader / height map / policyを変更していない。`public/first-view/light.frag`のSHA-256は`19c1a127…`のままでAC-041の凍結を維持する |

`Change freedom`との関係では、roleの割り当て変更（`display` → `display.sm`）は「階層が保たれる限り変更できる」範囲に収まる。実測階層は63 > 40.5 > 31.5で逆転していない。

INVは本変更の影響下にない。INV-008はbuild 9 routeとdry-run 495 assetsで維持を確認した。INV-005 / 007 / 009 / 010が扱うcontentには触れていない。

### Residual

- **build再現性**: 現在のbuildはnode_modulesへ手で差し替えた未publishのdistに依存する。clean install
  からは再現できず、`npm install`で巻き戻る。`@otibo/ui`のbump / publishはowner判断待ち（不可逆・
  passkey必須）。publishまでこの状態を恒久扱いしない。
- **reduced motionの体験**: 進捗0固定でexit washが発生しない点は未解決。owner判断待ち。
- **mobile階層逆転**: 390pxで`.principle h2`が`2xl`まで下がり、Products見出し（40.5px）を下回る。
  本変更以前から同値で存在。CSS側にowner判断待ちである旨のコメントを残した。
- **AC-008**: owner承認は未取得。

### Verdict

- **AC-006: PASS（keyboard）**。reduced motionの体験判断は残るが、keyboard操作は成立を実機で確認した。
- **Verdict remains PARTIAL.** step 5は未完了。reduced motion、mobile階層、AC-008が残る。


## 2026-07-30 mobile section heading down-step (Option A)

### Change

`app/_components/top-page/top-page.module.css` の `@media (max-width: 47.5rem)` ブロック内
`.sectionHeading h2` に `font-size: var(--font-sizes-xl)` を追加し、principle >= Products の階層を
mobileで維持する。desktopは触れない。JSX / role / product名 / principle side は変更しない。

- 対象selectorは Products section の header 内 h2 のみ（Contact h2 は `.contact h2` selectorで
  eyebrow role、footer は h2 なし）。CSS module scoping と併せて、他 section への波及はない。
- clamp は使わない。Products は8字（"Products"）で、375px幅で `xl` = 31.5px でも余白が十分。
- コメントは既存の `.principle h2` 段下げコメントと同じ位置づけ（下げの根拠と、product名との
  平坦化について eyebrow が signal を担う旨）を残した。

### Regression discovered and corrected

本セッションの初手では `var(--font-sizes-2xl)` を指定した。これは `heading.lg` role が既に
`font-size: var(--font-sizes-2xl)` を持つため**値としてno-op**であり、Products は 40.5px の
まま何も変わっていなかった。coordinator の実画面計測（375px viewport）で判明し、`xl` へ訂正した。
根本原因の言明: principle mobile の clamp `clamp(xl, 8vw, 2xl)` は 375〜425px 帯では 8vw < xl の
ため下限側の `xl` が採用される（375px なら 8vw = 30px < 31.5px）。principle mobile の実効値は
`2xl` ではなく `xl` である。Products を principle 以下へ下げるには `xl` が必要だった。

### 決定と tradeoff

owner判断（Option A）: mobileでは Products h2 を principle h2 の mobile 実効値と同じ `xl` band
まで下げる。結果として Products (h2, `xl`=31.5px) と product名 (h3, `heading.md`=`xl`=31.5px) は
視覚的に同サイズへ並ぶ。h2 / h3 の階層は書体・意味論では依然区別され、`What otibo makes` eyebrow
が section 開始点の signal を担う。

計測値（root 18px、`--font-sizes-xl` = 1.75rem = 31.5px、`--font-sizes-2xl` = 2.25rem = 40.5px）:

| 要素 | role | 現行desktop | mobile 375px (本変更後) |
| --- | --- | --- | --- |
| principle h2 | `display.sm` | 63px | 31.5px（clamp 下限 `xl` で確定） |
| Products h2 | `heading.lg` (site override) | 40.5px | **31.5px（本変更 `xl`）** |
| product名 h3 | `heading.md` | 31.5px | 31.5px |

principle >= Products の階層は成立する。

### Decision Conformance — 2026-07-30 (mobile down-step)

| ID | Result | 判断 |
| --- | --- | --- |
| DEC-009 | PASS | typography role の割当（`heading.lg`）は変更していない。site CSS が持つのは breakpoint 固有の下げ幅（`2xl` band）のみで、role の外観を site 側で再定義していない。同じく `.principle h2` 段下げが受容されているのと同じ扱い。 |
| DEC-011 | PARTIAL | site 側 override 例外は「principle mobile 段下げ」1件から2件（principle + Products mobile 段下げ）へ増えた。両者とも `@otibo/ui` 側のresponsive contract が育つまでの暫定 override であり、恒久 site scale の再導入ではない。将来 DS 側で mobile band を持てるようになったときの解消余地は残す。 |
| DEC-010 | PASS | section / product 境界の余白と surface 表現は変えていない。border / divider を再導入していない。 |
| DEC-003 | PASS | First View shader / height map / engine / policy に触れていない。`public/first-view/light.frag` の SHA-256 は変更前後で `19c1a1279209ecc1946378b9fe39a09bd0cdb26de39f82d4c9bf7b824ce463f8` のまま（AC-041 / DEC-017 の凍結境界を越えていない）。 |

### Gate 実行結果

| Gate | Result | Evidence |
| --- | --- | --- |
| `npm run lint` | PASS | biome check 36 files、fixなし |
| `npm run typecheck` | PASS | tsc --noEmit exit 0 |
| `npm run test` | PASS | vitest 4 files / 38 tests |
| `npm run build` | PASS | static 9 routes |
| `npm run deploy:dry-run` | PASS | wrangler dry-run 495 assets |
| `./scripts/check-docs.sh` | PASS | exit 0 |
| Shader freeze guard (AC-041 / DEC-017) | PASS | `public/first-view/light.frag` SHA-256 `19c1a127…` unchanged |

### Residual

- **owner visual approval が必要**: mobile 390px viewport で principle >= Products >= product名 の
  hierarchy が意図どおり読めるか、Products と product名 が同サイズで並ぶ体験が受容されるかは、
  実画面での owner 判断待ち。本セッションでは browser 検証は行っていない（owner 実施の指示に従う）。
- Products と product名 が同サイズになるため、eyebrow `What otibo makes` が section signal として
  機能することが前提。将来 eyebrow の位置や大きさを変更する場合はこの前提も再確認する。
- 恒久的な解消は `@otibo/ui` 側で mobile band を持つ responsive contract が育つのを待つ。それまで
  site override 2件（principle / Products）は暫定として `DEC-011` の再訪対象に残る。
- reduced motion の体験判断、AC-008（3秒 / 30秒 / production visual）は本変更の対象外で未解決のまま。

### Verdict

- **DEC-009 / DEC-010 / DEC-003: PASS.** DEC-011 は暫定 override 例外が2件へ増えた点で PARTIAL、
  ただし本判断（Option A）自体は owner の明示的な選好で、恒久 site scale の再導入ではない。
- **Verdict remains PARTIAL.** step 5 は未完了。owner visual approval、reduced motion、AC-008 が残る。

## 2026-07-30 reduced motion 体験判断 (owner decision)

2026-07-28 静的分析節および 2026-07-30 keyboard 節で、reduced motion 時に exit wash が発生せず
色面 → 白面が scroll edge の cut になる体験を未解決 residual として保留していた。

**owner 判断: 現状維持を採用。**

- 根拠: `prefers-reduced-motion: reduce` はユーザー本人の宣言である。scroll 連動 animation を無効化して
  wash を発生させない現行挙動は仕様に忠実であり、ユーザーが選択した preference を演出優先で上書きしない。
- 影響範囲: `app/_components/first-view/light-policy.ts` の `if (reducedMotion) return 0;` を維持。
  `app/_components/first-view/first-view.module.css` の `@media (prefers-reduced-motion: reduce)` block
  は現状のまま（canvas transition のみ無効化）。
- 変更: なし。コード / CSS ともに touch していない。
- Shader freeze guard: 未変更。本判断は shader / height map / engine / policy に影響しない。
  `public/first-view/light.frag` の SHA-256 は依然 `19c1a1279209ecc1946378b9fe39a09bd0cdb26de39f82d4c9bf7b824ce463f8`。

### Residual (after this decision)

- AC-006 の reduced motion 未確定分は closed。この節に由来する AC-006 residual なし。
- 検討済みで採用しなかった代替: (b) 静的 bottom gradient、(c) IntersectionObserver 契機 CSS transition、
  (d) reduced motion 時に First View 区間を短縮。いずれも owner の第一原理（ユーザー宣言の尊重）と
  合致しないと判断された。将来 owner がこの判断を revisit する余地は残す。
- step 5 全体としては AC-008、owner visual approval（Option A mobile down-step および full-page
  visual review）、`@otibo/ui` publish が残る。

### Verdict

- **AC-006 (reduced motion): PASS as-designed.** owner が現行挙動を明示的に採用した。
- **Verdict remains PARTIAL.** step 5 未完了は AC-008、owner visual approval、`@otibo/ui` publish に絞られた。

## 2026-07-30 Products β editorial pivot

`Site-Feat-17` step 5 の一部として、Products 領域を gallery two-pane から editorial chapter grammar
（DEC-012 / β）へ切り替えた。First View は AC-041 / DEC-017 で凍結済みであり、本作業で shader /
height map / engine / policy / wordmark には触れていない。

### Change summary

- `app/_components/top-page/TopPageContent.tsx`
  - `Product` type から `media` field を削除。
  - `ProductMedia` function を削除。
  - `MediaFrameImage` / `MediaFrameRoot` / `ScrollAreaRoot` / `ScrollAreaViewport` の import を削除
    （grep で ProductMedia 以外の usage が無いことを確認済）。
  - `.product` の `data-has-media` 分岐と `.productCopy` wrapper を廃止し、
    article を単一 column の chapter 構造（badge → identity → description）へ整えた。
  - `LogoFrameRoot` / `LogoFrameImage` / `LogoFrameFallback` は継続使用（DEC-009 準拠）。
- `app/_components/top-page/top-page.module.css`
  - 削除: `.product[data-has-media="false"]`, `.product[data-has-media="false"] .productCopy`,
    `.productMedia`, `.mediaViewport`, `.mediaTrack`, `.mediaTrack[data-count="1"]`, `.mediaItem`,
    `.mediaFrame`, mobile block 内の `.mediaTrack` / `.mediaTrack[data-count="1"]` /
    `.mediaViewport` / `.mediaItem`, `@media (prefers-reduced-motion: reduce)` の `.productMedia` 単独 rule。
  - 変更: `.product` を single-column article 幅（`width: min(100%, 44rem); margin: 0 auto`）へ再構成。
    `.status` へ `align-self: start` を付与（`.productCopy` wrapper がなくなり grid item として置かれる）。
    `.productCopy > p` の selector を `.product > p` へ書き換え（wrapper 削除の追随）。
  - Mobile: `.product` は `width: 100%`（chapter 幅の上限を外し、`.products` 全幅で読ませる）。
  - コメント: DEC-012 由来の chapter 決定を CSS コメントで明示。
- copy / status / product 順序 / 責務段階数（4段階）に変更なし。

### Decision Conformance

| ID | Result | 判断 |
| --- | --- | --- |
| DEC-003 | PASS | shader / height map / engine / policy / wordmark 未変更。`public/first-view/light.frag` の SHA-256 は変更前後で `19c1a1279209ecc1946378b9fe39a09bd0cdb26de39f82d4c9bf7b824ce463f8` のまま（AC-041 / DEC-017 の凍結境界を越えていない） |
| DEC-006 | PASS | product 紹介の形式（card / gallery / grid）を固定せず、chapter という別 composition を採用可能である DEC-006 の Change freedom 内での判断 |
| DEC-007 / INV-007 / INV-010 | PASS | 欠落 asset を補作していない。Sarae / Stash に screenshot placeholder を作らないという方針を、gallery 撤去でより自然な形で維持 |
| DEC-009 | PASS | `LogoFrame` / `textStyle` / `Badge` を DS 正本のまま使用。site 側では chapter composition だけを持つ。site 側で primitive を再定義していない |
| DEC-010 | PASS | product 間の分離は `.productList` の gap（余白）だけで表現。border / divider を導入していない |
| DEC-011 | PASS | typography role の割当・上書き例外に変化なし。site side での恒久 site scale を再導入していない |
| DEC-012 (new) | PASS | 本節そのもの。gallery two-pane を廃止し、chapter grammar として実装した |

### Gate results

| Gate | Result | Evidence |
| --- | --- | --- |
| `npm run lint` | PASS | biome check 36 files、fixなし |
| `npm run typecheck` | PASS | tsc --noEmit exit 0 |
| `npm run test` | PASS | vitest 4 files / 38 tests |
| `npm run build` | PASS | static 9 routes |
| `npm run deploy:dry-run` | PASS | wrangler dry-run 495 assets |
| `./scripts/check-docs.sh` | PASS | exit 0 |
| Shader freeze guard (AC-041 / DEC-017) | PASS | `public/first-view/light.frag` SHA-256 `19c1a1279209ecc1946378b9fe39a09bd0cdb26de39f82d4c9bf7b824ce463f8` unchanged |

### Residual

- **owner visual approval が必要**: desktop 1280px および mobile 375px での chapter rhythm、
  reading column 44rem の妥当性、status badge / identity / description の縦密度、product 間の gap
  scale が意図どおり読めるかは、実画面での owner 判断待ち。本セッションでは browser 検証は行っていない
  （orchestrator が owner と実施する指示）。
- screenshot supply（Medo だけでも掲載するか、全 product 揃うまで gallery 復活を保留するか）は
  本判断の対象外。DEC-012 は「supply が揃うまでの表現形式を chapter で確定させる」だけで、
  supply 自体を閉じるものではない。ownerが将来的にgallery grammarへ戻す余地はDEC-012 `Revisit when`で保持。
- AC-006 keyboard focusable 数（5要素: contact mailto + footer 4 links）は本変更で増減なし
  （focusable な要素を追加削除していない）。実操作再確認は不要。
- `@otibo/ui` publish、AC-008（3秒 / 30秒 / production visual owner 承認）、mobile 階層問題
  は本変更の対象外で未解決のまま。

### Verdict

- **DEC-012: PASS.** editorial chapter grammar として実装が成立し、gate 全通、shader 凍結を維持。
- **DEC-003 / DEC-006 / DEC-007 / DEC-009 / DEC-010 / DEC-011: PASS.**
- **Verdict remains PARTIAL.** step 5 未完了は AC-008、owner visual approval（本 β 含む）、
  `@otibo/ui` publish に絞られたまま。

### Regression fix — grid item inline stretch（same-day follow-up）

本 β pivot 直後に coordinator が desktop 1280px viewport の DOM を実測し、
`.status`（Badge span）が article grid の inline 軸で 792px まで stretch されていることを検出した。
Badge component は `inline-flex` を宣言しているが、CSS Grid の item は既定で `justify-items: stretch`
（inline 軸を track 幅へ拡張）が効くため、grid item となった時点で intrinsic width が上書きされていた。
同じ理由で `.identity`（logo + h3 の flex row）も 792px の container 幅を取っていた
（内部の flex row は左寄せに集合するため視覚的な違和は Badge ほどではないが、container として不正）。

`<p class="textStyle_body">` は 689px（34em / max-width `.product > p`）で意図どおり動作しており、
本件の対象外。

#### 修正

`app/_components/top-page/top-page.module.css`:

- `.status`: `justify-self: start` を追加（`align-self: start` は保持）。
- `.identity`: `justify-self: start` を追加。

article grid template、article 幅（`min(100%, 44rem)` centered）、`.product > p` の `max-width: 34em`、
Badge / LogoFrame component 内部、DS role 割当は変更していない。durable 案として
`.product { justify-items: start }` を検討したが、それでは `<p>` も stretch を失い intrinsic width へ
落ちる。`.p` は現状 `stretch` + `max-width: 34em` で 689px を得ているため、grid-container 側で
`stretch` を無効化すると本文 measure の意図が崩れる。したがって item side での局所 override を選択した。

#### Gate 再実行

| Gate | Result |
| --- | --- |
| `npm run lint` | PASS (biome 36 files) |
| `npm run typecheck` | PASS |
| `npm run test` | PASS (4 files / 38 tests) |
| `npm run build` | PASS (9 static routes) |
| `npm run deploy:dry-run` | PASS (wrangler, 495 assets) |
| `./scripts/check-docs.sh` | PASS (exit 0) |
| Shader freeze guard (AC-041 / DEC-017) | PASS — SHA-256 `19c1a1279209ecc1946378b9fe39a09bd0cdb26de39f82d4c9bf7b824ce463f8` unchanged |

#### 位置づけ

本 fix は上記 β pivot と同日の直接 follow-up であり、独立 cycle として切り出さない。DEC-012 の実装
契約（single-column chapter, badge → identity → description）は変更しておらず、article 構造で発生した
grid 既定挙動を補正しただけ。owner visual approval の対象は β pivot 全体（本 fix 適用後の状態）に対して
求められる。

## 2026-07-31 Products κ bento integration

`Site-Feat-17` step 5 の続きとして、Products 領域を DEC-012（β / editorial chapter）から
DEC-013（κ / column-featured bento）へ収束した。owner が scratch prototype
（`~/dev/scratch/otibo-products-kappa/`）で κ 案を実物確認済みで、それを otibo-dev の実装に反映
する作業。First View は AC-041 / DEC-017 で凍結中であり、本作業で shader / height map / engine /
policy / wordmark には触れていない。

### Change summary

- `app/_components/top-page/TopPageContent.tsx`（177 行）
  - `Product` 型に optional `media: { src, alt }` を追加。旧 `logo?: string` field を削除。
  - `products` 配列を `Record<"medo" | "sarae" | "stash", Product>` 形式へ再構成し、Medo の media
    に実 asset `/products/medo/ss-home.png` を含める。Sarae / Stash は media 未設定。
  - Products section header の eyebrow `What otibo makes` を撤去し、h2 のみに（DEC-014 / INV-011）。
  - 旧 `.product` chapter article の JSX（badge + `.identity` LogoFrame + h3 + description）を
    3枚の `CardRoot` bento cells（Medo / Sarae / Stash）へ置換。全 Card は `surface="paper"` /
    `padding="md"` で variant 同一。
  - Medo Card 内は `CardHeader`（Badge + `CardTitle` + `CardDescription`）+ `.medoMedia` wrapper
    （`MediaFrameRoot aspect="auto" fit="contain"` + `MediaFrameImage`）。Sarae / Stash は
    `CardHeader` のみ（image slot なし）。
  - `LogoFrameRoot` / `LogoFrameImage` / `LogoFrameFallback` の import と usage を Products
    section から撤去。κ prototype も cards に LogoFrame を使っていなかったため、それに揃えた。
  - deferred bento-in-bento readiness を JSX / CSS コメントで明示（Medo の image wrapper を
    `.medoMedia > *` を future nested grid item として並べ替えられる single grid-container point に
    保つ）。今 cycle では実装しない。
- `app/_components/top-page/top-page.module.css`（261 行）
  - 削除: `.productList`, `.product`, `.identity`, `.identity h3`, `.product > p`（DEC-012 の
    chapter 幅・reading measure を担っていた selector 群）。
  - 削除: mobile block 内の `.product` / `.product > p` 個別 rule。
  - 変更: `.sectionHeading` を simplified（h2 only baseline を前提に `.sectionHeading h2, p`
    の複合 selector を `.sectionHeading h2` 単独へ縮小、`.sectionHeading p` の line-height rule
    を削除）。
  - 変更: `.status` selector を Card slot 内 Badge 用に整理（`display: inline-flex` /
    `align-self: start` / `justify-self: start` / `margin-bottom` 撤去）。CardHeader の gap
    が rhythm を担うため、margin 系の site override は不要。
  - 追加: `.productsBento`（desktop grid `minmax(0, 22rem) minmax(0, 1fr)` × `1fr 1fr`）、
    `.bentoCard`（`height: 100%` / `min-width: 0`）、`.medoCard` / `.saraeCard` / `.stashCard`
    （grid-column / grid-row 割当）、`.medoMedia` + `.medoMedia > *`（flex 縦下端寄せ + width
    constraint `min(11rem, 100%)`）。
  - 追加: mobile block 内で bento を単一 column へ collapse（`grid-template-columns:
    minmax(0, 1fr)` / `grid-template-rows: auto`）。各 bentoCard は `height: auto`。
    `.medoMedia > *` は `min(12rem, 60vw)`。
  - 保持: `.principle` / `.sectionHeading h2` の mobile 段下げ（DEC-011 の Option A 継承）/
    `.contact` / `.footer` の rule 全て未変更。
- `public/products/medo/ss-home.png`（新規、260,278 bytes）
  - `/home/penne/Pictures/dev_assets/medo/ss-home.png` を `mkdir -p` 後 `cp` で追加。
  - 1080x2400 phone portrait screenshot、Medo の実 asset。DEC-007 / INV-010 に合致する
    「実在する掲載理由がある任意情報」として採用。
  - JSX からは `/products/medo/ss-home.png` として参照。
- `_docs/intent/Site/top-page-rebuild/decision.md`
  - **DEC-012 を superseded by DEC-013 (2026-07-31) と記載**。原文は履歴保持のため削除せず、
    冒頭に status ラベルと supersede 参照を追記。owner 判断（履歴保持 = option (a)）に従う。
  - **DEC-013 を新設**: bento composition の What / Why / Change freedom / Why not（α β γ ι δ η
    の6候補棄却理由）/ Revisit when。
  - **DEC-014 を新設**: 見出し補助 copy（eyebrow / lede / subtitle / kicker / tagline / prose）は
    具体的目的が示せる場合だけ使う原則。2026-07-31 の subagent による eyebrow 追加を owner が
    棄却した経緯を Why に記載。既存 Contact section の eyebrow role h2 は Change freedom で維持。
  - **INV-011 を新設**（from DEC-014）: 埋め草としての補助 copy を置かない strict invariant。
  - **Grammar principles / GP-001** を新設: DEC-014 の運用ガイドライン。
  - `Enforced in` を更新: DEC-012 superseded の note、DEC-013 / DEC-014 / INV-011 の enforcement
    先を追加。

### Docs judgment call — copy restraint の記載場所

指示は「`_docs/reference/Site/copy-restraint/reference.md` へ新設するか、
`_docs/intent/Site/otibo-dev-site-purpose/decision.md` へ追記するか、`Ask judgment`」であった。

判断: **`_docs/intent/Site/top-page-rebuild/decision.md` に DEC-014 / INV-011 / GP-001 として同居させる**
方針を採用した。site-purpose intent（憲法）は brand voice のスコープに閉じており、composition 判断
（bento、chapter 等）と一体で運用したい copy restraint は top-page-rebuild の rebuild cycle と同じ
Decision Register 内にまとめたほうが、DEC-013 → GP-001 → INV-011 の追跡が短く済む。site-purpose 側
にも将来的に横展開する必要が出た場合（他の section を新設する時など）、intent 引用（`references:`）
で site-purpose へ持ち上げる。この時点で reference.md を切り出すよりも、まず intent 内で
運用しながら育てるほうが軽量。lightweight reference.md への切り出しは、他 area にも波及した段階
で再判断する。

### Decision Conformance

| ID | Result | 判断 |
| --- | --- | --- |
| DEC-003 / AC-041 | PASS | shader / height map / engine / policy / wordmark 未変更。`public/first-view/light.frag` の SHA-256 は変更前後で `19c1a1279209ecc1946378b9fe39a09bd0cdb26de39f82d4c9bf7b824ce463f8` のまま。凍結境界を越えていない |
| DEC-006 | PASS | product 紹介の形式（card / gallery / grid）を事前固定しないという Change freedom 内での判断。chapter から bento への移行を intent で許容 |
| DEC-007 / INV-007 / INV-010 | PASS | Medo の実 asset は掲載理由が明確（テスト中の実物 screenshot）で INV-010 の「実在する場合だけ使う」に合致。Sarae / Stash は media 未設定のまま、cell size の差だけで product 間の実態差を表現している |
| DEC-009 | PASS | `Badge` / `CardRoot` / `CardHeader` / `CardTitle` / `CardDescription` / `MediaFrameRoot` / `MediaFrameImage` / `textStyle` は全て `@otibo/ui` primitive を native usage で採用。site CSS は grid composition のみを持つ |
| DEC-010 | PASS | cell 間の分離は grid gap のみ。border / divider / accent tinting を導入していない |
| DEC-011 | PASS | typography role の割当（`heading.lg` / `body`）に変化なし。site 側の恒久 site scale を再導入していない。mobile 段下げ 2件（principle / Products）は継承 |
| DEC-012 | SUPERSEDED | DEC-013 で置換。実装は bento κ へ収束し、chapter grammar は enforcement 対象から外れた。履歴は decision.md に保持 |
| DEC-013 (new) | PASS | 本節そのもの。κ bento composition を実装し、mobile collapse / bento-in-bento future readiness / 3枚同一 Card variant を全て満たす |
| DEC-014 / INV-011 (new) | PASS | Products section header は h2 のみで、eyebrow / subtitle / lede を追加していない。既存 Contact section の eyebrow role h2 は意図的採用として Change freedom 内で維持 |

### Gate results

| Gate | Result | Evidence |
| --- | --- | --- |
| `npm run lint` | PASS | biome check 36 files、fix なし |
| `npm run typecheck` | PASS | tsc --noEmit exit 0 |
| `npm run test` | PASS | vitest 4 files / 38 tests |
| `npm run build` | PASS | static 9 routes（`/`, `/_not-found`, `/medo/{account-deletion,privacy,terms}`, `/sarae`, `/stash`, `/tokushoho`）|
| `npm run deploy:dry-run` | PASS | wrangler dry-run 496 files（Medo screenshot +1）|
| `./scripts/check-docs.sh` | PASS | exit 0 |
| Shader freeze guard (AC-041 / DEC-017) | PASS | `public/first-view/light.frag` SHA-256 `19c1a1279209ecc1946378b9fe39a09bd0cdb26de39f82d4c9bf7b824ce463f8` unchanged before and after |

### Residual

- **owner visual approval が必要**: κ 案自体は scratch prototype で owner 実物承認済みだが、
  otibo-dev の実 stack（Next.js 16 static + Panda CSS + 実 asset）へ載せた desktop / mobile
  最終描画は未確認。特に (a) `.principle` の mobile clamp と `.sectionHeading h2 = xl` down-step
  下での bento の見え方、(b) Medo screenshot の実寸（1080x2400 の phone portrait を `min(11rem, 100%)`
  に contain した密度）、(c) Sarae / Stash card の empty body ratio、(d) mobile collapse の
  順序と gap `--spacing-4` が読みやすいか、が実画面での確認対象。本セッションでは browser 検証は
  行っていない（orchestrator が owner と実施する指示）。
- deploy artifact 数が 495 → 496 に増える（Medo screenshot）。単一 asset 260 KB で Workers Static
  Assets の 25 MiB 上限には十分収まり、`deploy:dry-run` は PASS した。
- `@otibo/ui` publish 待ち（`display.sm` の未 publish dist を node_modules へ手差ししている状態）
  は本変更の対象外で未解決のまま。
- AC-006 focusable 数（5 要素 = contact mailto + footer 4 links）に増減なし。実操作再確認は不要。
- AC-008（3秒 / 30秒 / production visual owner 承認）は本変更の対象外で未解決のまま。
- bento-in-bento（Medo に2〜3枚目の image asset が加わったときの nested grid 展開）は現時点で
  実装せず、`.medoMedia > *` の grid-container point だけ CSS / JSX コメントで残した。
  Medo に画像が増えた時点で DEC-013 Revisit when (b) に従い判断する。

### Verdict

- **DEC-013 / DEC-014 / INV-011: PASS.** bento composition と copy restraint 原則が実装と intent の
  両側で成立し、gate 全通、shader 凍結を維持。
- **DEC-012: SUPERSEDED**（履歴保持）。
- **DEC-003 / DEC-006 / DEC-007 / DEC-009 / DEC-010 / DEC-011: PASS.**
- **Verdict remains PARTIAL.** step 5 未完了は AC-008、owner visual approval（κ 統合後の desktop /
  mobile 実画面）、`@otibo/ui` publish に絞られたまま。

## 2026-07-31 AC-008 provisional approval + desktop/mobile visual approval (owner)

owner が κ 統合後の実画面（desktop 1280、mobile 375）を実機で確認し、以下を明示的に承認した。

### 承認内容

- **AC-008 provisional approval**: 3秒 / 30秒 の体験と production visual の方向性として承認。
  「最終 visual ではないが、これを詰めていく方向として OK」という位置付け。final production visual
  approval は残り polish（interaction、他 section、mobile Medo image frame の feature vs bug 判断等）
  が完了した後に別途取る前提。
- **desktop 1280 visual approval**: κ bento（Medo 左縦長 + Sarae/Stash 右列積み、eyebrow なし、
  h2 のみ、fixed copy 厳守）で成立と判定。
- **mobile 375 visual approval**: bento の単カラム collapse（Medo → Sarae → Stash 縦積み）で成立と
  判定。Medo phone screenshot が縦支配になる点は実 UI aspect (0.45) の物理的制約として受容。

### Residual

- **AC-008 は provisional**。final approval は以下が全て解決した後に別途取る:
  - interaction 詳細実装（image click 拡大、hover 追従等の設計フェーズ）
  - mobile Medo image が周囲 bg と融合して見える点の判断（feature = ecosystem unified feel、
    bug = phone frame signal 弱化、いずれとするか）
  - 他 section（Principle、Contact、Footer）の polish
- `@otibo/ui` publish 判断は未実施（本 approval とは独立）。
- Shader freeze guard: 本 approval は shader / height map / engine / policy に影響しない。
  `public/first-view/light.frag` SHA-256 = `19c1a1279209ecc1946378b9fe39a09bd0cdb26de39f82d4c9bf7b824ce463f8` 不変。

### Verdict

- **AC-008: PROVISIONAL PASS**。owner が方向性として承認、final approval は残 polish 完了後に取る。
- **desktop / mobile visual approval: PASS (κ 統合状態で)。**
- **Verdict remains PARTIAL.** step 5 未完了は `@otibo/ui` publish と、AC-008 final approval に絞られた。

## 2026-07-31 @otibo/ui 0.5.0 adoption

`@otibo/ui@0.5.0` が npm registry に publish 済みとなったため、otibo-dev の pin を `^0.4.0` →
`^0.5.0` に更新し、`npm install` で registry から正式 tarball を取り直した。これにより 2026-07-29
時点で hand-swap されていた local otibo-ui dist（display.sm 先行取り込みおよび κ 統合で必要な
primitive を先出しするための手動置換）は解消された。

### Pin bump

- `package.json`: `"@otibo/ui": "^0.4.0"` → `"^0.5.0"`。
- `package-lock.json`:
  - root deps 側 pin が `^0.5.0` に更新。
  - `node_modules/@otibo/ui` エントリが `version 0.4.0` (integrity `sha512-+hj7fctW...`) →
    `version 0.5.0` (integrity `sha512-Cz2EtSyN...`)、`resolved` は `.../ui-0.5.0.tgz` に更新。
  - `npm install` 結果: `added 109 packages, removed 99 packages, and audited 110 packages`。
    devDependencies 全般の transitive 更新分を含み、`@otibo/ui` 単体の差分ではない。

### Hand-swap vs 0.5.0 dist 等価性

install 前 (hand-swapped local otibo-ui dist) と install 後 (registry 0.5.0 dist) の観測可能
成果物を SHA-256 で比較:

| file | before (hand-swap) | after (registry 0.5.0) | 判定 |
| --- | --- | --- | --- |
| `dist/styles.css` | `09abb75a42dd...` | `09abb75a42dd...` | identical |
| `dist/index.js` | `fabf68899e2e...` | `fabf68899e2e...` | identical |
| `dist/index.d.ts` | `afa345823437...` | `cb210af96904...` | differs |

`styles.css` と `index.js` は byte-identical。`index.d.ts` のみ差分があるが、consumer が実際に
参照する `textStyle` union と `TypographyRole` は両側で `"display" | "display.sm" | "heading" |
"heading.sm" | "heading.md" | "heading.lg" | "body" | "eyebrow" | "caption"` を維持しており、
`typecheck` が PASS することで API 表面の後方互換が担保されている（差分は無関係な CSS プロパティの
型定義など）。

`display.sm` 具体規則も両側で同一:

```
.textStyle_display,.textStyle_display\.sm {
  font-family: var(--fonts-display);
  font-weight: var(--font-weights-semibold);
  line-height: var(--line-heights-display-snug);
  letter-spacing: var(--letter-spacings-display);
  color: var(--colors-fg-strong);
}
.textStyle_display\.sm {
  font-size: 3.5rem;
}
```

### Gate results

- `npm run lint` — PASS (`Checked 36 files, no fixes applied`)。
- `npm run typecheck` — PASS (`tsc --noEmit`、エラー無し)。
- `npm run test` — PASS (`Test Files 4 passed, Tests 38 passed`、152ms)。
- `npm run build` — PASS (Next.js 16.2.10、`Compiled successfully in 2.7s`、9 static pages
  generated: `/`, `/_not-found`, `/medo/account-deletion`, `/medo/privacy`, `/medo/terms`, `/sarae`,
  `/stash`, `/tokushoho`)。
- `npm run deploy:dry-run` — PASS (wrangler 4.110.0、`Read 496 files from the assets directory`、
  bindings 無し)。
- `./scripts/check-docs.sh` — PASS (全 PASS。pre-existing WARN `_docs/qa/Site/first-view-light-shader/test-plan.md`
  の deferred Test Matrix reason 欠落は本 task 範囲外)。

### Shader freeze guard

`public/first-view/light.frag` SHA-256 =
`19c1a1279209ecc1946378b9fe39a09bd0cdb26de39f82d4c9bf7b824ce463f8` 不変。本 task は package pin と
docs のみに触れ、shader / height map / engine / policy には一切影響しない。

### Verdict

- **@otibo/ui publish 依存: RESOLVED.** hand-swapped dist に頼っていた κ 統合 (DEC-013) と
  `display.sm` 描画は、registry から取得した 0.5.0 dist で再現され、gate 全通。prior verification
  entries が抱えていた「hand-swapped dist で走っている」残件は本 entry で解消。
- **Verdict remains PARTIAL.** step 5 の残件は AC-008 final approval と、owner による最終 deploy
  判断のみに絞られた。
