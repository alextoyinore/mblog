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
const {renderPlay} = require('../controllers/play.controller');

// GET route: Render the register page
router.get('/', renderPlay);

module.exports = router;

