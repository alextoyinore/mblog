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
const renderSearch = async (req, res) => {
    const { userAuthenticated } = req.session.user || {}

    const query = req.query.q;

    try{
         // Perform a case-insensitive search on the song title and artist name
         const results = await Song.find({
            $or: [
                { songTitle: { $regex: query, $options: 'i' } },
                { artistName: { $regex: query, $options: 'i' } },
                { albumTitle: { $regex: query, $options: 'i' } },
                { genre: { $regex: query, $options: 'i' } },
                // { releaseYear: { $regex: query, $options: 'i' } },
            ],
        }).select('id artwork songFile songTitle artistName albumTitle releaseYear genre user spotify appleMusic youtubeMusic boomplay tidal amazon pandora souncloud audiomack deezer totalPlays totalLikes region country createdAt')
        .populate({
            path: 'user',
            select: 'profileImage name username songs playlist favourites totalFollower totalVisits'
        })
        .sort({ createdAt: 'desc'})
        .exec();

        const topSearches = []
        const trendingSearches = []

        res.render('./layouts/base', {
            page: 'search',
            title: `Search result(s) for: '${toTitleCase(query)}'`,
            sessionUser: req.session.user,
            widgets: ['top-searches', 'trending-searches'],
            route: req.originalUrl,
            songs: results,
            topSearches,
            trendingSearches,
            moment
        });
        
    }catch(error){
        // Log and throw error if there's an issue rendering page
        console.error('Error rendering latest page', error.message);
        throw error;
    }
}

module.exports = {
    renderSearch
}

