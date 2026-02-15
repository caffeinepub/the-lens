# Specification

## Summary
**Goal:** Prevent raw Internet Computer replica rejection details (e.g., IC0508 “canister is stopped”) from appearing in the storefront, replacing them with a short, non-technical English message and preserving retry behavior where available.

**Planned changes:**
- Detect “stopped canister” replica rejection errors (e.g., reject code 5 / IC0508 / messages containing “is stopped” and/or “CallContextManager”) for product browsing queries used by Home featured products, Shop, and Category pages.
- Map detected stopped-canister errors to a concise, user-friendly English “service temporarily unavailable” message instead of showing the raw error payload.
- Keep existing retry actions on Shop/Category error states and ensure retry triggers a refetch; ensure Home featured products uses the sanitized message without breaking the rest of the Home page rendering.
- Ensure any user-facing error text affected by this change is English-only and does not include internal codes/IDs/payload details; do not misclassify non-IC0508 errors.

**User-visible outcome:** When the backend canister is stopped, shoppers see a simple “service temporarily unavailable” style message (with Retry on pages that support it) instead of raw replica rejection blobs; normal errors continue to behave as they do today.
