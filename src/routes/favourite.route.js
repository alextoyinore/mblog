/**
 * @license Apache-2.0
 * @copyright 2025 Alexander Ore
 */

'use strict'

/**
 * node modules
 */
const express = require('express');
const router = express.Router();
const moment = require('moment');


/**
 * custom modules
 */
const User = require('../models/user.model');
const Song = require('../models/song.model');


// Get user favorites
router.get('/', async (req, res) => {

    const { userAuthenticated } = req.session.user || {}

    if (!userAuthenticated){
        return res.redirect('/login');
    }

    const userId = req.session.user.id; // Assuming you store the user ID in the session

    try {
        const user = await User.findById(userId).populate({
            path: 'favourites', 
            select: 'id artwork songFile songTitle artistName albumTitle releaseYear genre user spotify appleMusic youtubeMusic boomplay tidal amazon pandora soundcloud audiomack deezer totalPlays totalLikes region country totalShares totalPlaylistAdds moreInfo createdAt'}); // Populate to get song details if needed
        
            if (!user) return res.status(404).send({ message: 'User not found' });

        // favourites = user.favourites // Send back the list of favorite song IDs

        res.render('./layouts/base', {
            page: 'liked',
            title: 'Liked Songs',
            // widgets: ['trending', 'topsongs'],
            sessionUser: req.session.user,
            route: req.originalUrl,
            favourites: user.favourites,
            // trendingSongs,
            // topSongs,
            // songsByRegion,
            // songsByGenre,
            // recentArtists,
            moment
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

// Favorite a song
router.post('/', async (req, res) => {
    const { songId } = req.body;
    const userId = req.session.user.id; // Assuming you store userId in session

    if (!userId) {
        // return res.status(401).json({ message: 'Unauthorized' });
        return res.redirect('/login')
    }

    try {
        const user = await User.findById(userId);
        const isFavorited = user.favourites.includes(songId);

        if (isFavorited) {
            // Remove from favorites
            user.favourites.pull(songId);
        } else {
            // Add to favorites
            user.favourites.push(songId);
        }

        await user.save();
        res.json({ isFavorited: !isFavorited }); // Return the new state
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

