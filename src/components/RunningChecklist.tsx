import type { TaxonomyNode } from "@/types";
import { formatNodeId } from "@/lib/formatNodeId";

interface ChecklistItem {
  node_id: string;
  confidence_tier: "confirmed" | "possible";
  reason?: string;
  planning_note?: string;
  count?: number;
  note?: string;
}

interface Props {
  checklist: ChecklistItem[];
  taxonomyNodes: TaxonomyNode[];
  newItemIds?: Set<string>;
}

const tierConfig: Record<string, { label: string; classes: string }> = {
  confirmed: { label: "Confirmed", classes: "bg-green-100 text-green-800" },
  possible:  { label: "Possible",  classes: "bg-yellow-100 text-yellow-800" },
};

export default function RunningChecklist({ checklist, taxonomyNodes, newItemIds }: Props) {
  const count = checklist.length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
        {count === 0
          ? "Your checklist"
          : `We've found ${count} item${count !== 1 ? "s" : ""} for your preparer`}
      </h3>
      {count === 0 ? (
        <p className="text-sm text-gray-400 italic">Items appear as you answer questions.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-gray-100">
          {checklist.map((item) => {
            const config = tierConfig[item.confidence_tier] ?? tierConfig.possible;
            const node = taxonomyNodes.find((n) => n.id === item.node_id);
            const label = node ? node.label : formatNodeId(item.node_id);
            const itaRef = node
              ? `${node.ita_reference.primary.act} s.${node.ita_reference.primary.section}`
              : null;
            const isNew = newItemIds?.has(item.node_id) ?? false;
            return (
              <li
                key={item.node_id}
                className={`py-2.5 flex flex-col gap-1${
                  isNew ? " animate-fade-slide-in" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2 max-w-full">
                  <span className="text-sm font-medium text-gray-800 leading-snug break-all overflow-hidden">
                    {label}
                    {item.count != null && item.count > 1 && (
                      <span className="ml-1 text-gray-500 font-normal">x{item.count}</span>
                    )}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${config.classes}`}
                  >
                    {config.label}
                  </span>
                </div>
                {itaRef && <p className="text-xs text-gray-400">{itaRef}</p>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
