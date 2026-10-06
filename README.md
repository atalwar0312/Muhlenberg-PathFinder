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
