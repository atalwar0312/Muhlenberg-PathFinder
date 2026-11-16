import { createCourseRepository } from "../repositories/courseRepository.js";

export function createCourseService(supabase) {
  const repository = createCourseRepository(supabase);
  return {
    listCourses(search) { return repository.findAllCourses(search); },
    getCourse(id) { return repository.findCourseById(id); }
  };
}
