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
const renderDiscover = async (req, res) => {
    const { userAuthenticated } = req.session.user || {}

    // const query = req.query.q;

    try {
    //      // Perform a case-insensitive search on the song title and artist name
    //      const results = await Song.find({
    //         $or: [
    //             { songTitle: { $regex: query, $options: 'i' } },
    //             { artistName: { $regex: query, $options: 'i' } },
    //             { albumTitle: { $regex: query, $options: 'i' } },
    //             { genre: { $regex: query, $options: 'i' } },
    //             { country: { $regex: query, $options: 'i' } },
    //             { region: { $regex: query, $options: 'i' } },
    //             { writer: { $regex: query, $options: 'i' } },
    //             { producer: { $regex: query, $options: 'i' } },
    //             // { releaseYear: { $regex: query } },
    //         ],
    //     })
    //     .populate({
    //         path: 'user',
    //     })
    //     .sort({ createdAt: 'desc'})
    //     .exec();

        res.render('./layouts/baseWide', {
            page: 'discover',
            title: 'Discover',
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
    renderDiscover
}

