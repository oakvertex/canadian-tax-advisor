"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSession, applyScreenFeedback, replaySession } from "@/lib/session";
import InterviewScreenComponent from "@/components/InterviewScreen";
import RunningChecklist from "@/components/RunningChecklist";
import type { SessionState, InterviewBranch, InterviewScreen, TaxonomyNode, AnswerValue } from "@/types";

const SESSION_KEY = "tax-advisor-session";

function getActiveBranches(
  branches: InterviewBranch[],
  flags: Record<string, boolean>
): InterviewBranch[] {
  return branches
    .filter((branch) => {
      if (branch.always_runs) return true;
      if (!branch.triggered_by) return false;
      const triggers = Array.isArray(branch.triggered_by)
        ? branch.triggered_by
        : [branch.triggered_by];
      return triggers.some((t) => flags[t] === true);
    })
    .sort((a, b) => a.branch_order - b.branch_order);
}

function shouldShow(screen: InterviewScreen, answers: Record<string, AnswerValue>, flags: Record<string, boolean>): boolean {
  if (!screen.show_if) return true;
  const si = screen.show_if as { question_id?: string; flag?: string; operator: string; value: unknown };
  const actual = si.flag !== undefined ? flags[si.flag] : answers[si.question_id!];
  switch (si.operator) {
    case "equals":     return actual === si.value;
    case "not_equals": return actual !== si.value;
    case "in":         return Array.isArray(si.value) ? si.value.includes(actual as string) : false;
    case "not_in":     return Array.isArray(si.value) ? !si.value.includes(actual as string) : true;
    default:           return true;
  }
}

function shouldSkip(screen: InterviewScreen, answers: Record<string, AnswerValue>): boolean {
  if (!screen.skip_if) return false;
  const { question_id, operator, value } = screen.skip_if;
  const actual = answers[question_id];
  switch (operator) {
    case "equals":
      return actual === value;
    case "not_equals":
      return actual !== value;
    case "in":
      return Array.isArray(value) ? value.includes(actual as string) : false;
    case "not_in":
      return Array.isArray(value) ? !value.includes(actual as string) : true;
    default:
      return false;
  }
}

function findNextScreenIndex(
  branch: InterviewBranch,
  fromIndex: number,
  answers: Record<string, AnswerValue>,
  flags: Record<string, boolean>
): number {
  let idx = fromIndex;
  while (
    idx < branch.screens.length &&
    (shouldSkip(branch.screens[idx], answers) || !shouldShow(branch.screens[idx], answers, flags))
  ) {
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

  // Data loaded asynchronously — not bundled into the client JS chunk
  const [branches, setBranches] = useState<InterviewBranch[]>([]);
  const [taxonomyNodes, setTaxonomyNodes] = useState<TaxonomyNode[]>([]);
  const [dataReady, setDataReady] = useState(false);
  const [dataError, setDataError] = useState(false);

  const [session, setSession] = useState<SessionState>(() => createSession("2025"));
  const [showingIntro, setShowingIntro] = useState(true);
  const [showingBranchSummary, setShowingBranchSummary] = useState<InterviewBranch | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/interview-flow").then((r) => {
        if (!r.ok) throw new Error("Failed to load interview flow");
        return r.json();
      }),
      fetch("/api/taxonomy-items").then((r) => {
        if (!r.ok) throw new Error("Failed to load taxonomy items");
        return r.json();
      }),
    ])
      .then(([flow, items]: [InterviewBranch[], TaxonomyNode[]]) => {
        setBranches(flow);
        setTaxonomyNodes(items);
        setDataReady(true);
      })
      .catch(() => setDataError(true));
  }, []);

  // Loading state — page is already interactive, just waiting on data
  if (!dataReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-4">
          {dataError ? (
            <>
              <p className="text-red-600 font-medium">Failed to load interview data.</p>
              <button
                onClick={() => { setDataError(false); window.location.reload(); }}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Retry
              </button>
            </>
          ) : (
            <>
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">Loading your tax interview…</p>
            </>
          )}
        </div>
      </div>
    );
  }

  const activeBranches = getActiveBranches(branches, session.flags);
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

  const canGoBack = showingBranchSummary !== null
    ? (session.answerHistory ?? []).length > 0
    : showingIntro
    ? session.current_branch_index > 0
    : (session.answerHistory ?? []).length > 0;

  const handlePrevious = () => {
    const history = session.answerHistory ?? [];

    if (showingBranchSummary !== null) {
      if (history.length === 0) return;
      const last = history[history.length - 1];
      const newHistory = history.slice(0, -1);
      const replayed = replaySession(branches, newHistory, session.tax_year);
      const finalSession: SessionState = {
        ...replayed,
        answerHistory: newHistory,
        current_branch_index: last.branch_index,
        current_screen_index: last.screen_index,
      };
      saveSession(finalSession);
      setSession(finalSession);
      setShowingBranchSummary(null);
      setShowingIntro(false);
      return;
    }

    if (showingIntro) {
      if (history.length === 0) return;
      const last = history[history.length - 1];
      const newHistory = history.slice(0, -1);
      const replayed = replaySession(branches, newHistory, session.tax_year);
      const finalSession: SessionState = {
        ...replayed,
        answerHistory: newHistory,
        current_branch_index: last.branch_index,
        current_screen_index: last.screen_index,
      };
      saveSession(finalSession);
      setSession(finalSession);
      setShowingIntro(false);
      return;
    }

    if (history.length === 0) return;
    const last = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    const replayed = replaySession(branches, newHistory, session.tax_year);
    const finalSession: SessionState = {
      ...replayed,
      answerHistory: newHistory,
      current_branch_index: last.branch_index,
      current_screen_index: last.screen_index,
    };
    saveSession(finalSession);
    setSession(finalSession);
  };

  const handleAnswer = (screen: InterviewScreen, value: AnswerValue | AnswerValue[]) => {
    const historyEntry = {
      question_id: screen.question_id,
      value: value as AnswerValue,
      branch_index: session.current_branch_index,
      screen_index: session.current_screen_index,
    };

    let updated: SessionState = {
      ...session,
      answers: { ...session.answers, [screen.question_id]: value as AnswerValue },
      answerHistory: [...(session.answerHistory ?? []), historyEntry],
    };

    updated = applyScreenFeedback(updated, screen, value);

    const nextIdx = findNextScreenIndex(
      currentBranch,
      session.current_screen_index + 1,
      updated.answers,
      updated.flags
    );

    let finalSession: SessionState;

    if (nextIdx < currentBranch.screens.length) {
      finalSession = { ...updated, current_screen_index: nextIdx };
    } else {
      const newActiveBranches = getActiveBranches(branches, updated.flags);
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
        if (currentBranch.branch_completion_summary.shows === "active_branches_preview") {
          setShowingBranchSummary(currentBranch);
        } else {
          setShowingIntro(true);
        }
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
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 flex flex-col lg:flex-row gap-8">
        {/* Interview area */}
        <div className="flex-1 min-w-0">
          {showingBranchSummary !== null ? (
            <div className="flex flex-col gap-5">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                Your 2025 Tax Review
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {showingBranchSummary.branch_completion_summary.message}
              </p>
              <ul className="flex flex-col gap-2">
                {activeBranches.map((b) => (
                  <li key={b.branch_id} className="flex items-center gap-2 text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                    {b.branch_label}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={handlePrevious}
                  disabled={!canGoBack}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => { setShowingBranchSummary(null); setShowingIntro(true); }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : showingIntro ? (
            <div className="flex flex-col gap-5">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                {currentBranch.branch_label}
              </p>
              <p className="text-lg font-semibold text-gray-900">{currentBranch.intro}</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevious}
                  disabled={!canGoBack}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setShowingIntro(false)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Start
                </button>
              </div>
            </div>
          ) : currentScreen ? (
            <div className="flex flex-col gap-6">
              <InterviewScreenComponent
                key={currentScreen.question_id}
                screen={currentScreen}
                onAnswer={(value) => handleAnswer(currentScreen, value)}
                currentAnswers={session.answers}
              />
              <div>
                <button
                  onClick={handlePrevious}
                  disabled={!canGoBack}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Sidebar checklist */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <RunningChecklist checklist={session.checklist} taxonomyNodes={taxonomyNodes} />
        </aside>
      </main>
    </div>
  );
}
