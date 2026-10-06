# Muhlenberg PathFinder

A student academic planning prototype for Muhlenberg College.

## Current status

The frontend displays a sample student profile and progress indicators for
major, minor, general academic requirements, and overall credits.

Student data is currently hardcoded for demonstration. The backend and
course catalog integration are not implemented yet.

## Run locally

From the repository root, run:

    python3 -m http.server 8000

Open http://localhost:8000/pathfinder/frontend/

Stop the server with Control+C.

## Repository structure

| Folder | Purpose |
| --- | --- |
| pathfinder/frontend/ | Browser interface |
| pathfinder/frontend/js/ | JavaScript |
| pathfinder/backend/ | Future backend implementation |
| pathfinder/config/ | Future application configuration |
| data/sample/ | Course catalog CSV |
| docs/proposal/ | Project proposal and scope |
| docs/meeting-notes/ | Team and advisor meeting notes |
| docs/weekly-reports/ | Weekly progress reports |
| docs/diagrams/ | Design and architecture diagrams |
| tests/ | Future application tests |
| git-practice/ | Team Git exercises |

## Document naming

Use descriptive filenames, for example:

- docs/meeting-notes/2026-10-06-team-meeting.md
- docs/weekly-reports/week-06.docx
- docs/proposal/project-proposal.docx
- docs/diagrams/use-case-diagram.png

## Contributing

1. Create a branch for your work.
2. Make and check your changes.
3. Commit with a descriptive message.
4. Push your branch and open a pull request.
