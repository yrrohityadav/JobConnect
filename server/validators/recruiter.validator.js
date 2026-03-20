const { z } = require('zod');

const updateProfileSchema = z.object({
    company: z.object({
        name: z.string().min(2).max(100).trim().optional(),
        description: z.string().max(1000).optional(),
        industry: z.string().optional(),
        size: z.enum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+', '']).optional(),
        website: z.string().url().optional().or(z.literal('')),
    }).optional(),
});

module.exports = { updateProfileSchema };
