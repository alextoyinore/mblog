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
const User = require('../models/userModel');
const Song = require('../models/songModel')

/**
 * Renders the register page
 * 
 * @param {object} req - The request object 
 * @param {object} res - The response object
 */
const renderNew = async (req, res) => {
    const { userAuthenticated } = req.session.user || {}

    // if (!userAuthenticated){
    //     return res.redirect('/login');
    // }

    try{

        // Retrieve songs from database, selecting specified fields and populating user field
        const latestSongs = await Song.find().select('id artwork songFile songTitle artistName albumTitle releaseYear genre user spotify appleMusic youtubeMusic boomplay tidal amazon pandora souncloud audiomack deezer totalPlays totalLikes region country createdAt')
        .populate({
            path: 'user',
            select: 'profileImage name username songs playlist favourites totalFollower totalVisits'
        })
        .sort({ createdAt: 'desc'})
        .exec();

        res.render('./pages/new', {
            sessionUser: req.session.user,
            route: req.originalUrl,
            latestSongs,
            title: 'New Arrivals',
            moment
        });
        
    }catch(error){
        // Log and throw error if there's an issue rendering page
        console.error('Error rendering latest page', error.message);
        throw error;
    }
}


module.exports = {
    renderNew,
}

