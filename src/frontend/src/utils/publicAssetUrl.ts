/**
 * Production-safe public asset URL utility.
 * Generates correct URLs for files in frontend/public that work in:
 * - Local dev (/)
 * - IC canister deployments (/<canister-id>/)
 * - All SPA routes (no route-relative prefixing)
 */

/**
 * Get the base path for the application.
 * In IC deployments, this will be /<canister-id>/
 * In local dev, this will be /
 */
function getBasePath(): string {
  // First try Vite's BASE_URL (set at build time)
  const viteBase = import.meta.env.BASE_URL;
  if (viteBase && viteBase !== '/') {
    return viteBase;
  }

  // For IC deployments, detect canister path from current location
  // IC URLs look like: https://<canister-id>.ic0.app/ or http://localhost:4943/?canisterId=<id>
  const pathname = window.location.pathname;
  
  // Check if we're in a canister path (starts with a canister-like ID)
  // Canister IDs are typically alphanumeric with hyphens, ending in -cai
  const canisterPathMatch = pathname.match(/^\/([a-z0-9-]+)\//);
  if (canisterPathMatch) {
    return `/${canisterPathMatch[1]}/`;
  }

  // Default to root
  return '/';
}

/**
 * Build a production-safe URL for a public asset.
 * Handles spaces and special characters in filenames.
 * 
 * @param relativePath - Path relative to frontend/public (e.g., "assets/products/folder/file.jpg")
 * @returns Full URL that works across all routes and deployment environments
 */
export function getPublicAssetUrl(relativePath: string): string {
  const basePath = getBasePath();
  
  // Split path into segments and encode each segment individually
  // This preserves folder structure while encoding filenames with spaces
  const segments = relativePath.split('/');
  const encodedSegments = segments.map(segment => encodeURIComponent(segment));
  const encodedPath = encodedSegments.join('/');
  
  // Remove leading slash from relative path if present
  const cleanPath = encodedPath.startsWith('/') ? encodedPath.slice(1) : encodedPath;
  
  // Combine base path with encoded relative path
  const fullPath = basePath.endsWith('/') 
    ? `${basePath}${cleanPath}`
    : `${basePath}/${cleanPath}`;
  
  // Normalize multiple slashes
  return fullPath.replace(/([^:]\/)\/+/g, '$1');
}

/**
 * Convenience helper for generated images in assets/generated/
 */
export function getGeneratedImageUrl(filename: string): string {
  return getPublicAssetUrl(`assets/generated/${filename}`);
}

/**
 * Convenience helper for product images in assets/products/
 */
export function getProductImageUrl(folder: string, filename: string): string {
  return getPublicAssetUrl(`assets/products/${folder}/${filename}`);
}
