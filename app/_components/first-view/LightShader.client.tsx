"use client";

import { useEffect, useRef } from "react";
import styles from "./first-view.module.css";
import { startLightEngine } from "./light-engine";
import { lightDebugModes, resolveLightDebugMode } from "./light-policy";

export function LightShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const debugMode = resolveLightDebugMode(
      window.location.search,
      process.env.NODE_ENV === "development",
    );
    if (debugMode === lightDebugModes.fallback) {
      canvas.dataset.status = "forced-fallback";
      return;
    }

    let disposed = false;
    let engine: Awaited<ReturnType<typeof startLightEngine>> = null;
    canvas.dataset.status = "loading";
    const showFallback = () => {
      canvas.dataset.ready = "false";
    };

    void startLightEngine({
      canvas,
      debugMode,
      onFailure: (error) => {
        showFallback();
        canvas.dataset.status = "error";
        console.error("First View light shader failed.", error);
      },
      onFirstFrame: () => {
        canvas.dataset.ready = "true";
        canvas.dataset.status = "ready";
      },
      onUnavailable: () => {
        showFallback();
        canvas.dataset.status = "webgl-unavailable";
      },
    })
      .then((startedEngine) => {
        if (disposed) startedEngine?.dispose();
        else engine = startedEngine;
      })
      .catch((error) => {
        showFallback();
        canvas.dataset.status = "asset-error";
        console.error("First View light assets failed to load.", error);
      });

    return () => {
      disposed = true;
      engine?.dispose();
    };
  }, []);

  return (
    <canvas
      className={styles.canvas}
      data-ready="false"
      data-status="server-fallback"
      ref={canvasRef}
    />
  );
}
