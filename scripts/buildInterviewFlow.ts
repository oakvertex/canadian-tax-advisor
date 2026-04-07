/**
 * scripts/buildInterviewFlow.ts
 *
 * Assembles taxonomy/{year}/interview-flow.json from individual branch files
 * in taxonomy/{year}/branches/, processed in alphabetical filename order.
 *
 * Filename convention: use numeric prefixes so sort order = branch order.
 *   00_life_events_gate.json
 *   01_personal_profile.json
 *   02_employment.json
 *   ...
 *   15_credits_review.json
 *
 * Each file may contain:
 *   - A single branch object  {}
 *   - An array of branch objects  [{}]
 *
 * Usage:
 *   npx tsx scripts/buildInterviewFlow.ts
 *   npx tsx scripts/buildInterviewFlow.ts --year 2024
 */

import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const yearFlag = args.indexOf("--year");
const TAX_YEAR = yearFlag !== -1 ? args[yearFlag + 1] : "2025";

const BRANCHES_DIR = path.resolve(process.cwd(), `taxonomy/${TAX_YEAR}/branches`);
const OUTPUT_FILE  = path.resolve(process.cwd(), `taxonomy/${TAX_YEAR}/interview-flow.json`);

// ---------------------------------------------------------------------------
// Minimal type for validation output
// ---------------------------------------------------------------------------
interface BranchShape {
  branch_id?: string;
  branch_label?: string;
  branch_order?: number;
  always_runs?: boolean;
  triggered_by?: string | string[];
  screens?: unknown[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function validateBranch(branch: BranchShape, file: string, index: number): string[] {
  const errs: string[] = [];
  const ctx = index >= 0 ? `${file}[${index}]` : file;
  if (!branch.branch_id)    errs.push(`${ctx}: missing branch_id`);
  if (!branch.branch_label) errs.push(`${ctx}: missing branch_label`);
  if (branch.branch_order === undefined) errs.push(`${ctx}: missing branch_order`);
  if (!Array.isArray(branch.screens))    errs.push(`${ctx}: screens must be an array`);
  return errs;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  // 1. Verify branches directory exists
  if (!fs.existsSync(BRANCHES_DIR)) {
    console.error(`\n❌  Branches directory not found: ${BRANCHES_DIR}`);
    console.error(`    Run: mkdir -p taxonomy/${TAX_YEAR}/branches\n`);
    process.exit(1);
  }

  // 2. Read all .json files in alphabetical order (skip dotfiles like .keep)
  const files = fs
    .readdirSync(BRANCHES_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  if (files.length === 0) {
    console.log(`\n⚠️   No .json files found in taxonomy/${TAX_YEAR}/branches/`);
    console.log(`    Directory exists and is ready for branch files.`);
    console.log(`    Expected filenames: 00_life_events_gate.json, 01_personal_profile.json, ...\n`);
    process.exit(0);
  }

  console.log(`\n📂  Reading ${files.length} branch file(s) from taxonomy/${TAX_YEAR}/branches/\n`);

  // 3. Parse each file and collect branches
  const branches: BranchShape[] = [];
  const parseErrors: string[] = [];
  const validationErrors: string[] = [];

  for (const file of files) {
    const filePath = path.join(BRANCHES_DIR, file);
    let parsed: unknown;

    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      parsed = JSON.parse(raw);
    } catch (err) {
      parseErrors.push(`  ${file}: ${(err as Error).message}`);
      continue;
    }

    if (Array.isArray(parsed)) {
      parsed.forEach((branch, i) => {
        const errs = validateBranch(branch as BranchShape, file, i);
        validationErrors.push(...errs);
        branches.push(branch as BranchShape);
      });
      console.log(`  ✓  ${file}  (${parsed.length} branch${parsed.length !== 1 ? "es" : ""})`);
    } else if (typeof parsed === "object" && parsed !== null) {
      const errs = validateBranch(parsed as BranchShape, file, -1);
      validationErrors.push(...errs);
      branches.push(parsed as BranchShape);
      console.log(`  ✓  ${file}`);
    } else {
      parseErrors.push(`  ${file}: root value must be an object or array, got ${typeof parsed}`);
    }
  }

  // 4. Report parse errors and exit if any
  if (parseErrors.length > 0) {
    console.error(`\n❌  JSON parse errors:\n${parseErrors.join("\n")}\n`);
    process.exit(1);
  }

  // 5. Report validation errors and exit if any
  if (validationErrors.length > 0) {
    console.error(`\n❌  Branch validation errors:\n${validationErrors.map((e) => `  ${e}`).join("\n")}\n`);
    process.exit(1);
  }

  // 6. Warn if branch_order values are non-sequential
  const orders = branches
    .map((b) => b.branch_order)
    .filter((o): o is number => o !== undefined)
    .sort((a, b) => a - b);
  const isSequential = orders.every((v, i) => v === i);
  if (!isSequential) {
    console.warn(`\n⚠️   branch_order values are not sequential: [${orders.join(", ")}]`);
    console.warn(`    The app sorts by branch_order at runtime — this is allowed but check for gaps.\n`);
  }

  // 7. Write assembled output
  const output = JSON.stringify(branches, null, 2);
  fs.writeFileSync(OUTPUT_FILE, output, "utf-8");

  const sizeKb = (Buffer.byteLength(output, "utf-8") / 1024).toFixed(1);
  console.log(`\n✅  Assembled ${branches.length} branch${branches.length !== 1 ? "es" : ""} → taxonomy/${TAX_YEAR}/interview-flow.json`);
  console.log(`    File size: ${sizeKb} KB\n`);
}

main();
