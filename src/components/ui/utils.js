// src/components/ui/utils.js

/**
 * Conditionally join class names.
 * Usage: cn("btn", isActive && "btn-active", size)
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
