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
const {renderNew} = require('../controllers/newController');

// POST route: Route to increment totalPlays
router.get('/', renderNew);

module.exports = router;

