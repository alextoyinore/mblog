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
const {renderHome, handleSearch} = require('../controllers/homeController');

// GET route: Render the register page
router.get('/', renderHome);

// POST route: Handles form submission for user registration
router.post('/', handleSearch);

module.exports = router;

