import { describe, expect, it } from "vitest";
import {
  lightDebugModes,
  resolveFirstViewWordmarkOpacity,
  resolveLightDebugMode,
  resolveLightExitWash,
  resolveLightScrollProgress,
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

describe("resolveLightScrollProgress", () => {
  it.each([
    { containerTop: 0, expected: 0 },
    { containerTop: -42.5, expected: 0.5 },
    { containerTop: -85, expected: 1 },
  ])("AC-012 maps the pinned interval to $expected", ({
    containerTop,
    expected,
  }) => {
    expect(
      resolveLightScrollProgress({
        containerTop,
        pinnedTravel: 100,
        reducedMotion: false,
      }),
    ).toBe(expected);
  });

  it("AC-012 holds the completed light state before the pinned interval ends", () => {
    expect(
      resolveLightScrollProgress({
        containerTop: -99,
        pinnedTravel: 100,
        reducedMotion: false,
      }),
    ).toBe(1);
  });

  it("INV-016 fixes scroll-linked motion at the initial frame", () => {
    expect(
      resolveLightScrollProgress({
        containerTop: -576,
        pinnedTravel: 576,
        reducedMotion: true,
      }),
    ).toBe(0);
  });
});

describe("shared exit wash", () => {
  it.each([
    { expected: 0, progress: 0 },
    { expected: 0, progress: 0.74 },
    { expected: 0.5, progress: 0.87 },
    { expected: 1, progress: 1 },
  ])("AC-013 resolves progress $progress to wash $expected", ({
    expected,
    progress,
  }) => {
    expect(resolveLightExitWash(progress)).toBeCloseTo(expected);
  });

  it.each([
    { exitWash: 0, expected: 1 },
    { exitWash: 0.5, expected: 0.5 },
    { exitWash: 1, expected: 0 },
  ])("AC-014 maps wash $exitWash to wordmark opacity $expected", ({
    exitWash,
    expected,
  }) => {
    expect(resolveFirstViewWordmarkOpacity(exitWash)).toBeCloseTo(expected);
  });
});
