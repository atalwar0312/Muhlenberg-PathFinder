import express from "express";
import { fileURLToPath } from "node:url";
import { createStudentRoutes } from "./routes/students.js";
import { createCourseRoutes } from "./routes/courses.js";
import { createProgramRoutes } from "./routes/programs.js";
import { createStudentController } from "./controllers/studentController.js";
import { createStudentService } from "./services/studentService.js";
import { studentRepository } from "./repositories/studentRepository.js";

export function createApp(supabase, repository = studentRepository) {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json());

  const studentService = createStudentService(repository);
  const studentController = createStudentController(studentService);

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      course_source: supabase ? "supabase" : "sample",
      program_source: supabase ? "supabase" : "unavailable",
      student_source: "sample",
      database_status: "not_checked"
    });
  });

  app.use("/api/students", createStudentRoutes(studentController));
  app.use("/api/courses", createCourseRoutes(supabase));
  app.use("/api/programs", createProgramRoutes(supabase));

  // Serve the frontend UI when the repository contains the expected frontend directory.
  app.use(express.static(fileURLToPath(new URL("../../frontend/UI/", import.meta.url))));

  app.use((req, res) => res.status(404).json({ error: "Route not found" }));
  app.use((error, _req, res, _next) => {
    console.error("Request failed:", error.message);
    res.status(500).json({ error: "Internal server error" });
  });
  return app;
}
