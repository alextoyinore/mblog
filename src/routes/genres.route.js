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
const { renderGenres } = require('../controllers/genres.controller');

// GET route: Route to render search
router.get('/', renderGenres);

module.exports = router;

