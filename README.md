# Muhlenberg PathFinder

PathFinder is a student academic-planning prototype for Muhlenberg College. The project aims to help students monitor progress toward declared academic programs, explore possible majors/minors, and eventually support advisor access and HAL, an AI assistant.

## Current implementation (October 27, 2026)

- **Frontend:** browser-based JavaScript prototype in `pathfinder/frontend/UI/`. Its displayed student data and progress indicators are hardcoded; it is not yet connected to the API.
- **Backend:** Node.js/Express API prototype in `pathfinder/backend/`, structured as **Layered Architecture** (routes/controllers → services → repositories → demo data). Its profile, progress, and opportunity endpoints use fictional fixtures rather than actual student records.
- **Database:** raw course catalogs and exploratory source material are in `data/`. No live database connection is implemented in the current backend.
- **Not yet implemented:** production authentication, AI chatbot, advisor functionality, GPA calculation and frontend-to-backend integration. Requirements describe planned behavior, not necessarily working code.

## Run frontend

From the repository root:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/pathfinder/frontend/UI/`.

## Run backend

```bash
cd pathfinder/backend
npm ci
npm test
npm start
```

The API starts at `http://localhost:3000`. To inspect the fixture-backed endpoints:

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/students/demo/profile
curl http://localhost:3000/api/students/demo/progress
curl http://localhost:3000/api/students/demo/opportunities
```

The tests exercise selected service calculations only; they do not constitute end-to-end tests of the frontend, authentication or database.

## Repository map

| Location | Responsibility |
| --- | --- |
| `pathfinder/frontend/UI/` | Current browser UI prototype |
| `pathfinder/backend/routes/` | Express HTTP route definitions |
| `pathfinder/backend/controllers/` | HTTP request/response handlers |
| `pathfinder/backend/services/` | Academic progress and opportunity calculations |
| `pathfinder/backend/repositories/` | Data-access abstraction |
| `pathfinder/backend/data/` | Temporary fictional sample records |
| `pathfinder/config/` | Reserved for non-secret configuration |
| `data/sample/`, `data/source/` | Course catalog snapshots and supporting raw data |
| `docs/` | Requirements, architecture, presentations, team planning and AI-policy artifacts |
| `tests/` | Backend tests |
| `git-practice/` | Original team Git practice exercises |

## Assignment 5: Internal Server Architecture

**Chosen pattern:** Layered Architecture; request → business logic → persistence → data. This organization matches the course's Chapter 5 separation-of-concerns approach. The server's currently implemented request paths are:

- **FR-3 Student Information Card data:** `GET /api/students/demo/profile` → `studentController.getProfile` → `studentService.getProfile` → `studentRepository.findStudentById` → demo data.
- **FR-1 Progress Overview prototype:** `GET /api/students/demo/progress` → `studentController.getProgress` → `studentService.getProgress` → repository → demo data.
- **FR-2 Opportunity Finder prototype:** `GET /api/students/demo/opportunities` → `studentController.getOpportunities` → `studentService.getOpportunities` → repository → demo data.

The [UML class/module diagram](docs/diagrams/assignment-05-class-diagram.md) and the [Assignment 5 slide deck](docs/presentations/assignment-05-internal-server-architecture.pptx) describe the same current implementation. The backend is independent from, and not yet connected to, the frontend UI.

## Contributing and document policy

Keep working code, sample datasets and project documentation in their existing top-level areas. Track new work in feature branches and merge by pull request. Keep only the latest *agreed* requirements version labeled as current; place historical versions in an archive only after confirming with the team. Never commit API keys, access tokens, private student information, `.env` files, or exported database credentials. Google Drive remains the collaborative source for living team documents; repository copies are dated snapshots.
