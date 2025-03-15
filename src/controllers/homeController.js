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
const renderHome = async (req, res) => {
    const { userAuthenticated } = req.session.user || {}
    // console.log(req.session.user);

    if (!userAuthenticated){
        return res.redirect('/login');
    }

    try{

        // Retrieve songs from database, selecting specified fields and populating user field
        const latestSongs = await Song.find().select('id artwork songFile songTitle artistName albumTitle releaseYear genre user spotify appleMusic youtubeMusic boomplay tidal amazon pandora souncloud audiomack deezer totalPlays totalLikes region country createdAt')
        .populate({
            path: 'user',
            select: 'profileImage name username songs playlist favourites totalFollower totalVisits'
        })
        .sort({ createdAt: 'desc'});

        const rockSongs = latestSongs.filter((song) => song.genre.toLowerCase() === 'rock');

        res.render('./pages/home', {
            sessionUser: req.session.user,
            latestSongs,
            rockSongs,
            moment
        });

        console.log(latestSongs);

        
    }catch(error){
        // Log and throw error if there's an issue rendering page
        console.error('Error rendering home page', error.message);
        throw error;
    }
}

/**
 * Handles registration process for a new user
 * @param {object} req The request object
 * @param {object} res The response object
 * @returns {Promise<void>} - A Promise that returns after the registration process is completed
 * @throws {Error} - If error occurs during registration
 */
const handleSearch = async (req, res) => {
    try {
        // Handle search

        // Redirect user to login page upon success
        res.redirect('/');

    } catch (error) {
        if (res.status.code >= 400){
            return res.status(400).send({message: error.message});
        }
    }
}

module.exports = {
    renderHome,
    handleSearch
}

