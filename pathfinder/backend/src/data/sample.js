// Demonstration fixtures only, not official academic records or requirements.
const student = {
  student_id: '0000000000', name: 'Demo Student', class_year: 'Junior',
  majors: 'Computer Science', minors: 'Data Science',
  credits_completed: 78, credits_required: 128, graduation_term: 'Spring 2028',
  major_progress: 72, minor_progress: 58,
  gar_categories: [
    { name: 'Writing', completed: 3, required: 4 },
    { name: 'Quantitative', completed: 2, required: 3 },
    { name: 'Humanities', completed: 4, required: 5 },
    { name: 'Natural Science', completed: 3, required: 4 }
  ]
};
const courses = [
  { id: 'DEMO-101', title: 'Sample Programming Course', department: 'DEMO' },
  { id: 'DEMO-201', title: 'Sample Data Structures Course', department: 'DEMO' }
];

// Replace this adapter after the team agrees on PostgreSQL tables.
// Keep the route response shapes stable for the frontend.
export const sampleRepository = {
  async getStudent(id) { return student.student_id === id ? structuredClone(student) : null; },
  async listCourses(query = '') {
    const search = query.toLowerCase();
    return structuredClone(courses.filter(c => `${c.id} ${c.title}`.toLowerCase().includes(search)));
  },
  async getCourse(id) { return structuredClone(courses.find(c => c.id === id) ?? null); }
};
