# Repository organization guide

This file explains the existing layout. It does **not** move or delete application code.

## Primary folders

- `pathfinder/frontend/UI/`: canonical frontend pages, JavaScript, styles, images, and a web-served copy of the course catalog.
- `pathfinder/backend/`: Express application. `app.js` is the entry point; routes, controllers, services, repositories, and fictional data are kept in their respective directories.
- `tests/`: backend automated tests.
- `data/sample/`: reusable sample CSV data; `data/source/`: original source spreadsheets.
- `docs/`: course deliverables and project records. See [docs index](docs/README.md).
- `.github/workflows/`: CI and GitHub Pages publishing.
- `git-practice/`: original class Git exercises.

## Duplicate frontend files at repository root

The repository currently includes two UI file groups:

- `pathfinder/frontend/UI/` — the frontend served by the Express backend.
- Root-level `Main.js`, `index.html`, `login.js`, `login.html`, other pages, assets, and `course-catalog.csv` — a separate existing copy.

Some copies have different revisions. **Do not consolidate by blindly copying or deleting**: first verify GitHub Pages, Render, relative asset URLs, and any external links. Canonical development should target `pathfinder/frontend/UI/`.

## Documentation folders

| Folder | Content |
| --- | --- |
| `docs/requirements/` | Requirements documents and feature list |
| `docs/diagrams/` | Architecture, deployment, and use-case diagrams |
| `docs/presentations/` | Course presentations |
| `docs/weekly-reports/` | Progress reports |
| `docs/meeting-notes/` | Team meeting records |
| `docs/planning/` | Team and sprint planning |
| `docs/proposal/` | Project and extension proposals |
| `docs/database/` | Database planning notes |
| `docs/ai/` | AI usage and policy artifacts |
| `docs/assets/` | Brand images |
| `docs/references/` | Historical references |

## Safe cleanup backlog (not executed)

1. Inventory all references to root-level UI files and identify whether any published sites still depend on them.
2. Compare root UI content with `pathfinder/frontend/UI/`; do not assume they are identical.
3. Decide with the team whether to keep the root site for GitHub Pages compatibility or replace it with explicit redirects.
4. Update the README after confirming any real Supabase/backend or HAL API integration. Avoid overstating prototype capabilities.
5. Add missing weekly reports and newer course presentations only after checking the team's agreed versions.
6. Consider pinning Node.js versions consistently between local, GitHub Actions, and Render.
7. Validate frontend assets and logout behavior in a browser in addition to backend tests.

## Live demo safety

Do not merge risky structural changes immediately before the November 19 CI/CD demo. Keep testable feature changes isolated and verify that a frontend-only push triggers the intended deployment target.
