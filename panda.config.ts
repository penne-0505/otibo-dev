import { otiboPreset } from "@otibo/ui/preset";
import { defineConfig } from "@pandacss/dev";

// intent: _docs/intent/App/ui-integration/decision.md — Approach 4 (Ship Build Info File) canonical 設定
// 旧実装の verification 記録: _docs/qa/App/ui-integration/verification.md INV-002 / INV-003

export default defineConfig({
  presets: [otiboPreset],
  include: [
    "./app/**/*.{ts,tsx,js,jsx}",
    // Approach 4: library 側の panda.buildinfo.json を include して recipe class を emit させる
    "./node_modules/@otibo/ui/dist/panda.buildinfo.json",
  ],
  // library の styled-system と importMap を一致させる(Approach 4 canonical)
  importMap: "@otibo/ui/styled-system",
  // runtime / manager 描画される component は static usage 検出されないため staticCss で常時 emit
  // canonical: _docs/qa/App/ui-integration/verification.md INV-003
  staticCss: {
    recipes: {
      toast: ["*"],
      pagination: ["*"],
      combobox: ["*"],
      navigationMenu: ["*"],
      numberField: ["*"],
      toggle: ["*"],
      chip: ["*"],
    },
  },
  // breakpoints: library は提供していないため consumer 側で定義
  // 旧実装 verification: _docs/qa/App/top-page-initial/verification.md — Residual Risks 「breakpoints が consumer 側に書かれた」
  theme: {
    extend: {
      breakpoints: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  outdir: "styled-system",
  jsxFramework: "react",
});
