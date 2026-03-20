const router = require('express').Router();
const studentController = require('../controllers/student.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const { uploadResume } = require('../middleware/upload.middleware');
const { validate } = require('../validators/auth.validator');
const { updateProfileSchema } = require('../validators/student.validator');

// All routes require student authentication
router.use(authenticate, authorize('student'));

router.get('/profile', studentController.getProfile);
router.put('/profile', validate(updateProfileSchema), studentController.updateProfile);
router.post('/resume', uploadResume.single('resume'), studentController.uploadResume);
router.get('/saved-jobs', studentController.getSavedJobs);
router.post('/saved-jobs/:jobId', studentController.saveJob);
router.delete('/saved-jobs/:jobId', studentController.unsaveJob);

module.exports = router;
