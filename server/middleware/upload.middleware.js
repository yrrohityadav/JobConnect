const multer = require('multer');

// Use memory storage so we can stream to Cloudinary
const storage = multer.memoryStorage();

// File filter for resumes (PDF only)
const resumeFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed for resumes'), false);
    }
};

// File filter for images (logos, avatars)
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const uploadResume = multer({
    storage,
    fileFilter: resumeFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

const uploadImage = multer({
    storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
    },
});

module.exports = { uploadResume, uploadImage };
