# Database implementation and sources

**Actual committed app state:** `pathfinder/backend/repositories/studentRepository.js` reads `pathfinder/backend/data/demoData.js`. It does not connect to Supabase or PostgreSQL.

**Reported team state:** Week 8 states that a Supabase-hosted PostgreSQL database contains 1,165 course catalog records. This hosted database and its schema were not verified via the repository.

Drive references:
- [DB (iteration 1) folder](https://drive.google.com/drive/folders/131yMHXiAJdAuV_f8qhN_6KFDd4v71BmT)
- [DB Test folder](https://drive.google.com/drive/folders/1s5iFEpDQuqjCIx7ydVVv3nwW5lfaCW5F)

Recommended code paths for later integration:
- `database/schema.sql` — reviewed schema DDL
- `database/seed/` — **sanitized** public/nonpersonal seed data
- `pathfinder/backend/repositories/` — database access adapter
- `pathfinder/backend/config/` — config reading environment variables (never keys)

**Never commit** Supabase service-role keys, database URLs with passwords, access tokens, `.env`, or real student records. Use `.env.example` with placeholders only. Review schema and ownership with the database teammate before adding SQL.
