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
    renderUser 
} = require('../controllers/profile.controller');

// GET route: Render the song page
router.get('/', renderUser);

module.exports = router;

