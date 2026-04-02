/**
 * Utilities for loading taxonomy data from static JSON files.
 */

import type { TaxonomyItemsFile, InterviewFlowFile } from "@/types";

export async function loadTaxonomyItems(taxYear: number): Promise<TaxonomyItemsFile> {
  const data = await import(`../../taxonomy/${taxYear}/items.json`);
  return data.default as TaxonomyItemsFile;
}

export async function loadInterviewFlow(taxYear: number): Promise<InterviewFlowFile> {
  const data = await import(`../../taxonomy/${taxYear}/interview-flow.json`);
  return data.default as InterviewFlowFile;
}

export const SUPPORTED_TAX_YEARS = [2025, 2024] as const;
export type SupportedTaxYear = (typeof SUPPORTED_TAX_YEARS)[number];

export function isValidTaxYear(year: number): year is SupportedTaxYear {
  return (SUPPORTED_TAX_YEARS as readonly number[]).includes(year);
}
