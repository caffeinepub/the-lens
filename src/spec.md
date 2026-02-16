# Specification

## Summary
**Goal:** Add a customer login page that collects name, email, and an India-format phone number with OTP verification.

**Planned changes:**
- Add/update a Customer Login UI with fields for Name, Email, and Indian phone number formatting/validation.
- Add an OTP verification step in the login flow (generate/verify OTP without real SMS delivery).
- Wire the login flow to the existing Internet Identity-based authentication setup without adding new backend services.

**User-visible outcome:** Users can enter their name, email, and an India-format phone number, then complete an OTP verification step to log in.
