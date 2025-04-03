/**
 * @license Apache-2.0
 * @copyright 2025 Alexander Ore
 */

'use strict'

/**
 * node modules
 */
const bcrypt = require('bcrypt');
const moment = require('moment');

/**
 * custom modules
 */
const User = require('../models/user.model');
const Song = require('../models/song.model')
const {toTitleCase} = require('../../public/js/utils/funcs')

/**
 * Renders the register page
 * 
 * @param {object} req - The request object 
 * @param {object} res - The response object
 */
const renderCharts = async (req, res) => {
    const { userAuthenticated } = req.session.user || {}

    try {

        res.render('./layouts/baseWide', {
            page: 'charts',
            title: 'Charts',
            sessionUser: req.session.user,
            route: req.originalUrl,
            // songs: results,
            moment
        });
        
    } catch(error) {
        // Log and throw error if there's an issue rendering page
        console.error('Error rendering latest page', error.message);
        throw error;
    }
}

module.exports = {
    renderCharts
}

