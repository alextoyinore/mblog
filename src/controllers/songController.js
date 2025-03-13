/**
 * @license Apache-2.0
 * @copyright 2025 Alexander Ore
 */

'use strict'

/**
 * node modules
 */


/**
 * custom modules
 */


/**
 * Renders the song add page
 * 
 * @param {object} req - The request object 
 * @param {object} res - The response object
 */
const renderAddSongOrURL = (req, res) => {
    const { userAuthenticated } = req.session.user
    // console.log(req.session.user);

    if (!userAuthenticated){
        return res.redirect('/login');
    }
    
    res.render('./pages/newSong', {
        sessionUser: req.session.user,
        route: req.originalUrl
    });
}

/**
 * Handles adding new song or song URL
 * @param {object} req The request object
 * @param {object} res The response object
 * @returns {Promise<void>} - A Promise that returns after the registration process is completed
 * @throws {Error} - If error occurs during registration
 */

const handleAddSongOrURL = async (req, res) => {

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
    renderAddSongOrURL,
    handleAddSongOrURL,
    handleEditSongOrURL
}

