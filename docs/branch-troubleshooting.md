# Branch Troubleshooting: "Branch is either deleted or invalid"

Use this checklist when a pull request cannot be opened or updated because the source branch is missing/invalid.

## 1) Confirm current branch is valid

```bash
git branch --show-current
git status -sb
```

Expected: a non-empty branch name and clean/known working tree state.

## 2) Avoid rewriting shared branch history

If a branch is already used by CI/PR tooling, avoid repeated `git commit --amend` and force pushes.
Prefer new commits:

```bash
git add -A
git commit -m "Follow-up: <summary>"
```

## 3) Recover from a deleted/invalid branch quickly

Create a fresh branch from the current commit and continue there:

```bash
git checkout -b fix/<short-description>
```

Then continue normal commit flow and open/update the PR from the new branch.

### Quick recovery one-liner

If you are already at the correct commit and just need a valid branch immediately:

```bash
git checkout -b fix/fresh-branch-from-head
```

## 4) Verify before PR creation

```bash
git log --oneline -5
git rev-parse --abbrev-ref HEAD
```

## 5) Safe handoff rules

- Keep commit history linear and append-only once PR is under review.
- Prefer follow-up commits over amend/rebase during active review.
- If branch metadata breaks, create a fresh branch from current HEAD and continue.
