# Auth changes implemented (Nov 7, 2025)

This document summarizes all auth-related changes implemented during this session: OTP verification hardening, unverified account re‑signup, and a complete patient "Forgot Password" flow.

## What’s included

- Reuse unverified accounts on signup (patient + doctor)
- Fixes to OTP verification for doctor and patient paths
- Patient forgot password flow (request code + reset with code)
- Model updates to support password reset
- Email utility to send reset codes

## Files changed/added

- app/api/auth/signup/route.js
  - Reuse existing unverified user accounts: regenerate `verificationCode`, update password/name/phone, resend OTP; block only verified accounts.
- app/api/auth/signupDoctor/route.js
  - Same logic for doctors; preserves/updates doctor-specific fields when provided.
- app/auth/sign-up/page.jsx
  - Redirects to `/auth/user-verify-otp?email=...` after signup (already present, validated).
- app/auth/doctor/sign-up/page.jsx
  - Redirects to `/auth/doctor/doctor-verify-otp?email=...` after signup.
- app/api/auth/doctorEmailVarify/route.js
  - Verifies using BOTH `email` and `verificationCode` to prevent cross-account verification issues.
- app/api/auth/signup/route.js
  - Fixed `verificationCode` field name usage (previous typo caused lookups to fail).
- lib/mongodb/models/User.js
  - Added: `resetPasswordCode: String`, `resetPasswordExpires: Date`.
- lib/mongodb/models/doctor.js
  - Added: `resetPasswordCode: String`, `resetPasswordExpires: Date` (for parity; doctor flow next).
- Middleware/Email.js
  - Added `sendPasswordResetCode(email, code)` helper and simple HTML template.
- app/api/auth/forgot-password/request/route.js
  - NEW: Accepts `{ email }`, generates a 6‑digit code (10‑min expiry), stores on User, and emails code. Responds success even when email doesn’t exist (no user enumeration).
- app/api/auth/forgot-password/verify/route.js
  - NEW: Accepts `{ email, code, password, confirmPassword }`, validates code + expiry, updates password, clears reset fields.
- app/auth/forgot-password/page.jsx
  - NEW: UI to request a reset code.
- app/auth/reset-password/page.jsx
  - NEW: UI to enter reset code and set a new password.

## Behaviors

### Signup (patient and doctor)
- If email is NOT found: create account, generate `verificationCode`, send OTP, redirect to verification page.
- If email exists AND `isVarified === true`: return error (account already exists).
- If email exists AND `isVarified === false` (unverified):
  - Regenerate a fresh `verificationCode`.
  - Update mutable fields from the submitted form (name, phone, password; plus doctor extra fields).
  - Save and resend OTP.
  - Return success (no duplicate account created).

### OTP verification
- Doctor verification checks by BOTH `email` and `verificationCode`.
- Patient signup now stores the code under the correct field name `verificationCode`.
- Frontend redirects include `email` in query so the verify page sends `{ email, varifyCode }` to the API.

### Forgot password (patient)
- Request: POST `/api/auth/forgot-password/request` with `{ email }`.
  - If account exists: saves `resetPasswordCode` and `resetPasswordExpires` (+10 minutes), emails the code.
  - Response is always `{ success: true }` (prevents email enumeration).
- Reset: POST `/api/auth/forgot-password/verify` with `{ email, code, password, confirmPassword }`.
  - Validates code match and expiry, updates password, clears reset fields.
- Pages:
  - `/auth/forgot-password`: submit email, then proceed to code entry.
  - `/auth/reset-password?email=...`: enter code + new password, auto-redirects to login on success.

## Minimal contracts

- Request reset code
  - POST `/api/auth/forgot-password/request`
  - Body: `{ email: string }`
  - Response: `{ success: true }` (always)

- Verify/reset password
  - POST `/api/auth/forgot-password/verify`
  - Body: `{ email: string, code: string(6), password: string, confirmPassword: string }`
  - Errors: `400` with `{ error: string }` for invalid/expired/mismatch
  - Success: `{ success: true }`

## How to try it locally

```bash
# Start dev server
npm run dev
```

Patient forgot password
1) Go to /auth/forgot-password
2) Enter account email; you’ll get a message that a code was sent (if the account exists)
3) Continue to /auth/reset-password?email=...
4) Enter the 6‑digit code from email and the new password
5) On success you’ll be redirected to login

Signup with existing unverified account (patient/doctor)
1) Sign up with an email, do not verify the OTP
2) Sign up again with the same email
3) You should not get a duplicate error; a fresh OTP is sent and the same account is reused
4) Verify using the latest code

## Next steps (optional but recommended)

- Doctor forgot password flow
  - Mirror the patient APIs and pages under `/api/auth/doctor/forgot-password/*` and `/auth/doctor/*`.
- Rate limiting and throttling
  - Add time‑based limits for sending reset codes and OTP resends.
- Code expirations for signup OTP
  - Add `verificationCodeExpires` and check on verify.
- Password strength checks
  - Enforce minimum length/complexity and add helpful error messages.
- Audit logging
  - Log sends and resets for abuse detection.

## Notes

- If you previously had a unique index on `licenseNumber`, ensure that index is dropped in MongoDB if you want to allow multiple null values. Schema changes don’t automatically remove existing indexes.
