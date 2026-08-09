/**
 * Utility functions for formatting file sizes and dates
 */

/**
 * Format bytes into human-readable strings (e.g. 1.2 MB)
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Format ISO date string into readable date (e.g. Oct 24, 2026)
 */
export function formatDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Truncate filename nicely keeping extension
 */
export function truncateFilename(filename, maxLength = 24) {
  if (!filename || filename.length <= maxLength) return filename;
  const extIndex = filename.lastIndexOf(".");
  if (extIndex === -1) return `${filename.slice(0, maxLength)}...`;
  const ext = filename.slice(extIndex);
  const name = filename.slice(0, extIndex);
  const charsToShow = maxLength - ext.length - 3;
  if (charsToShow <= 0) return `${filename.slice(0, maxLength)}...`;
  return `${name.slice(0, charsToShow)}...${ext}`;
}