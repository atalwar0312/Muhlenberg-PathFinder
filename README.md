# Muhlenberg PathFinder

PathFinder is a student academic-planning prototype for Muhlenberg College. The browser UI helps users explore courses and program progress; the Node.js/Express backend supplies separate demonstration API endpoints.

**Live app (Render):** https://muhlenberg-pathfinder.onrender.com  
**Continuous integration:** [GitHub Actions](.github/workflows/ci.yml)  
**Frontend Pages workflow:** [GitHub Pages](.github/workflows/deploy-pages.yml)  
**Project documentation:** [docs/README.md](docs/README.md)  
**Contributor guide:** [CONTRIBUTING.md](CONTRIBUTING.md)

> This is a course prototype, not a production student system. Its login is browser-side demo authentication, and its backend endpoints currently use fictional demonstration records. A visible HAL help widget is not by itself evidence of a live AI backend.

## Where things belong

| Path | Purpose |
| --- | --- |
| `pathfinder/frontend/UI/` | Canonical browser UI: login, dashboard, courses, styles, images and catalog copy |
| `pathfinder/backend/` | Node.js/Express API, layered routes/controllers/services/repositories, demo fixtures |
| `tests/` | Backend tests executed by `npm test` |
| `data/sample/` | Reference CSV snapshots used for development |
| `data/source/` | Original spreadsheet/source files |
| `docs/` | Requirements, design diagrams, weekly reports, presentations and project notes |
| `.github/workflows/` | Automated CI and GitHub Pages workflows |
| `pathfinder/config/` | Reserved for non-secret application configuration |
| `git-practice/` | Historical coursework / Git practice |

See [REPOSITORY_GUIDE.md](REPOSITORY_GUIDE.md) for the project layout and notes about the proposed removal of duplicate root-level frontend files.

## Run locally

Requires Node.js and npm. From the repository root:

```bash
cd pathfinder/backend
npm ci
npm test
npm start
```

Open `http://localhost:3000` for the app and `http://localhost:3000/api/health` for the API health endpoint. Other demonstration routes include:

```
GET /api/students/demo/profile
GET /api/students/demo/progress
GET /api/students/demo/opportunities
```

The API tests do not verify the browser login, HAL UI, or the complete frontend-to-backend interaction.

## CI/CD overview

- **CI:** `.github/workflows/ci.yml` runs on pushes to `main`, pull requests targeting `main`, and manual invocation. It installs backend dependencies with `npm ci` and runs `npm test`.
- **Render:** Serves the Node/Express app from `pathfinder/backend`. Render can be configured to deploy after CI checks pass, but an automated deploy must be demonstrated from a new pushed commit; successful manual or configuration-triggered deployments are not proof of a push-to-deploy workflow.
- **GitHub Pages:** `.github/workflows/deploy-pages.yml` publishes a static UI preview on relevant frontend changes. This is separate from Render and does not run the backend.
- **Important:** If Render's Root Directory is set to `pathfinder/backend`, frontend-only changes may not trigger Render auto-deployment. Verify the service configuration before a CI/CD live demo.

## Team workflow

1. Sync `main` before starting work and use a feature branch.
2. Limit changes to your feature; do not casually replace teammates' files.
3. Run `npm test` from `pathfinder/backend`.
4. Open a pull request and confirm CI results before merging.
5. For a frontend update, verify both GitHub Pages and Render behavior as appropriate.
6. Never commit real student data, credentials, database passwords, access tokens, or `.env` files.

See [CONTRIBUTING.md](CONTRIBUTING.md) for practical instructions and [docs/README.md](docs/README.md) for course deliverables.
