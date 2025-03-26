/**
 * @license Apache-2.0
 * @copyright 2025 Alexander Ore
 */

'use strict'

/**
 * node modules
 */
const router = require('express').Router();
const multer = require('multer');
const path = require('path');


// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

// Configure file filter
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'songFile') {
        // Accept audio files
        if (file.mimetype.startsWith('audio/')) {
            cb(null, true);
        } else {
            cb(new Error('Only audio files are allowed!'), false);
        }
    } else if (file.fieldname === 'artwork') {
        // Accept image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    } else {
        cb(new Error('Unexpected field'), false);
    }
};

/**
 * custom modules
 */
const upload = multer({ storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 8 * 1024 * 1024, // 300MB limit
    } 
}); // Temporary storage

const {
    handleNewSongOrURL, 
    renderNewSongOrURL, 
    handleEditSongOrURL
} = require('../controllers/newsong.controller');

// GET route: Render the add song page
router.get('/', renderNewSongOrURL);

// POST route: Handles form submission for adding song or song URL
router.post('/', upload.single('songFile'), handleNewSongOrURL);

// POST route: Handles form submission for editing song or song URL
router.post('/', handleEditSongOrURL);

module.exports = router;

