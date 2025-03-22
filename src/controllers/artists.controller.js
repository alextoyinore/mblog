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
const Song = require('../models/song.model');
const {toTitleCase} = require('../../public/js/utils/funcs')

/**
 * Renders the register page
 * 
 * @param {object} req - The request object 
 * @param {object} res - The response object
 */
const renderArtists = async (req, res) => {

    try {
        // Retrieve songs from database, selecting specified fields and populating user field
        const artistsWithPlayCounts = await Song.aggregate([
            {
                $group: {
                    _id: "$artistName", // Group by artist name
                    totalPlays: { $sum: "$totalPlays" }, // Sum the total plays for each artist
                    artwork: { $first: "$artwork" } // Get the artwork of the first song for the artist
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the default _id field
                    artistName: "$_id", // Rename _id to artistName
                    totalPlays: 1, // Include the totalPlays field
                    artwork: 1 // Include the artwork field
                }
            },
            {
                $sort: { totalPlays: -1 } // Sort by totalPlays in descending order
            }
        ]);

        // Top Genres
        const topArtists = await Song.aggregate([
            {
                $group: {
                    _id: {
                        artistName: "$artistName", // Group by artist name
                        region: "$region",         // Include region in the grouping
                        country: "$country",        // Include country in the grouping
                    },
                    artwork: { $first: "$artwork" }, // Get the artwork of the first song for the artist
                    totalViews: { $sum: "$totalPlays" } // Sum the total plays for each artist
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the default _id field
                    artist: "$_id.artistName", // Rename _id.artistName to artist
                    region: "$_id.region",     // Include region
                    country: "$_id.country",   // Include country
                    artwork: 1, // Include the artwork field
                    totalViews: 1             // Include the totalViews field
                }
            },
            {
                $sort: { totalViews: -1 } // Sort by totalViews in descending order
            },
            {
                $limit: 5 // Limit the results to the top 5 artists
            }
        ]);


        // Trending Genres
        const threeDaysAgo = moment().subtract(3, 'days').toDate();

        const trendingArtists = await Song.aggregate([
            {
                $match: {
                    createdAt: { $gte: threeDaysAgo } // Filter for songs created in the last 3 days
                }
            },
            {
                $group: {
                    _id: "$artistName", // Group by artist name
                    totalPlays: { $sum: "$totalPlays" } // Sum the total plays for each artist
                }
            },
            {
                $sort: { totalPlays: -1 } // Sort by totalPlays in descending order
            },
            {
                $limit: 5 // Limit the results to the top artist
            }
        ]);


        res.render('./layouts/base', {
            page: 'artists',
            title: 'Artists',
            widgets: ['top-artists'],
            sessionUser: req.session.user,
            route: req.originalUrl,
            artists: artistsWithPlayCounts,
            trendingArtists,
            topArtists,
            moment
        });

    } catch (error) {
        if (res.status.code >= 400){
            return res.status(400).send(error.message);
        } else if (res.status.code >= 500) {
            return res.status(400).send(error.message);
        }
    }
}

module.exports = {
    renderArtists
}

