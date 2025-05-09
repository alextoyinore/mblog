/**
 * @license Apache-2.0
 * @copyright 2025 Alexander Ore
 */

'use strict'


/**
 * node modules
 */
const bcrypt = require('bcrypt');
const moment = require('moment')

/**
 * custom modules
 */
const User = require('../models/user.model');
const Song = require('../models/song.model');

/**
 * Renders the register page
 * 
 * @param {object} req - The request object 
 * @param {object} res - The response object
 */
const renderSongPage = async (req, res) => {
    const { userAuthenticated } = req.session.user || {}
    // console.log(req.session.user);

    // if (!userAuthenticated){
    //     return res.redirect('/login');
    // }

    const songId = req.params.id; // Access the song ID from the URL

    // Retrieve songs from database, selecting specified fields and populating user field
    const song = await Song.findOne({_id: songId}).populate({
        path: 'user'
    })

    if (song) {
        const relatedSongs = await Song.find()
            .where('genre').equals(song.genre)
            .populate({
                path: 'user'
            })
            .limit(3)
            .exec();

        const songsBySameArtist = await Song.find()
            .where('artistName').equals(song.artistName)
            .populate({
                path: 'user'
            })
            .limit(3)
            .exec();

        res.render('./layouts/base', {
            page: 'song',
            title: `${song.songTitle}`,
            widgets: ['relatedsongs', 'same-artist'],
            sessionUser: req.session.user,
            route: req.originalUrl,
            song: song,
            relatedSongs: relatedSongs,
            songsBySameArtist,
            moment
        });
    } else {
        res.status(404).send('Song not found');
    }
}

module.exports = {
    renderSongPage
}

