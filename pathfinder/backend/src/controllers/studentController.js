import { studentService as defaultService } from "../services/studentService.js";

export function createStudentController(service = defaultService) {
  function handle(method) {
    return async (req, res, next) => {
      try {
        const result = await service[method](req.params.id);
        if (!result) return res.status(404).json({ error: "Student not found" });
        return res.status(200).json(result);
      } catch (error) {
        return next(error);
      }
    };
  }

  return {
    getProfile: handle("getProfile"),
    getProgress: handle("getProgress"),
    getOpportunities: handle("getOpportunities"),

    // Preserves the original response contract: { data_source, data }.
    getStudent: async (req, res, next) => {
      try {
        const student = await service.getStudent(req.params.id);
        if (!student) return res.status(404).json({ error: "Student not found" });
        return res.json({ data_source: "sample", data: student });
      } catch (error) {
        return next(error);
      }
    }
  };
}

export const studentController = createStudentController();
