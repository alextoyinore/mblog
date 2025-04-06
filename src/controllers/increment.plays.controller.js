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
const User = require('../models/user.model');
const Song = require('../models/song.model'); // Adjust the path to your Song model
const Play = require('../models/play.model');


/**
 * Increment a songs totalPlays
 * 
 * @param {object} req - The request object 
 * @param {object} res - The response object
 */
const incrementPlays = async (req, res) => {
    const { userAuthenticated } = req.session.user || {}
    // console.log(req.session.user);

    const songId = req.params.id;
    try {
        const song = await Song.findById(songId);
        if (!song) {
            return res.status(404).json({ success: false, message: 'Song not found' });
        }
        
        await Play.create({ songId: songId, user: song.user })

        song.totalPlays += 1; // Increment the totalPlays
        await song.save(); // Save the updated song

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

module.exports = {
    incrementPlays,
}

