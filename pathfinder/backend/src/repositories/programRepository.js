const PROGRAM_COLUMNS = "id,name,type,degree,total_units_required,min_gpa,notes";

export function createProgramRepository(supabase) {
  if (!supabase) {
    return {
      async findAllPrograms() { return []; },
      async findProgramById() { return null; }
    };
  }

  return {
    async findAllPrograms(type = "") {
      let query = supabase.from("programs")
        .select(PROGRAM_COLUMNS)
        .order("name", { ascending: true })
        .limit(500);
      if (type) query = query.eq("type", type);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },

    async findProgramById(id) {
      const numericId = Number(id);
      if (!Number.isSafeInteger(numericId) || numericId < 1) return null;
      const { data, error } = await supabase.from("programs")
        .select(PROGRAM_COLUMNS)
        .eq("id", numericId)
        .maybeSingle();
      if (error) throw error;
      return data ?? null;
    }
  };
}
