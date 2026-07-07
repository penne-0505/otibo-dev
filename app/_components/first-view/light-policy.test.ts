import { describe, expect, it } from "vitest";
import {
  lightDebugModes,
  resolveLightDebugMode,
  shouldRunLightAnimation,
} from "./light-policy";

describe("resolveLightDebugMode", () => {
  it("keeps diagnostics out of the production route", () => {
    expect(resolveLightDebugMode("?light-debug=material", false)).toBe(
      lightDebugModes.final,
    );
  });

  it.each([
    ["material", lightDebugModes.material],
    ["light", lightDebugModes.light],
    ["final", lightDebugModes.final],
    ["fallback", lightDebugModes.fallback],
  ])("resolves the named %s diagnostic in development", (name, mode) => {
    expect(resolveLightDebugMode(`?light-debug=${name}`, true)).toBe(mode);
  });

  it("falls back to the final composite for an unknown mode", () => {
    expect(resolveLightDebugMode("?light-debug=unknown", true)).toBe(
      lightDebugModes.final,
    );
  });
});

describe("shouldRunLightAnimation", () => {
  it("runs only with motion allowed in a visible document and live context", () => {
    expect(
      shouldRunLightAnimation({
        contextLost: false,
        documentHidden: false,
        reducedMotion: false,
      }),
    ).toBe(true);
  });

  it.each([
    { contextLost: true, documentHidden: false, reducedMotion: false },
    { contextLost: false, documentHidden: true, reducedMotion: false },
    { contextLost: false, documentHidden: false, reducedMotion: true },
  ])("stops continuous frames for $contextLost/$documentHidden/$reducedMotion", (state) => {
    expect(shouldRunLightAnimation(state)).toBe(false);
  });
});
