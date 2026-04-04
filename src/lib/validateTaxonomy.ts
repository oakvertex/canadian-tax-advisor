import { readFileSync } from "fs";
import { join } from "path";
import type { TaxonomyNode } from "@/types";

const REQUIRED_TOP_LEVEL: (keyof TaxonomyNode)[] = [
  "id",
  "tax_year",
  "category",
  "subcategory",
  "label",
  "ita_reference",
  "legislation_status",
  "plain_language",
  "life_event_tags",
  "eligibility_conditions",
  "confidence_tier",
  "limits",
  "eligible_expenses",
  "supporting_documents",
  "preparer_flags",
  "legislation_interaction",
  "planning_notes",
  "newcomer_relevance",
  "ontario_specific",
];

function validateNode(node: TaxonomyNode, index: number): string[] {
  const failures: string[] = [];

  for (const field of REQUIRED_TOP_LEVEL) {
    if (node[field] === undefined) {
      failures.push(`node[${index}].${field}`);
    }
  }

  // ita_reference sub-fields
  if (node.ita_reference) {
    if (!node.ita_reference.primary) failures.push(`node[${index}].ita_reference.primary`);
    if (!Array.isArray(node.ita_reference.supporting)) failures.push(`node[${index}].ita_reference.supporting`);
  }

  // legislation_status sub-fields
  if (node.legislation_status) {
    if (typeof node.legislation_status.stable !== "boolean") failures.push(`node[${index}].legislation_status.stable`);
    if (!("note" in node.legislation_status)) failures.push(`node[${index}].legislation_status.note`);
    if (!node.legislation_status.last_verified) failures.push(`node[${index}].legislation_status.last_verified`);
  }

  // eligibility_conditions sub-fields
  if (node.eligibility_conditions) {
    if (!node.eligibility_conditions.logic) failures.push(`node[${index}].eligibility_conditions.logic`);
    if (!Array.isArray(node.eligibility_conditions.conditions)) failures.push(`node[${index}].eligibility_conditions.conditions`);
    if (!Array.isArray(node.eligibility_conditions.flag_conditions)) failures.push(`node[${index}].eligibility_conditions.flag_conditions`);
  }

  // confidence_tier sub-fields
  if (node.confidence_tier) {
    if (!node.confidence_tier.confirmed) failures.push(`node[${index}].confidence_tier.confirmed`);
    if (!node.confidence_tier.possible) failures.push(`node[${index}].confidence_tier.possible`);
  }

  // limits sub-fields
  if (node.limits) {
    if (!node.limits.type) failures.push(`node[${index}].limits.type`);
    if (!Array.isArray(node.limits.amounts)) failures.push(`node[${index}].limits.amounts`);
    if (typeof node.limits.carryforward !== "boolean") failures.push(`node[${index}].limits.carryforward`);
    if (typeof node.limits.carryback !== "boolean") failures.push(`node[${index}].limits.carryback`);
  }

  // newcomer_relevance sub-fields
  if (node.newcomer_relevance) {
    if (typeof node.newcomer_relevance.high !== "boolean") failures.push(`node[${index}].newcomer_relevance.high`);
  }

  return failures;
}

function main() {
  const filePath = join(process.cwd(), "taxonomy", "2025", "items.json");
  const nodes: TaxonomyNode[] = JSON.parse(readFileSync(filePath, "utf-8"));

  if (!Array.isArray(nodes) || nodes.length === 0) {
    console.log("FAIL: items.json is empty or not an array");
    process.exit(1);
  }

  const allFailures: string[] = [];
  for (let i = 0; i < nodes.length; i++) {
    allFailures.push(...validateNode(nodes[i], i));
  }

  if (allFailures.length === 0) {
    console.log(`PASS: all ${nodes.length} node(s) valid`);
  } else {
    for (const f of allFailures) {
      console.log(`FAIL: missing or invalid field — ${f}`);
    }
    process.exit(1);
  }
}

main();
