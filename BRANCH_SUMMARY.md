# TaxReady — Interview Branch Summary

## Branch List

| Order | File | Branch ID | Label | Runs |
|-------|------|-----------|-------|------|
| 0  | 00_life_events_gate.json    | branch_life_events_gate    | Your 2025 Tax Year          | always |
| 1  | 01_personal_profile.json    | branch_personal_profile    | Personal Profile            | always |
| 2  | 02_employment.json          | branch_employment          | Employment Income           | always |
| 3  | 03_other_income.json        | branch_other_income        | Other Income Sources        | always |
| 4  | 04_moving.json              | branch_moving              | Relocation                  | life_event_moved |
| 5  | 05_marital_status.json      | branch_marital_status      | Marital Status Change       | life_event_marriage_change |
| 6  | 06_children.json            | branch_children            | Children and Dependents     | life_event_had_child, has_dependents |
| 7  | 07_self_employment.json     | branch_self_employment     | Self-Employment             | life_event_started_business |
| 8  | 08_retirement.json          | branch_retirement          | Retirement                  | life_event_retired, age_65_plus, receives_eligible_pension, rrsp_conversion_required |
| 9  | 09_education.json           | branch_education           | Education                   | life_event_education |
| 10 | 10_first_home.json          | branch_first_home          | First Home Purchase         | life_event_first_home |
| 11 | 11_disability.json          | branch_disability          | Disability                  | life_event_disability, has_child_with_disability |
| 12 | 12_age_milestones.json      | branch_age_milestones      | Age Milestones              | life_event_age_milestone, age_65_plus, rrsp_conversion_required |
| 13 | 13_savings_registered.json  | branch_savings_registered  | Savings and Registered Plans| always |
| 14 | 14_deductions_review.json   | branch_deductions_review   | Deductions Review           | always |
| 15 | 15_credits_review.json      | branch_credits_review      | Credits Review              | always |

## Life Event Options (Screen 0 — Life Events Gate)
| Value | Label | Activates Flag |
|-------|-------|----------------|
| life_event_moved | I moved to a new city or province | life_event_moved |
| life_event_changed_job | I changed jobs or started a new job | life_event_changed_job |
| life_event_marriage_change | I got married, separated, or divorced | life_event_marriage_change |
| life_event_had_child | I had a child or adopted | life_event_had_child |
| life_event_started_business | I started a business or became self-employed | life_event_started_business |
| life_event_retired | I retired or started receiving pension income | life_event_retired |
| life_event_age_milestone | I turned 18, 65, or 71 this year | life_event_age_milestone |
| life_event_disability | I or a dependent has a disability | life_event_disability |
| life_event_education | I returned to school or a family member attended post-secondary | life_event_education |
| life_event_first_home | I purchased my first home | life_event_first_home |
| life_event_none | None of the above (exclusive) | — |

## ITA Primary References by Branch

| Branch | Key ITA Sections |
|--------|-----------------|
| 0 — Gate | — |
| 1 — Personal Profile | s.118(1), s.118(2), s.114 |
| 2 — Employment | s.5(1), s.8(1), s.8(10), s.8(13) |
| 3 — Other Income | s.56(1), s.12(1)(c), s.39(1), s.122.7 |
| 4 — Moving | s.62(1), s.62(2), s.248(1) |
| 5 — Marital | s.60(b), s.73(1), s.70(6), s.118(1)(a) |
| 6 — Children | s.63(1), s.118.3, s.122.6, s.146.1 |
| 7 — Self-Employment | s.9(1), s.18(1), s.18(12), s.60(e) |
| 8 — Retirement | s.56(1)(a), s.60.03, s.118(2), s.118(3), s.146(2)(b.4) |
| 9 — Education | s.118.5, s.118.61, s.118.8, s.118.9, s.122.91, s.146.02 |
| 10 — First Home | s.146.6, s.146.01, s.118.05 |
| 11 — Disability | s.118.3, s.118.2, s.146.4 |
| 12 — Age Milestones | s.118(2), s.146.2, s.146(2)(b.4) |
| 13 — Savings | s.60(i), s.146(1), s.146.2, s.146.6 |
| 14 — Deductions | s.118.1, s.118.2, s.20(1)(c), s.60(e.1), s.110.7 |
| 15 — Credits | s.118(1)(c), s.122.5, s.122.7, OTA s.103.1, OTA s.103.4, OTA s.104.1 |

## Ontario-Specific Screens (Branch 15)
- credits_ontario_otb: show_if ontario_credits_eligible — rent or property tax
- credits_ontario_energy_north: show_if ontario_credits_eligible — northern Ontario
- credits_ontario_lift: show_if ontario_credits_eligible + has_employment_income
- credits_ontario_senior_grant: show_if ontario_credits_eligible + age_65_plus

## Education Branch — Student Flag Logic
Screen edu_who_is_student (multi_select):
- "myself" → taxpayer_is_student
- "spouse" → spouse_is_student + tuition_transfer_decision
- "child"  → dependent_is_student + tuition_transfer_decision
Downstream screens gated by show_if on individual student flags.
tuition_transfer_decision flag triggers planning discussion screen.

## branch_completion_summary.shows Values
| Value | Meaning |
|-------|---------|
| active_branches_preview | Branch 0 only — shows list of active branches |
| running_checklist_snapshot | Shows current checklist items |
| final_output_brief | Branch 15 only — triggers completion page |
| none | No special display |

## Rebuild Status
| Branch | Status |
|--------|--------|
| 00_life_events_gate | pending regeneration |
| 01_personal_profile | pending regeneration |
| 02_employment | pending regeneration |
| 03_other_income | pending regeneration |
| 04_moving | pending regeneration |
| 05_marital_status | pending regeneration |
| 06_children | pending regeneration |
| 07_self_employment | pending regeneration |
| 08_retirement | pending regeneration |
| 09_education | pending regeneration |
| 10_first_home | pending regeneration |
| 11_disability | pending regeneration |
| 12_age_milestones | pending regeneration |
| 13_savings_registered | pending regeneration |
| 14_deductions_review | pending regeneration |
| 15_credits_review | pending regeneration |
