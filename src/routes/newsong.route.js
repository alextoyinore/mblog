/**
 * @license Apache-2.0
 * @copyright 2025 Alexander Ore
 */

'use strict'

/**
 * node modules
 */
const router = require('express').Router();
const multer = require('multer')

/**
 * custom modules
 */
const upload = multer({ dest: 'uploads/' }); // Temporary storage

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

