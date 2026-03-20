const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
        },
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },
        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recruiter',
            required: true,
        },
        status: {
            type: String,
            enum: ['applied', 'shortlisted', 'interview', 'offered', 'rejected'],
            default: 'applied',
        },
        coverLetter: {
            type: String,
            maxlength: [2000, 'Cover letter cannot exceed 2000 characters'],
            default: '',
        },
        resumeSnapshot: {
            type: String, // URL at the time of application
            default: '',
        },
        interviewDate: {
            type: Date,
        },
        notes: {
            type: String, // Recruiter-only private notes
            default: '',
        },
        statusHistory: [
            {
                status: {
                    type: String,
                    enum: ['applied', 'shortlisted', 'interview', 'offered', 'rejected'],
                },
                changedAt: {
                    type: Date,
                    default: Date.now,
                },
                note: {
                    type: String,
                    default: '',
                },
            },
        ],
        appliedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
applicationSchema.index({ applicant: 1 });
applicationSchema.index({ recruiter: 1 });

module.exports = mongoose.model('Application', applicationSchema);
