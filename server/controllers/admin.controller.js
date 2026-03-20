const User = require('../models/User.model');
const Job = require('../models/Job.model');
const Application = require('../models/Application.model');
const Recruiter = require('../models/Recruiter.model');
const Student = require('../models/Student.model');
const { createNotification } = require('../services/notification.service');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
exports.getDashboardStats = async (req, res, next) => {
    try {
        const [totalUsers, totalJobs, totalApplications, pendingRecruiters] = await Promise.all([
            User.countDocuments(),
            Job.countDocuments(),
            Application.countDocuments(),
            Recruiter.countDocuments({ isVerified: false }),
        ]);

        const recentApplications = await Application.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate({ path: 'job', select: 'title' })
            .populate({ path: 'applicant', populate: { path: 'user', select: 'name' } });

        // Stats by role
        const [students, recruiters, admins] = await Promise.all([
            User.countDocuments({ role: 'student' }),
            User.countDocuments({ role: 'recruiter' }),
            User.countDocuments({ role: 'admin' }),
        ]);

        // Job stats
        const [openJobs, closedJobs] = await Promise.all([
            Job.countDocuments({ status: 'open' }),
            Job.countDocuments({ status: 'closed' }),
        ]);

        res.json({
            success: true,
            data: {
                totalUsers,
                totalJobs,
                totalApplications,
                pendingRecruiters,
                usersByRole: { students, recruiters, admins },
                jobsByStatus: { open: openJobs, closed: closedJobs },
                recentApplications,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users (with pagination)
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res, next) => {
    try {
        const { role, search, page = 1, limit = 20 } = req.query;

        const query = {};
        if (role) query.role = role;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [users, total] = await Promise.all([
            User.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            User.countDocuments(query),
        ]);

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit)),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Approve recruiter
// @route   PUT /api/admin/recruiters/:id/approve
exports.approveRecruiter = async (req, res, next) => {
    try {
        const recruiter = await Recruiter.findById(req.params.id).populate('user');
        if (!recruiter) {
            return res.status(404).json({ success: false, message: 'Recruiter not found.' });
        }

        recruiter.isVerified = true;
        await recruiter.save();

        // Also approve user account
        await User.findByIdAndUpdate(recruiter.user._id, { isApproved: true });

        // Notify recruiter
        createNotification({
            recipient: recruiter.user._id,
            type: 'account_approved',
            title: 'Account Approved',
            message: 'Your recruiter account has been approved! You can now post jobs.',
            link: '/recruiter/dashboard',
        });

        res.json({ success: true, message: 'Recruiter approved.' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get pending recruiters
// @route   GET /api/admin/recruiters/pending
exports.getPendingRecruiters = async (req, res, next) => {
    try {
        const recruiters = await Recruiter.find({ isVerified: false })
            .populate('user', 'name email createdAt')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: recruiters });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ success: false, message: 'Cannot delete admin accounts.' });
        }

        // Clean up role-specific profile
        if (user.role === 'student') {
            await Student.findOneAndDelete({ user: user._id });
        } else if (user.role === 'recruiter') {
            await Recruiter.findOneAndDelete({ user: user._id });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'User deleted.' });
    } catch (error) {
        next(error);
    }
};
