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
    renderArtists 
} = require('../controllers/artists.controller');

// GET route: Render the song page
router.get('/', renderArtists);

module.exports = router;

