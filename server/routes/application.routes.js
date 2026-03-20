const router = require('express').Router();
const applicationController = require('../controllers/application.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const { validate } = require('../validators/auth.validator');
const { applySchema, updateStatusSchema } = require('../validators/application.validator');

// Student routes
router.post('/:jobId', authenticate, authorize('student'), validate(applySchema), applicationController.applyToJob);
router.get('/my', authenticate, authorize('student'), applicationController.getMyApplications);

// Recruiter routes
router.get('/job/:jobId', authenticate, authorize('recruiter'), applicationController.getJobApplicants);
router.put('/:id/status', authenticate, authorize('recruiter'), validate(updateStatusSchema), applicationController.updateApplicationStatus);

module.exports = router;
