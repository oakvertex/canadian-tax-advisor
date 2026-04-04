"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import interviewFlowJson from "../../../taxonomy/2025/interview-flow.json";
import taxonomyItemsJson from "../../../taxonomy/2025/items.json";
import { createSession, applyFeedback } from "@/lib/session";
import InterviewScreenComponent from "@/components/InterviewScreen";
import RunningChecklist from "@/components/RunningChecklist";
import type { SessionState, InterviewBranch, InterviewScreen, TaxonomyNode } from "@/types";

const branches = interviewFlowJson as InterviewBranch[];
const taxonomyNodes = taxonomyItemsJson as TaxonomyNode[];

const SESSION_KEY = "tax-advisor-session";

function getActiveBranches(flags: Record<string, boolean>): InterviewBranch[] {
  return branches.filter((branch) => {
    if (branch.always_runs) return true;
    if (!branch.triggered_by) return false;
    const triggers = Array.isArray(branch.triggered_by)
      ? branch.triggered_by
      : [branch.triggered_by];
    return triggers.some((t) => flags[t] === true);
  });
}

function shouldSkip(screen: InterviewScreen, answers: Record<string, any>): boolean {
  if (!screen.skip_if) return false;
  const { question_id, operator, value } = screen.skip_if;
  const actual = answers[question_id];
  switch (operator) {
    case "equals":
      return actual === value;
    case "not_equals":
      return actual !== value;
    case "in":
      return Array.isArray(value) ? value.includes(actual) : false;
    case "not_in":
      return Array.isArray(value) ? !value.includes(actual) : true;
    default:
      return false;
  }
}

function findNextScreenIndex(
  branch: InterviewBranch,
  fromIndex: number,
  answers: Record<string, any>
): number {
  let idx = fromIndex;
  while (idx < branch.screens.length && shouldSkip(branch.screens[idx], answers)) {
    idx++;
  }
  return idx;
}

function saveSession(s: SessionState) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  }
}

export default function InterviewPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionState>(() => createSession("2025"));
  const [showingIntro, setShowingIntro] = useState(true);

  const activeBranches = getActiveBranches(session.flags);
  const currentBranch = activeBranches[session.current_branch_index];

  // Interview complete
  if (session.completed || !currentBranch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-gray-200 p-10 max-w-lg w-full text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Review Complete</h2>
          <p className="text-gray-600 mb-8">
            {session.checklist.length} item{session.checklist.length !== 1 ? "s" : ""} identified.
          </p>
          <button
            onClick={() => router.push("/completion")}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-semibold"
          >
            View Your Tax Checklist
          </button>
        </div>
      </div>
    );
  }

  const currentScreen = currentBranch.screens[session.current_screen_index];

  const handleAnswer = (screen: InterviewScreen, value: any) => {
    // 1. Record answer
    let updated: SessionState = {
      ...session,
      answers: { ...session.answers, [screen.question_id]: value },
    };

    // 2. Apply feedback
    if (screen.screen_type === "multi_select" && Array.isArray(value)) {
      for (const v of value) {
        const fb = screen.feedback[String(v)];
        if (fb) updated = applyFeedback(updated, fb);
      }
    } else {
      const fb = screen.feedback[String(value)];
      if (fb) updated = applyFeedback(updated, fb);
    }

    // 3. Advance to next screen, skipping any skip_if matches
    const nextIdx = findNextScreenIndex(
      currentBranch,
      session.current_screen_index + 1,
      updated.answers
    );

    let finalSession: SessionState;

    if (nextIdx < currentBranch.screens.length) {
      finalSession = { ...updated, current_screen_index: nextIdx };
    } else {
      // Branch complete — advance to next active branch
      const newActiveBranches = getActiveBranches(updated.flags);
      const nextBranchIdx = session.current_branch_index + 1;

      if (nextBranchIdx >= newActiveBranches.length) {
        finalSession = {
          ...updated,
          current_branch_index: nextBranchIdx,
          current_screen_index: 0,
          completed: true,
        };
      } else {
        finalSession = {
          ...updated,
          current_branch_index: nextBranchIdx,
          current_screen_index: 0,
        };
        setShowingIntro(true);
      }
    }

    saveSession(finalSession);
    setSession(finalSession);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with branch progress */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">2025 Tax Interview</h1>
          <span className="text-sm text-gray-500">
            Branch {session.current_branch_index + 1} of {activeBranches.length} —{" "}
            <span className="font-medium text-gray-700">{currentBranch.branch_label}</span>
          </span>
        </div>
        {/* Branch progress bar */}
        <div className="max-w-5xl mx-auto mt-3">
          <div className="flex gap-1.5">
            {activeBranches.map((branch, idx) => (
              <div
                key={branch.branch_id}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  idx < session.current_branch_index
                    ? "bg-blue-500"
                    : idx === session.current_branch_index
                    ? "bg-blue-300"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 flex gap-8">
        {/* Interview area */}
        <div className="flex-1 min-w-0">
          {showingIntro ? (
            <div className="flex flex-col gap-5">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                {currentBranch.branch_label}
              </p>
              <p className="text-gray-700 text-lg">{currentBranch.intro}</p>
              <button
                onClick={() => setShowingIntro(false)}
                className="self-start px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Start
              </button>
            </div>
          ) : currentScreen ? (
            <InterviewScreenComponent
              screen={currentScreen}
              onAnswer={(value) => handleAnswer(currentScreen, value)}
              currentAnswers={session.answers}
            />
          ) : null}
        </div>

        {/* Sidebar checklist */}
        <aside className="w-72 flex-shrink-0">
          <RunningChecklist checklist={session.checklist} taxonomyNodes={taxonomyNodes} />
        </aside>
      </main>
    </div>
  );
}
