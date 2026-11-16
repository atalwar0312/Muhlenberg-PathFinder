import { test } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { createApp } from "../src/app.js";
import { courseMatchesRequirementItem } from "../src/services/requirementMatcher.js";

async function withServer(client, run, repository) {
  const server = createApp(client, repository).listen(0, "127.0.0.1");
  await once(server, "listening");
  try { await run(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise((resolve) => server.close(resolve)); }
}

function fakeClient(result, calls = []) {
  const builder = {};
  for (const method of ["from", "select", "order", "limit", "ilike", "eq", "in"]) {
    builder[method] = (...args) => { calls.push([method, ...args]); return builder; };
  }
  builder.maybeSingle = () => Promise.resolve(result);
  builder.then = (resolve, reject) => Promise.resolve(result).then(resolve, reject);
  return builder;
}

const demoRepository = {
  async findStudentById(id) {
    return id === "0000000000" ? {
      id, name: "Demo Student", classYear: "Junior", majors: ["Computer Science"], minors: ["Data Science"],
      schoolId: id, creditsEarned: 78, creditsRequired: 128, majorProgress: 72, minorProgress: 58,
      completedCourses: ["CSC 150", "CSC 220"], inProgressCourses: ["CSC 310"], garCategories: []
    } : null;
  },
  async findProgramsByNames() { return [{ name: "Computer Science", type: "major", requiredCourses: ["CSC 150", "CSC 220"] }]; },
  async findAllPrograms() { return []; },
  async getStudent(id) { return id === "0000000000" ? { student_id: id, credits_completed: 78, credits_required: 128, majors: "Computer Science" } : null; }
};

test("health endpoint reports catalog sources and leaves student data demo-only", async () => {
  await withServer(fakeClient({ data: [], error: null }), async (base) => {
    const body = await (await fetch(`${base}/api/health`)).json();
    assert.equal(body.status, "ok");
    assert.equal(body.course_source, "supabase");
    assert.equal(body.program_source, "supabase");
    assert.equal(body.student_source, "sample");
  });
});

test("program list queries Supabase and supports major/minor filter", async () => {
  const calls = [];
  const rows = [{ id: 4, name: "Computer Science", type: "major" }];
  await withServer(fakeClient({ data: rows, error: null }, calls), async (base) => {
    const response = await fetch(`${base}/api/programs?type=major`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { data_source: "supabase", data: rows });
    assert.ok(calls.some((call) => call[0] === "from" && call[1] === "programs"));
    assert.ok(calls.some((call) => call[0] === "eq" && call[1] === "type" && call[2] === "major"));
  });
});

test("program detail retrieves a numeric Supabase program id", async () => {
  const calls = [];
  const program = { id: 4, name: "Computer Science", type: "major" };
  await withServer(fakeClient({ data: program, error: null }, calls), async (base) => {
    const response = await fetch(`${base}/api/programs/4`);
    assert.equal(response.status, 200);
    assert.deepEqual((await response.json()).data, program);
    assert.ok(calls.some((call) => call[0] === "eq" && call[1] === "id" && call[2] === 4));
  });
});

test("program requirements combine requirements and their requirement items", async () => {
  let queryNumber = 0;
  const calls = [];
  const supabase = {
    from(table) {
      const result = table === "programs"
        ? { data: { id: 4, name: "Computer Science", type: "major" }, error: null }
        : table === "requirements"
          ? { data: [{ id: 12, program_id: 4, name: "Core", courses_required: 2 }], error: null }
          : { data: [{ id: 99, requirement_id: 12, prefix: "CSC", number: "150" }], error: null };
      const builder = {};
      for (const method of ["select", "eq", "order", "limit", "in"]) {
        builder[method] = (...args) => { calls.push([table, method, ...args]); return builder; };
      }
      builder.maybeSingle = () => Promise.resolve(result);
      builder.then = (resolve, reject) => { queryNumber += 1; return Promise.resolve(result).then(resolve, reject); };
      return builder;
    }
  };
  await withServer(supabase, async (base) => {
    const response = await fetch(`${base}/api/programs/4/requirements`);
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.data.program.id, 4);
    assert.equal(body.data.requirements[0].items[0].prefix, "CSC");
    assert.ok(calls.some((call) => call[0] === "requirements_items" && call[1] === "in"));
  });
});

test("invalid program type returns 400", async () => {
  await withServer(fakeClient({ data: [], error: null }), async (base) => {
    assert.equal((await fetch(`${base}/api/programs?type=student`)).status, 400);
  });
});

test("Supabase course list uses updated catalog columns and supports name search", async () => {
  const calls = [];
  const rows = [{ id: 1, prefix: "CSC", number: "150", name: "Intro" }];
  await withServer(fakeClient({ data: rows, error: null }, calls), async (base) => {
    const response = await fetch(`${base}/api/courses?q=intro`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { data_source: "supabase", data: rows });
    assert.ok(calls.some((call) => call[0] === "from" && call[1] === "courses"));
    assert.ok(calls.some((call) => call[0] === "ilike" && call[1] === "name" && call[2] === "%intro%"));
  });
});

test("course detail now retrieves a course from Supabase", async () => {
  const course = { id: 21, prefix: "CSC", number: "150", name: "Intro" };
  await withServer(fakeClient({ data: course, error: null }), async (base) => {
    const response = await fetch(`${base}/api/courses/21`);
    assert.equal(response.status, 200);
    assert.deepEqual((await response.json()).data, course);
    assert.equal((await fetch(`${base}/api/courses/not-a-number`)).status, 404);
  });
});

test("existing demo student routes remain available without exposing Supabase student tables", async () => {
  await withServer(null, async (base) => {
    const response = await fetch(`${base}/api/students/0000000000/profile`);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).name, "Demo Student");
  }, demoRepository);
});

test("private paths and unknown routes remain unavailable", async () => {
  await withServer(null, async (base) => {
    for (const path of ["/.env", "/src/supabase.js", "/package.json", "/api/unknown"]) {
      assert.equal((await fetch(`${base}${path}`)).status, 404);
    }
  });
});


test("requirement matcher supports exact courses and bounded course-number ranges", () => {
  assert.equal(courseMatchesRequirementItem(
    { prefix: "CSC", number: "150" },
    { prefix: "CSC", number: "150", min_number: null, max_number: null }
  ), true);
  assert.equal(courseMatchesRequirementItem(
    { prefix: "CSC", number: "220" },
    { prefix: "CSC", number: null, min_number: 200, max_number: 299 }
  ), true);
  assert.equal(courseMatchesRequirementItem(
    { prefix: "MAT", number: "220" },
    { prefix: "CSC", number: null, min_number: 200, max_number: 299 }
  ), false);
  assert.equal(courseMatchesRequirementItem(
    { prefix: "CSC", number: "310" },
    { prefix: "CSC", number: null, min_number: 200, max_number: 299 }
  ), false);
});
