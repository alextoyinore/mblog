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

const {renderFavourites, handleAddToFavourites} = require('../controllers/favourite.controller')


// Get user favorites
router.get('/', renderFavourites);

// Favorite a song
router.post('/', handleAddToFavourites);

module.exports = router;

