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

/**
 * Renders the register page
 * 
 * @param {object} req - The request object 
 * @param {object} res - The response object
 */
const renderNew = async (req, res) => {

    try{

        // Retrieve songs from database, selecting specified fields and populating user field
        const latestSongs = await Song.find()
        .populate({
            path: 'user'
        })
        .sort({ createdAt: 'desc'})
        .exec();

        // Retrieve Top Songs
        const topSongs = [...latestSongs].sort((a, b) => b.totalPlays - a.totalPlays).slice(0,5);

        // Retrieve Trending Songs
        const threeDaysAgo = moment().subtract(3, 'days').toDate(); // Get the date for 3 days ago

        const trendingSongs = latestSongs.filter(song => 
            song.createdAt >= threeDaysAgo && song.totalPlays > 0
        ).slice(0,5);

        res.render('./layouts/base', {
            page: 'newarrivals',
            title: 'New Arrivals',
            widgets: ['trending', 'topsongs'],
            sessionUser: req.session.user,
            route: req.originalUrl,
            latestSongs,
            topSongs,
            trendingSongs,
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

