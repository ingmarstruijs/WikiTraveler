import { describe, expect, it } from "vitest";
import { computeCategoryBars, overallAccessibilityScore } from "./accessibilityScore";

describe("computeCategoryBars", () => {
  it("maps facts by field name, not display section / room scope", () => {
    const bars = computeCategoryBars([
      { fieldName: "step_free_entrance" },
      { fieldName: "automatic_door" },
      { fieldName: "accessible_bathroom" },
      { fieldName: "roll_in_shower" },
      { fieldName: "grab_bars_bathroom" },
    ]);
    const bathroom = bars.find((b) => b.id === "bathroom");
    expect(bathroom?.count).toBe(3);
    expect(bathroom?.pct).toBe(100);
  });

  it("does not count notes or retired fields", () => {
    const bars = computeCategoryBars([
      { fieldName: "notes" },
      { fieldName: "elevator_floor_count" },
      { fieldName: "accessible_room_count" },
    ]);
    expect(bars.every((b) => b.count === 0)).toBe(true);
  });
});

describe("overallAccessibilityScore", () => {
  it("matches Lens weighting for 73/86/100/0 coverage", () => {
    const bars = [
      { pct: 73 },
      { pct: 86 },
      { pct: 100 },
      { pct: 0 },
    ];
    expect(overallAccessibilityScore(bars)).toBe(66);
  });
});
