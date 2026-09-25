(function () {
  // Student details for the planner.
  const student = {
    name: "Andrew Jarrah",
    student_id: "0000000000",
    class_year: "Junior",
    majors: "Computer Science",
    minors: "Data Science",
    credits_completed: 78,
    credits_required: 128,
    graduation_term: "Spring 2028",
    major_progress: 72,
    minor_progress: 58,
  };

  // GARS categories and counts.
  const garCategories = [
    ["Writing", 3, 4],
    ["Quantitative", 2, 3],
    ["Humanities", 4, 5],
    ["Natural Science", 3, 4],
  ];

  // Top summary fields.
  const identityFields = [
    ["STUDENT", student.name],
    ["ID NUMBER", student.student_id],
    ["CLASS YEAR", student.class_year],
    ["DECLARED MAJOR", student.majors],
    ["MINOR", student.minors],
    ["PROJECTED GRADUATION", student.graduation_term],
  ];

  // Placeholder next courses.
  const nextCourseList = [
    "-------------------------",
    "-------------------------",
    "-------------------------",
  ];

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
    /* Student info bar. */
    .identity-bar {
      background: ${COLORS.PANEL};
      border: 1px solid ${COLORS.LINE};
      padding: 14px 18px;
      display: grid;
      grid-template-columns: repeat(6, minmax(0, 1fr));
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
  function buildIdentityBar() {
    const identityBar = createElement("div", "identity-bar");
    identityFields.forEach(([label, value]) => {
      const cell = createElement("div", "identity-cell");
      cell.append(textNode("span", "identity-label", label), textNode("div", "identity-value", value));
      identityBar.appendChild(cell);
    });
    return identityBar;
  }

  // Build the blank course list.
  function buildNextCourses() {
    const nextCourses = createElement("div", "next-courses");
    nextCourses.appendChild(textNode("span", "next-courses-label", "Next Courses"));
    nextCourseList.forEach((course) => {
      const item = createElement("div", "course-item");
      item.append(textNode("span", "course-arrow", "↓"), textNode("span", null, course));
      nextCourses.appendChild(item);
    });
    return nextCourses;
  }

  // Set up the page layout.
  function init() {
    document.title = "PathFinder | Muhlenberg Academic Planner";
    document.body.innerHTML = "";

    const shell = createElement("div", "pathfinder-shell");
    const sidebar = createElement("aside", "sidebar");
    const sidebarNav = createElement("div", "sidebar-nav");

    // Build the sidebar menu.
    const progressButton = textNode("button", "sidebar-button sidebar-button--parent sidebar-button--active", "PROGRESS");
    const submenu = createElement("div", "sidebar-submenu is-open");

    ["MAJOR", "MINOR", "GARS"].forEach((label, index) => {
      const button = textNode("button", `sidebar-button sidebar-button--child${index === 0 ? " sidebar-button--active" : ""}`, label);
      submenu.appendChild(button);
    });

    progressButton.addEventListener("click", () => {
      submenu.classList.toggle("is-open");
    });

    sidebarNav.append(progressButton, submenu);

    sidebar.append(
      textNode("div", "sidebar-title", "PathFinder"),
      textNode("div", "sidebar-subtitle", "Academic planning, in focus."),
      createElement("div", "sidebar-divider"),
      sidebarNav,
      createElement("div", "sidebar-divider"),
      textNode("div", "sidebar-section-label", "CURRENT STUDENT"),
      textNode("div", "student-name", student.name),
      textNode("div", "student-id", student.student_id)
    );

    // Main panel setup.
    const main = createElement("main", "main-panel");
    const header = createElement("div", "header");
    header.append(textNode("h1", "header-title", "PathFinder"), textNode("div", "header-subtitle", "A CLEAR VIEW OF WHAT YOU HAVE COMPLETED AND WHAT COMES NEXT."));

    const contentCard = createElement("section", "content-card");
    contentCard.appendChild(textNode("h2", "panel-title", "Progress"));

    // Build the progress rings.
    const charts = createElement("div", "progress-charts");
    const { major_progress, minor_progress, credits_completed, credits_required } = student;
    // GARS percentage.
    const garProgress = Math.round(
      (garCategories.reduce((sum, item) => sum + item[1], 0) /
        garCategories.reduce((sum, item) => sum + item[2], 0)) * 100
    );
    // Overall credit percentage.
    const overall = Math.round((credits_completed / credits_required) * 100);

    charts.append(
      createProgressRing("MAJOR", Math.round(major_progress), COLORS.RED),
      createProgressRing("MINOR", Math.round(minor_progress), COLORS.DARK_RED),
      createProgressRing("GARS", garProgress, COLORS.RED),
      createProgressRing("OVERALL", overall, COLORS.GREEN)
    );

    contentCard.append(charts, buildNextCourses());
    main.append(header, buildIdentityBar(), contentCard);
    shell.append(sidebar, main);
    document.body.appendChild(shell);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
