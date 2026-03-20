const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        profile: {
            bio: {
                type: String,
                maxlength: [500, 'Bio cannot exceed 500 characters'],
                default: '',
            },
            skills: [
                {
                    type: String,
                    trim: true,
                },
            ],
            education: [
                {
                    degree: { type: String, required: true },
                    institution: { type: String, required: true },
                    year: { type: Number },
                    cgpa: { type: Number, min: 0, max: 10 },
                },
            ],
            experience: [
                {
                    title: { type: String, required: true },
                    company: { type: String, required: true },
                    duration: { type: String },
                    description: { type: String },
                },
            ],
            location: { type: String, default: '' },
            linkedIn: { type: String, default: '' },
            github: { type: String, default: '' },
            portfolio: { type: String, default: '' },
        },
        resume: {
            url: { type: String, default: '' },
            publicId: { type: String, default: '' },
            uploadedAt: { type: Date },
        },
        savedJobs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Job',
            },
        ],
        profileCompletion: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
    },
    {
        timestamps: true,
    }
);

// Calculate profile completion
studentSchema.methods.calculateProfileCompletion = function () {
    let score = 0;
    const profile = this.profile;

    if (profile.bio && profile.bio.length > 10) score += 15;
    if (profile.skills && profile.skills.length > 0) score += 20;
    if (profile.education && profile.education.length > 0) score += 20;
    if (profile.experience && profile.experience.length > 0) score += 15;
    if (profile.location) score += 5;
    if (profile.linkedIn) score += 5;
    if (profile.github) score += 5;
    if (this.resume && this.resume.url) score += 15;

    this.profileCompletion = score;
    return score;
};

module.exports = mongoose.model('Student', studentSchema);
