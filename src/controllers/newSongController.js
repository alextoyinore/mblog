/**
 * @license Apache-2.0
 * @copyright 2025 Alexander Ore
 */

'use strict'

/**
 * node modules
 */
const crypto = require('crypto');


/**
 * custom modules
 */
const uploadToCloudinary = require('../config/cloudinaryConfig')
const Song = require('../models/songModel')
const User = require('../models/userModel');
const { log } = require('console');

/**
 * Renders the song add page
 * 
 * @param {object} req - The request object 
 * @param {object} res - The response object
 */
const renderNewSongOrURL = (req, res) => {
    const { userAuthenticated } = req.session.user || {}

    if (!userAuthenticated){
        return res.redirect('/login');
    }
    
    res.render('./pages/newSong', {
        sessionUser: req.session.user,
        // route: req.originalUrl
    });
}

/**
 * Handles adding new song or song URL
 * @param {object} req The request object
 * @param {object} res The response object
 * @returns {Promise<void>} - A Promise that returns after the registration process is completed
 * @throws {Error} - If error occurs during registration
 */

const handleNewSongOrURL = async (req, res) => {
    // console.log(req.body);

    try {
        // Retrieve content from request body
        const { artwork, songFile, songTitle, artistName, albumTitle, releaseYear, genre, producer, spotify, appleMusic, youtubeMusic, boomplay, tidal, amazon, pandora, soundcloud, audiomack, deezer, region, country } = req.body
    
        // Upload artwork and song file to Cloudinary
        const public_id = crypto.randomBytes(10).toString('hex');
        const artworkURL = await uploadToCloudinary(artwork, public_id);
    
        // Find user who is posting the song
        const user = await User.findOne({ username:req.session.user.username }).select('_id songs songsPublished');
    
        // Post new song to server
        const newSong = await Song.create({
            user: user._id,
            artwork: {
                url: artworkURL,
                public_id: public_id
            },
            songFile: songFile,
            songTitle: songTitle,
            artistName:  artistName,
            albumTitle: albumTitle,
            releaseYear: releaseYear,
            genre: genre,
            producer: producer,
            spotify: spotify,
            appleMusic: appleMusic,
            youtubeMusic: youtubeMusic,
            boomplay: boomplay,
            tidal: tidal,
            amazon: amazon,
            pandora: pandora,
            soundcloud: soundcloud,
            audiomack: audiomack,
            deezer: deezer,
            region: region,
            country: country
        });

        // Update user data
        user.songs.push(newSong._id);
        user.songsPublished++;
        await user.save();

        // redirect to newly created song page
        res.redirect(`song/${newSong._id}`);

    }catch (error) {
        // Log and throw error if any
        return res.status(400).send({message: `Error publishing new song or song URL:  ${error.message}`});
    }
}

/**
 * Handles adding editing song or song URL
 * @param {object} req The request object
 * @param {object} res The response object
 * @returns {Promise<void>} - A Promise that returns after the registration process is completed
 * @throws {Error} - If error occurs during registration
 */

const handleEditSongOrURL = async (req, res) => {

}

module.exports = {
    renderNewSongOrURL,
    handleNewSongOrURL,
    handleEditSongOrURL
}

