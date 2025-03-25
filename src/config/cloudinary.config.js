/**
 * @license Apache-2.0
 * @copyright 2025 Alexander Ore
 */

'use strict';


/**
 * node modules
 */
const cloudinary = require('cloudinary').v2;

/**
 * configures cloudinary
 */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Custom modules
 */
const config = require('../../public/js/utils/config.js')
console.log(config)

/**
 * upload base64 image to cloudinary
 * @param {String} image - The base64 image to upload
 * @param {String} public_id - The  identifier that's used for accessing and delivering the uploaded asset
 * @returns {Promise<String>} A promise that resolves to the secure url of the uploaded image on Cloudinary
 * @throws {Error} If there's an error during the upload process
 */

const uploadToCloudinary = async (image, public_id) => {
    try {
        const response = await cloudinary.uploader.upload(image, {
            resource_type: 'auto',
            public_id
        });
        return response.secure_url;
    } catch(error) {
        console.error('Error uploading artwork to Cloudinary', error);
        throw error;
    }
}

const uploadAudioToCloudinary = async (audioFile) => {
    try {
        // Validate file type
        // const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
        const allowedTypes = ['audio/mp3', 'audio/mpeg', 'audio/ogg'];

        if (!allowedTypes.includes(audioFile.mimetype)) {
            throw new Error('Invalid audio file type. Please upload MP3 or OGG files only.');
        }

        // Validate file size (e.g., max 10MB)
        const maxSize = 5 * 1024 * 1024; // 3MB in bytes
        if (audioFile.size > maxSize) {
            throw new Error(`Audio file size exceeds ${maxSize}MB limit.`);
        }

        // Upload to Cloudinary with audio settings
        const result = await cloudinary.uploader.upload(audioFile.path, {
            resource_type: "video", // Cloudinary uses "video" type for audio files
            folder: "audio_uploads", // Specify your folder in Cloudinary
            format: "mp3", // Convert to MP3 format
            audio_codec: "mp3", // Use MP3 codec
            bit_rate: "128k", // Set bitrate
            overwrite: true,
            // notification_url: "https://your-callback-url.com/notify", // Optional: URL for upload notifications
            tags: ["audio", "music"], // Optional: Add tags for organization
        });

        // Return the upload result
        return {
            public_id: result.public_id,
            url: result.secure_url,
            format: result.format,
            duration: result.duration, // Duration in seconds
            bytes: result.bytes, // File size in bytes
        };

    } catch (error) {
        console.error('Error uploading audio to Cloudinary:', error);
        throw error;
    }
};

module.exports = { uploadToCloudinary, uploadAudioToCloudinary }

