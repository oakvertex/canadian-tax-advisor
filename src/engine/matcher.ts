import { readFileSync } from "fs";
import { join } from "path";
import type { SessionState, MatchedNode, TaxonomyNode, AnswerValue } from "@/types";

function evaluateAnswerCondition(operator: string, actual: AnswerValue | undefined, expected: AnswerValue): boolean {
  switch (operator) {
    case "equals":
      return actual === expected;
    case "not_equals":
      return actual !== expected;
    case "in":
      if (Array.isArray(expected)) return expected.includes(actual as string);
      if (Array.isArray(actual)) return actual.includes(expected as string);
      return false;
    case "not_in":
      if (Array.isArray(expected)) return !expected.includes(actual as string);
      if (Array.isArray(actual)) return !actual.includes(expected as string);
      return true;
    case "greater_than":
      return typeof actual === "number" && actual > (expected as number);
    case "less_than":
      return typeof actual === "number" && actual < (expected as number);
    default:
      return false;
  }
}

function evaluateFlagCondition(operator: string, flagValue: boolean | undefined, expected: boolean): boolean {
  const actual = flagValue ?? false;
  switch (operator) {
    case "equals":
      return actual === expected;
    case "not_equals":
      return actual !== expected;
    default:
      return actual === true;
  }
}

function evaluateEligibility(
  node: TaxonomyNode,
  answers: Record<string, AnswerValue>,
  flags: Record<string, boolean>
): { matches: boolean; allMet: boolean } {
  const { logic, conditions, flag_conditions } = node.eligibility_conditions;

  const results = [
    ...conditions.map((c) => evaluateAnswerCondition(c.operator, answers[c.question_id], c.value)),
    ...flag_conditions.map((c) => evaluateFlagCondition(c.operator, flags[c.flag], c.value)),
  ];

  if (results.length === 0) {
    return { matches: true, allMet: true };
  }

  const passCount = results.filter(Boolean).length;
  const allMet = passCount === results.length;

  switch (logic) {
    case "ALL":
      if (passCount === 0) return { matches: false, allMet: false };
      return { matches: true, allMet };
    case "ANY":
      return { matches: passCount > 0, allMet };
    case "NONE":
      return { matches: passCount === 0, allMet: passCount === 0 };
    default:
      return { matches: false, allMet: false };
  }
}

export function matchNodes(sessionState: SessionState, taxYear: string): MatchedNode[] {
  const filePath = join(process.cwd(), "taxonomy", taxYear, "items.json");
  const nodes: TaxonomyNode[] = JSON.parse(readFileSync(filePath, "utf-8"));
  const matched: MatchedNode[] = [];

  for (const node of nodes) {
    const { matches, allMet } = evaluateEligibility(node, sessionState.answers, sessionState.flags);
    if (!matches) continue;

    const { logic } = node.eligibility_conditions;
    let confidence_tier: "confirmed" | "possible";
    if (logic === "ALL") {
      confidence_tier = allMet ? "confirmed" : "possible";
    } else if (logic === "ANY") {
      confidence_tier = "confirmed"; // any passing condition is sufficient
    } else {
      confidence_tier = "confirmed"; // NONE — all disqualifiers absent
    }

    matched.push({
      node_id: node.id,
      label: node.label,
      category: node.category,
      confidence_tier,
      ita_reference: node.ita_reference,
      plain_language: node.plain_language,
      supporting_documents: node.supporting_documents,
      preparer_flags: node.preparer_flags,
      planning_notes: node.planning_notes,
    });
  }

  return matched;
}
