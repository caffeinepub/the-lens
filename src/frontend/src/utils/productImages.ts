/**
 * Centralized product image mapping utility.
 * Returns an array of image paths for known products, empty array for others.
 * Generates base-path-aware URLs for production deployments (Internet Computer).
 */

export interface ProductImageMapping {
  productId: string;
  images: string[];
}

const productImageMappings: ProductImageMapping[] = [
  {
    productId: 'cmf-earbuds',
    images: [
      'cmf 1-2.webp',
      'cmf 2-1.webp',
      'cmf 7-1.webp',
      'cmf 1-1.webp',
      'cmf 6-1.webp',
    ],
  },
];

/**
 * Get the base path for the application at runtime.
 * In production (Internet Computer), this will be the canister path.
 * In development, this will be '/'.
 */
function getBasePath(): string {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return '/';
  }

  // Get the base element if it exists
  const base = document.querySelector('base');
  if (base && base.href) {
    const url = new URL(base.href);
    return url.pathname;
  }

  // Fallback to the current path's base
  // For IC deployments, this will include the canister ID
  const pathname = window.location.pathname;
  
  // If we're at root or a simple path, return '/'
  if (pathname === '/' || !pathname.includes('/')) {
    return '/';
  }

  // For IC, paths typically look like: /<canister-id>/...
  // We want to preserve the canister ID part
  const parts = pathname.split('/').filter(Boolean);
  
  // If the first part looks like a canister ID (alphanumeric with hyphens)
  // or if we're in a nested path, use the appropriate base
  if (parts.length > 0 && /^[a-z0-9-]+$/.test(parts[0])) {
    return '/' + parts[0] + '/';
  }

  return '/';
}

/**
 * Build a production-safe image URL that respects the app's base path.
 * Encodes only the filename portion to handle spaces correctly.
 */
function buildImageUrl(productFolder: string, filename: string): string {
  const basePath = getBasePath();
  const encodedFilename = encodeURIComponent(filename);
  
  // Remove trailing slash from base path if present
  const cleanBasePath = basePath.endsWith('/') && basePath.length > 1 
    ? basePath.slice(0, -1) 
    : basePath;
  
  // Build the full path
  const fullPath = `${cleanBasePath}/assets/products/${productFolder}/${encodedFilename}`;
  
  // Normalize multiple slashes
  return fullPath.replace(/\/+/g, '/');
}

/**
 * Get all images for a product by ID or name
 */
export function getProductImages(productIdOrName: string): string[] {
  // Normalize the input for matching
  const normalized = productIdOrName.toLowerCase().trim();
  
  // Try exact ID match first
  const exactMatch = productImageMappings.find(
    (mapping) => mapping.productId.toLowerCase() === normalized
  );
  
  if (exactMatch) {
    const folder = 'cmf-cc-earbuds'; // Map product ID to folder
    return exactMatch.images.map(filename => buildImageUrl(folder, filename));
  }
  
  // Try partial name match as fallback
  const nameMatch = productImageMappings.find((mapping) =>
    normalized.includes(mapping.productId.toLowerCase()) ||
    mapping.productId.toLowerCase().includes(normalized)
  );
  
  if (nameMatch) {
    const folder = 'cmf-cc-earbuds'; // Map product ID to folder
    return nameMatch.images.map(filename => buildImageUrl(folder, filename));
  }
  
  return [];
}

/**
 * Get the primary (first) image for a product card
 */
export function getPrimaryProductImage(productIdOrName: string): string | null {
  const images = getProductImages(productIdOrName);
  return images.length > 0 ? images[0] : null;
}
