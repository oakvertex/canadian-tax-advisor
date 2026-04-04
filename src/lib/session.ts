import type { SessionState } from "@/types";

type FeedbackEntry = {
  message?: string;
  checklist_update?: { node_id: string; confidence_tier: string; reason?: string; count?: number; note?: string } | null;
  checklist_preview?: { node_id: string; status: string; label: string } | null;
  activates_flag?: string;
  document_checklist_add?: { document: string; urgency: string } | null;
  preparer_flag?: { flag: string; urgency: string } | null;
  suppresses_branch_screens?: string[];
};

export function createSession(taxYear: string): SessionState {
  return {
    answers: {},
    flags: {},
    checklist: [],
    documents: [],
    preparer_flags: [],
    obligations: [],
    current_branch_index: 0,
    current_screen_index: 0,
    tax_year: taxYear,
    completed: false,
  };
}

export function applyFeedback(session: SessionState, feedback: object): SessionState {
  const fb = feedback as FeedbackEntry;
  let updated = { ...session };

  if (fb.activates_flag) {
    updated = { ...updated, flags: { ...updated.flags, [fb.activates_flag]: true } };
  }

  if (fb.checklist_update) {
    const entry = {
      node_id: fb.checklist_update.node_id,
      confidence_tier: fb.checklist_update.confidence_tier as "confirmed" | "possible",
      reason: fb.checklist_update.reason,
      count: fb.checklist_update.count,
      note: fb.checklist_update.note,
    };
    const existingIdx = updated.checklist.findIndex((c) => c.node_id === entry.node_id);
    if (existingIdx >= 0) {
      const newList = [...updated.checklist];
      newList[existingIdx] = entry;
      updated = { ...updated, checklist: newList };
    } else {
      updated = { ...updated, checklist: [...updated.checklist, entry] };
    }
  }

  if (fb.document_checklist_add) {
    const urgency = fb.document_checklist_add.urgency as "standard" | "priority" | "urgent" | "critical";
    updated = {
      ...updated,
      documents: [
        ...updated.documents,
        { document: fb.document_checklist_add.document, note: "", urgency, source_node: "" },
      ],
    };
  }

  return updated;
}
