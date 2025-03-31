/**
 * @license Apache-2.0
 * @copyright 2025 Alexander Ore
 */

'use strict'

/**
 * node modules
 */
const express = require('express');
const router = express.Router();

/**
 * custom modules
 */

const {renderPlaylist, handleAddToPlaylist} = require('../controllers/playlist.controller')


// Get user favorites
router.get('/', renderPlaylist);

// Favorite a song
router.post('/', handleAddToPlaylist);

module.exports = router;

