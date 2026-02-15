/**
 * Centralized product image mapping utility.
 * Returns an array of image paths for known products, empty array for others.
 */

export interface ProductImageMapping {
  productId: string;
  images: string[];
}

const productImageMappings: ProductImageMapping[] = [
  {
    productId: 'cmf-earbuds',
    images: [
      '/assets/products/cmf-cc-earbuds/cmf 2-1.webp',
      '/assets/products/cmf-cc-earbuds/cmf 7-1.webp',
      '/assets/products/cmf-cc-earbuds/cmf 1-1.webp',
      '/assets/products/cmf-cc-earbuds/cmf 6-1.webp',
    ],
  },
];

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
    return exactMatch.images;
  }
  
  // Try partial name match as fallback
  const nameMatch = productImageMappings.find((mapping) =>
    normalized.includes(mapping.productId.toLowerCase()) ||
    mapping.productId.toLowerCase().includes(normalized)
  );
  
  return nameMatch ? nameMatch.images : [];
}

/**
 * Get the primary (first) image for a product card
 */
export function getPrimaryProductImage(productIdOrName: string): string | null {
  const images = getProductImages(productIdOrName);
  return images.length > 0 ? images[0] : null;
}
