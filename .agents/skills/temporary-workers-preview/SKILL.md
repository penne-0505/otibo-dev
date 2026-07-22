---
name: temporary-workers-preview
description: Publish the current otibo baseline through Cloudflare Temporary Workers. Use when the user asks for a short-lived public preview, a workers.dev URL, or a phone-accessible snapshot without changing production.
---

# Temporary Workers Preview

Create a disposable public snapshot of the current worktree. This is a preview lane, not the
`otibo.dev` production deploy lane.

## Preconditions

- Run only after the user explicitly asks to publish the prototype externally.
- Treat the returned claim URL as a bearer credential. Return it only to the requesting user.
- Do not run `wrangler logout`, edit `wrangler.jsonc`, or modify source assets to make a preview fit.
- Do not allocate a TTY. The helper also sets `CI=1`, so Wrangler prints the terms notice and
  continues without stopping for interactive input.

## Procedure

1. From the repository root, run:

   ```bash
   scripts/deploy-temporary-workers-preview.sh
   ```

   Use a normal non-TTY command invocation. Completion criterion: the script prints a
   `Temporary Workers URL` after verifying every exported HTML route.

2. Return the public URL, the approximate 60-minute lifetime, and the claim URL. State every
   preview-only image resize reported by the script. Completion criterion: the user can distinguish
   the temporary snapshot from the production artifact.

## What the helper guarantees

- Copies the current dirty worktree to `/tmp` and builds there; the repository's `public/`, `out/`,
  environment files, and deployment config are not rewritten.
- Runs `npm ci` inside the isolated copy and uses that lockfile-installed Wrangler. It does not
  symlink the repository's `node_modules`, because Turbopack rejects dependencies outside its
  filesystem root.
- Rejects unreviewed build environment keys. The current legal-page keys and `NEXT_PUBLIC_*` are
  allowed because their values are intentionally compiled into public static HTML.
- Generates a temporary Wrangler config without the `otibo.dev` custom-domain route.
- Unsets Cloudflare credential environment variables and uses isolated HOME/XDG state instead of
  logging out the user's existing account.
- Reuses a still-valid temporary account through stable `/tmp` state; after expiry Wrangler creates
  another account non-interactively.
- Enforces the 5 MiB per-file limit on the copied artifact. Oversized raster images are repeatedly
  resized below 4.8 MB. Oversized non-images stop the run because byte-splitting would break their
  URLs or consumers.
- Retries live route checks to absorb initial Workers asset propagation.

## Preparation-only branch

When reviewing the artifact or changing this skill, run:

```bash
scripts/deploy-temporary-workers-preview.sh --prepare-only
```

This builds and adapts the preview without creating an account or external deployment. Inspect the
printed staging directory, confirm no file exceeds 5 MiB, and compare any resized image before
changing the helper.

## Failure boundaries

- Unknown environment key: stop and review whether it is safe to compile into public HTML.
- Oversized non-image: stop and implement an app-aware format or reference change; never split it
  blindly.
- Missing `workers.dev` URL or failed route check: report the run as failed and preserve the printed
  `/tmp` evidence directory.
- Existing temporary deployment expired: run the same command again; do not claim or promote it
  unless the user asks.
