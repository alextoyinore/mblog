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
        const user = await User.findById(userId).populate('favourites'); // Populate to get song details if needed
        if (!user) return res.status(404).send({ message: 'User not found' });

        res.json({ favourites: user.favourites }); // Send back the list of favorite song IDs
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

// Favorite a song
router.post('/:id', async (req, res) => {

    const { userAuthenticated } = req.session.user || {}

    if (!userAuthenticated){
        return res.redirect('/login');
    }

    const userId  = req.session.user.id // Assuming you send the user ID in the request body
    const songId  = req.params;

    try {
        const user = await User.findById(userId);
        const song = await Song.findById(songId);

        if (!user) return res.status(404).send({ message: 'User not found' });
        if (!song) return res.status(404).send({ message: 'Song not found' });

        // Add song to user's favorites if not already present
        if (!user.favourites.includes(songId)) {
            user.favourites.push(songId);
            await user.save();
            return res.status(200).send({ message: 'Song added to favourites' });
        } else {
            return res.status(400).send({ message: 'Song already in favourites' });
        }
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

// Unfavorite a song
router.delete('/:id', async (req, res) => {
    const { userAuthenticated } = req.session.user || {}

    if (!userAuthenticated){
        return res.redirect('/login');
    }

    const userId  = req.session.user.id // Assuming you send the user ID in the request body
    const songId  = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).send({ message: 'User not found' });

        // Remove song from user's favorites if present
        if (user.favourites.includes(songId)) {
            user.favourites = user.favourites.filter(id => id.toString() !== songId);
            await user.save();
            return res.status(200).send({ message: 'Song removed from favourites' });
        } else {
            return res.status(400).send({ message: 'Song not in favourites' });
        }
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

module.exports = router;

