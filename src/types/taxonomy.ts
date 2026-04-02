/**
 * Taxonomy node types for Canadian Personal Tax Advisor
 * Versioned by tax year via /taxonomy/{year}/items.json
 */

export type TaxYear = number; // e.g. 2024, 2025

export type NodeCategory =
  | "income"
  | "deduction"
  | "credit"
  | "slip"
  | "schedule"
  | "benefit"
  | "carryforward"
  | "other";

export type FilingStatus =
  | "single"
  | "married"
  | "common-law"
  | "separated"
  | "divorced"
  | "widowed";

export type ResidencyStatus =
  | "resident"
  | "non-resident"
  | "deemed-resident"
  | "part-year-resident";

export type ProvinceCode =
  | "AB"
  | "BC"
  | "MB"
  | "NB"
  | "NL"
  | "NS"
  | "NT"
  | "NU"
  | "ON"
  | "PE"
  | "QC"
  | "SK"
  | "YT";

/** A single condition that must be true for a node to be applicable */
export interface TaxCondition {
  /** Field/attribute to evaluate, e.g. "filingStatus", "hasChildrenUnder18" */
  field: string;
  operator: "eq" | "neq" | "in" | "not_in" | "gt" | "lt" | "gte" | "lte" | "exists";
  value: string | number | boolean | string[] | number[];
}

/** Source slip or document that feeds this taxonomy node */
export interface SourceDocument {
  /** CRA slip/form identifier, e.g. "T4", "T5", "T2202" */
  slipId: string;
  /** Human-readable label */
  label: string;
  /** Relevant box numbers on the slip */
  boxes?: string[];
}

/** A line reference on the T1 general return */
export interface T1LineRef {
  /** CRA line number, e.g. "10100", "22200" */
  lineNumber: string;
  /** Schedule reference if applicable, e.g. "Schedule 9" */
  schedule?: string;
  /** Form reference if applicable, e.g. "T778" */
  form?: string;
}

/** A single taxonomy node representing a deductible expense, credit, income type, etc. */
export interface TaxonomyNode {
  /** Unique identifier, e.g. "employment-income", "rrsp-contribution" */
  id: string;
  /** Tax year this node applies to */
  taxYear: TaxYear;
  /** Human-readable name */
  label: string;
  /** Brief description shown to user */
  description: string;
  /** Category grouping */
  category: NodeCategory;
  /** T1 line reference(s) */
  t1Lines: T1LineRef[];
  /** Source documents / slips */
  sourceDocuments: SourceDocument[];
  /** Conditions under which this node is potentially applicable */
  applicabilityConditions: TaxCondition[];
  /** Whether this item requires carryforward from prior years */
  hasCarryforward: boolean;
  /** Whether this item can be split between spouses */
  isSpouseTransferable: boolean;
  /** Whether this item is province-specific */
  isProvincial: boolean;
  /** Province codes if provincial, or empty if federal/all provinces */
  applicableProvinces: ProvinceCode[];
  /** CRA webpage or guide reference, e.g. "T4012", "RC4064" */
  craReference?: string;
  /** Tags for fuzzy matching / search */
  tags: string[];
  /** Display order within category */
  sortOrder: number;
  /** Whether node is active in this tax year */
  active: boolean;
}

/** The full items.json file structure */
export type TaxonomyItemsFile = TaxonomyNode[];
