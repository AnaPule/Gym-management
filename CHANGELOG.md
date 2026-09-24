# Changelog

All notable changes to this project, grouped by coding session.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

---

### 2026-09-24 — Contact page: categories + safeguarding routing

**Added**
- Category dropdown on contact form: General enquiry, Membership question,
  Complaint, Feedback, Lost property, About my child.
- Inline safeguarding notice shown when "About my child" is selected.
- Success screen confirms safeguarding routing when that category was used.

**Changed**
- Contact page no longer assumes unauthenticated context. Reachable from
  both login/signup (public) and, later, the dashboard sidebar.

## [Unreleased]

### 2026-09-23 — Kill forgot password, minor flow polish

**Removed**
- `/forgot-password` route and page. OTP-only auth means there is no
  password to reset. Login flow now offers "Resend code" on the OTP step
  instead, which is the actual recovery action.

**Added**
- `lib/grade.ts` — age-aware grade suggestions for minors
  (2 grades behind the typical, 1 ahead).
- `emergencyContact.sameAsPrimary` flag on `OnboardingForm`. When ticked
  by a guardian, auto-fills the emergency contact with the primary
  guardian's details and locks the fields.
- Confirm step now groups the review into labelled sections
  (Guardian / Member / Fighter / Emergency & medical / Plan & payment /
  Consents) with per-section "Edit" links back to the relevant step.
- Masked card display on Confirm when card was chosen
  (`•••• •••• •••• 4242`).

**Changed**
- `EmergencyMedical.tsx` — added "same as primary guardian" checkbox.
- `Details.tsx` — grade dropdown now shows a window of grades around the
  minor's age with a "Show all grades" escape hatch.
- `Confirm.tsx` — restructured from flat list into category cards.

---

### 2026-09-22 — Unified adult + minor onboarding

**Added**
- `OnboardingShell.tsx` — single wizard drives both flows, `mode` prop.
- `AdultMember.tsx` / `MinorMember.tsx` — thin named wrappers.
- `PaymentMethodForm.tsx` — card / EFT toggle, mocked until the gateway
  lands.
- Mode-aware step components: `Details`, `EmergencyMedical`,
  `ChoosePlan`, `Consents`, `Confirm`.
- Single `OnboardingForm` shape with `mode: 'adult' | 'minor'`.
- `computeCanNext` branches on mode for per-step validity.

**Changed**
- Fighter profile and verify email are shared verbatim between flows.
- `api/signup.ts` collapsed to a single `registerMember(form, token)`
  call; branches server-side.

**Removed**
- `steps-minor/` folder (duplicated work).
- `AdultSignupForm`, `MinorSignupForm`, `minorValidation.ts`.

---

### 2026-09-20 — Shared UI library and auth pages

**Added**
- `Button`, `LinkButton`, `Form` + `FormField`, `Logo`, `Phone`,
  `Dropdown`, `Pill`.
- `AuthLayout`, `OnboardingStepper`, `ConsentCard`.
- AI assistant panel (bubble + drawer + provider + hook).
- Login (two-step OTP), Signup chooser, Forgot password (since removed),
  Contact.
- `api/client.ts`, `api/auth.ts` — stubbed fetch layer.
- Path alias `@/` → `src/`.
- Tailwind v4 via `@tailwindcss/vite`; crimson + zinc theme tokens.

**Changed**
- Login swapped from password mock to email + OTP.

---

### 2026-09-18 — Project scaffold

**Added**
- Ionic React + Vite + TypeScript base.
- Tailwind, eslint, cypress config.
- `.gitignore`, `docker-compose.yml`, `Makefile`, `README.md`.
- Obsidian vault under `docs/`.

---