/**
 * Matching engine — evaluates which TaxonomyNodes are applicable
 * given a set of InterviewAnswers.
 */

import type { TaxonomyNode, TaxCondition, InterviewAnswers } from "@/types";

function evaluateCondition(condition: TaxCondition, answers: InterviewAnswers): boolean {
  const actual = answers[condition.field];

  switch (condition.operator) {
    case "exists":
      return actual !== undefined && actual !== null && actual !== "";
    case "eq":
      return actual === condition.value;
    case "neq":
      return actual !== condition.value;
    case "in":
      return Array.isArray(condition.value) && condition.value.includes(actual as never);
    case "not_in":
      return Array.isArray(condition.value) && !condition.value.includes(actual as never);
    case "gt":
      return typeof actual === "number" && actual > (condition.value as number);
    case "lt":
      return typeof actual === "number" && actual < (condition.value as number);
    case "gte":
      return typeof actual === "number" && actual >= (condition.value as number);
    case "lte":
      return typeof actual === "number" && actual <= (condition.value as number);
    default:
      return false;
  }
}

/**
 * Returns the subset of nodes that are applicable given the provided answers.
 * A node with no applicabilityConditions is always included.
 */
export function matchApplicableNodes(
  nodes: TaxonomyNode[],
  answers: InterviewAnswers
): TaxonomyNode[] {
  return nodes.filter((node) => {
    if (!node.active) return false;
    if (node.applicabilityConditions.length === 0) return true;
    return node.applicabilityConditions.every((cond) => evaluateCondition(cond, answers));
  });
}
