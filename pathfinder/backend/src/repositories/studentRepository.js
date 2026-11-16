import { students, programs } from "../data/demoData.js";

// Sole access point for student and program records.
export const studentRepository = {
  async findStudentById(id) {
    const student = students.find((item) => item.id === id);
    return student ? structuredClone(student) : null;
  },

  async findProgramsByNames(names) {
    const wanted = new Set(names.map(normalize));
    return structuredClone(programs.filter((program) => wanted.has(normalize(program.name))));
  },

  async findAllPrograms() {
    return structuredClone(programs);
  },

  // Backward-compatible repository method used by the original GET /api/students/:id API.
  async getStudent(id) {
    const student = await this.findStudentById(id);
    if (!student) return null;

    // Preserve the snake_case fields consumed by the pre-refactor frontend.
    return {
      student_id: student.id,
      name: student.name,
      class_year: student.classYear,
      majors: student.majors.join(", "),
      minors: student.minors.join(", "),
      credits_completed: student.creditsEarned,
      credits_required: student.creditsRequired,
      graduation_term: student.graduationTerm,
      major_progress: student.majorProgress,
      minor_progress: student.minorProgress,
      gar_categories: student.garCategories
    };
  }
};

function normalize(value) {
  return String(value).trim().toLowerCase();
}
