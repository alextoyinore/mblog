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
const {handleLogout} = require('../controllers/logoutController');

// POST route: Handles form submission for user logout
router.post('/', handleLogout);

module.exports = router;
