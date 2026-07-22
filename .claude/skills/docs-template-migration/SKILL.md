---
name: docs-template-migration
description: Migrate a pinned upstream docs-driven template revision into an existing customized repository. Use when that upstream delta changes standards, validators, paired skills, hooks, CI, template meta-work, or document schemas. Do not use for project-local schema edits without an upstream revision.
---

# Docs-Driven Template Migration

Treat every migration as a provenance-locked three-way migration:

- `B`: the upstream version originally adopted by the project.
- `U`: the exact upstream commit selected for this migration.
- `P`: the project tree at the owner-approved migration cutoff.

Do not compare only against a moving branch tip.

## Procedure

### 1. Freeze the project cutoff

Read repository rules, inspect the current branch, HEAD, dirty paths, and
concurrent work before editing. Record whether the owner wants the migration in
the active tree or an isolated worktree. Give parallel writers non-overlapping
path ownership. Record `P` as the HEAD SHA plus the staged, unstaged, and
untracked manifest. For every in-scope dirty path, preserve its cutoff content
hash or cutoff diff.

Completion criterion: `P` is reproducible from HEAD plus cutoff evidence; the
cutoff time, dirty contents, destination mode, and parallel ownership are
explicit, and later changes can be distinguished from migration changes.

### 2. Lock provenance

Identify `B` through repository history and matching upstream blob evidence.
Record the remote, source branch, and full SHAs for `B` and `U`. Treat every
unmerged upstream branch as a separate migration lane.

Completion criterion: exactly one `B..U` range is selected, included and
excluded branch heads are explicit, and no moving ref remains in the plan. Stop
before writes if `B` or the source branch is ambiguous.

### 3. Build the three-way inventory

Compare both `B..U` and `B..P`. Classify every path in their union as:

- upstream-owned unchanged;
- project-only;
- customized shared;
- upstream-added;
- upstream-removed or template meta-work;
- schema-affected.

Assign exactly one resolution to every path: apply, merge, keep, remove, or
defer. An upstream deletion is not authorization to delete a project record.

Completion criterion: every path in both deltas has one resolution and
rationale; no customization or removal is implicit.

### 4. Establish the migration contract

Use the repository's preparation and QA skills when required. Record current
validator results before importing new validators. Review imported hooks and
scripts before executing or trusting them.

Acceptance criteria must cover provenance, customization, meta-work, schema
transition, concurrent-work isolation, and verification. Include agent
misbehavior checks for branch mixing, blind replacement, and bulk schema edits.

Completion criterion: baseline failures are separated from migration
regressions, and every destructive or semantic operation has owner authority.

### 5. Integrate in gates

1. Import validators and fixtures in legacy-compatible mode.
2. Run them against unchanged project docs before schema edits.
3. Merge standards, templates, paired skill trees, hooks, CI, and shared root
   docs path by path. Never replace a customized shared file wholesale.
4. Remove template-self meta-work only after its rules are absorbed elsewhere,
   provenance is proven, references are resolved, and deletion is authorized.
5. Classify legacy docs as current, migrate-now, or deferred. Migrate semantic
   edits; do not force schema conversion for link, typo, or metadata fixes.
6. Reclassify code anchors semantically: decision rationale points to `DEC-*`;
   only results required across every valid implementation point to `INV-*`.
7. Map every legacy ID to retained INV, DEC, delegated canonical authority,
   superseded history, or removal with owner authority. Do not renumber retained
   IDs. Preserve prior verification commands and results as historical evidence.
8. Confirm every schema marker is accepted by frontmatter, intent, and QA
   validators before migrating live documents.
9. Enable strict CI enforcement after the selected schema target is satisfied.

Completion criterion: every completed gate passes relative to the baseline. A
deferred gate has owner-authorized rationale, an explicit follow-up, and a
non-PASS verdict; every legacy and meta-work path has a final state.

### 6. Verify closure

Run the repository wrapper, validator fixtures, markdown lint, hook tests,
paired-skill comparison, diff checks, and project-specific regression tests.
Reconcile the final diff with the inventory and prove that each project
customization was preserved or intentionally changed. Run `qa-review` and
record only commands actually executed.

Completion criterion: no inventory path is unresolved, no parallel branch or
post-cutoff file was silently included, failures are not new or unexplained,
and the verification verdict matches the achieved migration stage.

## Reporting Boundary

Report compatibility migration and strict schema migration separately. Never
collapse a staged or partially deferred result into full completion.
