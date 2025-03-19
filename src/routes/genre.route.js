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
const { renderGenre } = require('../controllers/genre.controller');

// GET route: Route to render search
router.get('/:genre', renderGenre);

module.exports = router;

