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
const {renderRecovery, handleRecovery} = require('../controllers/password.controller');

// GET route: Render the register page
router.get('/', renderRecovery);

// POST route: Handles form submission for user registration
router.post('/', handleRecovery);

module.exports = router;

