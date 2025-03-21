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
                    _id: "$artistName",
                    totalPlays: { $sum: "$totalPlays" }
                }
            },
            {
                $project: {
                    _id: 0,
                    artistName: "$_id",
                    totalPlays: 1
                }
            },
            {
                $sort: { totalPlays: -1 }
            }
        ]);

        // Top Genres
        const topArtists = await Song.aggregate([
            {
                $group: {
                    _id: "$artistName",
                    totalViews: { $sum: "$totalPlays" }
                }
            },
            {
                $project: {
                    _id: 0,
                    artist: "$_id",
                    totalViews: 1
                }
            },
            {
                $sort: { totalViews: -1 }
            }
        ]).limit(5);


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

