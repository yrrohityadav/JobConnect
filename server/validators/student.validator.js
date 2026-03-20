const { z } = require('zod');

const updateProfileSchema = z.object({
    bio: z.string().max(500).optional(),
    skills: z.array(z.string().trim()).optional(),
    education: z.array(z.object({
        degree: z.string().min(1),
        institution: z.string().min(1),
        year: z.number().int().optional(),
        cgpa: z.number().min(0).max(10).optional(),
    })).optional(),
    experience: z.array(z.object({
        title: z.string().min(1),
        company: z.string().min(1),
        duration: z.string().optional(),
        description: z.string().optional(),
    })).optional(),
    location: z.string().optional(),
    linkedIn: z.string().url().optional().or(z.literal('')),
    github: z.string().url().optional().or(z.literal('')),
    portfolio: z.string().url().optional().or(z.literal('')),
});

module.exports = { updateProfileSchema };
