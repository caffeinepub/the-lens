# Specification

## Summary
**Goal:** Fix missing/placeholder product images by making frontend image resolution more robust and ensuring mapped image URLs with spaces load correctly.

**Planned changes:**
- Update `ProductImageGallery` to look up images by `productId` first, then fall back to `productName` when no images are found.
- Update `ProductCard` to resolve the primary image using `product.id`, with a fallback to `product.name` if needed.
- Update image helper(s) in `frontend/src/utils/productImages.ts` so returned `src` URLs are properly URL-encoded (e.g., spaces encoded) while keeping existing on-disk filenames unchanged.

**User-visible outcome:** CMF earbuds images reliably appear in the product detail gallery (with selectable thumbnails) and on storefront/product cards when mapped images exist; products without mapped images continue to show the existing placeholder.
