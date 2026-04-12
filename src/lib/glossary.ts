import type { GlossaryEntry, ScreenGlossaryMap } from "@/types/glossary";

// ---------------------------------------------------------------------------
// Glossary data
// Each entry keyed by the term string as it appears in interview option labels.
// Tier 1 = sub-label only (always visible).
// Tier 2 = sub-label + ⓘ expansion panel (tap/click to reveal).
// ---------------------------------------------------------------------------

export const GLOSSARY: Record<string, GlossaryEntry> = {
  T1: {
    term: "T1",
    sublabel: "Canadian personal income tax return",
    tier: "sublabel",
    branches: ["B0"],
    screens: ["life_events_gate"],
  },

  T4: {
    term: "T4",
    sublabel: "Employment income slip",
    tier: "sublabel",
    branches: ["B2"],
    screens: ["employment_t4_count"],
    notes: "Universally understood by most filers; sub-label sufficient for newcomers",
  },

  T2200: {
    term: "T2200",
    sublabel: "Employer expense authorization form",
    tier: "sublabel_expansion",
    branches: ["B2"],
    screens: ["employment_t2200", "employment_home_office"],
    expansion: {
      title: "Declaration of Conditions of Employment (T2200)",
      body: "A form your employer signs confirming you were required to work from home or use your vehicle for work. Without it, employment expense deductions are not allowed. Ask your HR or payroll department — it must be signed before you file.",
      where_to_find: "From your employer — HR or payroll department",
      ita: "ITA s.8(10)",
    },
  },

  T2200S: {
    term: "T2200S",
    sublabel: "Simplified home office form (COVID-era)",
    tier: "sublabel_expansion",
    branches: ["B2"],
    screens: ["employment_home_office"],
    expansion: {
      title: "T2200S — Declaration of Conditions of Employment for Working at Home",
      body: "A shorter version of the T2200 used during COVID years. As of 2023, CRA has ended the simplified flat-rate method. If you worked from home in 2025, you need a full T2200 from your employer to claim actual expenses.",
      where_to_find: "From your employer — may no longer be issued; request a T2200 instead",
      ita: "ITA s.8(13)",
    },
  },

  T5: {
    term: "T5",
    sublabel: "Investment income slip",
    tier: "sublabel",
    branches: ["B3"],
    screens: ["other_income_investments"],
  },

  T3: {
    term: "T3",
    sublabel: "Trust or mutual fund income slip",
    tier: "sublabel",
    branches: ["B3"],
    screens: ["other_income_investments"],
  },

  T5008: {
    term: "T5008",
    sublabel: "Securities transaction slip",
    tier: "sublabel_expansion",
    branches: ["B3"],
    screens: ["other_income_investments"],
    expansion: {
      title: "T5008 — statement of securities transactions",
      body: "Issued by your broker when you sell stocks, ETFs, bonds, or mutual funds. It reports the proceeds of sale. You also need your original purchase cost (adjusted cost base) to calculate capital gain or loss — your broker's year-end statement usually shows this.",
      where_to_find: "From your brokerage — available in your online account portal",
      ita: "ITA s.39(1)",
    },
  },

  T4A: {
    term: "T4A",
    sublabel: "Other income slip (pension, RRSP, scholarships)",
    tier: "sublabel_expansion",
    branches: ["B3", "B7", "B8", "B9"],
    screens: [
      "other_income_employer_pension",
      "other_income_rrsp_withdrawal",
      "selfemploy_revenue_range",
      "education_resp_withdrawal",
    ],
    expansion: {
      title: "T4A — statement of pension, retirement, annuity, and other income",
      body: "A catch-all slip covering pension income, RRSP withdrawals, self-employment fees, scholarships, and RESP educational assistance. If you received any of these, expect a T4A from the payer.",
      where_to_find: "From the payer — pension administrator, financial institution, or university",
      ita: "ITA s.56(1)",
    },
  },

  T4E: {
    term: "T4E",
    sublabel: "Employment Insurance income slip",
    tier: "sublabel",
    branches: ["B3"],
    screens: ["other_income_ei"],
  },

  "T4A(OAS)": {
    term: "T4A(OAS)",
    sublabel: "Old Age Security income slip",
    tier: "sublabel_expansion",
    branches: ["B3", "B8"],
    screens: ["other_income_cpp_oas", "retirement_oas_clawback"],
    expansion: {
      title: "T4A(OAS) — Old Age Security pension",
      body: "Issued by Service Canada to recipients of OAS. If your net income exceeds $90,997 in 2025, part of your OAS will be clawed back as a recovery tax — this is reported and repaid on your T1. CRA may also require monthly instalments for 2026.",
      where_to_find: "Mailed by Service Canada in February, or via My Service Canada Account",
      ita: "ITA s.180.2",
    },
  },

  "T4A(P)": {
    term: "T4A(P)",
    sublabel: "Canada Pension Plan income slip",
    tier: "sublabel",
    branches: ["B3", "B8"],
    screens: ["other_income_cpp_oas", "retirement_income_sources"],
  },

  NR4: {
    term: "NR4",
    sublabel: "Income paid to non-residents or from foreign payers",
    tier: "sublabel_expansion",
    branches: ["B3"],
    screens: ["other_income_foreign_pension"],
    expansion: {
      title: "NR4 — statement of amounts paid to non-residents",
      body: "Issued when a Canadian payer sends pension, interest, or other income to a non-resident — or when a foreign payer issues the equivalent in another country. Newcomers receiving a pension from their home country should report it in Canadian dollars at the exchange rate on the date received.",
      where_to_find: "From the foreign pension administrator or Canadian financial institution",
      ita: "ITA s.56(1), s.126(1)",
    },
  },

  RRSP: {
    term: "RRSP",
    sublabel: "Registered Retirement Savings Plan",
    tier: "sublabel_expansion",
    branches: ["B3", "B8", "B12", "B13"],
    screens: [
      "other_income_rrsp_withdrawal",
      "retirement_rrif_conversion",
      "age_milestone_rrsp_final_contribution",
      "savings_rrsp_contributed",
      "savings_rrsp_deduction_timing",
      "savings_spousal_rrsp",
    ],
    expansion: {
      title: "Registered Retirement Savings Plan (RRSP)",
      body: "A government-registered account where contributions reduce your taxable income in the year you claim them. Growth inside is tax-deferred — you pay tax when you withdraw. Your contribution limit is shown on your Notice of Assessment from CRA. Must be converted to a RRIF or annuity by December 31 of the year you turn 71.",
      where_to_find: "Contribution receipts from your financial institution — March deadline slips cover January 1 to February 28/29",
      ita: "ITA s.146(1)",
    },
  },

  RRIF: {
    term: "RRIF",
    sublabel: "Registered Retirement Income Fund",
    tier: "sublabel_expansion",
    branches: ["B8", "B12"],
    screens: [
      "retirement_rrif_conversion",
      "retirement_income_sources",
      "age_milestone_rrif_minimum",
    ],
    expansion: {
      title: "Registered Retirement Income Fund (RRIF)",
      body: "What an RRSP becomes after conversion (required by age 71). You must withdraw a minimum amount each year — the percentage increases with age. Withdrawals are fully taxable. Your financial institution will issue a T4RIF slip.",
      where_to_find: "T4RIF slip from your financial institution",
      ita: "ITA s.146.3",
    },
  },

  TFSA: {
    term: "TFSA",
    sublabel: "Tax-Free Savings Account",
    tier: "sublabel_expansion",
    branches: ["B12", "B13"],
    screens: ["age_milestone_tfsa_18", "savings_tfsa"],
    expansion: {
      title: "Tax-Free Savings Account (TFSA)",
      body: "Available to any Canadian resident aged 18 or older. Contributions are not tax-deductible, but all growth and withdrawals are completely tax-free. Your available contribution room is shown on CRA My Account. Unused room carries forward indefinitely. Over-contributing results in a 1% per month penalty tax.",
      where_to_find: "No tax slip required for contributions. Check your available room via CRA My Account.",
      ita: "ITA s.146.2",
    },
  },

  FHSA: {
    term: "FHSA",
    sublabel: "First Home Savings Account",
    tier: "sublabel_expansion",
    branches: ["B10", "B13"],
    screens: ["first_home_fhsa", "savings_tfsa"],
    expansion: {
      title: "First Home Savings Account (FHSA)",
      body: "Opened after April 2023. Contributions (up to $8,000 per year, $40,000 lifetime) are tax-deductible like an RRSP, and qualifying withdrawals to buy a first home are tax-free like a TFSA. You must be a first-time buyer and a Canadian resident. If unused, funds can be transferred to an RRSP.",
      where_to_find: "T4FHSA slip from your financial institution",
      ita: "ITA s.146.6",
    },
  },

  RESP: {
    term: "RESP",
    sublabel: "Registered Education Savings Plan",
    tier: "sublabel_expansion",
    branches: ["B6", "B9"],
    screens: ["children_resp", "education_resp_withdrawal"],
    expansion: {
      title: "Registered Education Savings Plan (RESP)",
      body: "A savings account for a child's post-secondary education. The government contributes 20% of the first $2,500 per year via the Canada Education Savings Grant (CESG). Growth is tax-deferred. When the student withdraws for education, the Educational Assistance Payment (EAP) is taxable in the student's hands — usually at a low rate.",
      where_to_find: "T4A issued to the student for EAP withdrawals",
      ita: "ITA s.146.1",
    },
  },

  RDSP: {
    term: "RDSP",
    sublabel: "Registered Disability Savings Plan",
    tier: "sublabel_expansion",
    branches: ["B11"],
    screens: ["disability_rdsp"],
    expansion: {
      title: "Registered Disability Savings Plan (RDSP)",
      body: "A long-term savings plan for Canadians eligible for the Disability Tax Credit. The government may contribute Canada Disability Savings Grants and Bonds based on family income. Withdrawals are partially taxable. Requires a valid DTC certificate — losing DTC eligibility can trigger repayment of government contributions.",
      where_to_find: "T4A slip for withdrawals from your financial institution",
      ita: "ITA s.146.4",
    },
  },

  NOA: {
    term: "NOA",
    sublabel: "Notice of Assessment — CRA's annual tax summary",
    tier: "sublabel_expansion",
    branches: ["B14"],
    screens: ["deductions_prior_year_noa"],
    expansion: {
      title: "Notice of Assessment (NOA)",
      body: "The document CRA sends after processing your tax return. It confirms your refund or balance owing, your RRSP deduction limit for next year, your TFSA room, and any carryforward amounts such as losses or tuition credits. Always keep the most recent one — your preparer will need it.",
      where_to_find: "Via CRA My Account online, or mailed to you 2–8 weeks after filing",
      ita: "ITA s.152",
    },
  },

  HBP: {
    term: "HBP",
    sublabel: "Home Buyers' Plan — RRSP withdrawal for first home",
    tier: "sublabel_expansion",
    branches: ["B10"],
    screens: ["first_home_hbp"],
    expansion: {
      title: "Home Buyers' Plan (HBP)",
      body: "Allows first-time buyers to withdraw up to $35,000 from an RRSP tax-free to buy a qualifying home. The amount must be repaid to your RRSP over 15 years starting 2 years after the withdrawal — missed repayments are added to your income for that year.",
      where_to_find: "T4RSP slip from your financial institution (Box 27 — HBP withdrawal)",
      ita: "ITA s.146.01",
    },
  },

  LLP: {
    term: "LLP",
    sublabel: "Lifelong Learning Plan — RRSP withdrawal for education",
    tier: "sublabel_expansion",
    branches: ["B9"],
    screens: ["education_carryforward"],
    expansion: {
      title: "Lifelong Learning Plan (LLP)",
      body: "Allows you to withdraw up to $10,000 per year (maximum $20,000 total) from your RRSP tax-free to fund full-time education or training for yourself or your spouse. Repayment begins the earlier of 2 years after you stop being a full-time student, or 5 years after the first withdrawal.",
      where_to_find: "T4RSP slip from your financial institution (Box 25 — LLP withdrawal)",
      ita: "ITA s.146.02",
    },
  },

  DTC: {
    term: "DTC",
    sublabel: "Disability Tax Credit — CRA-approved disability certificate",
    tier: "sublabel_expansion",
    branches: ["B6", "B11"],
    screens: [
      "children_disability_dtc",
      "disability_dtc_status",
      "disability_who_affected",
    ],
    expansion: {
      title: "Disability Tax Credit (DTC)",
      body: "A non-refundable federal credit for people with severe and prolonged impairments in physical or mental function. Must be applied for using Form T2201, certified by a qualified practitioner, and approved by CRA before you can claim it. Approval can be backdated. The credit can also be transferred to a supporting family member.",
      where_to_find: "CRA approval letter — apply via CRA My Account or by mailing Form T2201",
      ita: "ITA s.118.3",
    },
  },

  T2201: {
    term: "T2201",
    sublabel: "Disability Tax Credit application form",
    tier: "sublabel_expansion",
    branches: ["B11"],
    screens: ["disability_dtc_status"],
    expansion: {
      title: "Form T2201 — Disability Tax Credit certificate",
      body: "The application form a medical practitioner completes to certify your disability for CRA. The practitioner section must be filled out by a doctor, nurse practitioner, or other qualifying professional. CRA approves or denies the certificate — approval must be in hand before claiming the DTC.",
      where_to_find: "Download from CRA website or apply via CRA My Account; completed by your doctor",
      ita: "ITA s.118.3(1)",
    },
  },

  OTB: {
    term: "OTB",
    sublabel: "Ontario Trillium Benefit",
    tier: "sublabel_expansion",
    branches: ["B15"],
    screens: ["credits_ontario_trillium"],
    expansion: {
      title: "Ontario Trillium Benefit (OTB)",
      body: "A combined monthly Ontario credit covering three components: Ontario Energy and Property Tax Credit (OEPTC), Northern Ontario Energy Credit (NOEC), and Ontario Sales Tax Credit (OSTC). Eligibility depends on age, income, rent paid, and property tax paid in 2025. Claimed via the ON-BEN schedule on your T1 return.",
      where_to_find: "No slip — calculated from your T1 return and ON-BEN schedule",
      ita: "OTA s.103.1",
    },
  },

  LIFT: {
    term: "LIFT",
    sublabel: "Ontario low-income tax credit",
    tier: "sublabel_expansion",
    branches: ["B2"],
    screens: ["employment_income_range"],
    expansion: {
      title: "Low-income Individuals and Families Tax Credit (LIFT)",
      body: "An Ontario non-refundable credit that reduces or eliminates Ontario personal income tax for lower-income workers. Eligibility is based on employment income and net income. If your employment income is under approximately $50,000, you may qualify — your preparer will calculate the exact amount.",
      where_to_find: "No separate form — calculated automatically from your Ontario return",
      ita: "OTA s.103.4",
    },
  },

  CWB: {
    term: "CWB",
    sublabel: "Canada Workers Benefit — refundable low-income credit",
    tier: "sublabel_expansion",
    branches: ["B2"],
    screens: ["employment_income_range"],
    expansion: {
      title: "Canada Workers Benefit (CWB)",
      body: "A federal refundable tax credit for low-income workers. If you earned employment or self-employment income and your net income is below the phase-out threshold, you may receive a CWB payment — even if you owe no tax. You can also apply for advance payments during the year via CRA.",
      where_to_find: "Schedule 6 on your T1 return — auto-calculated by your preparer or tax software",
      ita: "ITA s.122.7",
    },
  },

  CESG: {
    term: "CESG",
    sublabel: "Canada Education Savings Grant (RESP top-up)",
    tier: "sublabel_expansion",
    branches: ["B6"],
    screens: ["children_resp"],
    expansion: {
      title: "Canada Education Savings Grant (CESG)",
      body: "The federal government contributes 20% on the first $2,500 contributed annually to an RESP — up to $500 per year per child, $7,200 lifetime. Low- and middle-income families may receive an additional 10–20% grant. No action required on your tax return — the grant goes directly into the RESP.",
      where_to_find: "No slip — deposited directly to the RESP by the government",
      ita: "Canada Education Savings Act",
    },
  },

  T4RSP: {
    term: "T4RSP",
    sublabel: "RRSP withdrawal or conversion slip",
    tier: "sublabel_expansion",
    branches: ["B3", "B10", "B9"],
    screens: [
      "other_income_rrsp_withdrawal",
      "first_home_hbp",
      "education_carryforward",
    ],
    expansion: {
      title: "T4RSP — statement of RRSP income",
      body: "Issued when money leaves your RRSP — whether as a regular withdrawal, an HBP withdrawal, or an LLP withdrawal. The box number indicates the type. Regular withdrawals are fully taxable; HBP and LLP withdrawals are not taxable unless repayment is missed.",
      where_to_find: "From your financial institution, usually mailed by end of February",
      ita: "ITA s.146(8)",
    },
  },

  T4RIF: {
    term: "T4RIF",
    sublabel: "RRIF withdrawal slip",
    tier: "sublabel_expansion",
    branches: ["B8"],
    screens: ["retirement_income_sources", "retirement_rrif_conversion"],
    expansion: {
      title: "T4RIF — statement of income from a RRIF",
      body: "Issued when you receive mandatory or voluntary withdrawals from a RRIF. The full withdrawal amount is taxable. Pension income splitting may be available if you are 65 or older — up to 50% of eligible pension income can be transferred to a spouse to reduce combined tax.",
      where_to_find: "From your financial institution",
      ita: "ITA s.146.3",
    },
  },

  T1135: {
    term: "T1135",
    sublabel: "Foreign income verification — required over $100K",
    tier: "sublabel_expansion",
    branches: ["B15"],
    screens: ["credits_foreign_income_verification"],
    expansion: {
      title: "T1135 — Foreign Income Verification Statement",
      body: "Required if you held specified foreign property (bank accounts, stocks, real estate) with a total cost exceeding $100,000 CAD at any point in 2025. Failure to file carries penalties of $25 per day (minimum $100, maximum $2,500) and can be higher if CRA deems the omission wilful. Filed with your T1 return.",
      where_to_find: "Completed by you or your preparer — requires the cost base of each foreign asset",
      ita: "ITA s.233.3",
    },
  },

  T2125: {
    term: "T2125",
    sublabel: "Business income statement (self-employment)",
    tier: "sublabel_expansion",
    branches: ["B7"],
    screens: ["selfemploy_business_type", "selfemploy_revenue_range"],
    expansion: {
      title: "T2125 — statement of business or professional activities",
      body: "The schedule attached to your T1 where self-employment income and expenses are reported. One T2125 per business activity. It covers revenue, cost of goods sold, and all eligible deductions. If you have both employment income and self-employment income, you file both a T4 and a T2125.",
      where_to_find: "Completed by you or your preparer from your business records",
      ita: "ITA s.9(1)",
    },
  },

  "GST/HST": {
    term: "GST/HST",
    sublabel: "Goods and Services / Harmonized Sales Tax",
    tier: "sublabel_expansion",
    branches: ["B7"],
    screens: ["selfemploy_revenue_range", "selfemploy_business_type"],
    expansion: {
      title: "GST/HST registration",
      body: "If your self-employment or business revenue exceeds $30,000 in any single calendar quarter or over four consecutive quarters, you must register for GST/HST and collect it from clients. Once registered, you can also claim Input Tax Credits (ITCs) to recover GST/HST paid on business expenses.",
      where_to_find: "Register via CRA My Business Account or by phone",
      ita: "Excise Tax Act s.240",
    },
  },

  CPP: {
    term: "CPP",
    sublabel: "Canada Pension Plan",
    tier: "sublabel_expansion",
    branches: ["B3", "B7", "B8"],
    screens: [
      "other_income_cpp_oas",
      "selfemploy_cpp",
      "retirement_income_sources",
    ],
    expansion: {
      title: "Canada Pension Plan (CPP)",
      body: "A mandatory federal pension program. As an employee, both you and your employer contribute. If self-employed, you pay both the employee and employer share (currently approximately 11.9% of net self-employment income up to the Year's Maximum Pensionable Earnings). You may be able to deduct half the self-employed CPP contribution.",
      where_to_find: "T4A(P) slip from Service Canada for CPP retirement income",
      ita: "ITA s.60(e), Canada Pension Plan Act",
    },
  },

  OAS: {
    term: "OAS",
    sublabel: "Old Age Security — federal pension at 65",
    tier: "sublabel_expansion",
    branches: ["B3", "B8"],
    screens: [
      "other_income_cpp_oas",
      "retirement_oas_clawback",
      "age_milestone_oas_65",
    ],
    expansion: {
      title: "Old Age Security (OAS)",
      body: "A federal pension paid monthly to Canadians 65 and older who meet residency requirements. The amount depends on how long you have lived in Canada after age 18. If your net income exceeds $90,997 in 2025, part of your OAS is recovered via a 15% clawback (repayment tax) on the excess.",
      where_to_find: "T4A(OAS) slip from Service Canada",
      ita: "ITA s.180.2, Old Age Security Act",
    },
  },

  EI: {
    term: "EI",
    sublabel: "Employment Insurance benefits",
    tier: "sublabel",
    branches: ["B3"],
    screens: ["other_income_ei"],
  },

  ACB: {
    term: "ACB",
    sublabel: "Adjusted cost base — your purchase cost for tax",
    tier: "sublabel_expansion",
    branches: ["B3"],
    screens: ["other_income_investments"],
    expansion: {
      title: "Adjusted Cost Base (ACB)",
      body: "The original cost of an investment adjusted for reinvested distributions, return of capital, and other adjustments. Used to calculate capital gains or losses when you sell. Your brokerage may track this, but it is ultimately your responsibility. Errors in ACB are a common source of CRA reassessments.",
      where_to_find: "Year-end statement from your brokerage — or track manually using ACB.ca",
      ita: "ITA s.54",
    },
  },

  "Capital gain": {
    term: "Capital gain",
    sublabel: "Profit from selling an investment or property",
    tier: "sublabel_expansion",
    branches: ["B3"],
    screens: ["other_income_investments"],
    expansion: {
      title: "Capital gain",
      body: "The profit when you sell a capital property (stocks, real estate, etc.) for more than its adjusted cost base. In 2025, 50% of capital gains up to $250,000 is included in income; above $250,000, 66.67% is included. Capital losses can offset capital gains in the same year or be carried back 3 years and forward indefinitely.",
      where_to_find: "Calculate from your brokerage statements; T5008 reports proceeds of sale",
      ita: "ITA s.39(1)",
    },
  },

  "Pension splitting": {
    term: "Pension splitting",
    sublabel: "Transferring pension income to a lower-income spouse",
    tier: "sublabel_expansion",
    branches: ["B8"],
    screens: ["retirement_pension_splitting"],
    expansion: {
      title: "Pension income splitting",
      body: "Couples where one spouse has eligible pension income (RRIF, annuity, registered pension — if 65 or older) can allocate up to 50% of that income to the other spouse on paper, reducing the higher-income spouse's tax and potentially increasing age and pension credits. Both spouses must agree and file Form T1032.",
      where_to_find: "Form T1032 — completed by both spouses at tax time",
      ita: "ITA s.60.03",
    },
  },

  Carryforward: {
    term: "Carryforward",
    sublabel: "Unused credits or losses saved for future years",
    tier: "sublabel_expansion",
    branches: ["B4", "B9", "B14"],
    screens: [
      "moving_prior_year_carryforward",
      "education_carryforward",
      "deductions_prior_year_noa",
    ],
    expansion: {
      title: "Carryforward amounts",
      body: "Several tax items can be carried forward to reduce tax in future years: unused tuition credits, capital losses, non-capital losses, RRSP contribution room, and charitable donation credits. Your NOA shows current carryforward balances. If you have never reviewed your NOA, your preparer should check for any accumulated carryforwards.",
      where_to_find: "Your most recent Notice of Assessment from CRA",
      ita: "ITA s.111, s.118.61",
    },
  },

  CCA: {
    term: "CCA",
    sublabel: "Capital Cost Allowance — depreciation for business assets",
    tier: "sublabel_expansion",
    branches: ["B7"],
    screens: ["selfemploy_vehicle", "selfemploy_home_office"],
    expansion: {
      title: "Capital Cost Allowance (CCA)",
      body: "The tax equivalent of depreciation — allows you to deduct a percentage of the cost of business assets (vehicles, computers, equipment) each year based on CRA's prescribed rates by asset class. You cannot create or increase a business loss using CCA. Your preparer calculates this on your T2125.",
      where_to_find: "Your preparer calculates from purchase records and prior CCA schedules",
      ita: "ITA s.20(1)(a), Reg. 1100",
    },
  },

  "T1-OVP": {
    term: "T1-OVP",
    sublabel: "RRSP over-contribution penalty return",
    tier: "sublabel_expansion",
    branches: ["B13"],
    screens: ["savings_rrsp_contributed"],
    expansion: {
      title: "T1-OVP — RRSP/PRPP/SPP excess contributions return",
      body: "If you contributed more than your RRSP deduction limit plus the $2,000 lifetime buffer, you must file a T1-OVP and pay a 1% per month penalty tax on the excess. The return is due 90 days after year-end (March 31, 2026 for 2025). Penalties can also apply for late filing of the T1-OVP itself.",
      where_to_find: "Filed separately from your T1 return — your preparer will prepare it",
      ita: "ITA s.204.1",
    },
  },

  "Canada Training Credit": {
    term: "Canada Training Credit",
    sublabel: "Refundable federal credit for eligible training fees",
    tier: "sublabel_expansion",
    branches: ["B9"],
    screens: ["education_canada_training_credit"],
    expansion: {
      title: "Canada Training Credit (CTC)",
      body: "A refundable federal credit worth up to $250 per year (lifetime limit $5,000) for eligible tuition and fees paid to Canadian institutions for occupational skills courses. Your accumulated CTC limit is shown on your NOA. You must be between 25 and 65, have filed a return, and have income between $10,000 and $155,625.",
      where_to_find: "T2202 slip from your school — claim on Schedule 11",
      ita: "ITA s.122.91",
    },
  },

  T2202: {
    term: "T2202",
    sublabel: "Tuition and enrolment certificate",
    tier: "sublabel_expansion",
    branches: ["B9"],
    screens: ["education_tuition_receipts"],
    expansion: {
      title: "T2202 — Tuition and Enrolment Certificate",
      body: "Issued by Canadian colleges and universities confirming tuition paid and months of enrolment. Used to claim the federal tuition credit (15% of eligible fees) and the Canada Training Credit. Fees must be at least $100 to be eligible. Available through your school's student portal.",
      where_to_find: "Your school's student portal — usually available by end of February",
      ita: "ITA s.118.5",
    },
  },

  "Principal residence": {
    term: "Principal residence",
    sublabel: "Your main home — sale may be tax-exempt",
    tier: "sublabel_expansion",
    branches: ["B10"],
    screens: ["first_home_confirmed_buyer"],
    expansion: {
      title: "Principal residence exemption",
      body: "A property qualifies as your principal residence for each year you or your family ordinarily inhabited it. When you sell, any gain allocated to principal residence years is tax-exempt. You must now report the sale on your T1 (Schedule 3) even if fully exempt — failing to report can result in losing the exemption.",
      where_to_find: "Report on Schedule 3 of your T1; keep all purchase and sale documents",
      ita: "ITA s.54, s.40(2)(b)",
    },
  },
};

// ---------------------------------------------------------------------------
// Pre-computed screen → terms index
// Built once at module load. Used by the screen renderer to find all glossary
// terms relevant to a given screen_id without iterating the full map.
// ---------------------------------------------------------------------------

function buildScreenIndex(): ScreenGlossaryMap {
  const index: ScreenGlossaryMap = new Map();
  for (const entry of Object.values(GLOSSARY)) {
    for (const screenId of entry.screens) {
      const existing = index.get(screenId) ?? [];
      existing.push(entry);
      index.set(screenId, existing);
    }
  }
  return index;
}

export const SCREEN_GLOSSARY_INDEX: ScreenGlossaryMap = buildScreenIndex();

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

/**
 * Returns the glossary entry for a term, or undefined if not found.
 * Term matching is case-sensitive to match option labels exactly.
 */
export function getGlossaryEntry(term: string): GlossaryEntry | undefined {
  return GLOSSARY[term];
}

/**
 * Returns all glossary entries relevant to a given screen_id.
 * Returns an empty array if the screen has no glossary terms.
 */
export function getScreenGlossaryTerms(screenId: string): GlossaryEntry[] {
  return SCREEN_GLOSSARY_INDEX.get(screenId) ?? [];
}

/**
 * Returns only Tier 2 entries for a screen — the ones that need an ⓘ expansion panel.
 * Convenience wrapper for the screen renderer.
 */
export function getScreenExpansionTerms(screenId: string): GlossaryEntry[] {
  return getScreenGlossaryTerms(screenId).filter(
    (e) => e.tier === "sublabel_expansion"
  );
}
