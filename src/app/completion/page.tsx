"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import taxonomyItemsJson from "../../../taxonomy/2025/items.json";
import type { SessionState, TaxonomyNode } from "@/types";

const taxonomyNodes = taxonomyItemsJson as TaxonomyNode[];

const urgencyOrder: Record<string, number> = {
  critical: 0,
  urgent: 1,
  priority: 2,
  standard: 3,
};

const urgencyConfig: Record<string, { label: string; classes: string }> = {
  critical: { label: "Critical", classes: "bg-red-100 text-red-800" },
  urgent: { label: "Urgent", classes: "bg-orange-100 text-orange-800" },
  priority: { label: "Priority", classes: "bg-blue-100 text-blue-800" },
  standard: { label: "Standard", classes: "bg-gray-100 text-gray-700" },
};

const tierConfig = {
  confirmed: { label: "Confirmed", classes: "bg-green-100 text-green-800" },
  possible: { label: "Possible", classes: "bg-yellow-100 text-yellow-800" },
} as const;

function SectionHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
        {number}
      </span>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-sm text-gray-400 italic">{text}</p>;
}

export default function CompletionPage() {
  const [session, setSession] = useState<SessionState | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("tax-advisor-session");
    if (raw) {
      try {
        setSession(JSON.parse(raw) as SessionState);
      } catch {
        // corrupted data — leave null
      }
    }
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No session found. Please complete the interview first.</p>
          <Link href="/interview" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Start Interview
          </Link>
        </div>
      </div>
    );
  }

  const nodeMap = new Map(taxonomyNodes.map((n) => [n.id, n]));

  // Checklist items by category
  const checklistWithNodes = session.checklist.map((item) => ({
    item,
    node: nodeMap.get(item.node_id) ?? null,
  }));

  const incomeItems = checklistWithNodes.filter((e) => e.node?.category === "income");
  const deductionItems = checklistWithNodes.filter((e) => e.node?.category === "deduction");
  const creditItems = checklistWithNodes.filter((e) => e.node?.category === "credit");
  const generalItems = checklistWithNodes.filter((e) => e.node === null);

  // Deduplicated documents sorted by urgency
  const seenDocs = new Set<string>();
  const sortedDocs = [...session.documents]
    .filter((d) => {
      if (seenDocs.has(d.document)) return false;
      seenDocs.add(d.document);
      return true;
    })
    .sort((a, b) => (urgencyOrder[a.urgency] ?? 4) - (urgencyOrder[b.urgency] ?? 4));

  const confirmedCount = session.checklist.filter((c) => c.confidence_tier === "confirmed").length;
  const possibleCount = session.checklist.filter((c) => c.confidence_tier === "possible").length;

  const renderChecklistItems = (
    items: Array<{ item: SessionState["checklist"][number]; node: TaxonomyNode | null }>
  ) => {
    if (items.length === 0) return <EmptyState text="None identified." />;
    return (
      <ul className="flex flex-col gap-3">
        {items.map(({ item, node }) => {
          const label = node ? node.label : item.node_id;
          const itaRef = node
            ? `${node.ita_reference.primary.act} s.${node.ita_reference.primary.section}`
            : null;
          const config = tierConfig[item.confidence_tier];
          return (
            <li key={item.node_id} className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-800">
                    {label}
                    {item.count != null && item.count > 1 && (
                      <span className="ml-1 text-gray-500 font-normal">x{item.count}</span>
                    )}
                  </span>
                  {node ? (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.classes}`}>
                      {config.label}
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-500">
                      unknown
                    </span>
                  )}
                </div>
                {itaRef && <p className="text-xs text-gray-400 mt-0.5">{itaRef}</p>}
                {item.reason && <p className="text-xs text-gray-500 mt-0.5">{item.reason}</p>}
                {node?.plain_language && (
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{node.plain_language}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your 2025 Tax Review</h1>
          <p className="text-gray-600">
            We identified{" "}
            <span className="font-semibold text-green-700">{confirmedCount} confirmed</span>{" "}
            {confirmedCount === 1 ? "item" : "items"} and{" "}
            <span className="font-semibold text-yellow-700">{possibleCount} possible</span>{" "}
            {possibleCount === 1 ? "item" : "items"} for your 2025 return.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {/* Section 1: Income */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <SectionHeader number={1} title="Income to Report" />
            {renderChecklistItems(incomeItems)}
          </section>

          {/* Section 2: Deductions */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <SectionHeader number={2} title="Deductions to Claim" />
            {renderChecklistItems(deductionItems)}
          </section>

          {/* Section 3: Credits */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <SectionHeader number={3} title="Credits to Apply" />
            {renderChecklistItems(creditItems)}
          </section>

          {/* Section 4: General (unmatched items) */}
          {generalItems.length > 0 && (
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <SectionHeader number={4} title="General" />
              {renderChecklistItems(generalItems)}
            </section>
          )}

          {/* Section 5: Documents */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <SectionHeader number={generalItems.length > 0 ? 5 : 4} title="Documents to Gather" />
            <p className="text-sm text-gray-600 mb-4">
              Prepare the following documents before meeting your tax preparer or filing your
              own return.
            </p>
            {sortedDocs.length === 0 ? (
              <EmptyState text="No documents identified." />
            ) : (
              <ul className="flex flex-col gap-2">
                {sortedDocs.map((doc, i) => {
                  const uc = urgencyConfig[doc.urgency] ?? urgencyConfig.standard;
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 mt-0.5 ${uc.classes}`}
                      >
                        {uc.label}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{doc.document}</p>
                        {doc.note && <p className="text-xs text-gray-500">{doc.note}</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Section 6: Obligations */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <SectionHeader number={generalItems.length > 0 ? 6 : 5} title="Obligations and Actions" />
            {session.obligations.length === 0 ? (
              <EmptyState text="No additional obligations identified." />
            ) : (
              <ul className="flex flex-col gap-2">
                {session.obligations.map((ob, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-sm text-gray-800">{ob.action}</span>
                    {ob.urgency && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                          urgencyConfig[ob.urgency]?.classes ?? urgencyConfig.standard.classes
                        }`}
                      >
                        {urgencyConfig[ob.urgency]?.label ?? ob.urgency}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-xs text-gray-400 leading-relaxed text-center">
          This checklist is for preparation purposes only and does not constitute tax advice.
          Consult a qualified tax professional before filing. —{" "}
          <span className="font-medium">Canadian Tax Prep Guide by TaxReady</span>
        </p>

        {/* Footer actions */}
        <div className="mt-4 flex gap-4">
          <Link
            href="/interview"
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Start Over
          </Link>
        </div>
      </div>
    </div>
  );
}
