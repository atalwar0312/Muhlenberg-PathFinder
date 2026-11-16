import { createCourseService } from "../services/courseService.js";

export function createCourseController(supabase) {
  const service = createCourseService(supabase);
  return {
    listCourses: async (req, res) => {
      const q = req.query.q ?? "";
      if (typeof q !== "string" || q.length > 200) {
        return res.status(400).json({ error: "q must be a single string of at most 200 characters" });
      }
      try {
        const data = await service.listCourses(q);
        return res.json({ data_source: supabase ? "supabase" : "sample", data });
      } catch (error) {
        console.error("Course query failed:", error.message);
        return res.status(502).json({ error: "Unable to retrieve courses from the database" });
      }
    },
    getCourse: async (req, res, next) => {
      try {
        const course = await service.getCourse(req.params.id);
        if (!course) return res.status(404).json({ error: "Course not found" });
        return res.json({ data_source: supabase ? "supabase" : "sample", data: course });
      } catch (error) { return next(error); }
    }
  };
}
