# Canadian Tax Advisor — Build Context

## Stack
- Next.js 14, TypeScript, Tailwind CSS
- Deployed on Railway (railway.toml, no Dockerfile needed)
- AI: OpenRouter API, model via env var AI_MODEL
- Default dev model: meta-llama/llama-3.3-8b-instruct:free
- No database for MVP — static JSON files only

## Folder Structure Required
/taxonomy/2025/items.json
/taxonomy/2025/interview-flow.json
/taxonomy/2024/items.json
/taxonomy/2024/interview-flow.json
/src/app
/src/components
/src/engine
/src/types
/src/lib

## Environment Variables (.env.example)
OPENROUTER_API_KEY=
AI_MODEL=meta-llama/llama-3.3-8b-instruct:free
NEXT_PUBLIC_APP_ENV=development

## Taxonomy Node TypeScript Type
Each node has these fields:
  id: string
  tax_year: string
  category: "income" | "deduction" | "credit" | "special"
  subcategory: string
  label: string
  ita_reference: {
    primary: { section: string, act: string, description: string }
    supporting: Array<{ section: string, act: string, description: string }>
  }
  legislation_status: {
    stable: boolean
    note: string | null
    last_verified: string
  }
  plain_language: string
  life_event_tags: string[]
  eligibility_conditions: {
    logic: "ALL" | "ANY" | "NONE"
    conditions: Array<{
      question_id: string
      operator: "equals" | "not_equals" | "in" | "not_in" | "greater_than" | "less_than"
      value: any
    }>
    flag_conditions: Array<{
      flag: string
      operator: string
      value: any
    }>
  }
  confidence_tier: {
    confirmed: { label: string, condition: string }
    possible: { label: string, reasons: Record<string, string> }
  }
  limits: {
    type: "fixed_amount" | "percentage" | "income_capped" | "lesser_of" | "no_limit" | "phase_out"
    description: string
    amounts: Array<{ label: string, value: number | null, note: string }>
    phase_out: { starts_at: number | null, eliminated_at: number | null, note: string | null }
    carryforward: boolean
    carryforward_note: string | null
    carryback: boolean
    carryback_note: string | null
  }
  eligible_expenses: string[]
  supporting_documents: Array<{
    document: string
    note: string
    urgency: "standard" | "priority" | "urgent" | "critical"
  }>
  preparer_flags: Array<{
    flag: string
    urgency: "standard" | "priority" | "urgent" | "critical"
  }>
  legislation_interaction: Array<{
    interacts_with_node: string
    interaction_type: "reduces" | "eliminates" | "enhances" | "requires" | "conflicts"
    note: string
  }>
  planning_notes: string | null
  newcomer_relevance: { high: boolean, note: string | null }
  ontario_specific: boolean

## Interview Flow TypeScript Type
Each screen has:
  screen_id: string
  screen_type: "single_select" | "multi_select"
  title: string
  question_id: string
  instruction?: string
  options: Array<{
    value: any
    label: string
    exclusive?: boolean
  }>
  skip_if?: { question_id: string, operator: string, value: any }
  show_if?: { question_id?: string, flag?: string, operator: string, value: any }
  feedback: Record<string, {
    message: string
    checklist_update?: { node_id: string, confidence_tier: string, reason?: string } | null
    checklist_preview?: { node_id: string, status: string, label: string } | null
    activates_flag?: string
    document_checklist_add?: { document: string, urgency: string } | null
    preparer_flag?: { flag: string, urgency: string } | null
    suppresses_branch_screens?: string[]
  }>

## Interview Branch TypeScript Type
Each branch has:
  branch_id: string
  branch_label: string
  branch_order: number
  always_runs: boolean
  triggered_by?: string | string[]
  intro: string
  screens: InterviewScreen[]
  branch_completion_summary: {
    message: string
    shows: string
    highlighted_documents?: string[]
    transition: string | null
  }

## Session State TypeScript Type
  answers: Record<string, any>
  flags: Record<string, boolean>
  checklist: Array<{
    node_id: string
    confidence_tier: "confirmed" | "possible"
    reason?: string
    planning_note?: string
  }>
  documents: Array<{
    document: string
    note: string
    urgency: "standard" | "priority" | "urgent" | "critical"
    source_node: string
  }>
  preparer_flags: Array<{
    flag: string
    urgency: string
    source_node: string
  }>
  obligations: Array<{
    action: string
    urgency: string
    source_node: string
  }>
  current_branch_index: number
  current_screen_index: number
  tax_year: string
  completed: boolean

## Matched Node TypeScript Type
  node_id: string
  label: string
  category: "income" | "deduction" | "credit" | "special"
  confidence_tier: "confirmed" | "possible"
  reason?: string
  ita_reference: {
    primary: { section: string, act: string, description: string }
    supporting: Array<{ section: string, act: string, description: string }>
  }
  plain_language: string
  supporting_documents: Array<{
    document: string
    note: string
    urgency: "standard" | "priority" | "urgent" | "critical"
  }>
  preparer_flags: Array<{
    flag: string
    urgency: "standard" | "priority" | "urgent" | "critical"
  }>
  planning_notes: string | null

## Output Brief Structure
The output brief has five sections rendered from matched nodes:
  Section 1: Income to Report
  Section 2: Deductions to Claim
  Section 3: Credits to Apply
  Section 4: Documents to Gather
    - Organized by urgency: critical, urgent, priority, standard
    - Deduplicated across all matched nodes
  Section 5: Obligations and Actions
    - Non-T1 items: GST/HST registration, CCB application,
      RDSP opening, HBP/LLP repayment, RRSP conversion,
      T1135 foreign reporting, OAS/CPP application
  Planning Discussion:
    - Items requiring preparer modelling before filing
    - Examples: pension splitting, RRSP deduction timing,
      tuition transfer vs carryforward, OAS deferral

## Confidence Tiers
confirmed — all eligibility conditions met
possible  — partial conditions, fact_dependent,
            condition_not_asked, or
            professional_judgment_required

## Urgency Tiers
standard  — bring to preparer
priority  — required to claim this item
urgent    — time-sensitive, act before deadline
critical  — irreversible consequence if missed

## Branch List (15 branches total)
Branch 1:  Personal Profile          always_runs: true
Branch 2:  Employment Income         always_runs: true
Branch 3:  Other Income Sources      always_runs: true
Branch 4:  Relocation                triggered_by: life_event_moved
Branch 5:  Marital Status Change     triggered_by: life_event_marriage_change
Branch 6:  Children and Dependents   triggered_by: life_event_had_child, has_dependents
Branch 7:  Self-Employment           triggered_by: life_event_started_business
Branch 8:  Retirement                triggered_by: life_event_retired, age_65_plus, receives_pension_income
Branch 9:  Education                 triggered_by: life_event_education
Branch 10: First Home                triggered_by: life_event_first_home
Branch 11: Disability                triggered_by: life_event_disability, has_child_with_disability
Branch 12: Age Milestones            triggered_by: life_event_age_milestone, age_65_plus, rrsp_conversion_required
Branch 13: Savings and Registered Plans  always_runs: true
Branch 14: Deductions Review         always_runs: true
Branch 15: Credits Review            always_runs: true

## Life Event Options (Screen 1 — Life Events Gate)
life_event_moved             → activates branch_moving
life_event_changed_job       → activates branch_employment
life_event_marriage_change   → activates branch_marital_status
life_event_had_child         → activates branch_children
life_event_started_business  → activates branch_self_employment
life_event_retired           → activates branch_retirement
life_event_age_milestone     → activates branch_age_milestone
life_event_disability        → activates branch_disability
life_event_education         → activates branch_education
life_event_first_home        → activates branch_first_home
life_event_none              → exclusive, no branches activated

## Key Flags (set during interview, persist across branches)
has_employment_income
has_child_under_7
has_child_7_to_16
has_child_with_disability
has_adult_dependent
has_capital_gains
has_rental_income
has_medical_expenses
has_charitable_donations
newly_coupled
newly_separated
newly_divorced
newly_widowed
newcomer_proration
partial_year_employment
age_65_plus
milestone_18
milestone_65
milestone_71
rrsp_conversion_required
rrsp_conversion_year
dtc_approved
dtc_pending
dtc_not_applied
fhsa_active
hbp_active
llp_active
hbp_repayment_due
pension_splitting_eligible
receives_eligible_pension
receives_cpp
receives_oas
receives_rrif
gst_mandatory
gst_voluntary_only
has_employees
ontario_credits_eligible
lift_likely
lift_possible
cwb_check
high_income_phaseouts
t2200_required
selfemploy_home_office
selfemploy_vehicle
is_incorporated
is_sole_proprietor
changed_province
moving_expenses_confirmed
moving_expenses_possible
single_parent
taxpayer_is_student
dependent_is_student
tuition_transfer_decision
large_tuition_credit
purchased_home_2025
confirmed_first_time_buyer
new_construction
self_has_disability
spouse_has_disability
child_has_disability
other_dependent_disability
has_attendant_care
has_capital_assets
has_foreign_employment
receives_foreign_pension
received_retiring_allowance
received_ei
otb_rental
northern_ontario_resident

## Product Scope
- Output: Checklist only — no tax computation in MVP
- Federal T1 + Ontario (OTB, LIFT, Senior Homeowners Grant)
- 2025 tax year primary (2024 folder as placeholder)
- Target audience: Ontario residents, newcomers, first-time filers
- AI layer: clarification popups per ITA section — not advice

## Railway Configuration
builder: nixpacks
startCommand: npm run start
restartPolicyType: on_failure
restartPolicyMaxRetries: 3

## OpenRouter Integration
Base URL: https://openrouter.ai/api/v1/chat/completions
Auth: Bearer token from OPENROUTER_API_KEY env var
Model: from AI_MODEL env var
Usage: server-side only via Next.js API route
       never expose API key to client
Endpoint to create: /api/clarify
  - accepts: { node_id, ita_section, user_question, plain_language }
  - returns: { explanation: string }

