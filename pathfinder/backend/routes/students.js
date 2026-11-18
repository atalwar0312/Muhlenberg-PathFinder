// Request layer: URL and HTTP method mapping; no database queries.
const router = require('express').Router();
const studentController = require('../controllers/studentController');
router.get('/:studentId/profile', studentController.getProfile);
router.get('/:studentId/progress', studentController.getProgress);
router.get('/:studentId/opportunities', studentController.getOpportunities);
module.exports = router;
