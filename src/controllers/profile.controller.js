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
    const { userAuthenticated, username } = req.session.user || {}
    // console.log(req.session.user);

    if (!userAuthenticated){
        return res.redirect('/login');
    }

    // Retrieve songs from database, selecting specified fields and populating user field
    const user = await User.findOne({username: username})
        .select('id username email name bio songs playlist links songsPublished favourites totalFollowers totalVisits createdAt')
        .populate({
            path: 'songs',
            select: 'id artwork songFile songTitle artistName albumTitle releaseYear genre user spotify appleMusic youtubeMusic boomplay tidal amazon pandora soundcloud audiomack deezer totalPlays totalLikes region country totalShares totalPlaylistAdds moreInfo createdAt',
            options: { sort: { createdAt: -1 } }
        })
        .exec()

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

