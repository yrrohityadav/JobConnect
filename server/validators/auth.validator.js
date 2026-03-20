const { z } = require('zod');

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters').trim(),
    email: z.string().email('Please provide a valid email').toLowerCase().trim(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['student', 'recruiter']).default('student'),
    // Recruiter-specific fields
    companyName: z.string().max(100).trim().optional().or(z.literal('')),
});

const loginSchema = z.object({
    email: z.string().email('Please provide a valid email').toLowerCase().trim(),
    password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
    email: z.string().email('Please provide a valid email').toLowerCase().trim(),
});

const resetPasswordSchema = z.object({
    email: z.string().email('Please provide a valid email').toLowerCase().trim(),
    otp: z.string().length(6, 'OTP must be 6 digits'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        const errors = error.errors.map((e) => e.message);
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors,
        });
    }
};

module.exports = {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    validate,
};
