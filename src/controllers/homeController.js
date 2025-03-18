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
        .limit(10)
        .exec();

        
        // Retrieve Trending Songs
        const threeDaysAgo = moment().subtract(3, 'days').toDate(); // Get the date for 3 days ago

        const trendingSongs = await Song.find({
            createdAt: { $gte: threeDaysAgo } // Filter for songs created in the last 3 days
        })
        .select('id artwork songFile songTitle artistName albumTitle releaseYear genre user spotify appleMusic youtubeMusic boomplay tidal amazon pandora soundcloud audiomack deezer totalPlays totalLikes region country createdAt')
        .sort({ totalPlays: -1 }) // Sort by totalPlays in descending order
        .limit(5) // Limit the results to 10
        .exec(); // Execute the query

        // Retrieve Top Songs
        const topSongs = await Song.find()
            .select('id artwork songFile songTitle artistName albumTitle releaseYear genre user spotify appleMusic youtubeMusic boomplay tidal amazon pandora soundcloud audiomack deezer totalPlays totalLikes region country createdAt')
            .sort({ totalPlays: -1 })
            .limit(5)
            .exec();

        /**
         * Songs by Region
         */

        // Group songs by region
        
        // Fetch all songs from the database
        const songs = await Song.find()
        .select('id artwork songFile songTitle artistName albumTitle releaseYear genre user spotify appleMusic youtubeMusic boomplay tidal amazon pandora soundcloud audiomack deezer totalPlays totalLikes region country createdAt')
        .limit(10)
        .exec();

        // Group songs by region
        const songsByRegion = {};

        songs.forEach(song => {
            const region = song.region || 'Global'; // Default to 'Unknown' if no region is specified

            // Initialize the region if it doesn't exist
            if (!songsByRegion[region]) {
            songsByRegion[region] = [];
            }

            // Push the song to the corresponding region
            songsByRegion[region].push(song);
        });

        // Limit to 10 songs per region
        for (const region in songsByRegion) {
            songsByRegion[region] = songsByRegion[region].slice(0, 10); // Get the first 10 songs
        }

        /**
         * Songs By Genre
         */

        // Group songs by genre
        const songsByGenre = {};

        songs.forEach(song => {
            const genre = song.genre || 'World'; // Default to 'World' if no genre is specified

            // Initialize the genre if it doesn't exist
            if (!songsByGenre[genre]) {
                songsByGenre[genre] = [];
            }

            // Push the song to the corresponding genre
            songsByGenre[genre].push(song);
        });

        // Limit to 10 songs per genre
        for (const genre in songsByGenre) {
            songsByGenre[genre] = songsByGenre[genre].slice(0, 10); // Get the first 10 songs
        }

        res.render('./pages/home', {
            sessionUser: req.session.user,
            route: req.originalUrl,
            latestSongs,
            trendingSongs,
            topSongs,
            songsByRegion,
            songsByGenre,
            moment
        });

        // console.log(latestSongs);

        
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
    handleSearch,
}

