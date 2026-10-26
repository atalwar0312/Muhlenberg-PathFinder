

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

  const pageContent = {
    major: {
      title: "Major Progress",
      subtitle: "COMPUTER SCIENCE · DEGREE REQUIREMENTS",
      label: "Major",
      program: student.majors,
      progress: student.major_progress,
    },
    minor: {
      title: "Minor Progress",
      subtitle: "DATA SCIENCE · DEGREE REQUIREMENTS",
      label: "Minor",
      program: student.minors,
      progress: student.minor_progress,
    },
    gars: {
      title: "GARS Progress",
      subtitle: "GENERAL ACADEMIC REQUIREMENTS",
    },
  };

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
    .detail-progress-heading,
    .gars-row-heading {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: baseline;
      font-size: 12px;
      font-weight: 700;
    }
    .detail-progress-heading span:last-child,
    .gars-row-heading span:last-child {
      color: ${COLORS.DARK_RED};
    }
    .detail-track,
    .gars-track {
      width: 100%;
      height: 9px;
      margin-top: 10px;
      overflow: hidden;
      border-radius: 999px;
      background: #f0e8e9;
    }
    .detail-track-fill,
    .gars-track-fill {
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
    .gars-card {
      margin-top: 16px;
    }
    .gars-list {
      display: grid;
      gap: 20px;
      margin-top: 22px;
    }
    .gars-row-heading {
      font-size: 13px;
    }
    .gars-row-heading span:last-child {
      color: ${COLORS.MUTED};
      font-size: 11px;
      font-weight: 600;
    }
    .gars-track {
      height: 7px;
      margin-top: 9px;
    }
    .gars-track-fill {
      background: ${COLORS.RED};
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
    .assistant-widget {
      position: fixed;
      right: 24px;
      bottom: 24px;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 12px;
    }
    .assistant-launcher {
      width: 58px;
      height: 58px;
      display: grid;
      place-items: center;
      border: 0;
      border-radius: 50%;
      background: ${COLORS.RED};
      color: white;
      box-shadow: 0 6px 20px rgba(36, 36, 36, 0.22);
      font-size: 24px;
      cursor: pointer;
      transition: background 160ms ease, transform 160ms ease;
    }
    .assistant-launcher:hover {
      background: ${COLORS.DARK_RED};
      transform: translateY(-2px);
    }
    .assistant-launcher:focus-visible,
    .assistant-close:focus-visible,
    .assistant-send:focus-visible,
    .assistant-input:focus-visible {
      outline: 3px solid rgba(166, 25, 46, 0.3);
      outline-offset: 2px;
    }
    .assistant-panel {
      width: min(360px, calc(100vw - 32px));
      height: min(440px, calc(100vh - 120px));
      min-height: 280px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid ${COLORS.LINE};
      border-radius: 14px;
      background: ${COLORS.PANEL};
      box-shadow: 0 12px 36px rgba(36, 36, 36, 0.2);
    }
    .assistant-panel[hidden] {
      display: none;
    }
    .assistant-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 16px 18px;
      background: ${COLORS.RED};
      color: white;
    }
    .assistant-heading {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
    }
    .assistant-caption {
      margin: 4px 0 0;
      color: #f6dfe3;
      font-size: 11px;
    }
    .assistant-close {
      width: 30px;
      height: 30px;
      border: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      color: white;
      font-size: 19px;
      cursor: pointer;
    }
    .assistant-messages {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      overflow-y: auto;
      padding: 16px;
    }
    .assistant-empty {
      margin: auto;
      max-width: 230px;
      color: ${COLORS.MUTED};
      font-size: 12px;
      line-height: 1.5;
      text-align: center;
    }
    .assistant-message {
      max-width: 88%;
      align-self: flex-end;
      padding: 10px 13px;
      border-radius: 14px 14px 3px 14px;
      background: #f7e9eb;
      color: ${COLORS.INK};
      font-size: 13px;
      line-height: 1.45;
      overflow-wrap: anywhere;
      white-space: pre-wrap;
    }
    .assistant-form {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      padding: 12px;
      border-top: 1px solid ${COLORS.LINE};
    }
    .assistant-input {
      flex: 1;
      min-width: 0;
      max-height: 100px;
      resize: none;
      padding: 10px 12px;
      border: 1px solid ${COLORS.LINE};
      border-radius: 9px;
      font: inherit;
      font-size: 13px;
    }
    .assistant-send {
      min-height: 38px;
      padding: 0 14px;
      border: 0;
      border-radius: 8px;
      background: ${COLORS.RED};
      color: white;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }
    .assistant-send:hover {
      background: ${COLORS.DARK_RED};
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
        grid-template-columns: repeat(4, minmax(0, 1fr));
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
      .assistant-widget {
        right: 16px;
        bottom: 16px;
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

  // Build the course-planning empty state.
  function buildNextCourses() {
    const nextCourses = createElement("div", "next-courses");
    nextCourses.appendChild(textNode("span", "next-courses-label", "Next Courses"));
    nextCourses.appendChild(textNode("div", "empty-courses", "Your upcoming courses will appear here as you build your plan."));
    return nextCourses;
  }

  function buildMetric(value, label) {
    const metric = createElement("div", "detail-metric");
    metric.append(textNode("span", "detail-metric-value", value), textNode("span", "detail-metric-label", label));
    return metric;
  }

  function buildProgramPage(page) {
    const progress = Math.round(page.progress);
    const remaining = 100 - progress;
    const intro = textNode("p", "detail-intro", `Track your ${page.label.toLowerCase()} requirements and keep your academic plan moving forward.`);
    const grid = createElement("div", "detail-grid");
    const primary = createElement("section", "detail-card detail-card--primary");
    primary.append(
      textNode("p", "detail-eyebrow", `${page.label} at a glance`),
      textNode("h2", "detail-program", page.program),
      textNode("p", "detail-copy", `Your progress is based on the requirements completed in your academic plan.`)
    );
    const progressHeading = createElement("div", "detail-progress-heading");
    progressHeading.append(textNode("span", null, "Requirements completed"), textNode("span", null, `${progress}%`));
    const track = createElement("div", "detail-track");
    track.setAttribute("role", "progressbar");
    track.setAttribute("aria-label", `${page.label} requirements completed`);
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", "100");
    track.setAttribute("aria-valuenow", String(progress));
    const fill = createElement("div", "detail-track-fill");
    fill.style.width = `${progress}%`;
    track.appendChild(fill);
    const metrics = createElement("div", "detail-metrics");
    metrics.append(
      buildMetric(`${progress}%`, "Completed"),
      buildMetric(`${remaining}%`, "Remaining"),
      buildMetric(student.graduation_term, "Projected graduation")
    );
    primary.append(progressHeading, track, metrics);

    const side = createElement("aside", "detail-card detail-side-card");
    side.append(
      textNode("p", "detail-eyebrow", "Keep your plan on track"),
      textNode("h2", "detail-program", "What's next?"),
      textNode("p", "detail-copy", "Review your remaining requirements with your academic advisor and update your plan as you complete courses.")
    );
    const sideFoot = createElement("div");
    sideFoot.append(textNode("p", "detail-side-number", `${remaining}%`), textNode("p", "detail-side-caption", "of your requirements remain"));
    side.appendChild(sideFoot);
    grid.append(primary, side);
    return [intro, grid];
  }

  function buildGarsPage() {
    const totalCompleted = garCategories.reduce((sum, category) => sum + category[1], 0);
    const totalRequirements = garCategories.reduce((sum, category) => sum + category[2], 0);
    const completedPercent = Math.round((totalCompleted / totalRequirements) * 100);
    const intro = textNode("p", "detail-intro", "See how your completed general academic requirements are distributed across each area.");
    const summary = createElement("section", "detail-card detail-card--primary");
    const summaryHead = createElement("div", "detail-progress-heading");
    summaryHead.append(textNode("span", null, "Overall GARS progress"), textNode("span", null, `${totalCompleted} of ${totalRequirements} completed`));
    const track = createElement("div", "detail-track");
    track.setAttribute("role", "progressbar");
    track.setAttribute("aria-label", "Overall GARS requirements completed");
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", "100");
    track.setAttribute("aria-valuenow", String(completedPercent));
    const fill = createElement("div", "detail-track-fill");
    fill.style.width = `${completedPercent}%`;
    track.appendChild(fill);
    summary.append(textNode("p", "detail-eyebrow", "Requirement overview"), textNode("h2", "detail-program", "General Academic Requirements"), summaryHead, track);

    const categoryCard = createElement("section", "detail-card gars-card");
    categoryCard.append(textNode("h2", "panel-title", "Progress by area"));
    const list = createElement("div", "gars-list");
    garCategories.forEach(([name, completed, total]) => {
      const row = createElement("div", "gars-row");
      const heading = createElement("div", "gars-row-heading");
      heading.append(textNode("span", null, name), textNode("span", null, `${completed} of ${total} completed`));
      const rowTrack = createElement("div", "gars-track");
      rowTrack.setAttribute("role", "progressbar");
      rowTrack.setAttribute("aria-label", `${name} requirements completed`);
      rowTrack.setAttribute("aria-valuemin", "0");
      rowTrack.setAttribute("aria-valuemax", String(total));
      rowTrack.setAttribute("aria-valuenow", String(completed));
      const rowFill = createElement("div", "gars-track-fill");
      rowFill.style.width = `${Math.round((completed / total) * 100)}%`;
      rowTrack.appendChild(rowFill);
      row.append(heading, rowTrack);
      list.appendChild(row);
    });
    categoryCard.appendChild(list);
    return [intro, summary, categoryCard];
  }

  function buildDashboardLinks() {
    const links = createElement("section", "dashboard-links");
    [
      ["major", "Major requirements", "Explore your Computer Science progress."],
      ["minor", "Minor requirements", "See your Data Science progress."],
      ["gars", "General requirements", "Review progress across GARS areas."],
    ].forEach(([target, title, copy]) => {
      const button = createElement("button", "dashboard-link");
      button.type = "button";
      button.append(textNode("span", "dashboard-link-title", title), textNode("span", "dashboard-link-copy", copy));
      button.addEventListener("click", () => {
        window.location.href = `${target}.html`;
      });
      links.appendChild(button);
    });
    return links;
  }

  function buildAssistantWidget() {
    const widget = createElement("div", "assistant-widget");
    const panel = createElement("section", "assistant-panel");
    panel.id = "assistant-panel";
    panel.setAttribute("aria-labelledby", "assistant-heading");

    const header = createElement("div", "assistant-header");
    const headingGroup = createElement("div");
    headingGroup.append(
      textNode("h2", "assistant-heading", "HAL Chat Bot"),
      textNode("p", "assistant-caption", "Personal Assistant ")
    );
    const closeButton = textNode("button", "assistant-close", "×");
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Close quick chat");
    header.append(headingGroup, closeButton);

    const messages = createElement("div", "assistant-messages");
    messages.setAttribute("aria-live", "polite");
    messages.appendChild(textNode("p", "assistant-empty", "Type a message below to start chatting with the assistant."));

    const form = createElement("form", "assistant-form");
    const input = createElement("textarea", "assistant-input");
    input.rows = 1;
    input.setAttribute("aria-label", "Type a message");
    input.placeholder = "Type a message...";
    const sendButton = textNode("button", "assistant-send", "Send");
    sendButton.type = "submit";
    form.append(input, sendButton);
    panel.append(header, messages, form);

    const launcher = textNode("button", "assistant-launcher", "✎");
    launcher.type = "button";
    launcher.setAttribute("aria-label", "Open quick chat");
    launcher.setAttribute("aria-controls", panel.id);
    launcher.setAttribute("aria-expanded", "false");
    panel.hidden = true;

    function setOpen(isOpen) {
      panel.hidden = !isOpen;
      launcher.setAttribute("aria-expanded", String(isOpen));
      launcher.setAttribute("aria-label", isOpen ? "Close quick chat" : "Open quick chat");
      if (isOpen) input.focus();
      else launcher.focus();
    }

    launcher.addEventListener("click", () => setOpen(panel.hidden));
    closeButton.addEventListener("click", () => setOpen(false));
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = input.value.trim();
      if (!message) return;

      const emptyState = messages.querySelector(".assistant-empty");
      if (emptyState) emptyState.remove();
      messages.appendChild(textNode("div", "assistant-message", message));
      input.value = "";
      messages.scrollTop = messages.scrollHeight;
      input.focus();
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        form.requestSubmit();
      }
    });

    widget.append(panel, launcher);
    return widget;
  }

  // Set up the page layout.
  function init() {
    const currentPage = window.location.pathname.split("/").pop().replace(/\.html$/, "") || "index";
    const page = pageContent[currentPage];
    document.title = page ? `${page.title} | PathFinder` : "PathFinder | Muhlenberg Academic Planner";
    document.body.innerHTML = "";

    const shell = createElement("div", "pathfinder-shell");
    const sidebar = createElement("aside", "sidebar");
    const sidebarNav = createElement("div", "sidebar-nav");

    // Build the sidebar menu.
    const progressButton = textNode("button", `sidebar-button sidebar-button--parent${currentPage === "index" ? " sidebar-button--active" : ""}`, "PROGRESS");
    const submenu = createElement("div", "sidebar-submenu is-open");

    ["MAJOR", "MINOR", "GARS"].forEach((label, index) => {
      const button = textNode("button", `sidebar-button sidebar-button--child${currentPage === label.toLowerCase() ? " sidebar-button--active" : ""}`, label);
      button.addEventListener("click", () => {
        window.location.href = `${label.toLowerCase()}.html`;
      });
      submenu.appendChild(button);
    });

    progressButton.addEventListener("click", () => {
      window.location.href = "index.html";
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
    if (page) {
      header.append(
        textNode("h1", "header-title", page.title),
        textNode("div", "header-subtitle", page.subtitle)
      );
      const pageSections = currentPage === "gars" ? buildGarsPage() : buildProgramPage(page);
      main.append(header, ...pageSections);
      shell.append(sidebar, main);
      document.body.append(shell, buildAssistantWidget());
      return;
    }

    header.append(
      textNode("h1", "header-title", "PathFinder"),
      textNode("div", "header-subtitle", "A CLEAR VIEW OF WHAT YOU HAVE COMPLETED AND WHAT COMES NEXT.")
    );

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
    main.append(header, buildIdentityBar(), contentCard, buildDashboardLinks());
    shell.append(sidebar, main);
    document.body.append(shell, buildAssistantWidget());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
