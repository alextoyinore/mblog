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
    renderArtist 
} = require('../controllers/artist.controller');

// GET route: Render the song page
router.get('/:name', renderArtist);

module.exports = router;

