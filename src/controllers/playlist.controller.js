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

/**
 * Renders the register page
 * 
 * @param {object} req - The request object 
 * @param {object} res - The response object
 */
const renderPlaylist = async (req, res) => {

    const { userAuthenticated } = req.session.user || {}

    if (!userAuthenticated){
        return res.redirect('/login');
    }

    const userId = req.session.user.id; // Assuming you store the user ID in the session

    try {
        // Find the user to get their favorite song IDs
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found'); // Handle user not found
        }

         // Query the Song model to find songs that are in the user's playlist
        const playlist = await Song.find({ _id: { $in: user.playlist } }) .populate({
            path: 'user'
        })

        res.render('./layouts/base', {
            page: 'playlist',
            title: 'Playlist',
            widgets: [],
            sessionUser: req.session.user,
            route: req.originalUrl,
            playlist,
            // user,
            moment
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

const handleAddToPlaylist = async (req, res) => {
    const { songId } = req.body;
    const userId = req.session.user.id; // Assuming you store userId in session

    if (!userId) {
        return res.redirect('/login')
    }

    try {
        const user = await User.findById(userId);
        const isInPlaylist = user.playlist.includes(songId);

        if (isInPlaylist) {
            // Remove from favorites
            user.playlist.pull(songId);
        } else {
            // Add to favorites
            user.playlist.push(songId);
        }

        await user.save();
        res.json({ isInPlaylist: !isInPlaylist }); // Return the new state
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    renderPlaylist,
    handleAddToPlaylist
}

