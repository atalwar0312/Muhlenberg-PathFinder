// Fictional demo fixtures only. These are not official Muhlenberg records.
export const students = [
  {
    id: "0000000000",
    name: "Demo Student",
    classYear: "Junior",
    majors: ["Computer Science"],
    minors: ["Data Science"],
    schoolId: "0000000000",
    creditsEarned: 78,
    creditsRequired: 128,
    graduationTerm: "Spring 2028",
    majorProgress: 72,
    minorProgress: 58,
    completedCourses: ["CSC 150", "CSC 220", "MAT 121", "MAT 122", "ENG 101", "PHY 101"],
    inProgressCourses: ["CSC 310", "STA 201"],
    garCategories: [
      { name: "Writing", completed: 3, required: 4 },
      { name: "Quantitative", completed: 2, required: 3 },
      { name: "Humanities", completed: 4, required: 5 },
      { name: "Natural Science", completed: 3, required: 4 }
    ]
  }
];

export const programs = [
  {
    name: "Computer Science",
    type: "major",
    description: "Study computation, software, algorithms, and computer systems.",
    minimumCredits: 0,
    requiredCourses: ["CSC 150", "CSC 220", "CSC 250", "CSC 310", "MAT 121", "MAT 220"]
  },
  {
    name: "Data Science",
    type: "minor",
    description: "Use computing, statistics, and data analysis to understand information.",
    minimumCredits: 0,
    requiredCourses: ["CSC 150", "CSC 220", "MAT 121", "MAT 122", "STA 201"]
  },
  {
    name: "Mathematics",
    type: "minor",
    description: "Develop mathematical reasoning and quantitative problem-solving skills.",
    minimumCredits: 0,
    requiredCourses: ["MAT 121", "MAT 122", "MAT 220", "MAT 230"]
  },
  {
    name: "Physics",
    type: "major",
    description: "Explore physical systems through theory, experimentation, and computation.",
    minimumCredits: 24,
    requiredCourses: ["PHY 101", "PHY 201", "MAT 121", "MAT 122", "MAT 220"]
  },
  {
    name: "Economics",
    type: "minor",
    description: "Examine markets, incentives, and economic decision-making.",
    minimumCredits: 24,
    requiredCourses: ["ECO 101", "ECO 102", "MAT 121", "STA 201"]
  },
  {
    name: "English",
    type: "major",
    description: "Study literature, writing, interpretation, and rhetoric.",
    minimumCredits: 0,
    requiredCourses: ["ENG 101", "ENG 210", "ENG 220", "HIS 110"]
  }
];

// Keep the existing sample course endpoint available as a fallback/demo fixture.
export const sampleCourses = [
  { id: "DEMO-101", title: "Sample Programming Course", department: "DEMO" },
  { id: "DEMO-201", title: "Sample Data Structures Course", department: "DEMO" }
];
