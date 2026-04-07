# TaxReady — Interview Branch Summary

## Branch List

| Order | File | Branch ID | Label | Runs |
|-------|------|-----------|-------|------|
| 0  | 00_life_events_gate.json    | branch_life_events_gate    | Your 2025 Tax Year           | always |
| 1  | 01_personal_profile.json    | branch_personal_profile    | Personal Profile             | always |
| 2  | 02_employment.json          | branch_employment          | Employment Income            | always |
| 3  | 03_other_income.json        | branch_other_income        | Other Income Sources         | always |
| 4  | 04_moving.json              | branch_moving              | Relocation                   | life_event_moved |
| 5  | 05_marital_status.json      | branch_marital_status      | Marital Status Change        | life_event_marriage_change |
| 6  | 06_children.json            | branch_children            | Children and Dependents      | life_event_had_child, has_dependents |
| 7  | 07_self_employment.json     | branch_self_employment     | Self-Employment              | life_event_started_business |
| 8  | 08_retirement.json          | branch_retirement          | Retirement                   | life_event_retired, age_65_plus, receives_eligible_pension, rrsp_conversion_required |
| 9  | 09_education.json           | branch_education           | Education                    | life_event_education |
| 10 | 10_first_home.json          | branch_first_home          | First Home Purchase          | life_event_first_home |
| 11 | 11_disability.json          | branch_disability          | Disability                   | life_event_disability, has_child_with_disability |
| 12 | 12_age_milestones.json      | branch_age_milestones      | Age Milestones               | life_event_age_milestone, age_65_plus, rrsp_conversion_required |
| 13 | 13_savings_registered.json  | branch_savings_registered  | Savings and Registered Plans | always |
| 14 | 14_deductions_review.json   | branch_deductions_review   | Deductions Review            | always |
| 15 | 15_credits_review.json      | branch_credits_review      | Credits Review               | always |

## Build Status
All 16 branch files complete. interview-flow.json assembled at 239.5 KB, valid JSON.
Last full rebuild: April 2026.
To rebuild after any branch edit: npx tsx scripts/buildInterviewFlow.ts

## Life Event Options (Screen 0 — Life Events Gate)
| Value | Activates Flag |
|-------|----------------|
| life_event_moved | life_event_moved |
| life_event_changed_job | life_event_changed_job |
| life_event_marriage_change | life_event_marriage_change |
| life_event_had_child | life_event_had_child |
| life_event_started_business | life_event_started_business |
| life_event_retired | life_event_retired |
| life_event_age_milestone | life_event_age_milestone |
| life_event_disability | life_event_disability |
| life_event_education | life_event_education |
| life_event_first_home | life_event_first_home |
| life_event_none | — (exclusive, no flag) |

## ITA / OTA Primary References by Branch

| Branch | Key Sections |
|--------|-------------|
| 0 — Life Events Gate | — |
| 1 — Personal Profile | ITA s.118(1)(a), s.118(2), s.146(2)(b.4), s.146(16) |
| 2 — Employment Income | ITA s.5(1), s.8(1)(h.1), s.8(1)(i), s.8(1)(r), s.8(1)(s), s.8(10), s.8(13), s.118.7, s.126(1) |
| 3 — Other Income | ITA s.12(1)(c), s.39(1), s.56(1)(a), s.56(1)(b), s.56(1)(h), s.60.03, s.118(3), s.122.5, s.126(1), s.145, s.146.01, s.146.02 |
| 4 — Relocation | ITA s.62(1), s.62(3), s.248(1) |
| 5 — Marital Status | ITA s.60(b), s.60(o.1), s.70(5), s.70(6), s.73(1), s.118(1)(a), s.118(1)(b), s.146(8.1), s.146.3 |
| 6 — Children & Dependents | ITA s.63(1), s.74.1(2), s.118(1)(b), s.118(1)(c.1), s.118(1)(d), s.118.3(2), s.146.1 |
| 7 — Self-Employment | ITA s.9(1), s.18(1), s.18(12), s.34, s.60(j.1), Excise Tax Act (GST/HST) |
| 8 — Retirement | ITA s.56(1)(a), s.56(1)(a.1), s.56(1)(a.ii), s.60.03, s.118(2), s.118(3), s.146(2)(b.4), s.146.3, s.180.2 |
| 9 — Education | ITA s.118.5, s.118.61, s.118.8, s.118.9, s.122.91, s.146.1(7), s.146.02 |
| 10 — First Home | ITA s.118.05, s.146.01, s.146.6 |
| 11 — Disability | ITA s.64, s.118.2(2), s.118.3, s.118.3(2), s.146.4 |
| 12 — Age Milestones | ITA s.118(2), s.146(2)(b.4), s.146.3, s.207.02 |
| 13 — Savings & Registered Plans | ITA s.146(1), s.146(8.3), s.146.6, s.204.1 |
| 14 — Deductions Review | ITA s.20(1)(c), s.20(1)(bb), s.60(b), s.118.1, s.118.2 |
| 15 — Credits Review | ITA s.118.06, s.118.07, s.122.5, s.122.7, s.180.2, s.233.3; OTA s.103.1, s.103.4, s.104.1 |

## Key Screen IDs by Branch (for debugging and issue reporting)

| Branch | Screen IDs |
|--------|-----------|
| 0 | life_events_gate |
| 1 | profile_residency, profile_marital_status, profile_age, profile_dependents |
| 2 | employment_t4_count, employment_newcomer_partialyr, employment_income_range, employment_foreign, employment_home_office, employment_t2200, employment_vehicle, employment_other_expenses |
| 3 | other_income_cpp_oas, other_income_employer_pension, other_income_foreign_pension, other_income_ei, other_income_rrsp_withdrawal, other_income_support_received, other_income_investments, other_income_rental |
| 4 | moving_reason, moving_distance, moving_province_change, moving_expenses_types, moving_income_at_new_location, moving_prior_year_carryforward |
| 5 | marital_change_type, marital_new_spouse_income, marital_separation_date, marital_support_paid, marital_legal_fees, marital_property_transfer, marital_widowed_rrsp, marital_widowed_capital_property |
| 6 | children_count_ages, children_single_parent, children_care_expenses, children_care_provider, children_lower_income_spouse, children_resp, children_disability_dtc, children_canada_child_benefit, children_caregiver_adult, children_attribution_rules |
| 7 | selfemploy_business_type, selfemploy_revenue_range, selfemploy_books_records, selfemploy_home_office, selfemploy_vehicle, selfemploy_employees, selfemploy_cpp |
| 8 | retirement_income_sources, retirement_pension_splitting, retirement_age_amount, retirement_oas_clawback, retirement_rrif_conversion |
| 9 | education_who_is_student, education_tuition_receipts, education_carryforward, education_transfer_decision, education_canada_training_credit, education_student_loan_interest, education_resp_withdrawal |
| 10 | first_home_confirmed_buyer, first_home_first_time_buyer, first_home_buyers_amount, first_home_hbp, first_home_fhsa, first_home_new_construction |
| 11 | disability_who_affected, disability_dtc_status, disability_attendant_care, disability_rdsp, disability_medical_expenses |
| 12 | age_milestone_which, age_milestone_tfsa_18, age_milestone_oas_65, age_milestone_rrsp_final_contribution, age_milestone_rrif_minimum |
| 13 | savings_rrsp_contributed, savings_rrsp_deduction_timing, savings_spousal_rrsp, savings_tfsa, savings_rrsp_over_contribution |
| 14 | deductions_charitable, deductions_medical, deductions_carrying_charges, deductions_support_paid, deductions_prior_year_noa |
| 15 | credits_gst_hst, credits_cwb, credits_ontario_trillium, credits_lift, credits_senior_homeowners, credits_foreign_income_verification, credits_volunteer_firefighter |

## branch_completion_summary.shows Values
| Value | Meaning |
|-------|---------|
| active_branches_preview | Branch 0 only — shows list of active branches after gate |
| running_checklist_snapshot | Shows current checklist items at branch end |

## Education Branch — Student Flag Logic
Screen education_who_is_student (multi_select):
- "self"   → taxpayer_is_student
- "spouse" → tuition_transfer_decision (spouse credit transfer)
- "child"  → dependent_is_student + tuition_transfer_decision
Downstream screens gated by show_if on individual student flags.
tuition_transfer_decision triggers a planning note: transfer vs carryforward modelling.

## Ontario Credits — Trigger Conditions (Branch 15)
| Screen | Trigger |
|--------|---------|
| credits_ontario_trillium | ontario_credits_eligible flag |
| credits_lift | ontario_credits_eligible flag |
| credits_senior_homeowners | ontario_credits_eligible flag |
