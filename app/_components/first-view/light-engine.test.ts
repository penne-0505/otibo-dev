import { describe, expect, it } from "vitest";
import {
  estimateHeightTextureBytes,
  HEIGHT_TEXTURE_BYTES_PER_TEXEL,
  resolveHeightTextureFormat,
} from "./light-engine";

describe("height texture format", () => {
  it("AC-027 keeps the canonical height map in one GPU channel", () => {
    const format = resolveHeightTextureFormat({
      R8: 0x8229,
      RED: 0x1903,
      UNSIGNED_BYTE: 0x1401,
    });

    expect(format).toEqual({
      format: 0x1903,
      internalFormat: 0x8229,
      type: 0x1401,
    });
    expect(HEIGHT_TEXTURE_BYTES_PER_TEXEL).toBe(1);
    expect(estimateHeightTextureBytes(3072, 6144)).toBe(18 * 1024 * 1024);
  });
});
