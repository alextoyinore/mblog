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
const {renderRegister, handleRegister} = require('../controllers/register.controller');

// GET route: Render the register page
router.get('/', renderRegister);

// POST route: Handles form submission for user registration
router.post('/', handleRegister);

module.exports = router;
