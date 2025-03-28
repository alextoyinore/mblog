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
const {renderHome} = require('../controllers/home.controller');

// GET route: Render the register page
router.get('/', renderHome);

module.exports = router;

