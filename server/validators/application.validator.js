const { z } = require('zod');

const applySchema = z.object({
    coverLetter: z.string().max(2000).optional().default(''),
});

const updateStatusSchema = z.object({
    status: z.enum(['applied', 'shortlisted', 'interview', 'offered', 'rejected']),
    note: z.string().max(500).optional().default(''),
    interviewDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }).optional(),
});

module.exports = { applySchema, updateStatusSchema };
