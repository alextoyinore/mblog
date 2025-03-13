/**
 * @license Apache-2.0
 * @copyright 2025 Alexander Ore
 */

'use strict';

/**
 * Creates a username based on the provided email or combination of name and email provided
 * 
 * @param {string} email - The email provided
 * @returns {string} - A unique username composed of the first part of the provided email before @ symbol but if the username has been taken it combines email with timestamp
 */

module.exports = (email) => {
    const username = email.toLowerCase().split('@');
    return `${username[0]}-${Date.now()}`
}
