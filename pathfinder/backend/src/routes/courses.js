import { Router } from "express";
import { createCourseController } from "../controllers/courseController.js";

export function createCourseRoutes(supabase) {
  const controller = createCourseController(supabase);
  const router = Router();

  router.get("/", controller.listCourses);
  router.get("/:id", controller.getCourse);

  return router;
}
