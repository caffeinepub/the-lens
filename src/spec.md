# Specification

## Summary
**Goal:** Publish the existing “cmf-earbuds” product so it is visible across all public storefront surfaces.

**Planned changes:**
- Update backend initialization so that after `initializeShop`, the existing product `cmf-earbuds` is set to `published=true` and appears in public listings and the Electronics category.
- Add/adjust an upgrade-safe migration (only if needed) to ensure that if `cmf-earbuds` already exists with `published=false`, it is flipped to `published=true` without changing or deleting other products.
- Preserve access rules: public callers cannot access unpublished products; admins can access products regardless of publish status.

**User-visible outcome:** The CMF earbuds product appears on the public Shop page, Electronics category page, and Home featured products automatically (on both fresh deployments and upgrades), without requiring manual republishing in the admin UI.
