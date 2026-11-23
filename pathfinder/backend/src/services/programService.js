import { createProgramRepository } from "../repositories/programRepository.js";
import { createRequirementRepository } from "../repositories/requirementRepository.js";

export function createProgramService(supabase) {
  const programs = createProgramRepository(supabase);
  const requirements = createRequirementRepository(supabase);
  return {
    listPrograms(type) { return programs.findAllPrograms(type); },
    async listProgramsWithRequirements(type = "") {
      const rows = await programs.findAllPrograms(type);
      const requirementRows = await requirements.findRequirementsByProgramIds(rows.map((program) => program.id));
      const byProgram = new Map(rows.map((program) => [program.id, []]));
      for (const requirement of requirementRows) {
        byProgram.get(requirement.program_id)?.push(requirement);
      }
      return rows.map((program) => ({
        ...program,
        requirements: byProgram.get(program.id) ?? []
      }));
    },
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
