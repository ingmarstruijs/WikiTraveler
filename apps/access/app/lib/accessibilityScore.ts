import { auditStepForField, type AuditStepId } from "@wikitraveler/core";

/** Expected field counts — same model as Lens `CATEGORY_EXPECTED`. */
export const CATEGORY_EXPECTED: Array<{
  id: string;
  labelKey: string;
  steps: AuditStepId[];
  expected: number;
}> = [
  { id: "mobility", labelKey: "ui.auditStepMobility", steps: ["entrance", "mobility"], expected: 11 },
  { id: "room", labelKey: "ui.auditStepRoom", steps: ["room"], expected: 7 },
  { id: "bathroom", labelKey: "ui.auditStepBathroom", steps: ["bathroom"], expected: 3 },
  { id: "communication", labelKey: "ui.auditStepCommunication", steps: ["communication"], expected: 5 },
];

export type ScoreBar = { id: string; labelKey: string; pct: number; count: number };

/**
 * Coverage bars by catalogue field → audit step (not display section).
 * Room-scoped bathroom facts still count as bathroom, matching Lens.
 */
export function computeCategoryBars(facts: Array<{ fieldName: string }>): ScoreBar[] {
  const byStep: Partial<Record<AuditStepId, number>> = {};
  for (const f of facts) {
    const step = auditStepForField(f.fieldName);
    if (!step || step === "review") continue;
    byStep[step] = (byStep[step] ?? 0) + 1;
  }
  return CATEGORY_EXPECTED.map((cat) => {
    const count = cat.steps.reduce((sum, s) => sum + (byStep[s] ?? 0), 0);
    const pct = Math.min(100, Math.round((count / cat.expected) * 100));
    return { id: cat.id, labelKey: cat.labelKey, pct, count };
  });
}

/** Overall score = expected-field-weighted coverage across categories (0–100). */
export function overallAccessibilityScore(bars: Array<{ pct: number }>): number | null {
  let weighted = 0;
  let expected = 0;
  for (let i = 0; i < CATEGORY_EXPECTED.length; i++) {
    const bar = bars[i];
    if (!bar) continue;
    weighted += bar.pct * CATEGORY_EXPECTED[i].expected;
    expected += CATEGORY_EXPECTED[i].expected;
  }
  if (expected <= 0) return null;
  if (bars.every((b) => b.pct === 0)) return null;
  return Math.round(weighted / expected);
}
