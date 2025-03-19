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
const Song = require('../models/songModel');
const {toTitleCase} = require('../../public/js/utils/funcs')

/**
 * Renders the register page
 * 
 * @param {object} req - The request object 
 * @param {object} res - The response object
 */
const renderGenre = async (req, res) => {
    // const { userAuthenticated } = req.session.user || {}
    // console.log(req.session.user);

    // if (!userAuthenticated){
    //     return res.redirect('/login');
    // }

    try {
        const genre = req.params.genre; // Access the song ID from the URL

        // Retrieve songs from database, selecting specified fields and populating user field
        const songs = await Song.find({
            genre: { $regex: new RegExp(genre, 'i') }
        }).select('id artwork songFile songTitle artistName albumTitle releaseYear genre user spotify appleMusic youtubeMusic boomplay tidal amazon pandora soundcloud audiomack deezer totalPlays totalLikes region country totalShares totalPlaylistAdds moreInfo createdAt')
        .sort({ createdAt: 'desc'});

        res.render('./pages/genre', {
            songs: songs,
            title: toTitleCase(genre),
            route: req.originalUrl,
            moment: moment
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
    renderGenre
}

