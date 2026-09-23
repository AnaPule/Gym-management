# Contributing

Thanks for wanting to help build Team Stars. This document covers the
conventions we follow so the codebase stays predictable as more hands
touch it.

---

## Author tag

Every source file you create or meaningfully edit carries a header
comment. Use `@author` with your name so attribution is clear in the
git history and in the file itself.

```ts
/**
 * @file        OnboardingShell.tsx
 * @description Shared multi-step signup wizard for adult and minor
 *              members. Owns wizard state and swaps step components
 *              based on `mode`.
 * @author      Ana Pule
 * @created     2026-09-22
 * @updated     2026-09-23
 * @version     1.1.0
 */