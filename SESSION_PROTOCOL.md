# TaxReady — Session Protocol

## When to Start a New Thread

Start a new Claude Project thread when ANY of the following are true:
- The current thread has more than ~25 back-and-forth exchanges
- Claude begins repeating itself or giving shorter, less precise answers
- Claude makes a small error on something established earlier in the session
- You are switching from one type of work to another (e.g., branch fixes → app UI)
- A session has involved reading large files (large context consumption)

**This thread is already at risk if:** you notice Claude losing track of a decision
that was made earlier in the same thread, or if responses feel less careful.

---

## How to Start a New Session (Opening Prompt)

Copy and paste the following as your first message in a new Claude Project thread.
Fill in the [TASK] section with what you want to work on.

---

### Opening Prompt Template

```
This is the TaxReady Canadian Tax Prep Guide project.

Read the following project files before responding — they contain full context:
- CONTEXT.md (stack, types, architecture)
- DECISIONS.md (key decisions, current build status)
- BRANCH_SUMMARY.md (branch list with ITA references)

Then fetch the open GitHub issues before starting work:
https://github.com/oakvertex/canadian-tax-advisor/issues

The codebase is at: ~/canadian-tax-advisor (WSL distro: claude)
GitHub: https://github.com/oakvertex/canadian-tax-advisor

Key facts for this session:
- interview-flow.json is AUTO-GENERATED — never edit it directly
- All branch edits go in: taxonomy/2025/branches/NN_branch_id.json
- After any branch change: npx tsx scripts/buildInterviewFlow.ts
- Verify JSON: node -e "const f = require('./taxonomy/2025/interview-flow.json'); console.log('Branches:', f.length, '| Valid JSON: ✓');"
- MCP filesystem path: \\wsl.localhost\claude\home\oakvertex\canadian-tax-advisor

[TASK]: (describe what you want to work on — e.g., "Fix Issue #1 and #3"
or "Build taxonomy nodes for income_employment_t4 and deduction_employment_home_office")
```

---

## Context Loading Order for New Sessions

1. Read CONTEXT.md — types, architecture, flags, branch list
2. Read DECISIONS.md — key decisions and current build status
3. Read BRANCH_SUMMARY.md — ITA references per branch
4. Fetch https://github.com/oakvertex/canadian-tax-advisor/issues — open issues are the work queue
5. For branch-specific work, read the relevant branch file from taxonomy/2025/branches/

---

## Thread Length Heuristics

| Signal | Action |
|--------|--------|
| More than ~25 exchanges | Consider wrapping up and starting fresh |
| Claude reads 3+ large files in one session | High context consumption — wrap up soon |
| Response quality feels slightly off | Start new thread now |
| Switching to a different type of task | Good natural break point — start fresh |
| Any file write errors or tool timeouts | Restart Claude Desktop, then new thread |

---

## Standard Workflow for Bug Fixes and Improvements

1. Claude fetches the GitHub issue and reads the description
2. Claude reads the relevant branch file or component
3. Claude identifies the root cause and proposes the fix
4. You confirm the fix is correct
5. Claude writes the updated file
6. You run the build script and verify: `npx tsx scripts/buildInterviewFlow.ts`
7. You close the GitHub issue once confirmed working

One issue per logical batch. Never edit interview-flow.json directly.

---

## Standard Workflow for New Taxonomy Nodes (items.json)

1. Claude reads CHANGES.md for the pending taxonomy node list
2. Claude writes new TaxonomyNode objects per the schema in CONTEXT.md
3. Claude appends to taxonomy/2025/items.json
4. Run validation: `npx tsx src/lib/validateTaxonomy.ts`
5. Mark nodes done in CHANGES.md

---

## Screenshot Guidance for Issues

**Paste screenshots directly into the Claude Chat conversation** — not into GitHub Issues.
GitHub-hosted image URLs are not reliably fetchable by Claude.

- UI bugs / unexpected screen behaviour → paste screenshot in chat + describe expected behaviour
- Tax logic errors / wrong ITA references → written description in GitHub issue is more precise
- For Claude Code sessions → reference the issue number, written description only
