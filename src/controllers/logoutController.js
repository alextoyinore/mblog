/**
 * @license Apache-2.0
 * @copyright 2025 Alexander Ore
 */

'use strict'

/**
 * node modules
 */
const bcrypt = require('bcrypt');

/**
 * custom modules
 */
const User = require('../models/userModel');

/**
 * Renders the register page
 * 
 * @param {object} req - The request object 
 * @param {object} res - The response object
 */
const handleLogout = (req, res) => {
    const { userAuthenticated } = req.session.user || {}
    
    try {
        if (userAuthenticated){
            req.session.destroy();
            return res.redirect('/login');
        } else {
            return res.redirect('/login');
        }
    } catch (error) {
        // Log and throw error if there's an issue loggin out
        if (res.status.code >= 400){
            return res.status(400).send({message: error.message});
        }
        
        if (res.status.code >= 500){
            return res.status(500).send({message: error.message});
        } 
        throw error;
    }    
}


module.exports = {
    handleLogout
}

