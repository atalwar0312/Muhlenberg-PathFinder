import { sampleCourses } from "../data/demoData.js";

const COURSE_COLUMNS = "id,prefix,number,name,units,prerequisites_text,description,gar";

export function createCourseRepository(supabase) {
  return {
    async findAllCourses(search = "") {
      if (!supabase) {
        const term = search.trim().toLowerCase();
        return sampleCourses.filter((course) =>
          `${course.id} ${course.title} ${course.department}`.toLowerCase().includes(term)
        );
      }

      let query = supabase.from("courses")
        .select(COURSE_COLUMNS)
        .order("id", { ascending: true })
        .limit(2000);

      if (search.trim()) query = query.ilike("name", `%${search.trim()}%`);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },

    async findCourseById(id) {
      if (!supabase) return sampleCourses.find((course) => course.id === id) ?? null;
      const numericId = Number(id);
      if (!Number.isSafeInteger(numericId) || numericId < 1) return null;
      const { data, error } = await supabase.from("courses")
        .select(COURSE_COLUMNS)
        .eq("id", numericId)
        .maybeSingle();
      if (error) throw error;
      return data ?? null;
    }
  };
}
