---
name: qa-review
description: Use after implementation to compare diff, intent, QA test-plan, and test results before completion.
---

# QA Review

This skill determines whether implementation can be considered complete.

## Required Procedure

1. Read the TODO task.
2. Read the diff.
3. Read the Plan.
4. Read the Intent.
5. Read the QA test-plan.
6. Check whether AC, affected DEC rationale, and applicable INV are satisfied.
7. Run or confirm tests, validators, and manual QA.
8. Create or update `_docs/qa/<Area>/<slug>/verification.md`.
9. Fill `Transferable Principles`: ask whether any decision in this session
   carries a learning that outlives the session. Record 1-3 line candidates for
   intent promotion, or an explicit `None: <reason>`. Never leave it blank.
10. Set verification verdict to `PASS`, `PARTIAL`, `FAIL`, or `BLOCKED`.
11. Update the TODO task's `Verification:` field.
12. Decide whether the task can be completed.

## Completion Decision

| Verdict | Decision |
| --- | --- |
| `PASS` | TODO can be removed. |
| `PARTIAL` | TODO can be removed only when residual risks and follow-up TODOs are explicit and acceptable. |
| `FAIL` | TODO must remain, or a corrective TODO must be added. |
| `BLOCKED` | TODO must remain; blocker and next action must be clear. |

## Rules

- Do not mark PASS just because tests passed.
- Confirm the implementation still serves each affected DEC's `Why`, and stays within its `Change freedom`.
- Confirm each applicable intent-derived invariant is preserved; `None` is a valid invariant set.
- New verification documents use `qa_schema: 3` and include Decision Conformance
  and Transferable Principles.
- "The fix matches an existing pattern" does not justify skipping the
  Transferable Principles reflection; a bare `None` is not acceptable evidence.
- Candidates are presented for user review. Do not promote a candidate to intent
  without the user's decision.
- Confirm documented intentional omissions are still visible and have not been "fixed" away without updating Intent / QA.
- Do not list commands as run unless they were actually run.
- Do not leave residual risks vague.

## Example Verification Verdicts

### PASS

Use PASS only when all required AC checks, affected DEC reviews, and applicable INV checks are covered and no material residual risk remains.

```text
Verdict: PASS
qa_status: verified
Residual Risks: None
```

### PARTIAL

Use PARTIAL only when residual risk is explicit and follow-up TODOs exist.

```text
Verdict: PARTIAL
qa_status: partial
Residual Risks:
- AC-003 was deferred because external API credentials are unavailable.

Follow-up TODOs:
- API-Test-12: [Test] Verify AC-003 against staging credentials.
```

### FAIL

Use FAIL when a required AC, affected DEC, or applicable INV check failed.

```text
Verdict: FAIL
qa_status: failed
Residual Risks:
- INV-001 failed: QA archive path was accepted by validator.
```

### BLOCKED

Use BLOCKED when verification cannot proceed.

```text
Verdict: BLOCKED
qa_status: blocked
Residual Risks:
- Migration rollback cannot be tested until staging database snapshot is available.
```
