import { readFileSync } from "fs";
import { join } from "path";
import type { TaxonomyNode, InterviewBranch } from "@/types";

export function loadTaxonomyNodes(taxYear: string): TaxonomyNode[] {
  const filePath = join(process.cwd(), "taxonomy", taxYear, "items.json");
  return JSON.parse(readFileSync(filePath, "utf-8")) as TaxonomyNode[];
}

export function loadInterviewFlow(taxYear: string): InterviewBranch[] {
  const filePath = join(process.cwd(), "taxonomy", taxYear, "interview-flow.json");
  return JSON.parse(readFileSync(filePath, "utf-8")) as InterviewBranch[];
}
