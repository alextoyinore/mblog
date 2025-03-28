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
const User = require('../models/user.model');
const generateUsername = require('../../public/js/utils/generateUsername');

/**
 * Renders the register page
 * 
 * @param {object} req - The request object 
 * @param {object} res - The response object
 */
const renderRegister = (req, res) => {
    const { userAuthenticated } = req.session.user || {}
    // console.log(req.session.user);

    if (userAuthenticated){
        return res.redirect('/');
    }
    res.render('./pages/register');
}
/**
 * Handles registration process for a new user
 * @param {object} req The request object
 * @param {object} res The response object
 * @returns {Promise<void>} - A Promise that returns after the registration process is completed
 * @throws {Error} - If error occurs during registration
 */
const handleRegister = async (req, res) => {
    try {
        // Extract user data from request body
        const { name, email, securityQuestion, securityAnswer, password } = req.body;
        // console.log(req.body);
        
        // Create username
        const username = generateUsername(email)
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)
        // Create user with provided data
        await User.create({ name, email, securityQuestion, securityAnswer, password: hashedPassword, username });
        // Redirect user to login page upon success
        res.redirect('/login');

    } catch (error) {
        if (error.code === 11000){
            if(error.keyPattern.email){
                return res.status(400).send({message: 'An account with this email already exists'});
            }

            if(error.keyPattern.username){
                return res.status(400).send({message: 'Kindly use another email please. The username we generated from your email address is already taken by another user. Or, try again shortly with the same email.'});
            }
        }else{
            return res.status(400).send({message: `An error occured while creating user. ${error.message}`});
        }

        console.log(error.message);
        throw error;
        
    }
    
}

module.exports = {
    renderRegister,
    handleRegister
}
