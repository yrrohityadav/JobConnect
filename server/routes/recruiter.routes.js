const router = require('express').Router();
const recruiterController = require('../controllers/recruiter.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const { uploadImage } = require('../middleware/upload.middleware');
const { validate } = require('../validators/auth.validator');
const { updateProfileSchema } = require('../validators/recruiter.validator');

// All routes require recruiter authentication
router.use(authenticate, authorize('recruiter'));

router.get('/profile', recruiterController.getProfile);
router.put('/profile', validate(updateProfileSchema), recruiterController.updateProfile);
router.post('/logo', uploadImage.single('logo'), recruiterController.uploadLogo);
router.get('/jobs', recruiterController.getPostedJobs);

module.exports = router;
