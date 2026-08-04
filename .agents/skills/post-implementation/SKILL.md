---
name: post-implementation
description: Use after code changes are complete and before final response or PR summary.
---

# Post-Implementation

This skill closes implementation work by verifying outcomes, updating documentation, and deciding whether TODO items can be removed.

## Closure Flow

1. **Verify completion.** Compare the diff against the original request, TODO Goal, Acceptance Criteria, Intent, and QA test-plan.
2. **Run QA review when required.** If `Size >= M` or `Risk >= Medium`, run `qa-review`.
3. **Update verification.** Ensure `_docs/qa/<Area>/<slug>/verification.md` exists when required.
4. **Decide completion.** Use the verification verdict before removing any TODO item.
5. **Update documentation.** Refresh README, guide, reference, intent, QA, or standards docs as needed.
6. **Reflect on transferable principles.** Follow the Session-End Reflection section below. Never skip it silently.
7. **Summarize changes.** Include validation commands that were actually run and their results.

## Before Removing a Task from TODO.md

- Run `qa-review` if `Size >= M` or `Risk >= Medium`.
- Ensure `verification.md` exists when required.
- Ensure verdict is `PASS`, or `PARTIAL` with explicit follow-up TODOs and accepted residual risk.
- Do not remove TODO items with `FAIL` or `BLOCKED` verification.
- Confirm required intent / guide / reference / QA docs are updated.
- Confirm non-obvious code that encodes a design decision (especially a why not or intentional omission) carries a causal intent anchor (`// intent: DEC-00X (<Area>/<slug>) — <causal why>`) where a future reader could otherwise mistake it for missing or removable work. Use `// intent-invariant: INV-00X ...` only for strict invariants. Targeted, not blanket. See `quality_assurance.md` (intent ↔ code traceability).

## Session-End Reflection (Transferable Principles)

Before the final summary, ask yourself: **did any decision in this session make
you stop and think "why is it like this"?** Verbalize that "why" in 1-3 lines.

- Do not ask "should I write an intent?" — ask "what did I learn here that
  outlives this session?". "The fix matches an existing pattern" is not a reason
  to skip: why the pattern exists at all is often the transferable principle.
- If a principle emerges, record it as a candidate. Promotion to intent is the
  user's decision — present the candidate, do not promote it unilaterally.
- If nothing emerges, write `None: <why this session produced no new principle>`
  explicitly. Never leave the reflection blank and never write a bare `None` —
  an explicit reason distinguishes "considered, nothing found" from "skipped".
- Record location: the `Transferable Principles` section of
  `_docs/qa/<Area>/<slug>/verification.md` when it exists (`qa_schema: 3`
  requires it); otherwise include the candidate or reasoned `None` in the final
  summary / PR description.
- Promotion target: feature-bound learnings go to that feature's intent;
  cross-cutting principles go to `_docs/intent/<Area>/conventions/decision.md`.
  See `documentation_operations.md` (昇格ルール).

## Validation Commands

Prefer the wrapper:

```bash
./scripts/check-docs.sh
```

Use Deno validators, not old npm aliases, when isolating a failure:

```bash
deno run --allow-read --allow-env --allow-run=git scripts/validate-frontmatter.ts
deno run --allow-read scripts/validate-todo.ts
deno run --allow-read --allow-env --allow-run=git scripts/validate-doc-links.ts
deno run --allow-read --allow-env --allow-run=git scripts/validate-intent.ts
deno run --allow-read --allow-env --allow-run=git scripts/validate-qa.ts
```

## TODO.md Cleanup

- Remove fully completed items from `TODO.md`.
- Keep completion history in PRs, commits, CHANGELOG, intent, guide, reference, or QA verification.
- Do not create Done / Archived sections in `TODO.md`.
- Add follow-up tasks for residual work.

## Deliverables After Implementation

- Verification evidence when required.
- Updated documentation reflecting the current state.
- Updated TODO.md with completed tasks removed and follow-ups added.
- Transferable principle candidates, or an explicit `None: <reason>` reflection.
- Final summary with validations actually run.
