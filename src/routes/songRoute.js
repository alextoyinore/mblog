/**
 * @license Apache-2.0
 * @copyright 2025 Alexander Ore
 */

'use strict'

/**
 * node modules
 */
const router = require('express').Router();

/**
 * custom modules
 */
const {
    renderAddSongOrURL, 
    handleAddSongOrURL, 
    handleEditSongOrURL
} = require('../controllers/songController');

// GET route: Render the add song page
router.get('/', renderAddSongOrURL);

// POST route: Handles form submission for adding song or song URL
router.post('/', handleAddSongOrURL);

// POST route: Handles form submission for editing song or song URL
router.post('/', handleEditSongOrURL);

module.exports = router;
