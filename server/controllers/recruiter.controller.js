const Recruiter = require('../models/Recruiter.model');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinary.service');

// @desc    Get recruiter profile
// @route   GET /api/recruiters/profile
exports.getProfile = async (req, res, next) => {
    try {
        const recruiter = await Recruiter.findOne({ user: req.user._id }).populate('user', 'name email');
        if (!recruiter) {
            return res.status(404).json({ success: false, message: 'Recruiter profile not found.' });
        }
        res.json({ success: true, data: recruiter });
    } catch (error) {
        next(error);
    }
};

// @desc    Update recruiter profile
// @route   PUT /api/recruiters/profile
exports.updateProfile = async (req, res, next) => {
    try {
        const { company } = req.body;

        const recruiter = await Recruiter.findOne({ user: req.user._id });
        if (!recruiter) {
            return res.status(404).json({ success: false, message: 'Recruiter profile not found.' });
        }

        if (company) {
            if (company.name !== undefined) recruiter.company.name = company.name;
            if (company.description !== undefined) recruiter.company.description = company.description;
            if (company.industry !== undefined) recruiter.company.industry = company.industry;
            if (company.size !== undefined) recruiter.company.size = company.size;
            if (company.website !== undefined) recruiter.company.website = company.website;
        }

        await recruiter.save();
        res.json({ success: true, message: 'Profile updated.', data: recruiter });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload company logo
// @route   POST /api/recruiters/logo
exports.uploadLogo = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        const recruiter = await Recruiter.findOne({ user: req.user._id });
        if (!recruiter) {
            return res.status(404).json({ success: false, message: 'Recruiter profile not found.' });
        }

        // Delete old logo
        if (recruiter.company.logo.publicId) {
            await deleteFromCloudinary(recruiter.company.logo.publicId);
        }

        const result = await uploadToCloudinary(req.file.buffer, 'logos', 'image');

        recruiter.company.logo = {
            url: result.url,
            publicId: result.publicId,
        };
        await recruiter.save();

        res.json({ success: true, message: 'Logo uploaded.', data: { logo: recruiter.company.logo } });
    } catch (error) {
        next(error);
    }
};

// @desc    Get recruiter's posted jobs
// @route   GET /api/recruiters/jobs
exports.getPostedJobs = async (req, res, next) => {
    try {
        const recruiter = await Recruiter.findOne({ user: req.user._id }).populate({
            path: 'postedJobs',
            options: { sort: { createdAt: -1 } },
        });
        res.json({ success: true, data: recruiter?.postedJobs || [] });
    } catch (error) {
        next(error);
    }
};
