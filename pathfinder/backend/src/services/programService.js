import { createProgramRepository } from "../repositories/programRepository.js";
import { createRequirementRepository } from "../repositories/requirementRepository.js";

export function createProgramService(supabase) {
  const programs = createProgramRepository(supabase);
  const requirements = createRequirementRepository(supabase);
  return {
    listPrograms(type) { return programs.findAllPrograms(type); },
    async getProgram(id) {
      const program = await programs.findProgramById(id);
      return program;
    },
    async getProgramRequirements(id) {
      const program = await programs.findProgramById(id);
      if (!program) return null;
      const rows = await requirements.findRequirementsByProgramId(program.id);
      return { program, requirements: rows };
    }
  };
}
