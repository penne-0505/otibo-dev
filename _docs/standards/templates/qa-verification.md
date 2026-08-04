---
title: "QA Verification: <Feature>"
status: active
draft_status: n/a
qa_status: verified
risk: Medium
qa_schema: 3
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
references:
  - "_docs/intent/<Area>/<slug>/decision.md"
  - "_docs/plan/<Area>/<slug>/plan.md"
  - "_docs/qa/<Area>/<slug>/test-plan.md"
related_issues: []
related_prs: []
---

# QA Verification: `<Feature>`

<!--
Verdict / qa_status mapping:
- PASS -> verified
- PARTIAL -> partial
- FAIL -> failed
- BLOCKED -> blocked
-->

## Summary

何を検証したかを簡潔に書く。

## Verification Verdict

Verdict: PASS

## Commands Run

```bash
# command
```

Result:

```text
# result summary
```

## Automated Test Results

| Command / Test | Result | Notes |
| --- | --- | --- |
|  |  |  |

## Manual QA Results

| Checklist Item | Result | Notes |
| --- | --- | --- |
|  |  |  |

## Acceptance Criteria Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| AC-001 | PASS |  |

## Decision Conformance

| ID | Result | Why the implementation remains aligned |
| --- | --- | --- |
| DEC-001 | PASS |  |

## Invariant Coverage

None

## Deferred / Not Covered

| ID | Reason | Follow-up |
| --- | --- | --- |
|  |  |  |

## Residual Risks

-

## Follow-up TODOs

-

## Transferable Principles

<!--
Session-end reflection: この実装で「これはなぜ」と立ち止まった判断はあったか。
その「なぜ」が 1 セッション限りの説明で閉じないなら、candidate として 1–3 行で書く。
intent への昇格判断は user が行う。ここを埋めるまで validator は通らない (空欄・裸の None は不可)。
- candidate: `- TP: <原則。適用条件が分かる粒度で> (契機: <どの判断・修正から> / 昇格先候補: _docs/intent/<Area>/<slug または conventions>/decision.md)`
- 無い場合: `None: <検討した上で新規原則が無いと判断した理由>`
-->
