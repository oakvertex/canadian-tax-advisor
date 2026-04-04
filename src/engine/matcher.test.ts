import { test } from "node:test";
import assert from "node:assert/strict";
import { matchNodes } from "./matcher";
import type { SessionState } from "@/types";

function makeSession(overrides: Partial<SessionState>): SessionState {
  return {
    answers: {},
    flags: {},
    checklist: [],
    documents: [],
    preparer_flags: [],
    obligations: [],
    current_branch_index: 0,
    current_screen_index: 0,
    tax_year: "2025",
    completed: false,
    ...overrides,
  };
}

test("confirmed match — move_reason employment, distance qualifies", () => {
  const session = makeSession({
    answers: {
      move_reason: "employment",
      move_distance_qualifies: true,
    },
    flags: {},
  });

  const result = matchNodes(session, "2025");

  assert.strictEqual(result.length, 1, "expected exactly one matched node");
  assert.strictEqual(result[0].node_id, "deduction_moving_expenses");
  assert.strictEqual(result[0].confidence_tier, "confirmed");
});

test("possible match — move_reason employment, distance unsure", () => {
  const session = makeSession({
    answers: {
      move_reason: "employment",
      move_distance_qualifies: "unsure",
    },
    flags: {},
  });

  const result = matchNodes(session, "2025");

  assert.strictEqual(result.length, 1, "expected exactly one matched node");
  assert.strictEqual(result[0].node_id, "deduction_moving_expenses");
  assert.strictEqual(result[0].confidence_tier, "possible");
});

test("no match — move_reason other", () => {
  const session = makeSession({
    answers: {
      move_reason: "other",
    },
    flags: {},
  });

  const result = matchNodes(session, "2025");

  assert.deepStrictEqual(result, []);
});
