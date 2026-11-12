

(function () {
  // Student details for the planner.
  const student = {
    name: "Andrew Jarrah",
    student_id: "0000000000",
    class_year: "Junior",
    graduation_term: "Spring 2028",
  };

  // Top summary fields.
  const identityFields = [
    ["STUDENT", student.name],
    ["ID NUMBER", student.student_id],
    ["CLASS YEAR", student.class_year],
    ["PROJECTED GRADUATION", student.graduation_term],
  ];

  const pageContent = {
    major: {
      title: "Major Progress",
      subtitle: "DECLARED MAJOR · DEGREE REQUIREMENTS",
      label: "Major",
    },
    minor: {
      title: "Minor Progress",
      subtitle: "DECLARED MINORS · DEGREE REQUIREMENTS",
      label: "Minor",
    },
  };
  const currentPage = window.location.pathname.split("/").pop().replace(/\.html$/, "") || "index";
  const isCoursesPage = currentPage === "courses";
  const isHistoryPage = currentPage === "history";
  const isOpportunitiesPage = currentPage === "opportunities";
  const COURSE_HISTORY_KEY = "pathfinder-course-history";
  const COURSE_CATALOG_URL = "../../../data/sample/2026-27%20Catalog%20course%20export%20-%20Sheet1.csv";
  const LETTER_GRADE_POINTS = {
    "A+": 4, A: 4, "A-": 3.7, "B+": 3.3, B: 3, "B-": 2.7,
    "C+": 2.3, C: 2, "C-": 1.7, "D+": 1.3, D: 1, "D-": 0.7, F: 0,
  };
  const programDefinitions = [
    {
      name: "Computer Science",
      type: "major",
      requirements: [
        { label: "Computer Science I", matches: (course) => course.subject === "CSI" && course.name.includes("Computer Science I"), slots: 1 },
        { label: "CSI 111 — Computer Science II", codes: ["CSI 111"], slots: 1 },
        { label: "CSI 210 — Software Engineering", codes: ["CSI 210"], slots: 1 },
        { label: "CSI 220 — Data Structures & Algorithms", codes: ["CSI 220"], slots: 1 },
        { label: "CSI 240 — Computer Organization", codes: ["CSI 240"], slots: 1 },
        { label: "CSI 370 — CUE: Computer Science Seminar", codes: ["CSI 370"], slots: 1 },
        { label: "STA 119 or MTH 226", codes: ["STA 119", "MTH 226"], slots: 1 },
        { label: "Three additional CSI electives numbered 300 or higher", matches: (course) => course.subject === "CSI" && Number.parseInt(course.number, 10) >= 300 && course.number !== "370", slots: 3 },
      ],
    },
    {
      name: "Computer Science",
      type: "minor",
      requirements: [
        { label: "Two CSI electives numbered 300 or higher", matches: (course) => course.subject === "CSI" && Number.parseInt(course.number, 10) >= 300, slots: 2 },
      ],
    },
    {
      name: "Mathematics",
      type: "major",
      requirements: [
        { label: "STA 119 — Statistical Analysis", codes: ["STA 119"], slots: 1 },
        { label: "MTH 121 — Calculus I", codes: ["MTH 121"], slots: 1 },
        { label: "MTH 122 — Calculus II", codes: ["MTH 122"], slots: 1 },
        { label: "MTH 223 — Calculus III", codes: ["MTH 223"], slots: 1 },
        { label: "MTH 226 — Linear Algebra", codes: ["MTH 226"], slots: 1 },
        { label: "MTH 240 — Transition to Abstract Mathematics", codes: ["MTH 240"], slots: 1 },
        { label: "Any 100-level Computer Science course", matches: (course) => course.subject === "CSI" && Number.parseInt(course.number, 10) >= 100 && Number.parseInt(course.number, 10) < 200, slots: 1 },
        { label: "Mathematics CUE: MTH 975 or MTH 353", codes: ["MTH 975", "MTH 353"], slots: 1 },
        {
          label: "Four MTH courses numbered 300 or higher, including MTH 326 or MTH 337",
          matches: (course) => course.subject === "MTH" && Number.parseInt(course.number, 10) >= 300,
          slots: 4,
          requiresOneOf: ["MTH 326", "MTH 337"],
        },
        {
          label: "One additional MTH or STA course numbered 200 or higher",
          matches: (course) => ["MTH", "STA"].includes(course.subject) && Number.parseInt(course.number, 10) >= 200,
          slots: 1,
        },
      ],
    },
    {
      name: "Mathematics",
      type: "minor",
      requirements: [
        {
          label: "Three courses: MTH 120, any MTH 200+, or any 100-level CSI (at most one 100-level course)",
          matches: (course) =>
            course.code === "MTH 120" ||
            (course.subject === "MTH" && Number.parseInt(course.number, 10) >= 200) ||
            (course.subject === "CSI" && Number.parseInt(course.number, 10) >= 100 && Number.parseInt(course.number, 10) < 200),
          slots: 3,
          maxOneHundredLevel: true,
        },
      ],
    },
  ];

  const PROGRAM_SELECTION_KEY = "pathfinder-program-selection";
  const initialProgramSelection = { major: "Computer Science", minors: ["Data Science"] };
  const majorOptions = [...new Set(programDefinitions.filter((program) => program.type === "major").map((program) => program.name))];
  const minorOptions = [...new Set([
    ...programDefinitions.filter((program) => program.type === "minor").map((program) => program.name),
    "Data Science",
  ])];
  const isProgramsPage = currentPage === "programs";

  function getProgramSelection() {
    const stored = localStorage.getItem(PROGRAM_SELECTION_KEY);
    if (!stored) return { major: initialProgramSelection.major, minors: [...initialProgramSelection.minors] };

    const selection = JSON.parse(stored);
    if (!selection || !majorOptions.includes(selection.major) || !Array.isArray(selection.minors) ||
      selection.minors.length > 2 || selection.minors.some((minor) => !minorOptions.includes(minor) || minor === selection.major) ||
      new Set(selection.minors).size !== selection.minors.length) {
      throw new Error("Saved major and minor selections are invalid.");
    }
    return selection;
  }

  function saveProgramSelection(selection) {
    localStorage.setItem(PROGRAM_SELECTION_KEY, JSON.stringify(selection));
  }

  function getCourseHistory() {
    const stored = localStorage.getItem(COURSE_HISTORY_KEY);
    if (!stored) return [];
    const history = JSON.parse(stored);
    if (!Array.isArray(history)) throw new Error("Saved course history is not a valid list.");
    return history;
  }

  function saveCourseHistory(history) {
    localStorage.setItem(COURSE_HISTORY_KEY, JSON.stringify(history));
  }

  function calculateGpa(history) {
    const eligible = history.filter((course) => Object.hasOwn(LETTER_GRADE_POINTS, course.grade) && Number.isFinite(course.units) && course.units > 0);
    const units = eligible.reduce((total, course) => total + course.units, 0);
    if (!units) return null;
    const qualityPoints = eligible.reduce((total, course) => total + LETTER_GRADE_POINTS[course.grade] * course.units, 0);
    return (qualityPoints / units).toFixed(2);
  }

  function evaluateProgram(program, history, catalog = []) {
    const courseByCode = new Map(history.map((course) => [course.code, course]));
    const usedCodes = new Set();
    const requirements = program.requirements.map((requirement) => {
      let candidates = history.filter((course) => {
        const matchesCode = requirement.codes ? requirement.codes.includes(course.code) : requirement.matches(course);
        return matchesCode && !usedCodes.has(course.code);
      });
      const hasOneHundredLevelCourse = candidates.some((course) => Number.parseInt(course.number, 10) < 200);
      if (requirement.requiresOneOf) {
        candidates.sort((left, right) =>
          Number(requirement.requiresOneOf.includes(right.code)) - Number(requirement.requiresOneOf.includes(left.code))
        );
      }
      if (requirement.maxOneHundredLevel) {
        const oneHundredLevel = candidates.filter((course) => Number.parseInt(course.number, 10) < 200);
        const higherLevel = candidates.filter((course) => Number.parseInt(course.number, 10) >= 200);
        candidates = [...higherLevel, ...oneHundredLevel.slice(0, 1)];
      }

      const requiredAlternativeComplete = !requirement.requiresOneOf ||
        requirement.requiresOneOf.some((code) => courseByCode.has(code));
      const complete = candidates.slice(0, requirement.slots);
      let completedSlots = complete.length;
      if (requirement.requiresOneOf && !requiredAlternativeComplete) {
        completedSlots = Math.min(completedSlots, requirement.slots - 1);
      }
      complete.slice(0, completedSlots).forEach((course) => usedCodes.add(course.code));
      let availableCourses = catalog.filter((course) => {
        const matchesCode = requirement.codes ? requirement.codes.includes(course.code) : requirement.matches(course);
        const isOneHundredLevel = Number.parseInt(course.number, 10) < 200;
        return matchesCode && !courseByCode.has(course.code) && !usedCodes.has(course.code) &&
          (!requirement.maxOneHundredLevel || !hasOneHundredLevelCourse || !isOneHundredLevel);
      });
      return {
        label: requirement.label,
        slots: requirement.slots,
        completed: completedSlots,
        remaining: requirement.slots - completedSlots,
        satisfiedCourses: complete.slice(0, completedSlots),
        availableCourses,
      };
    });

    return {
      name: program.name,
      type: program.type,
      requirements,
      completed: requirements.reduce((total, requirement) => total + requirement.completed, 0),
      total: requirements.reduce((total, requirement) => total + requirement.slots, 0),
      percent: requirements.length
        ? Math.round(1000 * requirements.reduce((total, requirement) => total + requirement.completed, 0) /
          requirements.reduce((total, requirement) => total + requirement.slots, 0)) / 10
        : null,
    };
  }

  // Shared color palette.
  const COLORS = {
    BG: "#f7f7f7",
    PANEL: "#ffffff",
    INK: "#242424",
    MUTED: "#6d6d6d",
    LINE: "#dedede",
    RED: "#a6192e",
    DARK_RED: "#7f1526",
    GREEN: "#297a55",
  };

  // Page styling.
  const style = document.createElement("style");
  style.textContent = `
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      min-height: 100%;
      background: ${COLORS.BG};
      font-family: "Segoe UI", sans-serif;
      color: ${COLORS.INK};
    }
    body {
      display: flex;
      justify-content: stretch;
      align-items: stretch;
      padding: 0;
      min-height: 100vh;
    }
    .pathfinder-shell {
      width: 100vw;
      height: 100vh;
      display: grid;
      grid-template-columns: 235px 1fr;
      background: ${COLORS.BG};
    }
    .sidebar {
      display: flex;
      height: 100vh;
      flex-direction: column;
      background: ${COLORS.RED};
      padding: 0;
      color: white;
      min-height: 100vh;
      position: relative;
    }
    .sidebar-title {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.02em;
      padding: 28px 28px 0;
      line-height: 1.3;
    }
    .sidebar-subtitle {
      font-size: 9px;
      color: #f6dfe3;
      padding: 6px 28px 0;
      line-height: 1.4;
    }
    .sidebar-divider {
      height: 1px;
      background: #c75d6d;
      margin: 26px 22px;
    }
    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0;
      padding: 0;
    }
    .sidebar-button {
      width: 100%;
      border: none;
      background: ${COLORS.RED};
      color: white;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-align: left;
      padding: 11px 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      line-height: 1.25;
      border-top: 1px solid rgba(255,255,255,0.08);
    }
    .sidebar-button:first-child {
      border-top: none;
    }
    .sidebar-button:hover {
      background: ${COLORS.DARK_RED};
    }
    .sidebar-button--active {
      background: ${COLORS.DARK_RED};
    }
    .sidebar-button--active:hover {
      background: ${COLORS.DARK_RED};
    }
    .sidebar-signout {
      width: calc(100% - 32px);
      margin: auto 16px 18px;
      border: 1px solid rgba(255, 255, 255, 0.45);
      border-radius: 6px;
    }
    /* Progress parent item. */
    .sidebar-button--parent {
      border-top: none;
    }
    /* Nested items under Progress. */
    .sidebar-button--child {
      padding-left: 30px;
      margin-left: 12px;
      width: calc(100% - 12px);
      border-top: none;
      background: ${COLORS.RED};
    }
    /* Submenu for Progress. */
    .sidebar-submenu {
      display: none;
      flex-direction: column;
      gap: 0;
      padding-bottom: 4px;
    }
    .sidebar-submenu.is-open {
      display: flex;
    }
    .sidebar-section-label {
      color: #f2c4cb;
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 0.08em;
      padding: 0 28px;
      margin-top: 6px;
    }
    .student-name {
      font-size: 10px;
      font-weight: 700;
      color: white;
      padding: 9px 28px 0;
      line-height: 1.35;
    }
    .student-id {
      font-size: 9px;
      color: #f6dfe3;
      padding: 0 28px;
      line-height: 1.4;
    }
    /* Main content area. */
    .main-panel {
      background: ${COLORS.BG};
      padding: 30px 38px 0 38px;
      min-height: 100vh;
      overflow: auto;
    }
    /* Page header. */
    .header {
      margin-bottom: 18px;
    }
    .header-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0;
      line-height: 1.2;
      color: ${COLORS.INK};
    }
    .header-subtitle {
      margin-top: 4px;
      font-size: 10px;
      color: ${COLORS.MUTED};
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 10px;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(166, 25, 46, 0.08);
      border: 1px solid rgba(166, 25, 46, 0.2);
      color: ${COLORS.DARK_RED};
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: ${COLORS.GREEN};
      box-shadow: 0 0 0 2px rgba(41, 122, 85, 0.14);
    }
    /* Student info bar. */
    .identity-bar {
      background: ${COLORS.PANEL};
      border: 1px solid ${COLORS.LINE};
      padding: 14px 18px;
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 18px;
    }
    .identity-cell {
      min-width: 0;
    }
    .identity-label {
      font-size: 7px;
      color: ${COLORS.MUTED};
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 5px;
      display: block;
    }
    .identity-value {
      font-size: 10px;
      font-weight: 700;
      color: ${COLORS.INK};
      line-height: 1.4;
      white-space: normal;
      word-break: break-word;
      max-width: 135px;
    }
    /* Main progress card. */
    .content-card {
      background: ${COLORS.PANEL};
      border: 1px solid ${COLORS.LINE};
      padding: 15px 18px;
      margin-bottom: 10px;
      min-height: 200px;
    }
    .panel-title {
      font-size: 13px;
      font-weight: 700;
      margin: 0 0 10px;
      letter-spacing: 0.01em;
      color: ${COLORS.INK};
      text-transform: uppercase;
    }
    /* Progress rings row. */
    .progress-charts {
      display: flex;
      gap: 5px;
      margin-bottom: 18px;
    }
    /* One progress ring. */
    .progress-chart {
      flex: 1 1 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      min-width: 0;
    }
    /* Circular completion ring. */
    .progress-ring {
      width: 92px;
      height: 92px;
      border-radius: 50%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #eeeeee;
      overflow: hidden;
    }
    .progress-ring::before {
      content: "";
      position: absolute;
      inset: 10px;
      background: ${COLORS.PANEL};
      border-radius: 50%;
      z-index: 0;
    }
    .progress-ring-value {
      position: relative;
      z-index: 1;
      font-size: 11px;
      font-weight: 700;
      color: ${COLORS.INK};
    }
    .progress-chart-label {
      margin-top: 4px;
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 0.04em;
      color: ${COLORS.INK};
      text-transform: uppercase;
    }
    /* Upcoming courses. */
    .next-courses {
      margin-top: 6px;
    }
    .next-courses-label {
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: ${COLORS.MUTED};
      margin-bottom: 7px;
      text-transform: uppercase;
      display: block;
    }
    .course-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 10px;
      font-weight: 700;
      color: ${COLORS.INK};
      margin: 5px 0;
      line-height: 1.45;
      letter-spacing: 0.08em;
    }
    .course-arrow {
      font-size: 12px;
      color: ${COLORS.INK};
      line-height: 1;
      display: inline-block;
      transform: translateY(-1px);
    }
    .detail-intro {
      max-width: 720px;
      margin: 0 0 22px;
      color: ${COLORS.MUTED};
      font-size: 14px;
      line-height: 1.6;
    }
    .detail-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.6fr) minmax(230px, 0.9fr);
      gap: 16px;
      align-items: stretch;
    }
    .detail-card {
      background: ${COLORS.PANEL};
      border: 1px solid ${COLORS.LINE};
      border-radius: 10px;
      padding: 24px;
      box-shadow: 0 4px 16px rgba(36, 36, 36, 0.035);
    }
    .detail-card--primary {
      border-top: 4px solid ${COLORS.RED};
    }
    .detail-eyebrow {
      margin: 0 0 8px;
      color: ${COLORS.MUTED};
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .detail-program {
      margin: 0;
      font-size: 22px;
      line-height: 1.25;
    }
    .detail-copy {
      margin: 8px 0 22px;
      color: ${COLORS.MUTED};
      font-size: 13px;
      line-height: 1.55;
    }
    .course-list {
      overflow: hidden;
      border: 1px solid ${COLORS.LINE};
      border-radius: 10px;
      background: ${COLORS.PANEL};
    }
    .course-list-summary {
      margin: 0;
      padding: 16px 20px;
      color: ${COLORS.MUTED};
      font-size: 13px;
    }
    .planner-card {
      margin-bottom: 18px;
      padding: 18px;
      border: 1px solid ${COLORS.LINE};
      border-radius: 10px;
      background: ${COLORS.PANEL};
    }
    .planner-card-title {
      margin: 0 0 12px;
      font-size: 16px;
    }
    .course-entry-form {
      display: grid;
      grid-template-columns: minmax(200px, 2fr) minmax(110px, .7fr) minmax(100px, .6fr) auto;
      align-items: end;
      gap: 12px;
    }
    .program-selection-form {
      display: grid;
      gap: 18px;
      max-width: 620px;
    }
    .minor-selection-list {
      display: grid;
      gap: 10px;
    }
    .minor-selection-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: end;
      gap: 10px;
    }
    .planner-field label {
      display: block;
      margin-bottom: 5px;
      color: ${COLORS.MUTED};
      font-size: 12px;
      font-weight: 600;
    }
    .planner-field input,
    .planner-field select {
      width: 100%;
      min-height: 40px;
      padding: 8px 10px;
      border: 1px solid ${COLORS.LINE};
      border-radius: 6px;
      background: #fff;
      color: ${COLORS.INK};
    }
    .planner-action {
      min-height: 40px;
      padding: 8px 14px;
      border: 0;
      border-radius: 6px;
      background: ${COLORS.RED};
      color: #fff;
      font-weight: 700;
      cursor: pointer;
    }
    .planner-action:hover { background: ${COLORS.DARK_RED}; }
    .planner-action--secondary {
      border: 1px solid ${COLORS.LINE};
      background: #fff;
      color: ${COLORS.INK};
    }
    .planner-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .planner-error,
    .planner-note {
      margin: 10px 0 0;
      color: ${COLORS.MUTED};
      font-size: 12px;
      line-height: 1.5;
    }
    .planner-error { color: #a4001d; }
    .requirement-list,
    .suggestion-list {
      display: grid;
      gap: 12px;
    }
    .requirement-item,
    .suggestion-item {
      padding: 15px;
      border: 1px solid ${COLORS.LINE};
      border-radius: 8px;
      background: ${COLORS.PANEL};
    }
    .requirement-item h3,
    .suggestion-item h3 {
      margin: 0;
      font-size: 14px;
    }
    .requirement-item p,
    .suggestion-item p {
      margin: 6px 0 0;
      color: ${COLORS.MUTED};
      font-size: 12px;
      line-height: 1.5;
    }
    .course-options {
      max-height: 180px;
      margin: 8px 0 0;
      padding: 8px 10px 8px 28px;
      overflow: auto;
      border-radius: 6px;
      background: #f7f7f7;
      color: ${COLORS.MUTED};
      font-size: 12px;
      line-height: 1.6;
    }
    .suggestion-item {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 14px;
    }
    .suggestion-percent {
      color: ${COLORS.RED};
      font-size: 20px;
      font-weight: 700;
      white-space: nowrap;
    }
    .table-actions {
      display: flex;
      gap: 8px;
    }
    .table-action {
      border: 0;
      padding: 4px 0;
      background: transparent;
      color: ${COLORS.DARK_RED};
      font-size: 12px;
      text-decoration: underline;
      cursor: pointer;
    }
    .course-table-wrap {
      max-height: calc(100vh - 190px);
      overflow: auto;
    }
    .course-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .course-table th,
    .course-table td {
      padding: 12px 20px;
      border-top: 1px solid ${COLORS.LINE};
      font-size: 13px;
      line-height: 1.4;
    }
    .course-table th {
      position: sticky;
      top: 0;
      z-index: 1;
      background: #f4f4f5;
      color: ${COLORS.MUTED};
      font-size: 10px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .course-table td:first-child,
    .course-table td:nth-child(2) {
      white-space: nowrap;
      font-weight: 600;
    }
    .detail-progress-heading {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: baseline;
      font-size: 12px;
      font-weight: 700;
    }
    .detail-progress-heading span:last-child {
      color: ${COLORS.DARK_RED};
    }
    .detail-track {
      width: 100%;
      height: 9px;
      margin-top: 10px;
      overflow: hidden;
      border-radius: 999px;
      background: #f0e8e9;
    }
    .detail-track-fill {
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, ${COLORS.RED}, ${COLORS.DARK_RED});
    }
    .detail-metrics {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-top: 24px;
    }
    .detail-metric {
      padding: 14px;
      border-radius: 8px;
      background: #faf7f7;
    }
    .detail-metric-value {
      display: block;
      font-size: 18px;
      font-weight: 700;
      line-height: 1.2;
    }
    .detail-metric-label {
      display: block;
      margin-top: 5px;
      color: ${COLORS.MUTED};
      font-size: 10px;
      font-weight: 600;
      line-height: 1.4;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .detail-side-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: ${COLORS.DARK_RED};
      border: 0;
      color: white;
    }
    .detail-side-card .detail-eyebrow,
    .detail-side-card .detail-copy {
      color: #f5dfe2;
    }
    .detail-side-number {
      margin: 12px 0 0;
      font-size: 42px;
      font-weight: 700;
      letter-spacing: -0.04em;
      line-height: 1;
    }
    .detail-side-caption {
      margin: 8px 0 0;
      color: #f5dfe2;
      font-size: 12px;
    }
    .dashboard-links {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-top: 16px;
    }
    .dashboard-link {
      position: relative;
      display: block;
      padding: 17px 18px;
      text-align: left;
      border: 1px solid ${COLORS.LINE};
      border-radius: 9px;
      background: ${COLORS.PANEL};
      color: ${COLORS.INK};
      cursor: pointer;
      transition: border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease;
    }
    .dashboard-link:hover {
      border-color: ${COLORS.RED};
      box-shadow: 0 5px 16px rgba(36, 36, 36, 0.07);
      transform: translateY(-2px);
    }
    .dashboard-link-title {
      display: block;
      font-size: 12px;
      font-weight: 700;
    }
    .dashboard-link-copy {
      display: block;
      margin-top: 5px;
      color: ${COLORS.MUTED};
      font-size: 11px;
      line-height: 1.45;
    }
    .empty-courses {
      padding: 14px 16px;
      border: 1px dashed ${COLORS.LINE};
      border-radius: 7px;
      background: #fcfbfb;
      color: ${COLORS.MUTED};
      font-size: 12px;
      line-height: 1.5;
    }
    @media (max-width: 900px) {
      .pathfinder-shell {
        grid-template-columns: 200px minmax(0, 1fr);
      }
      .main-panel {
        padding: 26px 24px;
      }
      .identity-bar {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      .detail-grid {
        grid-template-columns: 1fr;
      }
      .detail-side-card {
        min-height: 190px;
      }
    }
    @media (max-width: 620px) {
      body {
        display: block;
      }
      .pathfinder-shell {
        width: 100%;
        height: auto;
        min-height: 100vh;
        display: block;
      }
      .sidebar {
        height: auto;
        min-height: 0;
        padding: 14px 16px;
      }
      .sidebar-title {
        padding: 0;
        font-size: 17px;
      }
      .sidebar-subtitle,
      .sidebar-divider,
      .sidebar-section-label,
      .student-name,
      .student-id {
        display: none;
      }
      .sidebar-nav {
        margin-top: 12px;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 5px;
      }
      .sidebar-button,
      .sidebar-button--child {
        width: auto;
        margin: 0;
        justify-content: center;
        padding: 9px 4px;
        border: 0;
        border-radius: 6px;
        font-size: 9px;
      }
      .course-table th,
      .course-table td {
        padding: 10px 12px;
      }
      .course-table-wrap {
        max-height: calc(100vh - 230px);
      }
      .course-entry-form {
        grid-template-columns: 1fr 1fr;
      }
      .program-selection-form {
        max-width: none;
      }
      .course-entry-form .planner-field:first-child {
        grid-column: 1 / -1;
      }
      .course-entry-form .planner-actions {
        grid-column: 1 / -1;
      }
      .suggestion-item {
        flex-direction: column;
      }
      .sidebar-signout {
        width: 100%;
        margin: 10px 0 0;
      }
      .sidebar-submenu {
        display: contents;
      }
      .main-panel {
        min-height: calc(100vh - 98px);
        padding: 24px 16px;
      }
      .header-title {
        font-size: 26px;
      }
      .identity-bar {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .progress-charts {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px 8px;
      }
      .detail-card {
        padding: 19px;
      }
      .detail-metrics {
        grid-template-columns: 1fr;
      }
      .dashboard-links {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);

  // Create an element quickly.
  function createElement(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined && text !== null) el.textContent = text;
    return el;
  }

  // Create a text element.
  const textNode = (tag, className, text) => {
    const el = createElement(tag, className);
    if (text !== undefined && text !== null) el.textContent = text;
    return el;
  };

  function goToPage(pageName) {
    window.location.href = `${pageName}.html`;
  }

  function buildSidebarButton({ label, page, active = false, child = false, onClick }) {
    const button = textNode(
      "button",
      `sidebar-button${child ? " sidebar-button--child" : " sidebar-button--parent"}${active ? " sidebar-button--active" : ""}`,
      label
    );
    button.type = "button";
    if (onClick) button.addEventListener("click", onClick);
    return button;
  }

  function buildPageHeader(title, subtitle) {
    const header = createElement("div", "header");
    header.append(
      textNode("h1", "header-title", title),
      textNode("div", "header-subtitle", subtitle)
    );
    return header;
  }

  // Circular progress ring.
  function createProgressRing(label, value, color) {
    const chart = createElement("div", "progress-chart");
    const ring = createElement("div", "progress-ring");
    ring.style.background = `conic-gradient(from -90deg, ${color} 0 ${value}%, #eeeeee ${value}% 100%)`;

    ring.appendChild(textNode("div", "progress-ring-value", `${value}%`));
    chart.append(ring, textNode("div", "progress-chart-label", label));
    return chart;
  }

  // Build the identity bar.
  function buildIdentityBar(history) {
    const identityBar = createElement("div", "identity-bar");
    const selection = getProgramSelection();
    const fields = [
      ...identityFields.slice(0, 3),
      ["DECLARED MAJOR", selection.major],
      ["MINORS", selection.minors.join(", ") || "None"],
      ...identityFields.slice(3),
      ["CUMULATIVE GPA", calculateGpa(history) || "Unavailable"],
    ];
    fields.forEach(([label, value]) => {
      const cell = createElement("div", "identity-cell");
      cell.append(textNode("span", "identity-label", label), textNode("div", "identity-value", value));
      identityBar.appendChild(cell);
    });
    return identityBar;
  }

  // Build the course-planning empty state.
  function buildNextCourses() {
    const nextCourses = createElement("div", "next-courses");
    nextCourses.appendChild(textNode("span", "next-courses-label", "Next Courses"));
    nextCourses.appendChild(textNode("div", "empty-courses", "Add completed courses to view requirement progress and program suggestions."));
    const button = textNode("button", "table-action", "Open Courses");
    button.type = "button";
    button.addEventListener("click", () => goToPage("courses"));
    nextCourses.appendChild(button);
    return nextCourses;
  }

  function buildMetric(value, label) {
    const metric = createElement("div", "detail-metric");
    metric.append(textNode("span", "detail-metric-value", value), textNode("span", "detail-metric-label", label));
    return metric;
  }

  function buildProgramProgressCard(label, programName, history, catalog, catalogError) {
    const program = programDefinitions.find((definition) => definition.name === programName && definition.type === label.toLowerCase());
    const content = createElement("section", "planner-card");
    content.appendChild(textNode("h2", "planner-card-title", `${label}: ${programName}`));

    if (!program) {
      content.appendChild(textNode("p", "planner-note", "Progress is unavailable because this program's requirement data is not included in the current catalog files."));
      return content;
    }

    const result = evaluateProgram(program, history, catalog);
    const progress = result.percent;
    const progressHeading = createElement("div", "detail-progress-heading");
    progressHeading.append(
      textNode("span", null, `${result.completed} of ${result.total} requirements completed`),
      textNode("span", null, `${progress}%`)
    );
    const track = createElement("div", "detail-track");
    track.setAttribute("role", "progressbar");
    track.setAttribute("aria-label", `${label} requirements completed`);
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", "100");
    track.setAttribute("aria-valuenow", String(progress));
    const fill = createElement("div", "detail-track-fill");
    fill.style.width = `${progress}%`;
    track.appendChild(fill);
    const metrics = createElement("div", "detail-metrics");
    metrics.append(
      buildMetric(`${progress}%`, "Completed"),
      buildMetric(String(result.total - result.completed), "Requirement slots remaining"),
      buildMetric(calculateGpa(history) || "Unavailable", "Cumulative GPA")
    );
    content.append(progressHeading, track, metrics);
    if (catalogError) content.appendChild(textNode("p", "planner-error", catalogError));

    const list = createElement("div", "requirement-list");
    result.requirements.forEach((requirement) => {
      const item = createElement("article", "requirement-item");
      item.appendChild(textNode("h3", null, requirement.label));
      item.appendChild(textNode("p", null, `${requirement.completed} of ${requirement.slots} complete${requirement.remaining ? ` · ${requirement.remaining} remaining` : ""}`));
      if (requirement.satisfiedCourses.length) {
        item.appendChild(textNode("p", null, `Counted: ${requirement.satisfiedCourses.map((course) => `${course.code} — ${course.name}`).join("; ")}`));
      }
      if (requirement.remaining && requirement.availableCourses.length) {
        item.appendChild(textNode("p", null, `Available courses (${requirement.availableCourses.length}):`));
        const options = createElement("ul", "course-options");
        requirement.availableCourses.forEach((course) => {
          options.appendChild(textNode("li", null, `${course.code} — ${course.name}`));
        });
        item.appendChild(options);
      }
      list.appendChild(item);
    });
    content.appendChild(list);
    return content;
  }

  async function buildProgramPage(page) {
    const selection = getProgramSelection();
    const selectedPrograms = page.label === "Major" ? [selection.major] : selection.minors;
    const intro = textNode("p", "detail-intro", `Track your ${page.label.toLowerCase()} requirements using courses saved in your demo course history.`);
    const cards = [];

    if (!selectedPrograms.length) {
      const emptyState = createElement("section", "planner-card");
      emptyState.appendChild(textNode("h2", "planner-card-title", "No minors selected"));
      emptyState.appendChild(textNode("p", "planner-note", "Add one or two minors in My Programs to track their progress here."));
      cards.push(emptyState);
    } else {
      let catalog = [];
      let catalogError = "";
      try {
        catalog = await loadCourseCatalog();
      } catch (error) {
        catalogError = "Course options could not be loaded.";
        console.error("Could not load catalog for requirement view:", error);
      }
      const history = getCourseHistory();
      selectedPrograms.forEach((programName) => {
        cards.push(buildProgramProgressCard(page.label, programName, history, catalog, catalogError));
      });
    }

    return [intro, ...cards];
  }

  function buildDashboardLinks() {
    const links = createElement("section", "dashboard-links");
    const selection = getProgramSelection();
    [
      ["programs", "My Programs", "Choose your major and up to two minors."],
      ["major", "Major requirements", `Explore your ${selection.major} progress.`],
      ["minor", "Minor requirements", selection.minors.length ? `See your ${selection.minors.join(" and ")} progress.` : "Add minors or continue without one."],
      ["courses", "Course history & catalog", "Add or update completed coursework."],
      ["opportunities", "Opportunity Finder", "Explore programs matching your courses."],
    ].forEach(([target, title, copy]) => {
      const button = createElement("button", "dashboard-link");
      button.type = "button";
      button.append(textNode("span", "dashboard-link-title", title), textNode("span", "dashboard-link-copy", copy));
      button.addEventListener("click", () => goToPage(target));
      links.appendChild(button);
    });
    return links;
  }

  function buildProgramSelectionPage() {
    const selection = getProgramSelection();
    const card = createElement("section", "planner-card");
    card.appendChild(textNode("h2", "planner-card-title", "Choose your academic programs"));
    card.appendChild(textNode("p", "planner-note", "Select one major and up to two minors. Your choices are saved in this browser and used for your dashboard and requirement progress."));

    const form = createElement("form", "program-selection-form");
    const majorField = createElement("div", "planner-field");
    const majorLabel = textNode("label", null, "Major");
    const majorSelect = createElement("select");
    majorSelect.required = true;
    majorSelect.setAttribute("aria-label", "Major");
    majorOptions.forEach((name) => majorSelect.appendChild(new Option(name, name)));
    majorSelect.value = selection.major;
    majorField.append(majorLabel, majorSelect);

    const minorGroup = createElement("div", "planner-field");
    minorGroup.appendChild(textNode("div", "identity-label", "MINORS (OPTIONAL · UP TO 2)"));
    const minorRows = createElement("div", "minor-selection-list");
    const minorValues = [...selection.minors];
    const addMinorButton = textNode("button", "planner-action planner-action--secondary", "Add a minor");
    addMinorButton.type = "button";

    const renderMinorRows = () => {
      minorRows.replaceChildren();
      minorValues.forEach((minor, index) => {
        const row = createElement("div", "minor-selection-row");
        const field = createElement("div", "planner-field");
        const label = textNode("label", null, `Minor ${index + 1}`);
        const select = createElement("select");
        select.setAttribute("aria-label", `Minor ${index + 1}`);
        select.appendChild(new Option("Select a minor", ""));
        minorOptions.forEach((name) => select.appendChild(new Option(name, name)));
        select.value = minor;
        select.addEventListener("change", () => {
          minorValues[index] = select.value;
          renderMinorRows();
        });
        field.append(label, select);

        const removeButton = textNode("button", "planner-action planner-action--secondary", "Remove");
        removeButton.type = "button";
        removeButton.setAttribute("aria-label", `Remove minor ${index + 1}`);
        removeButton.addEventListener("click", () => {
          minorValues.splice(index, 1);
          renderMinorRows();
        });

        row.append(field, removeButton);
        minorRows.appendChild(row);
      });
      addMinorButton.hidden = minorValues.length >= 2;
    };

    addMinorButton.addEventListener("click", () => {
      if (minorValues.length < 2) {
        minorValues.push("");
        renderMinorRows();
      }
    });

    renderMinorRows();
    minorGroup.append(minorRows, addMinorButton);

    const error = textNode("p", "planner-error");
    error.hidden = true;
    error.setAttribute("role", "alert");
    const actions = createElement("div", "planner-actions");
    const saveButton = textNode("button", "planner-action", "Save programs");
    saveButton.type = "submit";
    actions.appendChild(saveButton);
    form.append(majorField, minorGroup, error, actions);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const minors = minorValues.filter(Boolean);
      if (minors.length !== minorValues.length) {
        error.textContent = "Choose a minor or remove its empty selection.";
        error.hidden = false;
        return;
      }
      if (minors.includes(majorSelect.value)) {
        error.textContent = "Your major cannot also be selected as a minor.";
        error.hidden = false;
        return;
      }
      if (new Set(minors).size !== minors.length) {
        error.textContent = "Choose each minor only once.";
        error.hidden = false;
        return;
      }
      saveProgramSelection({ major: majorSelect.value, minors });
      goToPage("index");
    });
    card.appendChild(form);
    return card;
  }

  function parseCSV(text) {
    const rows = [];
    let row = [];
    let field = "";
    let quoted = false;

    for (let index = 0; index < text.length; index += 1) {
      const character = text[index];
      if (quoted) {
        if (character === '"' && text[index + 1] === '"') {
          field += '"';
          index += 1;
        } else if (character === '"') {
          quoted = false;
        } else {
          field += character;
        }
      } else if (character === '"') {
        quoted = true;
      } else if (character === ",") {
        row.push(field);
        field = "";
      } else if (character === "\n" || character === "\r") {
        if (character === "\r" && text[index + 1] === "\n") index += 1;
        row.push(field);
        if (row.some((value) => value.trim())) rows.push(row);
        row = [];
        field = "";
      } else {
        field += character;
      }
    }
    if (field || row.length) {
      row.push(field);
      if (row.some((value) => value.trim())) rows.push(row);
    }
    return rows;
  }

  async function loadCourseCatalog() {
    const response = await fetch(COURSE_CATALOG_URL);
    if (!response.ok) throw new Error(`Catalog request failed (${response.status}).`);

    const rows = parseCSV(await response.text());
    const headers = rows.shift();
    if (!headers) throw new Error("The course catalog is empty.");
    const normalizedHeaders = headers.map((header) => header.trim().toLowerCase());
    const subjectIndex = normalizedHeaders.indexOf("subject");
    const numberIndex = normalizedHeaders.indexOf("number");
    const nameIndex = normalizedHeaders.indexOf("name");
    const unitsIndex = normalizedHeaders.indexOf("course unit(s):");
    if (subjectIndex < 0 || numberIndex < 0 || nameIndex < 0) {
      throw new Error("The catalog is missing the Subject, Number, or Name column.");
    }

    const courses = rows.map((row) => {
      const subject = (row[subjectIndex] || "").trim();
      const number = (row[numberIndex] || "").trim();
      const name = (row[nameIndex] || "").trim();
      const unitValue = unitsIndex < 0 ? "" : (row[unitsIndex] || "").trim();
      const parsedUnits = Number.parseFloat(unitValue);
      return {
        subject,
        number,
        name,
        code: `${subject} ${number}`,
        units: Number.isFinite(parsedUnits) && parsedUnits > 0 ? parsedUnits : null,
      };
    }).filter((course) => course.subject && course.number && course.name);

    if (!courses.length) throw new Error("The catalog did not contain any complete course entries.");
    return courses;
  }

  function buildHistoryEditor(catalog) {
    const card = createElement("section", "planner-card");
    card.appendChild(textNode("h2", "planner-card-title", "Completed course history"));
    card.appendChild(textNode("p", "planner-note", "Choose courses from the catalog and save their grade and course units. Records are stored locally in this browser for the demo."));

    const form = createElement("form", "course-entry-form");
    const courseField = createElement("div", "planner-field");
    const courseLabel = textNode("label", null, "Catalog course");
    const courseInput = createElement("input");
    courseLabel.htmlFor = "completed-course";
    courseInput.id = "completed-course";
    courseInput.type = "text";
    courseInput.required = true;
    courseInput.placeholder = "Search by subject and number, e.g. CSI 111";
    courseInput.setAttribute("list", "catalog-course-options");
    const options = createElement("datalist");
    options.id = "catalog-course-options";
    catalog.forEach((course) => {
      const option = document.createElement("option");
      option.value = course.code;
      option.label = course.name;
      options.appendChild(option);
    });
    courseField.append(courseLabel, courseInput, options);

    const gradeField = createElement("div", "planner-field");
    const gradeLabel = textNode("label", null, "Grade");
    const gradeSelect = createElement("select");
    gradeLabel.htmlFor = "completed-course-grade";
    gradeSelect.id = "completed-course-grade";
    gradeSelect.appendChild(new Option("Not entered", ""));
    Object.keys(LETTER_GRADE_POINTS).forEach((grade) => gradeSelect.appendChild(new Option(grade, grade)));
    gradeField.append(gradeLabel, gradeSelect);

    const unitsField = createElement("div", "planner-field");
    const unitsLabel = textNode("label", null, "Course units");
    const unitsInput = createElement("input");
    unitsLabel.htmlFor = "completed-course-units";
    unitsInput.id = "completed-course-units";
    unitsInput.type = "number";
    unitsInput.min = "0.5";
    unitsInput.max = "10";
    unitsInput.step = "0.5";
    unitsInput.required = true;
    unitsInput.setAttribute("aria-label", "Course units");
    unitsField.append(unitsLabel, unitsInput);

    const actions = createElement("div", "planner-actions");
    const saveButton = textNode("button", "planner-action", "Add course");
    saveButton.type = "submit";
    const cancelButton = textNode("button", "planner-action planner-action--secondary", "Cancel edit");
    cancelButton.type = "button";
    cancelButton.hidden = true;
    actions.append(saveButton, cancelButton);
    form.append(courseField, gradeField, unitsField, actions);
    const error = textNode("p", "planner-error");
    error.hidden = true;
    error.setAttribute("role", "alert");
    error.setAttribute("aria-live", "polite");
    card.append(form, error);

    const historyPanel = createElement("div", "course-list");
    const historySummary = textNode("p", "course-list-summary");
    const historyTableWrap = createElement("div", "course-table-wrap");
    historyPanel.append(historySummary, historyTableWrap);
    card.appendChild(historyPanel);

    let editingCode = null;
    function showError(text) {
      error.textContent = text;
      error.hidden = !text;
    }
    function resetForm() {
      editingCode = null;
      form.reset();
      courseInput.disabled = false;
      saveButton.textContent = "Add course";
      cancelButton.hidden = true;
      showError("");
    }
    function renderHistory() {
      const history = getCourseHistory();
      const totalUnits = history.reduce((total, course) => total + course.units, 0);
      const gpa = calculateGpa(history);
      historySummary.textContent = `${history.length} saved courses · ${totalUnits.toFixed(1)} course units · GPA ${gpa || "unavailable"}`;
      historyTableWrap.replaceChildren();
      if (!history.length) {
        historyTableWrap.appendChild(textNode("p", "course-list-summary", "No completed courses have been entered yet."));
        return;
      }

      const table = document.createElement("table");
      table.className = "course-table";
      const head = document.createElement("thead");
      const headRow = document.createElement("tr");
      ["Course", "Grade", "Units", "Actions"].forEach((label) => {
        const cell = textNode("th", null, label);
        cell.scope = "col";
        headRow.appendChild(cell);
      });
      head.appendChild(headRow);
      const body = document.createElement("tbody");
      history.forEach((course) => {
        const row = document.createElement("tr");
        [course.code, course.grade || "Not entered", course.units.toFixed(1)].forEach((value) => row.appendChild(textNode("td", null, value)));
        const actionsCell = document.createElement("td");
        const actionGroup = createElement("div", "table-actions");
        const editButton = textNode("button", "table-action", "Edit");
        editButton.type = "button";
        editButton.addEventListener("click", () => {
          editingCode = course.code;
          courseInput.value = course.code;
          courseInput.disabled = true;
          gradeSelect.value = course.grade;
          unitsInput.value = String(course.units);
          saveButton.textContent = "Save changes";
          cancelButton.hidden = false;
          showError("");
          courseInput.focus();
        });
        const removeButton = textNode("button", "table-action", "Remove");
        removeButton.type = "button";
        removeButton.addEventListener("click", () => {
          saveCourseHistory(getCourseHistory().filter((saved) => saved.code !== course.code));
          if (editingCode === course.code) resetForm();
          renderHistory();
        });
        actionGroup.append(editButton, removeButton);
        actionsCell.appendChild(actionGroup);
        row.appendChild(actionsCell);
        body.appendChild(row);
      });
      table.append(head, body);
      historyTableWrap.appendChild(table);
    }

    courseInput.addEventListener("input", () => {
      const selected = catalog.find((course) => course.code.toLowerCase() === courseInput.value.trim().toLowerCase());
      if (selected && selected.units) unitsInput.value = String(selected.units);
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      showError("");
      const selected = catalog.find((course) => course.code.toLowerCase() === courseInput.value.trim().toLowerCase());
      if (!selected) {
        showError("Choose a course code from the catalog suggestions.");
        return;
      }
      const units = Number.parseFloat(unitsInput.value);
      if (!Number.isFinite(units) || units < 0.5 || units > 10) {
        showError("Enter course units between 0.5 and 10.");
        return;
      }
      const history = getCourseHistory();
      const record = {
        code: selected.code,
        subject: selected.subject,
        number: selected.number,
        name: selected.name,
        grade: gradeSelect.value,
        units,
      };
      if (editingCode) {
        const index = history.findIndex((course) => course.code === editingCode);
        if (index < 0) {
          showError("This course is no longer in your saved history. Refresh the list and try again.");
          return;
        }
        history[index] = record;
      } else {
        if (history.some((course) => course.code === selected.code)) {
          showError("That course is already in your history. Use Edit to change its grade or units.");
          return;
        }
        history.push(record);
      }
      saveCourseHistory(history);
      resetForm();
      renderHistory();
    });
    cancelButton.addEventListener("click", resetForm);
    renderHistory();
    return card;
  }

  async function buildCourseList() {
    const page = createElement("div");
    const section = createElement("section", "course-list");
    const summary = textNode("p", "course-list-summary", "Loading course catalog...");
    section.appendChild(summary);

    try {
      const courses = await loadCourseCatalog();
      const listedCourses = courses.filter((course) => ["MTH", "MTH/STA", "STA", "CSI"].includes(course.subject));
      page.appendChild(buildHistoryEditor(listedCourses));

      summary.textContent = `${listedCourses.length.toLocaleString()} Mathematics, Statistics, and Computer Science courses`;
      const filterInput = createElement("input");
      filterInput.type = "search";
      filterInput.placeholder = "Filter catalog by subject, number, or name";
      filterInput.setAttribute("aria-label", "Filter catalog");
      filterInput.style.cssText = "width:calc(100% - 32px); margin:0 16px 12px; padding:9px 10px; border:1px solid #dedede; border-radius:6px;";
      section.appendChild(filterInput);
      const tableWrap = createElement("div", "course-table-wrap");
      const table = createElement("table", "course-table");
      const head = document.createElement("thead");
      const headerRow = document.createElement("tr");
      ["Subject", "Number", "Name"].forEach((label) => {
        const cell = textNode("th", null, label);
        cell.scope = "col";
        headerRow.appendChild(cell);
      });
      head.appendChild(headerRow);

      const body = document.createElement("tbody");
      const fragment = document.createDocumentFragment();
      listedCourses.forEach((course) => {
        const courseRow = document.createElement("tr");
        [course.subject, course.number, course.name].forEach((value) => {
          courseRow.appendChild(textNode("td", null, value));
        });
        courseRow.dataset.search = `${course.subject} ${course.number} ${course.name}`.toLowerCase();
        fragment.appendChild(courseRow);
      });
      body.appendChild(fragment);
      table.append(head, body);
      tableWrap.appendChild(table);
      section.appendChild(tableWrap);
      filterInput.addEventListener("input", () => {
        const query = filterInput.value.trim().toLowerCase();
        Array.from(body.rows).forEach((row) => {
          row.hidden = !row.dataset.search.includes(query);
        });
      });
    } catch (error) {
      summary.textContent = "Could not load the course catalog.";
      summary.setAttribute("role", "alert");
      console.error("Could not load the course catalog:", error);
    }
    page.appendChild(section);
    return page;
  }

  async function buildOpportunityPage() {
    const history = getCourseHistory();
    const content = createElement("section", "planner-card");
    content.appendChild(textNode("h2", "planner-card-title", "Programs closest to your completed coursework"));
    content.appendChild(textNode("p", "planner-note", "Suggestions are separate from your declarations and use the demo requirement set from the Mathematics and Computer Science workbook."));
    if (!history.length) {
      content.appendChild(textNode("p", "planner-note", "Add completed courses in Courses to see ranked program suggestions."));
      return content;
    }

    const selection = getProgramSelection();
    const declaredMajors = new Set([selection.major]);
    const declaredMinors = new Set(selection.minors);
    const majorAreas = new Set([...declaredMajors].map((name) => name.toLowerCase()));
    const candidates = programDefinitions
      .filter((program) =>
        !(program.type === "major" && declaredMajors.has(program.name)) &&
        !(program.type === "minor" && declaredMinors.has(program.name)) &&
        !(program.type === "minor" && majorAreas.has(program.name.toLowerCase()))
      )
      .map((program) => evaluateProgram(program, history))
      .sort((left, right) =>
        right.completed - left.completed ||
        left.name.localeCompare(right.name) ||
        (left.type === right.type ? 0 : left.type === "major" ? -1 : 1)
      )
      .slice(0, 5);

    if (!candidates.length) {
      content.appendChild(textNode("p", "planner-note", "No eligible programs with usable requirement data are available."));
      return content;
    }

    const list = createElement("div", "suggestion-list");
    candidates.forEach((candidate) => {
      const item = createElement("article", "suggestion-item");
      const details = createElement("div");
      details.append(
        textNode("h3", null, `${candidate.name} ${candidate.type}`),
        textNode("p", null, `${candidate.completed} of ${candidate.total} requirements met · ${candidate.total - candidate.completed} remaining`),
        textNode("p", null, `Counted courses: ${candidate.requirements.flatMap((requirement) => requirement.satisfiedCourses).map((course) => `${course.code} — ${course.name}`).join("; ") || "None yet"}`)
      );
      item.append(details, textNode("div", "suggestion-percent", `${candidate.percent}%`));
      list.appendChild(item);
    });
    content.appendChild(list);
    return content;
  }

  // Set up the page layout.
  async function init() {
    if (sessionStorage.getItem("pathfinder-demo-authenticated") !== "true") {
      window.location.replace("login.html");
      return;
    }

    const page = pageContent[currentPage];
    document.title = isCoursesPage ? "Courses | PathFinder" :
      isOpportunitiesPage ? "Opportunity Finder | PathFinder" :
      isProgramsPage ? "My Programs | PathFinder" :
      page ? `${page.title} | PathFinder` : "PathFinder | Muhlenberg Academic Planner";
    document.body.innerHTML = "";

    const shell = createElement("div", "pathfinder-shell");
    const sidebar = createElement("aside", "sidebar");
    const sidebarNav = createElement("div", "sidebar-nav");

    const progressButton = buildSidebarButton({
      label: "PROGRESS",
      page: "index",
      active: currentPage === "index",
      onClick: () => goToPage("index")
    });
    const submenu = createElement("div", "sidebar-submenu is-open");

    ["MAJOR", "MINOR"].forEach((label) => {
      const pageName = label.toLowerCase();
      submenu.appendChild(buildSidebarButton({
        label,
        page: pageName,
        active: currentPage === pageName,
        child: true,
        onClick: () => goToPage(pageName)
      }));
    });

    const coursesButton = buildSidebarButton({
      label: "COURSES",
      page: "courses",
      active: isCoursesPage,
      onClick: () => goToPage("courses")
    });
    const opportunitiesButton = buildSidebarButton({
      label: "OPPORTUNITIES",
      page: "opportunities",
      active: isOpportunitiesPage,
      onClick: () => goToPage("opportunities")
    });
    const programsButton = buildSidebarButton({
      label: "MY PROGRAMS",
      page: "programs",
      active: isProgramsPage,
      onClick: () => goToPage("programs")
    });

    const signOutButton = textNode("button", "sidebar-button sidebar-signout", "LOG OUT");
    signOutButton.addEventListener("click", () => {
      sessionStorage.removeItem("pathfinder-authenticated");
      window.location.replace("login.html");
    });

    sidebarNav.append(progressButton, submenu, coursesButton, opportunitiesButton, programsButton);

    sidebar.append(
      textNode("div", "sidebar-title", "PathFinder"),
      textNode("div", "sidebar-subtitle", "Academic planning, in focus."),
      createElement("div", "sidebar-divider"),
      sidebarNav,
      createElement("div", "sidebar-divider"),
      textNode("div", "sidebar-section-label", "CURRENT STUDENT"),
      textNode("div", "student-name", student.name),
      textNode("div", "student-id", student.student_id),
      signOutButton
    );

    const main = createElement("main", "main-panel");
    let header = null;

    if (isCoursesPage) {
      header = buildPageHeader("Courses", "2026–27 COURSE CATALOG");
      main.appendChild(header);
      shell.append(sidebar, main);
      document.body.append(shell);
      main.appendChild(await buildCourseList());
      return;
    }
    if (isOpportunitiesPage) {
      header = buildPageHeader("Opportunity Finder", "PROGRAM SUGGESTIONS BASED ON COMPLETED COURSES");
      main.append(header, await buildOpportunityPage());
      shell.append(sidebar, main);
      document.body.append(shell);
      return;
    }
    if (isProgramsPage) {
      header = buildPageHeader("My Programs", "CHOOSE YOUR MAJOR AND UP TO TWO MINORS");
      main.append(header, buildProgramSelectionPage());
      shell.append(sidebar, main);
      document.body.append(shell);
      return;
    }
    if (page) {
      header = buildPageHeader(page.title, page.subtitle);
      main.append(header, ...await buildProgramPage(page));
      shell.append(sidebar, main);
      document.body.append(shell);
      return;
    }

    header = buildPageHeader("PathFinder", "A CLEAR VIEW OF WHAT YOU HAVE COMPLETED AND WHAT COMES NEXT.");

    const contentCard = createElement("section", "content-card");
    contentCard.appendChild(textNode("h2", "panel-title", "Progress"));

    const history = getCourseHistory();
    const selection = getProgramSelection();
    const majorProgram = programDefinitions.find((definition) => definition.name === selection.major && definition.type === "major");
    const majorProgress = majorProgram ? evaluateProgram(majorProgram, history).percent : null;
    const completedUnits = history.reduce((total, course) => total + course.units, 0);

    const charts = createElement("div", "progress-charts");
    if (majorProgress !== null) charts.appendChild(createProgressRing(`MAJOR · ${selection.major}`, majorProgress, COLORS.RED));
    selection.minors.forEach((minor) => {
      const minorProgram = programDefinitions.find((definition) => definition.name === minor && definition.type === "minor");
      if (minorProgram) {
        const progress = evaluateProgram(minorProgram, history).percent;
        charts.appendChild(createProgressRing(`MINOR · ${minor}`, progress, COLORS.DARK_RED));
      } else {
        charts.appendChild(textNode("div", "planner-note", `${minor} minor progress is unavailable because its requirements are not loaded.`));
      }
    });
    if (!selection.minors.length) {
      charts.appendChild(textNode("div", "planner-note", "No minors selected. Add one or two in My Programs whenever you like."));
    }
    charts.appendChild(createProgressRing("GRADUATION UNITS", Math.min(100, Math.round(completedUnits / 32 * 100)), COLORS.GREEN));
    charts.appendChild(buildMetric(`${completedUnits.toFixed(1)} / 32`, "Course units earned"));

    contentCard.append(charts, buildNextCourses());
    main.append(header, buildIdentityBar(history), contentCard, buildDashboardLinks());
    shell.append(sidebar, main);
    document.body.append(shell);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
