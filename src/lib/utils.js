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
export const API_BASE_URL = getEnvVariable("VITE_API_BASE_URL") || "http://localhost:8000/api/v1";
