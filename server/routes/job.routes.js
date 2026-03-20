const router = require('express').Router();
const jobController = require('../controllers/job.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const { validate } = require('../validators/auth.validator');
const { createJobSchema, updateJobSchema } = require('../validators/job.validator');

// Public routes
router.get('/', jobController.getAllJobs);
router.get('/featured', jobController.getFeaturedJobs);
router.get('/:id', jobController.getJobById);

// Recruiter-only routes
router.post('/', authenticate, authorize('recruiter'), validate(createJobSchema), jobController.createJob);
router.put('/:id', authenticate, authorize('recruiter'), validate(updateJobSchema), jobController.updateJob);
router.delete('/:id', authenticate, authorize('recruiter'), jobController.deleteJob);

module.exports = router;
