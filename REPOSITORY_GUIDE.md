# Repository organization guide

This file explains the repository layout and the proposed cleanup of duplicate root-level UI files. The cleanup is staged in a separate pull request until hosting and links are checked.

## Primary folders

- `pathfinder/frontend/UI/`: canonical frontend pages, JavaScript, styles, images, and a web-served copy of the course catalog.
- `pathfinder/backend/`: Express application. `app.js` is the entry point; routes, controllers, services, repositories, and fictional data are kept in their respective directories.
- `tests/`: backend automated tests.
- `data/sample/`: reusable sample CSV data; `data/source/`: original source spreadsheets.
- `docs/`: course deliverables and project records. See [docs index](docs/README.md).
- `.github/workflows/`: CI and GitHub Pages publishing.
- `git-practice/`: original class Git exercises.

## Proposed removal of duplicate root-level frontend files

The cleanup branch removes 13 redundant root-level UI files, including `Main.js`, HTML, CSS, images, and `course-catalog.csv`. The application copy remains in `pathfinder/frontend/UI/` without modification. The Express app serves that folder, and the GitHub Pages workflow explicitly copies it into its deployment artifact. This is not yet proof that every external link to a root-level file is safe to remove; confirm that before merging.

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

## Remaining cleanup checks

1. Before merging this PR, verify no external URLs depend on root-level HTML and confirm the active GitHub Pages deployment source is the included workflow.
2. Confirm Render and GitHub Pages still work on the proposed branch, and avoid merging shortly before the live demo.
3. Update the README when real Supabase/backend or HAL integration is verified.
4. Add missing reports/presentations after checking agreed team versions.
5. Align Node versions and add browser-level testing when practical.

## Live demo safety

Do not merge risky structural changes immediately before the November 19 CI/CD demo. Keep testable feature changes isolated and verify that a frontend-only push triggers the intended deployment target.
