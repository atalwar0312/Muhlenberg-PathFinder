import { createProgramService } from "../services/programService.js";

export function createProgramController(supabase) {
  const service = createProgramService(supabase);
  return {
    listPrograms: async (req, res) => {
      const type = req.query.type ?? "";
      if (typeof type !== "string" || type.length > 40 || (type && !["major", "minor"].includes(type.toLowerCase()))) {
        return res.status(400).json({ error: "type must be major or minor" });
      }
      try {
        const data = await service.listPrograms(type.toLowerCase());
        return res.json({ data_source: supabase ? "supabase" : "sample", data });
      } catch (error) {
        console.error("Program query failed:", error.message);
        return res.status(502).json({ error: "Unable to retrieve programs from the database" });
      }
    },
    getProgram: async (req, res, next) => {
      try {
        const data = await service.getProgram(req.params.id);
        if (!data) return res.status(404).json({ error: "Program not found" });
        return res.json({ data_source: "supabase", data });
      } catch (error) { return next(error); }
    },
    getRequirements: async (req, res, next) => {
      try {
        const data = await service.getProgramRequirements(req.params.id);
        if (!data) return res.status(404).json({ error: "Program not found" });
        return res.json({ data_source: "supabase", data });
      } catch (error) { return next(error); }
    }
  };
}
