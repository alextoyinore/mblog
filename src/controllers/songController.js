/**
 * @license Apache-2.0
 * @copyright 2025 Alexander Ore
 */

'use strict'


/**
 * node modules
 */
const bcrypt = require('bcrypt');

/**
 * custom modules
 */
const User = require('../models/userModel');
const Song = require('../models/songModel');

/**
 * Renders the register page
 * 
 * @param {object} req - The request object 
 * @param {object} res - The response object
 */
const renderSongPage = async (req, res) => {
    const { userAuthenticated } = req.session.user || {}
    // console.log(req.session.user);

    if (!userAuthenticated){
        return res.redirect('/login');
    }

    const songId = req.params.id; // Access the song ID from the URL

    // Retrieve songs from database, selecting specified fields and populating user field
    const song = await Song.findOne({_id: songId}).select('id artwork songFile songTitle artistName albumTitle releaseYear genre user spotify appleMusic youtubeMusic boomplay tidal amazon pandora souncloud audiomack deezer totalPlays totalLikes region country createdAt');

    if (song) {
        const relatedSongs = await Song.find()
            .select('id artwork songFile songTitle artistName albumTitle releaseYear genre user spotify appleMusic youtubeMusic boomplay tidal amazon pandora soundcloud audiomack deezer totalPlays totalLikes region country createdAt')
            .where('genre').equals(song.genre)
            .limit(3)
            .exec();

        res.render('./pages/song', {
            sessionUser: req.session.user,
            song: song,
            relatedSongs: relatedSongs
        });
    } else {
        res.status(404).send('Song not found');
    }
}

module.exports = {
    renderSongPage
}

