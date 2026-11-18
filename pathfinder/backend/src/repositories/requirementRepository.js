const REQUIREMENT_COLUMNS = "id,program_id,name,courses_required,sort_order,path,notes";
const ITEM_COLUMNS = "id,requirement_id,prefix,number,min_number,max_number";

export function createRequirementRepository(supabase) {
  return {
    async findRequirementsByProgramIds(programIds) {
      if (!supabase || !programIds.length) return [];
      const { data: requirements, error } = await supabase.from("requirements")
        .select(REQUIREMENT_COLUMNS)
        .in("program_id", programIds)
        .order("program_id", { ascending: true })
        .order("sort_order", { ascending: true })
        .limit(2000);
      if (error) throw error;
      if (!requirements?.length) return [];

      const requirementIds = requirements.map((item) => item.id);
      const { data: items, error: itemError } = await supabase.from("requirements_items")
        .select(ITEM_COLUMNS)
        .in("requirement_id", requirementIds)
        .order("id", { ascending: true })
        .limit(10000);
      if (itemError) throw itemError;

      const byRequirement = new Map(requirements.map((item) => [item.id, []]));
      for (const item of items ?? []) byRequirement.get(item.requirement_id)?.push(item);
      return requirements.map((requirement) => ({
        ...requirement,
        items: byRequirement.get(requirement.id) ?? []
      }));
    },

    async findRequirementsByProgramId(programId) {
      const rows = await this.findRequirementsByProgramIds([programId]);
      return rows;
    }
  };
}
