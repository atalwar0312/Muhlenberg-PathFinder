// Persistence layer: sole access point for the demo data source.
// Replace this adapter with parameterized SQL as the team's database matures.
const { students, programs } = require('../data/demoData');
exports.findStudentById = id => students.find(s => s.id === id) || null;
exports.findProgramsByNames = names => programs.filter(p => names.includes(p.name));
exports.findAllPrograms = () => programs.slice();
