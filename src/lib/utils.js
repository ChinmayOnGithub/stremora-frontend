//utils.js
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Helper function to get environment variables
export const getEnvVariable = (key) => {
  return import.meta.env[key] || '';
}

// API base URL from environment
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URI;
