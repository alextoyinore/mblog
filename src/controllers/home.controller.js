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
const Play = require('../models/play.model')

/**
 * Renders the register page
 * 
 * @param {object} req - The request object 
 * @param {object} res - The response object
 */
const renderHome = async (req, res) => {
    const { userAuthenticated } = req.session.user || {}
    // console.log(req.session.user);

    try{

        // Retrieve songs from database, selecting specified fields and populating user field
        const latestSongs = await Song.find().select('id artwork songFile songTitle artistName albumTitle releaseYear genre user spotify appleMusic youtubeMusic boomplay tidal amazon pandora soundcloud audiomack deezer totalPlays totalLikes region country totalShares totalPlaylistAdds moreInfo createdAt')
        .populate({
            path: 'user',
            select: 'profileImage name username songs playlist favourites totalFollower totalVisits'
        })
        .sort({ createdAt: 'desc'})
        .limit(10)
        .exec()

        
        const topSongs = [...latestSongs].sort((a, b) => b.totalPlays - a.totalPlays).slice(0,5);

        
        // Retrieve Trending Songs
        const threeDaysAgo = moment().subtract(3, 'days').toDate(); // Get the date for 3 days ago

        // Filter latestSongs to get songs created in the last 3 days that have been played
        const trendingSongs = latestSongs.filter(song => 
            song.createdAt >= threeDaysAgo && song.totalPlays > 0
        ).slice(0,5);

        /**
         * Songs by Region
         */

        // Group songs by region
        
        // Fetch all songs from the database
        const songs = [...latestSongs]

        // Group songs by region
        const songsByRegion = {};

        songs.forEach(song => {
            const region = song.region || 'Global'; // Default to 'Unknown' if no region is specified

            // Initialize the region if it doesn't exist
            if (!songsByRegion[region]) {
            songsByRegion[region] = [];
            }

            // Push the song to the corresponding region
            songsByRegion[region].push(song);
        });

        // Limit to 10 songs per region
        for (const region in songsByRegion) {
            songsByRegion[region] = songsByRegion[region].slice(0, 10); // Get the first 10 songs
        }

        /**
         * Songs By Genre
         */

        // Group songs by genre
        const songsByGenre = {};

        songs.forEach(song => {
            const genre = song.genre || 'World'; // Default to 'World' if no genre is specified

            // Initialize the genre if it doesn't exist
            if (!songsByGenre[genre]) {
                songsByGenre[genre] = [];
            }

            // Push the song to the corresponding genre
            songsByGenre[genre].push(song);
        });

        // Limit to 10 songs per genre
        for (const genre in songsByGenre) {
            songsByGenre[genre] = songsByGenre[genre].slice(0, 10); // Get the first 10 songs
        }


        const _threeDays = moment().subtract(3, 'days').toDate(); // Get the date for 3 days ago

        const recentArtists = await Song.aggregate([
            // Step 1: Match songs added in the last three days
            {
                $match: {
                    createdAt: { $gte: _threeDays } // Filter for songs added in the last three days
                }
            },
            // Step 2: Group by artist name, region, and country
            {
                $group: {
                    _id: {
                        artistName: "$artistName", // Group by artist name
                        region: "$region",         // Include region in the grouping
                        country: "$country",       // Include country in the grouping
                    },
                    artwork: { $first: "$artwork" }, // Get the artwork of the first song for the artist
                    totalPlays: { $sum: "$totalPlays" } // Sum the total plays for each artist
                }
            },
            // Step 3: Project the final output
            {
                $project: {
                    _id: 0, // Exclude the default _id field
                    artistName: "$_id.artistName", // Rename _id.artistName to artistName
                    region: "$_id.region",         // Include region
                    country: "$_id.country",       // Include country
                    totalPlays: 1,                // Include totalPlays
                    artwork: 1                     // Include artwork
                }
            },
            // Step 4: Sort by totalPlays in descending order
            {
                $sort: { totalPlays: -1 }
            },
            {
                $limit: 10
            }
        ]);

        res.render('./layouts/base', {
            page: 'home',
            title: 'Home',
            widgets: ['trending', 'topsongs'],
            sessionUser: req.session.user,
            route: req.originalUrl,
            latestSongs,
            trendingSongs,
            topSongs,
            songsByRegion,
            songsByGenre,
            recentArtists,
            moment,
            user
        });
        
    }catch(error){
        // Log and throw error if there's an issue rendering page
        console.error('Error rendering home page', error.message);
        throw error;
    }
}

module.exports = {
    renderHome
}

