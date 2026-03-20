const router = require('express').Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

// All routes require admin authentication
router.use(authenticate, authorize('admin'));

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);
router.get('/recruiters/pending', adminController.getPendingRecruiters);
router.put('/recruiters/:id/approve', adminController.approveRecruiter);

module.exports = router;
