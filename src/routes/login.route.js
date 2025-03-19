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
const {renderLogin, handleLogin} = require('../controllers/login.controller');

// GET route: Render the register page
router.get('/', renderLogin);

// POST route: Handles form submission for user registration
router.post('/', handleLogin);

module.exports = router;
