/**
 * @license Apache-2.0
 * @copyright 2025 Alexander Ore
 */

'use strict'

/**
 * node modules
 */
const router = require('express').Router();

/**
 * custom modules
 */
// const {
//     renderPrivacy
// } = require('../controllers/privacy.controller');

// GET route: Render the song page
router.get('/', async (req, res) => {
    try{
        res.render('./layouts/base', {
            page: 'privacy',
            title: 'Privacy',
            widgets: ['related-pages'],
            sessionUser: req.session.user,
            route: req.originalUrl,
        });
    }catch (error) {
        res.status(404).send('About not found', error);
    }
});

module.exports = router;

