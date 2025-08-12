// src/components/theme/ModernThemeToggle.jsx
import React, { useEffect, useState } from 'react';
import { useTheme } from './theme-provider';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModernThemeToggle({ className }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  // Resolve "system" only after mount
  const getResolvedTheme = () => {
    if (theme === 'system') {
      if (!mounted) return 'light';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return theme;
  };

  const resolvedTheme = getResolvedTheme();
  const isDark = resolvedTheme === 'dark';

  const handleToggle = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const nextTheme = isDark ? 'light' : 'dark';
    setTheme(nextTheme);

    // Minor guard for double clicks while animation plays
    setTimeout(() => setIsAnimating(false), 420);
  };

  if (!mounted) {
    return (
      <div
        className={cn(
          'w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse',
          className
        )}
      />
    );
  }

  const baseBtn = cn(
    'relative w-12 h-12 rounded-full transition-all duration-300 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed overflow-hidden',
    'bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 shadow-sm',
    'dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 dark:shadow-md',
    className
  );

  const iconTransition = { type: 'spring', stiffness: 260, damping: 30 };

  return (
    <motion.button
      onClick={handleToggle}
      disabled={isAnimating}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      whileTap={{ scale: 0.96 }}
      className={baseBtn}
    >
      {/* Background halo */}
      <motion.div
        key={isDark ? 'dark-halo' : 'light-halo'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="absolute inset-0 rounded-full blur-xl pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.12), transparent 35%)'
            : 'radial-gradient(circle at 70% 30%, rgba(253,186,116,0.14), transparent 35%)'
        }}
      />

      {/* Icon container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.svg
              key="moon"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ rotate: -20, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 20, scale: 0.6, opacity: 0 }}
              transition={iconTransition}
              className="relative z-10"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="moonGrad" x1="0" x2="1">
                  <stop offset="0%" stopColor="#E6EEF7" stopOpacity="1" />
                  <stop offset="100%" stopColor="#C5D4E6" stopOpacity="1" />
                </linearGradient>
              </defs>

              {/* Crescent: built as a circle with a smaller offset circle clipped out */}
              <g>
                <path
                  d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                  fill="url(#moonGrad)"
                />
              </g>

              {/* Tiny stars */}
              <g opacity="0.95">
                <circle cx="4.5" cy="6.5" r="0.45" fill="#fff" opacity="0.9" />
                <circle cx="18.5" cy="5.5" r="0.35" fill="#fff" opacity="0.75" />
                <circle cx="14.5" cy="16.5" r="0.3" fill="#fff" opacity="0.6" />
              </g>
            </motion.svg>
          ) : (
            <motion.svg
              key="sun"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ rotate: 20, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -20, scale: 0.6, opacity: 0 }}
              transition={iconTransition}
              className="relative z-10"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="sunCore" cx="50%" cy="45%">
                  <stop offset="0%" stopColor="#FFFBEB" />
                  <stop offset="60%" stopColor="#FDE68A" />
                  <stop offset="100%" stopColor="#FDBA74" />
                </radialGradient>
              </defs>

              {/* Core */}
              <circle cx="12" cy="12" r="4" fill="url(#sunCore)" />

              {/* Rays (8) — drawn as rounded lines positioned around the core */}
              {[...Array(8)].map((_, i) => {
                const angle = (i * 45) * (Math.PI / 180);
                const x1 = 12 + Math.cos(angle) * 6.2;
                const y1 = 12 + Math.sin(angle) * 6.2;
                const x2 = 12 + Math.cos(angle) * 9;
                const y2 = 12 + Math.sin(angle) * 9;
                return (
                  <motion.line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#F59E0B"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02, duration: 0.28 }}
                  />
                );
              })}

              {/* Gentle pulse on core */}
              <motion.circle
                cx="12"
                cy="12"
                r="4"
                fill="none"
                stroke="#FBBF24"
                strokeWidth="0.8"
                initial={{ opacity: 0.5, r: 4 }}
                animate={{ opacity: [0.5, 0.15, 0.5], r: [4, 6, 4] }}
                transition={{ repeat: Infinity, duration: 2.2 }}
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </div>

      {/* Click ripple (soft) */}
      {isAnimating && (
        <motion.span
          className="absolute inset-0 rounded-full pointer-events-none"
          initial={{ scale: 0.6, opacity: 0.28 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.button>
  );
}

// Optional compact toggle kept as requested
export function CompactThemeToggle({ className }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />;

  const isDark = theme === 'dark' || (theme === 'system' && mounted && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'w-8 h-8 rounded-full transition-all duration-200',
        'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600',
        'flex items-center justify-center',
        'focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500',
        className
      )}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.22 }}
        className={cn(
          'w-4 h-4 rounded-full transition-all duration-200',
          isDark ? 'bg-gradient-to-br from-slate-300 to-slate-400' : 'bg-gradient-to-br from-yellow-400 to-orange-500'
        )}
      />
    </button>
  );
}
