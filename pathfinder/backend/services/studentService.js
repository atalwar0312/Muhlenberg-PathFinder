// Business layer: calculations and rules; no HTTP or storage details.
const repository = require('../repositories/studentRepository');
const creditSum = courses => courses.reduce((sum, c) => sum + c.credits, 0);
function getStudent(id) { return repository.findStudentById(id); }
function getProfile(id) {
  const student = getStudent(id);
  if (!student) return null;
  const { name, classYear, declaredMajors, declaredMinors, schoolId } = student;
  return { name, classYear, declaredMajors, declaredMinors, schoolId };
}
function getProgress(id) {
  const student = getStudent(id);
  if (!student) return null;
  const completedCodes = new Set(student.completedCourses.map(c => c.code));
  const programs = repository.findProgramsByNames([...student.declaredMajors, ...student.declaredMinors])
    .filter(p => (p.type === 'major' && student.declaredMajors.includes(p.name)) ||
                 (p.type === 'minor' && student.declaredMinors.includes(p.name)));
  const requirements = programs.map(program => {
    const satisfied = program.requiredCourses.filter(code => completedCodes.has(code));
    return { program: program.name, type: program.type, satisfied,
      remaining: program.requiredCourses.filter(code => !completedCodes.has(code)),
      completed: satisfied.length, total: program.requiredCourses.length,
      percent: program.requiredCourses.length ? Math.round(satisfied.length / program.requiredCourses.length * 100) : 0 };
  });
  const creditsEarned = creditSum(student.completedCourses);
  return { studentId: id, creditsEarned, creditsRequired: student.creditsRequired,
    creditsRemaining: Math.max(0, student.creditsRequired - creditsEarned), requirements,
    demoData: true };
}
function getOpportunities(id) {
  const student = getStudent(id);
  if (!student) return null;
  const completedCodes = new Set(student.completedCourses.map(c => c.code));
  if (!completedCodes.size) return { studentId: id, suggestions: [], message: 'Add completed courses to see suggestions.', demoData: true };
  const declaredMajors = new Set(student.declaredMajors);
  const declaredMinors = new Set(student.declaredMinors);
  const majorAreas = new Set(student.declaredMajors.map(x => x.toLowerCase()));
  const suggestions = repository.findAllPrograms()
    .filter(p => !(p.type === 'major' && declaredMajors.has(p.name)) &&
                 !(p.type === 'minor' && declaredMinors.has(p.name)) &&
                 !(p.type === 'minor' && majorAreas.has(p.name.toLowerCase())))
    .map(p => {
      const matchedCourses = p.requiredCourses.filter(c => completedCodes.has(c));
      return { program: p.name, type: p.type, matchedCourses, matched: matchedCourses.length,
        remaining: p.requiredCourses.length - matchedCourses.length,
        percent: p.requiredCourses.length ? Math.round(100 * matchedCourses.length / p.requiredCourses.length) : 0 };
    })
    .sort((a, b) => b.matched - a.matched || a.remaining - b.remaining || a.program.localeCompare(b.program))
    .slice(0, 5);
  return { studentId: id, suggestions, demoData: true };
}
module.exports = { getProfile, getProgress, getOpportunities };
