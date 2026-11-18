// Illustrative fixture only. This is NOT the official course catalog or live student data.
exports.students = [{
  id: 'demo', schoolId: 'DEMO-0000', name: 'Demo Student', classYear: 'Junior',
  declaredMajors: ['Computer Science'], declaredMinors: ['Mathematics'],
  creditsRequired: 128,
  completedCourses: [
    { code: 'CSC101', credits: 4 }, { code: 'CSC102', credits: 4 },
    { code: 'MAT101', credits: 4 }, { code: 'MAT102', credits: 4 },
    { code: 'STA101', credits: 4 }
  ]
}];
exports.programs = [
  { name: 'Computer Science', type: 'major', requiredCourses: ['CSC101', 'CSC102', 'CSC201', 'MAT101'] },
  { name: 'Mathematics', type: 'minor', requiredCourses: ['MAT101', 'MAT102', 'MAT201'] },
  { name: 'Mathematics', type: 'major', requiredCourses: ['MAT101', 'MAT102', 'MAT201', 'STA101'] },
  { name: 'Data Science', type: 'minor', requiredCourses: ['CSC101', 'STA101', 'MAT102'] },
  { name: 'Statistics', type: 'minor', requiredCourses: ['STA101', 'MAT101', 'MAT201'] },
  { name: 'Physics', type: 'minor', requiredCourses: ['PHY101', 'MAT101', 'MAT102'] }
];
