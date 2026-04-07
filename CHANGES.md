# TaxReady — Taxonomy Nodes Pending Build

Bug reports, UI issues, and branch improvements are tracked in GitHub Issues:
https://github.com/oakvertex/canadian-tax-advisor/issues

This file tracks only **taxonomy node builds** (items.json) — code-level work
that does not fit naturally as a GitHub issue.

---

## How to Use This File

Each node_id below is referenced in one or more branch files but does not yet
exist in taxonomy/2025/items.json. Build them in batches by category.

After adding nodes:
  npx tsx src/lib/validateTaxonomy.ts

Mark done with [x] and move to Completed section.

---

## Income Nodes
- [ ] income_employment_t4
- [ ] income_foreign_employment
- [ ] income_cpp_oas
- [ ] income_employer_pension
- [ ] income_foreign_pension
- [ ] income_ei_benefits
- [ ] income_rrsp_withdrawal
- [ ] income_hbp_repayment
- [ ] income_llp_repayment
- [ ] income_spousal_support_received
- [ ] income_interest
- [ ] income_canadian_dividends
- [ ] income_foreign_dividends
- [ ] income_capital_gains
- [ ] income_rental
- [ ] income_self_employment
- [ ] income_rrif_withdrawal
- [ ] income_annuity
- [ ] income_retiring_allowance
- [ ] income_resp_eap

## Deduction Nodes
- [ ] deduction_moving_expenses (exists — review completeness)
- [ ] deduction_employment_home_office
- [ ] deduction_employment_vehicle
- [ ] deduction_union_dues
- [ ] deduction_tradesperson_tools
- [ ] deduction_employment_supplies
- [ ] deduction_professional_dues
- [ ] deduction_spousal_support_paid
- [ ] deduction_legal_fees_support
- [ ] deduction_child_care
- [ ] deduction_carrying_charges
- [ ] deduction_rrsp_contribution
- [ ] deduction_fhsa_contribution
- [ ] deduction_selfemploy_home_office
- [ ] deduction_selfemploy_vehicle
- [ ] deduction_attendant_care

## Credit Nodes
- [ ] credit_spousal_amount
- [ ] credit_eligible_dependant
- [ ] credit_disability_tax_credit
- [ ] credit_disability_transfer
- [ ] credit_caregiver_amount
- [ ] credit_infirm_dependent
- [ ] credit_tuition
- [ ] credit_tuition_transfer_spouse
- [ ] credit_tuition_transfer_parent
- [ ] credit_canada_training
- [ ] credit_student_loan_interest
- [ ] credit_age_amount
- [ ] credit_medical_expenses
- [ ] credit_charitable_donations
- [ ] credit_first_home_buyers_amount
- [ ] credit_gst_hst_credit
- [ ] credit_canada_workers_benefit
- [ ] credit_ontario_trillium_benefit
- [ ] credit_lift
- [ ] credit_ontario_senior_grant
- [ ] credit_gst_new_housing_rebate
- [ ] credit_volunteer_firefighter

## Benefit Nodes
- [ ] benefit_canada_child_benefit

## Savings Nodes
- [ ] savings_resp
- [ ] savings_rdsp

## Obligation Nodes
- [ ] obligation_gst_hst_registration
- [ ] obligation_payroll_remittances
- [ ] obligation_oas_clawback
- [ ] obligation_rrsp_conversion
- [ ] obligation_t1135_foreign_income

## Special Nodes
- [ ] special_spousal_property_rollover
- [ ] special_deceased_spouse_rrsp_rollover
- [ ] special_deceased_spouse_rrif_rollover
- [ ] special_deceased_spouse_capital_property
- [ ] special_attribution_minor
- [ ] special_pension_splitting

---

## Completed
(move items here with date when done)
