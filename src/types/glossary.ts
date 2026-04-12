export type GlossaryTier = "sublabel" | "sublabel_expansion";

export interface GlossaryExpansion {
  /** Full name shown as the expansion panel heading */
  title: string;
  /** 2–4 sentence plain-language definition */
  body: string;
  /** Where the user obtains this document or information */
  where_to_find: string;
  /** ITA / OTA citation string */
  ita: string;
}

export interface GlossaryEntry {
  /** Display term exactly as it appears in the interview option label, e.g. "RRSP" */
  term: string;
  /** Always-visible plain-language gloss, ≤6 words */
  sublabel: string;
  /** Tier 1 = sub-label only. Tier 2 = sub-label + ⓘ expansion panel. */
  tier: GlossaryTier;
  /** Branch codes where this term appears, e.g. ["B3", "B8"] */
  branches: string[];
  /** screen_ids where this term appears as an option label or in question text */
  screens: string[];
  /** Present only when tier === "sublabel_expansion" */
  expansion?: GlossaryExpansion;
  /** Implementation notes — not shown to the user */
  notes?: string;
}

/**
 * Pre-computed index: screen_id → GlossaryEntry[]
 * Built at module load time from GLOSSARY in glossary.ts.
 * Used by the screen renderer to look up all terms relevant to a given screen.
 */
export type ScreenGlossaryMap = Map<string, GlossaryEntry[]>;
