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
//     renderAbout
// } = require('../controllers/about.controller');

// GET route: Render the song page
router.get('/', async (req, res) => {
    try{
        res.render('./layouts/base', {
            page: 'faqs',
            title: 'FAQs',
            widgets: ['related-pages'],
            sessionUser: req.session.user,
            route: req.originalUrl,
        });
    }catch (error) {
        res.status(404).send('FAQs not found', error);
    }
});

module.exports = router;

