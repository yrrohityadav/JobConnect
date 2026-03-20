const { z } = require('zod');

const registerSchema = z.object({
    name: z.string().min(2).max(50).trim(),
    email: z.string().email().toLowerCase().trim(),
    password: z.string().min(6),
    role: z.enum(['student', 'recruiter']).default('student'),
    companyName: z.string().min(2).max(100).trim().optional(),
});

const data = {
    name: "rohit yadav",
    email: "2004yrrohit@gmail.com",
    password: "rohit123456.",
    role: "student",
    companyName: ""
};

try {
    registerSchema.parse(data);
    console.log("Success");
} catch (error) {
    console.log("Validation Failed:", error.errors);
}
