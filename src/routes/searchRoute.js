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
const { renderSearch } = require('../controllers/searchController');

// GET route: Route to render search
router.get('/', renderSearch);

module.exports = router;

