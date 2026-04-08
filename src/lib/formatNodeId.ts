const CATEGORY_PREFIXES = ["income_", "deduction_", "credit_", "special_", "obligation_"];

const UPPERCASE_TERMS = new Set([
  "ei", "cpp", "oas", "rrsp", "rrif", "tfsa", "fhsa", "hbp", "llp",
  "gst", "hst", "otb", "lift", "cwb", "rdsp", "resp", "lrif", "prpp",
  "t4", "t4a", "t4e", "t4rif", "t4rsp", "t1", "t2", "t3", "t5",
  "db", "dc", "acb", "itc", "dtc", "ccpc", "cra",
]);

export function formatNodeId(nodeId: string): string {
  let name = nodeId;
  for (const prefix of CATEGORY_PREFIXES) {
    if (nodeId.startsWith(prefix)) {
      name = nodeId.slice(prefix.length);
      break;
    }
  }
  return name
    .split("_")
    .map((word) => {
      const lower = word.toLowerCase();
      return UPPERCASE_TERMS.has(lower)
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function inferCategory(nodeId: string): "income" | "deduction" | "credit" | "general" {
  if (nodeId.startsWith("income_")) return "income";
  if (nodeId.startsWith("deduction_")) return "deduction";
  if (nodeId.startsWith("credit_")) return "credit";
  return "general";
}
