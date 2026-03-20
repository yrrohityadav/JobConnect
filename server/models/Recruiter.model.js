const mongoose = require('mongoose');

const recruiterSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        company: {
            name: {
                type: String,
                required: [true, 'Company name is required'],
                trim: true,
            },
            description: {
                type: String,
                default: '',
                maxlength: [1000, 'Description cannot exceed 1000 characters'],
            },
            industry: {
                type: String,
                default: '',
            },
            size: {
                type: String,
                enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+', ''],
                default: '',
            },
            website: {
                type: String,
                default: '',
            },
            logo: {
                url: { type: String, default: '' },
                publicId: { type: String, default: '' },
            },
        },
        postedJobs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Job',
            },
        ],
        isVerified: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Recruiter', recruiterSchema);
