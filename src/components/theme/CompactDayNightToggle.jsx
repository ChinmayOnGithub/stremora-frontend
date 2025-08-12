import React, { useEffect, useState } from "react";
import { useTheme } from "./theme-provider";
import styles from "./CompactDayNightToggle.module.css";

// Helper for theme-based value
const themed = (isDark, lightVal, darkVal) => (isDark ? darkVal : lightVal);

export default function CompactDayNightToggle({ height = 32 }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // System theme detection
  const isDark =
    mounted &&
    (theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches));

  // Compute all sizing/scaling
  const H = Math.max(16, height);         // min 16px
  const W = Math.round(H * 2.5);
  const BALL = Math.round(H * 0.77);
  const PAD = Math.round((H - BALL) / 2);

  // Ball always stays perfectly centered vertically, moves fully inside border-radius
  const ballLeft = isDark ? (W - BALL - PAD) : PAD;

  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <label
      className={styles.label}
      style={{
        width: W,
        height: H,
        minWidth: W,
        minHeight: H,
        userSelect: "none",
      }}
    >
      <input type="checkbox" checked={isDark} onChange={toggle} style={{ display: "none" }} />
      <div
        className={styles.container}
        style={{
          width: W,
          height: H,
          borderRadius: H / 2,
          boxShadow: themed(
            isDark,
            "0 2px 8px rgba(120,120,140,0.09), 0 1.5px 0.5px rgba(0,0,0,0.13)",
            "0 2px 12px rgba(0,0,0,0.46), 0 0.5px 0.5px rgba(30,30,40,0.15)"
          ),
          position: "relative",
        }}
      >
        <div
          className={styles.bg}
          style={{
            background: isDark ? "#22253A" : "#70a3ca",
            transition: "background 0.27s cubic-bezier(0.55,0.77,0.08,1.01)",
          }}
        />
        {/* Rays (only day) */}
        {!isDark && (
          <>
            <div
              className={`${styles.ray} ${styles["ray-inner"]}`}
              style={{
                width: BALL * 1.8,
                height: BALL * 1.8,
                top: -BALL * 0.42,
                left: -BALL * 0.42,
                opacity: 0.4,
              }}
            />
            <div
              className={`${styles.ray} ${styles["ray-medium"]}`}
              style={{
                width: BALL * 2.45,
                height: BALL * 2.45,
                top: -BALL * 0.8,
                left: -BALL * 0.8,
                opacity: 0.25,
              }}
            />
            <div
              className={`${styles.ray} ${styles["ray-far"]}`}
              style={{
                width: BALL * 3.22,
                height: BALL * 3.22,
                top: -BALL * 1.18,
                left: -BALL * 1.18,
                opacity: 0.14,
              }}
            />
          </>
        )}
        {/* Clouds & Shadows (scale/align to height) */}
        <div className={styles["cloud-shadows"]}>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`${styles["cloud-shadow"]} ${styles[`cloud-${i + 1}`]}`}
              style={{
                width: BALL * (1.08 - i * 0.16),
                height: BALL * (1.08 - i * 0.16),
                right: PAD + i * (BALL * 0.33),
                bottom: -PAD - i * 3,
                background: "#cde0f0",
                filter: "blur(1.3px)",
                opacity: isDark ? 0.06 : 0.36,
              }}
            />
          ))}
        </div>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`${styles.cloud} ${styles[`cloud-${i + 1}`]}`}
            style={{
              width: BALL * (1 - i * 0.15),
              height: BALL * (1 - i * 0.15),
              right: PAD + i * (BALL * 0.27),
              bottom: -PAD - i * 2,
              background: "#fff",
              opacity: isDark ? 0 : 1,
            }}
          />
        ))}
        {/* Stars, positioned/scaled */}
        {[...Array(6)].map((_, i) => {
          const sizes = [0.2, 0.08, 0.09, 0.07, 0.18, 0.085];
          const tops = [0.32, 0.20, 0.60, 0.44, 0.68, 0.09];
          const rights = [0.4, 0.68, 0.33, 0.66, 0.22, 0.84];
          return (
            <div
              key={i}
              className={styles.star}
              style={{
                width: BALL * sizes[i],
                height: BALL * sizes[i],
                top: H * tops[i],
                right: W * rights[i],
                opacity: isDark ? 1 : 0,
                filter: isDark
                  ? "drop-shadow(0 0 2px #fff)"
                  : "drop-shadow(0 0 0px #fff)",
                transition: "opacity 0.55s cubic-bezier(0.42,1,0.72,1.01)",
              }}
            />
          );
        })}
        {/* Toggle Ball. Sun/Moon morph, centered via translateX. */}
        <div
          className={styles.sun}
          style={{
            width: BALL,
            height: BALL,
            top: PAD,
            left: 0,
            position: "absolute",
            background: isDark ? "#CCCFD4" : "#FFD45C",
            borderRadius: "100%",
            overflow: "hidden",
            boxShadow: isDark
              ? "inset 0px -1.5px 3px rgba(40,40,80,0.17), 0 2.5px 6px rgba(31, 36, 48, 0.21)"
              : "0 2px 7px rgba(238,203,80,0.14), inset 0 1.5px 2px rgba(255,255,224,0.28)",
            transform: `translateX(${ballLeft}px)`,
            transition:
              "transform 0.38s cubic-bezier(0.58,1.68,0.22,1), background 0.31s, box-shadow 0.21s",
          }}
        >
          {/* Only show craters (for the moon) if dark */}
          {isDark && (
            <div
              className={styles.moon}
              style={{ position: "absolute", left: 0, top: 0, width: BALL, height: BALL }}
            >
              <div
                className={styles.crater}
                style={{
                  width: BALL * 0.31,
                  height: BALL * 0.31,
                  top: BALL * 0.38,
                  left: BALL * 0.17,
                }}
              />
              <div
                className={styles.crater}
                style={{
                  width: BALL * 0.19,
                  height: BALL * 0.19,
                  top: BALL * 0.12,
                  left: BALL * 0.40,
                }}
              />
              <div
                className={styles.crater}
                style={{
                  width: BALL * 0.17,
                  height: BALL * 0.17,
                  top: BALL * 0.57,
                  left: BALL * 0.63,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </label>
  );
}
