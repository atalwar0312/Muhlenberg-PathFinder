# Apply stage-two Drive audit in Codespaces

This package contains source links, short weekly report summaries, version-check notes, and database safety guidance. **It does not contain exported original Google Slides/Docs binaries.**

1. Go to repository root in Codespaces. Confirm your stage-one documentation merge is in `main`.
2. Create a new branch from fresh `main`:
   ```
   git switch main
   git pull origin main
   git switch -c repo-drive-sync-stage2
   ```
3. Upload **this ZIP** into the root of the Codespaces Explorer. Run:
   ```
   unzip -o PathFinder_Drive_Sync_Stage2.zip 'docs/*' 'APPLY_STAGE2.md'
   git status --short
   ```
4. Review the listed docs. Do **not** stage the ZIP.
5. Optionally export the actual Drive originals via the links, saving them under the paths described in the docs.
6. Commit only after verification:
   ```
   git add docs/weekly-reports/week-0{6,7,8}-source.md docs/requirements/CURRENT_VERSION.md docs/database/README.md docs/presentations/PRESENTATION_02_SOURCE.md docs/planning/ADDITIONAL_SOURCES.md APPLY_STAGE2.md
   git commit -m "Document current Drive sources and database integration status"
   git push -u origin repo-drive-sync-stage2
   ```
7. Open a pull request from `repo-drive-sync-stage2` into `main`. Check the diff before merging.

**Do not represent source-reference files as the original weekly reports or Presentation #2.** Those need separate export and upload.
