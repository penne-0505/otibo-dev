export const lightDebugModes = {
  final: 0,
  material: 1,
  light: 2,
  fallback: 3,
} as const;

export type LightDebugMode =
  (typeof lightDebugModes)[keyof typeof lightDebugModes];

export function resolveLightDebugMode(
  search: string,
  allowDiagnostics: boolean,
): LightDebugMode {
  if (!allowDiagnostics) return lightDebugModes.final;

  const requestedMode = new URLSearchParams(search).get("light-debug");
  if (requestedMode && requestedMode in lightDebugModes) {
    return lightDebugModes[requestedMode as keyof typeof lightDebugModes];
  }

  return lightDebugModes.final;
}

export function shouldRunLightAnimation({
  contextLost,
  documentHidden,
  reducedMotion,
}: {
  contextLost: boolean;
  documentHidden: boolean;
  reducedMotion: boolean;
}) {
  return !contextLost && !documentHidden && !reducedMotion;
}
