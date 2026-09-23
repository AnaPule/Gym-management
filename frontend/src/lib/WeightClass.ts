/**
 * @file        WeightClass.ts
 * @description Maps a weight in kg to an MMA weight class. Used in the
 *              fighter profile step and the confirmation review.
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-20
 * @updated     2026-09-20
 * @version     1.0.0
 */

export interface WeightClass {
  name: string;
  minKg: number;
  maxKg: number;  // exclusive upper bound
}

// Ordered by weight. Ranges are [min, max) in kg.
export const WEIGHT_CLASSES: WeightClass[] = [
  { name: 'Flyweight',        minKg: 0,   maxKg: 56.7 },
  { name: 'Bantamweight',     minKg: 56.7, maxKg: 61.2 },
  { name: 'Featherweight',    minKg: 61.2, maxKg: 65.8 },
  { name: 'Lightweight',      minKg: 65.8, maxKg: 70.3 },
  { name: 'Welterweight',     minKg: 70.3, maxKg: 77.1 },
  { name: 'Middleweight',     minKg: 77.1, maxKg: 83.9 },
  { name: 'Light Heavyweight', minKg: 83.9, maxKg: 92.9 },
  { name: 'Heavyweight',      minKg: 92.9, maxKg: 120.2 },
];

export function weightClassFor(kg: number): WeightClass | null {
  if (!Number.isFinite(kg) || kg <= 0) return null;
  return WEIGHT_CLASSES.find((c) => kg >= c.minKg && kg < c.maxKg) ?? null;
}