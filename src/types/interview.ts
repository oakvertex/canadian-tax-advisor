/**
 * Interview flow types for Canadian Personal Tax Advisor
 * Versioned by tax year via /taxonomy/{year}/interview-flow.json
 */

/** Supported question/input types */
export type QuestionType =
  | "boolean"        // yes/no
  | "single-choice"  // radio / select
  | "multi-choice"   // checkboxes
  | "number"         // numeric input
  | "currency"       // dollar amount
  | "date"           // date picker
  | "text"           // free text
  | "province";      // province selector

/** A single answer option for choice questions */
export interface AnswerOption {
  value: string;
  label: string;
  /** Optional hint shown beneath the option */
  hint?: string;
}

/** Conditional logic to determine if a question should be shown */
export interface DisplayCondition {
  /** The question ID whose answer drives this condition */
  questionId: string;
  operator: "eq" | "neq" | "in" | "not_in" | "exists" | "gt" | "lt";
  value: string | number | boolean | string[];
}

/** Validation rule for a question's answer */
export interface ValidationRule {
  type: "required" | "min" | "max" | "minLength" | "maxLength" | "pattern";
  value?: string | number;
  message: string;
}

/** A single interview question */
export interface InterviewQuestion {
  /** Unique ID, referenced by DisplayCondition.questionId and TaxCondition.field */
  id: string;
  /** Section this question belongs to */
  sectionId: string;
  type: QuestionType;
  /** Question text shown to user */
  label: string;
  /** Optional longer explanation */
  hint?: string;
  /** Tooltip / info popover content */
  tooltip?: string;
  /** For choice questions */
  options?: AnswerOption[];
  /** Conditions that must ALL be true for this question to appear */
  showIf?: DisplayCondition[];
  /** Validation rules */
  validation?: ValidationRule[];
  /** Taxonomy node IDs this question helps resolve */
  relatedNodes: string[];
  /** Display order within section */
  sortOrder: number;
}

/** A section (page / accordion) grouping related questions */
export interface InterviewSection {
  id: string;
  title: string;
  /** Short description shown at top of section */
  description?: string;
  /** Icon name (e.g. heroicon key) */
  icon?: string;
  /** Ordered list of question IDs in this section */
  questionIds: string[];
  /** Conditions that must ALL be true for this section to appear */
  showIf?: DisplayCondition[];
  /** Display order in the interview */
  sortOrder: number;
}

/** Mapping from question ID to the user's captured answer */
export type InterviewAnswers = Record<string, string | number | boolean | string[]>;

/** The full interview-flow.json file structure */
export interface InterviewFlowFile {
  /** Tax year this flow applies to */
  taxYear: number;
  /** Ordered sections */
  sections: InterviewSection[];
  /** All questions, keyed by question ID for O(1) lookup */
  questions: Record<string, InterviewQuestion>;
}
