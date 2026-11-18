// Request layer: translate HTTP requests to service calls and responses.
const studentService = require('../services/studentService');
function respond(res, next, fn) {
  try {
    const result = fn();
    if (!result) return res.status(404).json({ error: 'Student not found' });
    return res.json(result);
  } catch (error) { return next(error); }
}
exports.getProfile = (req, res, next) => respond(res, next, () => studentService.getProfile(req.params.studentId));
exports.getProgress = (req, res, next) => respond(res, next, () => studentService.getProgress(req.params.studentId));
exports.getOpportunities = (req, res, next) => respond(res, next, () => studentService.getOpportunities(req.params.studentId));
