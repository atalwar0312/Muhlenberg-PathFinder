# PathFinder server — Assignment 5

**Internal architecture: Layered** (Request → Business → Persistence → Data).

| Folder | Responsibility |
| --- | --- |
| `routes/` | HTTP paths and methods |
| `controllers/` | Request/response handling and status codes |
| `services/` | Academic progress and opportunity-ranking rules |
| `repositories/` | Centralized access to stored information |
| `data/` | Explicitly fictional demo records (temporary stand-in for DB) |
| `app.js` | Express application wiring and server startup |

## Run in Codespaces

```bash
cd pathfinder/backend
npm install
npm test
npm start
```

In a second terminal, try `curl http://localhost:3000/api/students/demo/progress` or use the Codespaces forwarded-port link. Additional endpoints: `/api/students/demo/profile`, `/api/students/demo/opportunities`, `/api/health`.

**Scope:** These endpoints are a tested backend prototype. They are **not yet connected to the existing frontend UI or real database**. Do not interpret the fixture values as actual Muhlenberg records. Authentication (FR-5), HAL, and advisor features are future increments.

## Feature paths
- FR-1 Progress Overview: `routes/students.js` → `controllers/studentController.js` → `services/studentService.js:getProgress` → `repositories/studentRepository.js` → `data/demoData.js`
- FR-2 Opportunity Finder: same route/controller/repository, with `getOpportunities` computing closest program matches, excluding declared programs and returning up to five.
- FR-3 Student Information Card: `getProfile`, currently exposed as JSON but not yet wired into the UI.

**Notes:** The project requirements use credit and GPA rules that are not completely implemented in this prototype; no GPA is calculated without real grades or an agreed data model.
