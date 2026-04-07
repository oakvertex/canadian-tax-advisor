const CATEGORY_PREFIXES = ["income_", "deduction_", "credit_", "special_"];

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
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function inferCategory(nodeId: string): "income" | "deduction" | "credit" | "general" {
  if (nodeId.startsWith("income_")) return "income";
  if (nodeId.startsWith("deduction_")) return "deduction";
  if (nodeId.startsWith("credit_")) return "credit";
  return "general";
}
