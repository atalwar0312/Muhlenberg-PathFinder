import { Router } from "express";
import { studentController as defaultController } from "../controllers/studentController.js";

export function createStudentRoutes(controller = defaultController) {
  const router = Router();

  // Assignment 5 endpoints.
  router.get("/:id/profile", controller.getProfile);
  router.get("/:id/progress", controller.getProgress);
  router.get("/:id/opportunities", controller.getOpportunities);

  // Existing endpoint retained for compatibility with the current frontend.
  router.get("/:id", controller.getStudent);

  return router;
}

export default createStudentRoutes();
