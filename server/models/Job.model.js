const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Job title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Job description is required'],
            maxlength: [5000, 'Description cannot exceed 5000 characters'],
        },
        requirements: [
            {
                type: String,
                trim: true,
            },
        ],
        skills: [
            {
                type: String,
                trim: true,
            },
        ],
        salary: {
            min: { type: Number, default: 0 },
            max: { type: Number, default: 0 },
            currency: { type: String, default: 'INR' },
        },
        jobType: {
            type: String,
            enum: ['Full-time', 'Part-time', 'Internship', 'Remote', 'Contract'],
            required: [true, 'Job type is required'],
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
        },
        openings: {
            type: Number,
            default: 1,
            min: [1, 'Must have at least 1 opening'],
        },
        deadline: {
            type: Date,
            required: [true, 'Application deadline is required'],
        },
        status: {
            type: String,
            enum: ['open', 'closed', 'paused'],
            default: 'open',
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recruiter',
            required: true,
        },
        applicants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Application',
            },
        ],
        views: {
            type: Number,
            default: 0,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Text index for full-text search
jobSchema.index({ title: 'text', description: 'text' });

// Index for common queries
jobSchema.index({ status: 1, jobType: 1, location: 1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ deadline: 1 });

module.exports = mongoose.model('Job', jobSchema);
