// src/components/ui/utils.js

/**
 * Conditionally join class names.
 * Usage: cn("btn", isActive && "btn-active", size)
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// src/lib/utils.js
export function formatDuration(duration) {
  if (!duration) return "0:00";

  // Handle numeric seconds
  if (typeof duration === "number") {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Handle string formats
  if (duration.includes(':')) {
    return duration;
  }

  // Handle ISO 8601 duration format (optional)
  if (duration.startsWith('PT')) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  return duration;
}

