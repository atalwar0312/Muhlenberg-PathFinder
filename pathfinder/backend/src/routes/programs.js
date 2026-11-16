import { Router } from "express";
import { createProgramController } from "../controllers/programController.js";

export function createProgramRoutes(supabase) {
  const router = Router();
  const controller = createProgramController(supabase);
  router.get("/", controller.listPrograms);
  router.get("/:id/requirements", controller.getRequirements);
  router.get("/:id", controller.getProgram);
  return router;
}
