const cloudinary = require('../config/cloudinary');

/**
 * Upload a buffer to Cloudinary
 * @param {Buffer} buffer - File buffer
 * @param {string} folder - Cloudinary folder name
 * @param {string} resourceType - 'image' | 'raw' (for PDFs)
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadToCloudinary = (buffer, folder, resourceType = 'image') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `job-portal/${folder}`,
                resource_type: resourceType,
            },
            (error, result) => {
                if (error) {
                    reject(new Error(`Cloudinary upload failed: ${error.message}`));
                } else {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                }
            }
        );

        uploadStream.end(buffer);
    });
};

/**
 * Delete a resource from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - 'image' | 'raw'
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
        console.error('Cloudinary delete error:', error.message);
    }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
