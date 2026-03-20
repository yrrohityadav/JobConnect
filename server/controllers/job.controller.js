const Job = require('../models/Job.model');
const Recruiter = require('../models/Recruiter.model');

// @desc    Create a job
// @route   POST /api/jobs
exports.createJob = async (req, res, next) => {
    try {
        const recruiter = await Recruiter.findOne({ user: req.user._id });
        if (!recruiter) {
            return res.status(404).json({ success: false, message: 'Recruiter profile not found.' });
        }

        if (!recruiter.isVerified) {
            return res.status(403).json({ success: false, message: 'Your recruiter account must be verified to post jobs.' });
        }

        const job = await Job.create({
            ...req.body,
            deadline: new Date(req.body.deadline),
            postedBy: recruiter._id,
        });

        recruiter.postedJobs.push(job._id);
        await recruiter.save();

        res.status(201).json({ success: true, message: 'Job posted successfully.', data: job });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all jobs (with search, filter, pagination)
// @route   GET /api/jobs
exports.getAllJobs = async (req, res, next) => {
    try {
        const { search, jobType, location, status, page = 1, limit = 12 } = req.query;

        const query = {};

        // Text search
        if (search) {
            query.$text = { $search: search };
        }

        // Filters
        if (jobType) query.jobType = jobType;
        if (location) query.location = { $regex: location, $options: 'i' };
        if (status) {
            query.status = status;
        } else {
            query.status = 'open'; // Default to open jobs
        }

        // Only show non-expired jobs
        query.deadline = { $gte: new Date() };

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [jobs, total] = await Promise.all([
            Job.find(query)
                .populate('postedBy', 'company.name company.logo')
                .sort({ isFeatured: -1, createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Job.countDocuments(query),
        ]);

        res.json({
            success: true,
            data: {
                jobs,
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

// @desc    Get single job
// @route   GET /api/jobs/:id
exports.getJobById = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'company user')
            .populate({
                path: 'postedBy',
                populate: { path: 'user', select: 'name email' },
            });

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found.' });
        }

        // Increment views
        job.views += 1;
        await job.save();

        res.json({ success: true, data: job });
    } catch (error) {
        next(error);
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
exports.updateJob = async (req, res, next) => {
    try {
        const recruiter = await Recruiter.findOne({ user: req.user._id });
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found.' });
        }

        if (job.postedBy.toString() !== recruiter._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this job.' });
        }

        if (req.body.deadline) {
            req.body.deadline = new Date(req.body.deadline);
        }

        const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json({ success: true, message: 'Job updated.', data: updated });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
exports.deleteJob = async (req, res, next) => {
    try {
        const recruiter = await Recruiter.findOne({ user: req.user._id });
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found.' });
        }

        if (job.postedBy.toString() !== recruiter._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this job.' });
        }

        await Job.findByIdAndDelete(req.params.id);

        // Remove from recruiter's posted jobs
        recruiter.postedJobs = recruiter.postedJobs.filter((id) => id.toString() !== req.params.id);
        await recruiter.save();

        res.json({ success: true, message: 'Job deleted.' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get featured jobs
// @route   GET /api/jobs/featured
exports.getFeaturedJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find({ isFeatured: true, status: 'open', deadline: { $gte: new Date() } })
            .populate('postedBy', 'company.name company.logo')
            .sort({ createdAt: -1 })
            .limit(6);

        res.json({ success: true, data: jobs });
    } catch (error) {
        next(error);
    }
};
