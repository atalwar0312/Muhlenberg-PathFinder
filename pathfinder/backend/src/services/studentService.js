import { studentRepository as defaultRepository } from "../repositories/studentRepository.js";

export function createStudentService(repository = defaultRepository) {
  return {
    async getProfile(id) {
      const student = await repository.findStudentById(id);
      if (!student) return null;

      return {
        id: student.id,
        name: student.name,
        classYear: student.classYear,
        majors: [...student.majors],
        minors: [...student.minors],
        schoolId: student.schoolId
      };
    },

    async getProgress(id) {
      const student = await repository.findStudentById(id);
      if (!student) return null;

      const programNames = [...student.majors, ...student.minors];
      const studentPrograms = await repository.findProgramsByNames(programNames);
      const completed = new Set(student.completedCourses ?? []);

      const programProgress = studentPrograms.map((program) => {
        const requirements = program.requiredCourses ?? [];
        const completedCourses = requirements.filter((course) => completed.has(course));
        const remainingCourses = requirements.filter((course) => !completed.has(course));
        return {
          name: program.name,
          type: program.type,
          completedRequirements: completedCourses.length,
          remainingRequirements: remainingCourses.length,
          totalRequirements: requirements.length,
          completedCourses,
          remainingCourses
        };
      });

      return {
        studentId: student.id,
        creditsEarned: student.creditsEarned,
        creditsRequired: student.creditsRequired,
        creditsRemaining: Math.max(0, student.creditsRequired - student.creditsEarned),
        completedCourseCount: (student.completedCourses ?? []).length,
        inProgressCourseCount: (student.inProgressCourses ?? []).length,
        majorProgress: student.majorProgress,
        minorProgress: student.minorProgress,
        garCategories: student.garCategories ?? [],
        programs: programProgress,
        totals: {
          completedRequirements: programProgress.reduce((sum, item) => sum + item.completedRequirements, 0),
          remainingRequirements: programProgress.reduce((sum, item) => sum + item.remainingRequirements, 0)
        }
      };
    },

    async getOpportunities(id) {
      const student = await repository.findStudentById(id);
      if (!student) return null;

      const currentPrograms = new Set([...student.majors, ...student.minors].map(normalize));
      const completed = new Set(student.completedCourses ?? []);
      const allPrograms = await repository.findAllPrograms();

      const opportunities = allPrograms
        .filter((program) => !currentPrograms.has(normalize(program.name)))
        .filter((program) => student.creditsEarned >= (program.minimumCredits ?? 0))
        .map((program) => {
          const requirements = program.requiredCourses ?? [];
          const overlapCourses = requirements.filter((course) => completed.has(course));
          return {
            name: program.name,
            type: program.type,
            description: program.description,
            overlapCount: overlapCourses.length,
            totalRequirements: requirements.length,
            overlapPercentage: requirements.length
              ? Math.round((overlapCourses.length / requirements.length) * 100)
              : 0,
            overlapCourses
          };
        })
        .sort((a, b) =>
          b.overlapCount - a.overlapCount ||
          b.overlapPercentage - a.overlapPercentage ||
          a.name.localeCompare(b.name)
        )
        .slice(0, 5);

      return {
        studentId: student.id,
        rankedBy: "completed-course overlap",
        opportunities
      };
    },

    // Backward-compatible alias for the original GET /api/students/:id endpoint.
    async getStudent(id) {
      return repository.getStudent(id);
    }
  };
}

function normalize(value) {
  return String(value).trim().toLowerCase();
}

export const studentService = createStudentService();
