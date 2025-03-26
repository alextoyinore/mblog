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
    renderWelcome
} = require('../controllers/welcome.controller');

// GET route: Render the song page
router.get('/', renderWelcome);

module.exports = router;

