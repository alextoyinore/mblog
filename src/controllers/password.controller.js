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
const renderRecovery = (req, res) => {
    const { userAuthenticated } = req.session.user || {}
    
    res.render('./pages/password');
}

/**
 * Handles registration process for a new user
 * @param {object} req The request object
 * @param {object} res The response object
 * @returns {Promise<void>} - A Promise that returns after the registration process is completed
 * @throws {Error} - If error occurs during registration
 */
const handleRecovery = async (req, res) => {
    try {
        // Extract user data from request body
        const { email, step, password } = req.body;

        // Find the user from database by email
        const user = await User.findOne({email: email})

        // Handle case where no user was found
        if(user && step==1){
            return res.status(200).json({message: 'User account found!', user: user, step: step});
        } else if(user && step == 3) {
            // const {password} = req.body
            const hashedPassword = await bcrypt.hash(password, 10)
            user.password = hashedPassword
            await user.save()
            // res.redirect('/login')
            return res.status(200).json({message: 'Password updated successfully'})
        } else {
            return res.status(400).json({message: 'No record found for this email. Kindly check it and try again.'})
        }

    } catch (error) {
        if (res.status.code >= 400){
            return res.status(400).send({message: error.message});
        }
    }
}

module.exports = {
    renderRecovery,
    handleRecovery
}

