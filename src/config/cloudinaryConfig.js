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

module.exports = uploadToCloudinary
