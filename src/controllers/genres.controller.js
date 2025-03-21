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
const renderGenres = async (req, res) => {

    try {
        // Retrieve songs from database, selecting specified fields and populating user field
        const genresWithCounts = await Song.aggregate([
            {
                $group: {
                    _id: "$genre",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    genre: "$_id",
                    count: 1
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.render('./layouts/base', {
            page: 'genres',
            title: 'Genres',
            widgets: ['trending', 'topsongs'],
            sessionUser: req.session.user,
            route: req.originalUrl,
            genres: genresWithCounts,
            // trendingSongs,
            // topSongs,
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
    renderGenres
}

