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
const {incrementPlays} = require('../controllers/increment.plays.controller');

// POST route: Route to increment totalPlays
router.post('/:id', incrementPlays);

module.exports = router;

