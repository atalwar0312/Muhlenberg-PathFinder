# Contributing to PathFinder

Thanks for contributing to the course project. Keep feature changes small and avoid overwriting teammates' work.

## Before you edit

1. Start from the latest `main` and create a descriptively named feature branch.
2. Put frontend code in `pathfinder/frontend/UI/` and backend code in `pathfinder/backend/`.
3. Put architecture and presentation deliverables in the matching `docs/` subfolder.
4. Check whether a teammate is already modifying the same file, especially `Main.js`.

## Test changes

From the repository root:

```bash
cd pathfinder/backend
npm ci
npm test
```

To launch the Node app:

```bash
npm start
```

Open the page in your browser; unit tests currently cover only selected backend service logic. Manually test navigation, login/logout, and the course interface for frontend modifications.

## Pull requests

- Summarize what changed and how you tested it.
- Link the relevant assignment or issue.
- Check the GitHub Actions run before merging.
- Keep unrelated cleanup separate from feature work.
- Never commit `.env` files, tokens, real student information, or database credentials.

## CI/CD demo guidance

GitHub Actions runs backend tests automatically on pull requests and pushes to `main`. Render auto-deployment is service configuration and must be independently checked. When showing a feature update, make sure the new commit appears in the deploy history **without clicking Manual Deploy**.

## Avoid breaking live deployments

A cleanup pull request proposes removing redundant root-level frontend copies. Keep the canonical application under `pathfinder/frontend/UI/` and verify hosting URLs before merging any structural cleanup.
