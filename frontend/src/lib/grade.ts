/**
 * @file        grade.ts
 * @description Maps a minor's exact age to a suggested school grade
 *              (South African system) and returns a window of grades
 *              around it — 2 behind, 1 ahead — for the grade dropdown.
 * @author      AnaPule
 * @created     2026-09-23
 * @updated     2026-09-23
 * @version     1.0.0
 *
 * CHANGELOG:
 *   1.0.0  2026-09-23  Initial implementation
 *
 * RATIONALE:
 *   A 13-year-old is typically in Grade 8. A 9-year-old is typically in
 *   Grade 4. Offering all 12 grades is noise — the guardian has to scan
 *   and the wrong choice gets picked. Two grades of grace on either side
 *   plus one ahead covers: repeated a year, skipped a year, home-schooled
 *   with non-standard pace.
 *
 *   Age is used, not the u8/u10/u14/u18 bracket — brackets span multiple
 *   ages and would suggest the wrong grade for kids at the edges.
 */

/** Typical SA grade for a given age. Age 6 → Grade 1, age 17 → Grade 12. */
const TYPICAL_GRADE_BY_AGE: Record<number, number> = {
  6: 1,
  7: 2,
  8: 3,
  9: 4,
  10: 5,
  11: 6,
  12: 7,
  13: 8,
  14: 9,
  15: 10,
  16: 11,
  17: 12,
};

/** Always appended to every suggestion list. */
const FALLBACK_OPTIONS = ['Not in school'] as const;

/**
 * Returns grade options around the typical grade for the given age.
 * Window: 2 grades behind, the typical grade, 1 grade ahead.
 *
 * Example (age 13, typical Grade 8):  [Grade 6, Grade 7, Grade 8, Grade 9]
 * Example (age 6,  typical Grade 1):  [Grade 1, Grade 2]  (can't go below 1)
 * Example (age 17, typical Grade 12): [Grade 10, Grade 11, Grade 12]
 */
export function suggestGrades(age: number): string[] {
  if (!Number.isFinite(age)) return allGrades();

  const typical = TYPICAL_GRADE_BY_AGE[Math.floor(age)];
  if (!typical) {
    // Under 6 or over 17 — no standard mapping. Show everything.
    return allGrades();
  }

  const min = Math.max(1, typical - 2);
  const max = Math.min(12, typical + 1);

  const grades: string[] = [];
  for (let g = min; g <= max; g++) grades.push(`Grade ${g}`);
  grades.push(...FALLBACK_OPTIONS);

  return grades;
}

/** Every grade 1–12 plus the not-in-school option. */
export function allGrades(): string[] {
  const grades: string[] = [];
  for (let g = 1; g <= 12; g++) grades.push(`Grade ${g}`);
  grades.push(...FALLBACK_OPTIONS);
  return grades;
}

/**
 * True when the age is 5 or younger, or 18 or older — where the
 * "typical grade" mapping doesn't apply and we should just show all grades.
 */
export function isAgeOutsideSchoolRange(age: number): boolean {
  return !Number.isFinite(age) || age < 6 || age > 17;
}