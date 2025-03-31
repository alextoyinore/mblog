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
const renderUser = async (req, res) => {
    const { userAuthenticated, username, id } = req.session.user || {}
    // console.log(req.session.user);

    if (!userAuthenticated){
        return res.redirect('/login');
    }

    // Retrieve songs from database, selecting specified fields and populating user field
    const user = await User.findOne({username: username})
        .populate({
            path: 'songs',
            populate: {
                path: 'user'
            },
            options: { sort: { createdAt: -1 } }
        })
        .exec()

    // Retrieve user songs in a way that streamers can update liked and playlist for a song 
    const userrSongs = await Song.find({ _id: { $in: user.favourites } }) .populate({
        path: 'user'
    })

    const userTopSongs = [...user.songs].sort((a, b) => b.totalPlays - a.totalPlays).slice(0,5);

    if (user) {
        res.render('./layouts/base', {
            page: 'profile',
            title: `${user.name}`,
            widgets: ['user-top-songs', 'user-top-artists'],
            sessionUser: req.session.user,
            route: req.originalUrl,
            user,
            userTopSongs,
            moment
        });
    } else {
        res.status(404).send('Song not found');
    }
}

module.exports = {
    renderUser
}

