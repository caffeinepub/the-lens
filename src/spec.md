# Specification

## Summary
**Goal:** Ensure all storefront product and marketing images reliably load across all routes in both local development and Internet Computer deployments, including filenames with spaces, without relying on absolute-root asset paths.

**Planned changes:**
- Update frontend static asset URL generation to be base-path safe across routes (Home, Shop, Category, Product Detail) and to properly handle filenames with spaces.
- Update Home hero and category tile image references to use the same base-path-safe asset URL approach (replacing hardcoded absolute `/assets/...` paths).
- Verify CMF earbuds image files exist with exact filenames under `frontend/public/assets/products/cmf-cc-earbuds/` and are included/served in the deployed frontend build output at the URLs produced by the app.

**User-visible outcome:** Product images (including CMF earbuds primary image and thumbnails) and Home/category marketing images display correctly on all pages in both local and Internet Computer deployments, without broken images or placeholders when assets exist.
