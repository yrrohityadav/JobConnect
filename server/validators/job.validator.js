const { z } = require('zod');

const createJobSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100).trim(),
    description: z.string().min(20, 'Description must be at least 20 characters').max(5000).trim(),
    requirements: z.array(z.string().trim()).optional().default([]),
    skills: z.array(z.string().trim()).optional().default([]),
    salary: z.object({
        min: z.number().min(0).optional().default(0),
        max: z.number().min(0).optional().default(0),
        currency: z.string().optional().default('INR'),
    }).optional(),
    jobType: z.enum(['Full-time', 'Part-time', 'Internship', 'Remote', 'Contract']),
    location: z.string().min(2).trim(),
    openings: z.number().int().min(1).optional().default(1),
    deadline: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
});

const updateJobSchema = createJobSchema.partial();

module.exports = { createJobSchema, updateJobSchema };
