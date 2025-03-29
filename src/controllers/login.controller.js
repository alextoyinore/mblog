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

/**
 * Renders the register page
 * 
 * @param {object} req - The request object 
 * @param {object} res - The response object
 */
const renderLogin = (req, res) => {
    const { userAuthenticated } = req.session.user || {}
    // console.log(req.session.user);

    if (userAuthenticated){
        return res.redirect('/');
    }
    
    res.render('./pages/login');
}

/**
 * Handles registration process for a new user
 * @param {object} req The request object
 * @param {object} res The response object
 * @returns {Promise<void>} - A Promise that returns after the registration process is completed
 * @throws {Error} - If error occurs during registration
 */
const handleLogin = async (req, res) => {
    try {
        // Extract user data from request body
        const { email, password } = req.body;
        // console.log(req.body);

        // Find the user from database by email
        const currentUser = await User.findOne({email: email})
        // console.log(currentUser);

        // Handle case where no user was found
        if(!currentUser){
            return res.status(400).send({message: 'User with this email does not exist in our records'});
        }
        
        // Check if password is valid
        const passwordValid = await bcrypt.compare(password, currentUser.password);
        if(!passwordValid){
            return res.status(400).send({message: 'The password you provided does not match this account.'});
        }
        
        // set session userAuthenticated to true and redirect to homepage
        req.session.user = {
            userAuthenticated: true,
            id: currentUser._id,
            name: currentUser.name,
            username: currentUser.username,
            profilePhotoURL: currentUser.profileImage?.url
        }

        // Redirect user to login page upon success
        res.redirect('/');

    } catch (error) {
        if (res.status.code >= 400){
            return res.status(400).send({message: error.message});
        }
    }
}

module.exports = {
    renderLogin,
    handleLogin
}

