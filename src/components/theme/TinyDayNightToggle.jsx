import React, { useCallback } from "react";
import { useTheme } from "./theme-provider";
import "./TinyDayNightToggle.css";

/**
 * TinyDayNightToggle
 * - height prop in px (default 48). Width = height * 2.5
 * - Uses external CSS (TinyDayNightToggle.css)
 */
export default function TinyDayNightToggle({ height = 48, className = "" }) {
  const { theme, setTheme } = useTheme();
  const mounted = typeof window !== "undefined";

  // Resolve system theme if requested
  const resolved =
    mounted && theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;
  const isDark = resolved === "dark";

  // geometry (clamped)
  const H = Math.max(32, height);
  const W = Math.round(H * 2.5);
  const BALL = Math.round(H * 0.72);
  const PAD = Math.round((H - BALL) / 2);
  const LEFT = PAD;
  const RIGHT = Math.max(8, W - BALL - PAD);
  const BALLY = Math.round((H - BALL) / 2);
  const CX = LEFT + BALL / 2;
  const CY = BALLY + BALL / 2;

  const toggle = useCallback(() => setTheme(isDark ? "light" : "dark"), [isDark, setTheme]);

  // pass CSS vars (px values) to stylesheet
  const cssVars = {
    "--tdnt-w": `${W}px`,
    "--tdnt-h": `${H}px`,
    "--tdnt-ball": `${BALL}px`,
    "--tdnt-left": `${LEFT}px`,
    "--tdnt-right": `${RIGHT}px`,
    "--tdnt-bally": `${BALLY}px`,
    "--tdnt-cx": `${CX}px`,
    "--tdnt-cy": `${CY}px`,
    // tx computed in CSS via calc(var(--tdnt-right) - var(--tdnt-left))
  };

  return (
    <div
      className={`tdnt-root ${className}`}
      data-theme={isDark ? "dark" : "light"}
      style={cssVars}
    >
      <button
        type="button"
        className="tdnt-toggle"
        aria-pressed={isDark}
        aria-label="Toggle day and night"
        onClick={toggle}
      >
        <div className="tdnt-track" />

        {/* clouds (under the ball, never above it) */}
        <div className="tdnt-clouds" aria-hidden="true">
          <div className="tdnt-cloud c1" />
          <div className="tdnt-cloud c2" />
          <div className="tdnt-cloud c3" />
        </div>

        {/* leaves (day-only) */}
        <div className="tdnt-leaves" aria-hidden="true">
          <span className="leaf l1" />
          <span className="leaf l2" />
          <span className="leaf l3" />
        </div>

        {/* stars (night-only) */}
        <div className="tdnt-stars" aria-hidden="true">
          <span className="star s1" />
          <span className="star s2" />
          <span className="star s3" />
        </div>

        {/* rays: small SVG rays rotating around ball center (day only) */}
        <svg className="tdnt-rays" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          <g className="rays-group">
            {Array.from({ length: 6 }).map((_, i) => (
              <line key={i} className="ray" data-idx={i} />
            ))}
          </g>
        </svg>

        {/* sliding ball (sun / moon). we use transform: translateX(var(--tx)) for smooth GPU animation */}
        <div className="tdnt-ball" aria-hidden="true">
          <div className="tdnt-sun" />
          <div className="tdnt-moon">
            <span className="crater cr1" />
            <span className="crater cr2" />
            <span className="crater cr3" />
          </div>
        </div>

        {/* subtle rim overlay to add depth */}
        <div className="tdnt-rim" aria-hidden="true" />
      </button>
    </div>
  );
}
