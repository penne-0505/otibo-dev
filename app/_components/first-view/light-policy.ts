export const lightDebugModes = {
  final: 0,
  material: 1,
  light: 2,
  fallback: 3,
} as const;

export type LightDebugMode =
  (typeof lightDebugModes)[keyof typeof lightDebugModes];

const LIGHT_SCROLL_TRANSITION_SHARE = 0.85;
const LIGHT_EXIT_WASH_START = 0.74;

export function resolveLightExitWash(scrollProgress: number) {
  const normalized = Math.min(
    1,
    Math.max(
      0,
      (scrollProgress - LIGHT_EXIT_WASH_START) / (1 - LIGHT_EXIT_WASH_START),
    ),
  );
  return normalized * normalized * (3 - 2 * normalized);
}

export function resolveFirstViewWordmarkOpacity(exitWash: number) {
  return 1 - Math.min(1, Math.max(0, exitWash));
}

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

export function resolveLightScrollProgress({
  containerTop,
  pinnedTravel,
  reducedMotion,
}: {
  containerTop: number;
  pinnedTravel: number;
  reducedMotion: boolean;
}) {
  if (reducedMotion) return 0;
  const transitionTravel = Math.max(
    1,
    pinnedTravel * LIGHT_SCROLL_TRANSITION_SHARE,
  );
  return Math.min(1, Math.max(0, -containerTop / transitionTravel));
}
