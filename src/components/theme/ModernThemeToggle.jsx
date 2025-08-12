// src/components/theme/CompactDayNightToggle.jsx
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./theme-provider";

/**
 * CompactDayNightToggle
 * - Small button (48×24px).
 */
export default function CompactDayNightToggle({ className }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Resolve theme or fallback to light
  const resolved = mounted && theme === "system"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
    : theme;
  const isDark = resolved === "dark";

  const toggle = useCallback(() => setTheme(isDark ? "light" : "dark"), [isDark, setTheme]);

  // Dimensions
  const W = 48, H = 24, BALL = 16, PAD = 4;
  const leftX = PAD, rightX = W - BALL - PAD, ballY = (H - BALL) / 2;

  return (
    <button
      onClick={toggle}
      onKeyDown={e => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), toggle())}
      role="switch"
      aria-checked={isDark}
      className={`${className || ""} relative flex items-center focus:outline-none`}
      style={{
        width: W,
        height: H,
        borderRadius: H / 2,
        background: isDark ? "#2D314F" : "#76AFD2",
        border: "1px solid rgba(255,255,255,0.25)",
        boxShadow:
          isDark
            ? "0 0 2px rgba(0,0,0,0.5), inset 0 0 4px rgba(0,0,0,0.5)"
            : "0 0 2px rgba(0,0,0,0.2), inset 0 0 4px rgba(255,255,255,0.6)",
      }}
    >
      {/* Layered clouds */}
      <div className="absolute inset-0 pointer-events-none rounded-full overflow-hidden">
        {[0.75, 0.5, 0.25].map((alpha, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: -8 + i * 4,
              left: -8 + i * 6,
              width: W * 0.5 + i * 6,
              height: H * 1.5,
              borderRadius: H,
              background: isDark ? `rgba(45,49,79,${alpha * 0.4})` : `rgba(255,255,255,${alpha * 0.8})`,
              filter: "blur(2px)",
            }}
          />
        ))}
      </div>

      {/* Stars (night) */}
      <AnimatePresence>
        {isDark && (
          <motion.div
            key="stars"
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {[{ x: 12, y: 6, s: 2 }, { x: 24, y: 4, s: 1.5 }, { x: 30, y: 12, s: 1.5 }].map((sObj, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: sObj.x,
                  top: sObj.y,
                  width: sObj.s,
                  height: sObj.s,
                  borderRadius: "50%",
                  background: "#FFF",
                  filter: "drop-shadow(0 0 1px rgba(255,255,255,0.8))",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rotating sun rays */}
      <svg
        width={W}
        height={H}
        className="absolute inset-0 pointer-events-none"
      >
        <motion.g
          initial={false}
          animate={{ rotate: isDark ? -360 : 360 }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          style={{
            originX: leftX + BALL / 2,
            originY: ballY + BALL / 2,
          }}
        >
          {[...Array(6)].map((_, i) => {
            const angle = (i * 60 * Math.PI) / 180;
            const r1 = BALL / 2 + 2, r2 = H / 2 - 2;
            const cx = leftX + BALL / 2, cy = ballY + BALL / 2;
            const x1 = cx + Math.cos(angle) * r1;
            const y1 = cy + Math.sin(angle) * r1;
            const x2 = cx + Math.cos(angle) * r2;
            const y2 = cy + Math.sin(angle) * r2;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isDark ? "#F6A623" : "#FFD580"}
                strokeWidth={1}
                strokeLinecap="round"
                opacity={isDark ? 0.4 : 0.8}
              />
            );
          })}
        </motion.g>
      </svg>

      {/* Sun/Moon ball */}
      <motion.div
        initial={false}
        animate={{
          x: isDark ? rightX : leftX,
          y: ballY,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        style={{
          position: "absolute",
          width: BALL,
          height: BALL,
          borderRadius: BALL / 2,
          background: isDark ? "#CCCFD4" : "#FFD580",
          boxShadow: isDark
            ? "inset 0 -2px 3px rgba(0,0,0,0.2)"
            : "0 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        <AnimatePresence>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              style={{ width: "100%", height: "100%", position: "relative" }}
            >
              {[{ x: 4, y: 6, d: 6 }, { x: 8, y: 4, d: 4 }].map((c, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: c.x,
                    top: c.y,
                    width: c.d,
                    height: c.d,
                    borderRadius: "50%",
                    background: "#AAB2B9",
                  }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
}
