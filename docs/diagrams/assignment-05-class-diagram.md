# Assignment 5 — Layered server (implementation prototype)

```mermaid
classDiagram
  direction TB
  class StudentRoutes {
    +GET /:id/profile
    +GET /:id/progress
    +GET /:id/opportunities
  }
  class StudentController {
    +getProfile(req,res)
    +getProgress(req,res)
    +getOpportunities(req,res)
  }
  class StudentService {
    +getProfile(id)
    +getProgress(id)
    +getOpportunities(id)
  }
  class StudentRepository {
    +findStudentById(id)
    +findProgramsByNames(names)
    +findAllPrograms()
  }
  class DemoData {
    +students[]
    +programs[]
  }
  StudentRoutes ..> StudentController : delegates
  StudentController ..> StudentService : calls
  StudentService ..> StudentRepository : reads via
  StudentRepository ..> DemoData : fixture adapter
```

The current persistence layer uses a **demo data fixture**. PostgreSQL/SQLite and authentication are not integrated yet. This diagram reflects the files introduced for Assignment 5, not future features.
