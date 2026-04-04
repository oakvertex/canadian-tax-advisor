export interface TaxonomyNode {
  id: string;
  tax_year: string;
  category: "income" | "deduction" | "credit" | "special";
  subcategory: string;
  label: string;
  ita_reference: {
    primary: { section: string; act: string; description: string };
    supporting: Array<{ section: string; act: string; description: string }>;
  };
  legislation_status: {
    stable: boolean;
    note: string | null;
    last_verified: string;
  };
  plain_language: string;
  life_event_tags: string[];
  eligibility_conditions: {
    logic: "ALL" | "ANY" | "NONE";
    conditions: Array<{
      question_id: string;
      operator: "equals" | "not_equals" | "in" | "not_in" | "greater_than" | "less_than";
      value: any;
    }>;
    flag_conditions: Array<{
      flag: string;
      operator: string;
      value: any;
    }>;
  };
  confidence_tier: {
    confirmed: { label: string; condition: string };
    possible: { label: string; reasons: Record<string, string> };
  };
  limits: {
    type: "fixed_amount" | "percentage" | "income_capped" | "lesser_of" | "no_limit" | "phase_out";
    description: string;
    amounts: Array<{ label: string; value: number | null; note: string }>;
    phase_out: { starts_at: number | null; eliminated_at: number | null; note: string | null };
    carryforward: boolean;
    carryforward_note: string | null;
    carryback: boolean;
    carryback_note: string | null;
  };
  eligible_expenses: string[];
  supporting_documents: Array<{
    document: string;
    note: string;
    urgency: "standard" | "priority" | "urgent" | "critical";
  }>;
  preparer_flags: Array<{
    flag: string;
    urgency: "standard" | "priority" | "urgent" | "critical";
  }>;
  legislation_interaction: Array<{
    interacts_with_node: string;
    interaction_type: "reduces" | "eliminates" | "enhances" | "requires" | "conflicts";
    note: string;
  }>;
  planning_notes: string | null;
  newcomer_relevance: { high: boolean; note: string | null };
  ontario_specific: boolean;
}

export interface InterviewScreen {
  screen_id: string;
  screen_type: "single_select" | "multi_select";
  title: string;
  question_id: string;
  instruction?: string;
  options: Array<{
    value: any;
    label: string;
    exclusive?: boolean;
  }>;
  skip_if?: { question_id: string; operator: string; value: any };
  show_if?: { question_id?: string; flag?: string; operator: string; value: any };
  feedback: Record<string, {
    message: string;
    checklist_update?: { node_id: string; confidence_tier: string; reason?: string } | null;
    checklist_preview?: { node_id: string; status: string; label: string } | null;
    activates_flag?: string;
    document_checklist_add?: { document: string; urgency: string } | null;
    preparer_flag?: { flag: string; urgency: string } | null;
    suppresses_branch_screens?: string[];
  }>;
}

export interface InterviewBranch {
  branch_id: string;
  branch_label: string;
  branch_order: number;
  always_runs: boolean;
  triggered_by?: string | string[];
  intro: string;
  screens: InterviewScreen[];
  branch_completion_summary: {
    message: string;
    shows: string;
    highlighted_documents?: string[];
    transition: string | null;
  };
}

export interface SessionState {
  answers: Record<string, any>;
  flags: Record<string, boolean>;
  checklist: Array<{
    node_id: string;
    confidence_tier: "confirmed" | "possible";
    reason?: string;
    planning_note?: string;
    count?: number;
    note?: string;
  }>;
  documents: Array<{
    document: string;
    note: string;
    urgency: "standard" | "priority" | "urgent" | "critical";
    source_node: string;
  }>;
  preparer_flags: Array<{
    flag: string;
    urgency: string;
    source_node: string;
  }>;
  obligations: Array<{
    action: string;
    urgency: string;
    source_node: string;
  }>;
  current_branch_index: number;
  current_screen_index: number;
  tax_year: string;
  completed: boolean;
  answerHistory?: Array<{
    question_id: string;
    value: any;
    branch_index: number;
    screen_index: number;
  }>;
}

export interface MatchedNode {
  node_id: string;
  label: string;
  category: "income" | "deduction" | "credit" | "special";
  confidence_tier: "confirmed" | "possible";
  reason?: string;
  ita_reference: {
    primary: { section: string; act: string; description: string };
    supporting: Array<{ section: string; act: string; description: string }>;
  };
  plain_language: string;
  supporting_documents: Array<{
    document: string;
    note: string;
    urgency: "standard" | "priority" | "urgent" | "critical";
  }>;
  preparer_flags: Array<{
    flag: string;
    urgency: "standard" | "priority" | "urgent" | "critical";
  }>;
  planning_notes: string | null;
}
