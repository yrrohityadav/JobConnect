const Student = require('../models/Student.model');
const Job = require('../models/Job.model');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinary.service');

// @desc    Get student profile
// @route   GET /api/students/profile
exports.getProfile = async (req, res, next) => {
    try {
        const student = await Student.findOne({ user: req.user._id }).populate('user', 'name email');
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found.' });
        }
        res.json({ success: true, data: student });
    } catch (error) {
        next(error);
    }
};

// @desc    Update student profile
// @route   PUT /api/students/profile
exports.updateProfile = async (req, res, next) => {
    try {
        const { bio, skills, education, experience, location, linkedIn, github, portfolio } = req.body;

        const student = await Student.findOne({ user: req.user._id });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found.' });
        }

        // Update profile fields
        if (bio !== undefined) student.profile.bio = bio;
        if (skills !== undefined) student.profile.skills = skills;
        if (education !== undefined) student.profile.education = education;
        if (experience !== undefined) student.profile.experience = experience;
        if (location !== undefined) student.profile.location = location;
        if (linkedIn !== undefined) student.profile.linkedIn = linkedIn;
        if (github !== undefined) student.profile.github = github;
        if (portfolio !== undefined) student.profile.portfolio = portfolio;

        // Recalculate profile completion
        student.calculateProfileCompletion();
        await student.save();

        res.json({ success: true, message: 'Profile updated.', data: student });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload resume
// @route   POST /api/students/resume
exports.uploadResume = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        const student = await Student.findOne({ user: req.user._id });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found.' });
        }

        // Delete old resume if exists
        if (student.resume.publicId) {
            await deleteFromCloudinary(student.resume.publicId, 'raw');
        }

        // Upload new resume
        const result = await uploadToCloudinary(req.file.buffer, 'resumes', 'raw');

        student.resume = {
            url: result.url,
            publicId: result.publicId,
            uploadedAt: new Date(),
        };
        student.calculateProfileCompletion();
        await student.save();

        res.json({ success: true, message: 'Resume uploaded.', data: { resume: student.resume } });
    } catch (error) {
        next(error);
    }
};

// @desc    Get saved jobs
// @route   GET /api/students/saved-jobs
exports.getSavedJobs = async (req, res, next) => {
    try {
        const student = await Student.findOne({ user: req.user._id }).populate({
            path: 'savedJobs',
            populate: { path: 'postedBy', select: 'company.name company.logo' },
        });
        res.json({ success: true, data: student?.savedJobs || [] });
    } catch (error) {
        next(error);
    }
};

// @desc    Save a job
// @route   POST /api/students/saved-jobs/:jobId
exports.saveJob = async (req, res, next) => {
    try {
        const student = await Student.findOne({ user: req.user._id });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found.' });
        }

        const jobId = req.params.jobId;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found.' });
        }

        if (student.savedJobs.includes(jobId)) {
            return res.status(400).json({ success: false, message: 'Job already saved.' });
        }

        student.savedJobs.push(jobId);
        await student.save();

        res.json({ success: true, message: 'Job saved.' });
    } catch (error) {
        next(error);
    }
};

// @desc    Unsave a job
// @route   DELETE /api/students/saved-jobs/:jobId
exports.unsaveJob = async (req, res, next) => {
    try {
        const student = await Student.findOne({ user: req.user._id });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found.' });
        }

        student.savedJobs = student.savedJobs.filter((id) => id.toString() !== req.params.jobId);
        await student.save();

        res.json({ success: true, message: 'Job removed from saved.' });
    } catch (error) {
        next(error);
    }
};
