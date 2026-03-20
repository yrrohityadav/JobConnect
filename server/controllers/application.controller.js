const Application = require('../models/Application.model');
const Job = require('../models/Job.model');
const Student = require('../models/Student.model');
const Recruiter = require('../models/Recruiter.model');
const { createNotification } = require('../services/notification.service');
const { sendApplicationStatusEmail } = require('../services/email.service');

// @desc    Apply to a job
// @route   POST /api/applications/:jobId
exports.applyToJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const { coverLetter } = req.body;

        const student = await Student.findOne({ user: req.user._id });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found.' });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found.' });
        }

        if (job.status !== 'open') {
            return res.status(400).json({ success: false, message: 'This job is no longer accepting applications.' });
        }

        if (job.deadline < new Date()) {
            return res.status(400).json({ success: false, message: 'Application deadline has passed.' });
        }

        // Check duplicate
        const existing = await Application.findOne({ job: jobId, applicant: student._id });
        if (existing) {
            return res.status(409).json({ success: false, message: 'You have already applied to this job.' });
        }

        const application = await Application.create({
            job: jobId,
            applicant: student._id,
            recruiter: job.postedBy,
            coverLetter: coverLetter || '',
            resumeSnapshot: student.resume?.url || '',
            statusHistory: [{ status: 'applied', changedAt: new Date() }],
        });

        // Add to job applicants
        job.applicants.push(application._id);
        await job.save();

        // Notify recruiter
        const recruiter = await Recruiter.findById(job.postedBy).populate('user', 'name');
        if (recruiter) {
            createNotification({
                recipient: recruiter.user._id,
                type: 'new_applicant',
                title: 'New Application',
                message: `${req.user.name} applied for ${job.title}`,
                link: `/recruiter/jobs/${jobId}/applicants`,
            });
        }

        res.status(201).json({ success: true, message: 'Application submitted.', data: application });
    } catch (error) {
        next(error);
    }
};

// @desc    Get student's applications
// @route   GET /api/applications/my
exports.getMyApplications = async (req, res, next) => {
    try {
        const student = await Student.findOne({ user: req.user._id });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found.' });
        }

        const applications = await Application.find({ applicant: student._id })
            .populate({
                path: 'job',
                select: 'title jobType location salary deadline status',
                populate: { path: 'postedBy', select: 'company.name company.logo' },
            })
            .sort({ createdAt: -1 });

        res.json({ success: true, data: applications });
    } catch (error) {
        next(error);
    }
};

// @desc    Get applicants for a job (recruiter)
// @route   GET /api/applications/job/:jobId
exports.getJobApplicants = async (req, res, next) => {
    try {
        const recruiter = await Recruiter.findOne({ user: req.user._id });
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found.' });
        }

        if (job.postedBy.toString() !== recruiter._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        const applications = await Application.find({ job: req.params.jobId })
            .populate({
                path: 'applicant',
                select: 'profile resume user',
                populate: { path: 'user', select: 'name email' },
            })
            .sort({ createdAt: -1 });

        res.json({ success: true, data: applications });
    } catch (error) {
        next(error);
    }
};

// @desc    Update application status (recruiter)
// @route   PUT /api/applications/:id/status
exports.updateApplicationStatus = async (req, res, next) => {
    try {
        const { status, note, interviewDate } = req.body;

        const application = await Application.findById(req.params.id)
            .populate({ path: 'job', select: 'title postedBy' })
            .populate({ path: 'applicant', populate: { path: 'user', select: 'name email' } });

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found.' });
        }

        // Verify recruiter owns this job
        const recruiter = await Recruiter.findOne({ user: req.user._id });
        if (application.job.postedBy.toString() !== recruiter._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        application.status = status;
        if (note) application.notes = note;
        if (interviewDate) application.interviewDate = new Date(interviewDate);

        application.statusHistory.push({
            status,
            changedAt: new Date(),
            note: note || '',
        });

        await application.save();

        // Notify student
        createNotification({
            recipient: application.applicant.user._id,
            type: 'application_update',
            title: 'Application Update',
            message: `Your application for ${application.job.title} has been updated to ${status}`,
            link: `/student/applications`,
        });

        // Send email
        sendApplicationStatusEmail(
            application.applicant.user.email,
            application.applicant.user.name,
            application.job.title,
            status
        );

        res.json({ success: true, message: 'Application status updated.', data: application });
    } catch (error) {
        next(error);
    }
};
