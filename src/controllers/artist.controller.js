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
const renderArtist = async (req, res) => {
    const { userAuthenticated } = req.session.user || {}
    // console.log(req.session.user);

    // if (!userAuthenticated){
    //     return res.redirect('/login');
    // }

    const artistName = req.params.name; // Access the artist by name from the URL

    const artistDetails = await Song.aggregate([
        {
            $match: { artistName: artistName }
        },
        {
            $group: {
                _id: {
                    artistName: "$artistName",
                    region: "$region",
                    country: "$country",
                    user: "$user",
                },
                totalPlays: { $sum: "$totalPlays" },
                genres: { $addToSet: "$genre" },
                artwork: { $first: "$artwork" }, // Get the artwork of the first song for the artist
            }
        },
        {
            $project: {
                _id: 0,
                artistName: "$_id.artistName",
                region: "$_id.region",
                country: "$_id.country",
                user: "$_id.user",
                totalPlays: 1,
                genres: 1,
                artwork: 1,
            }
        }
    ])

    // Retrieve songs from database, selecting specified fields and populating user field
    const songsBySameArtist = await Song.find()
            .select('id artwork songFile songTitle artistName albumTitle releaseYear genre user spotify appleMusic youtubeMusic boomplay tidal amazon pandora soundcloud audiomack deezer totalPlays totalLikes region country totalShares totalPlaylistAdds moreInfo createdAt')
            .where('artistName').equals(artistName).populate({
                path: 'user'
            })
            .exec();

    const relatedArtists = await Song.aggregate([
        // Step 1: Match the current artist to get their genres
        {
            $match: {
                artistName: artistName
            }
        },
        // Step 2: Unwind the genres array to create a document for each genre
        {
            $unwind: "$genres"
        },
        // Step 3: Group by artist to collect unique genres
        {
            $group: {
                _id: null, // Grouping all documents together
                genres: { $addToSet: "$genres" } // Collect unique genres
            }
        },
        // Step 4: Find other artists with the same genres
        {
            $lookup: {
                from: "songs", // Assuming the collection name is "songs"
                localField: "genres", // Field from the previous stage
                foreignField: "genres", // Field in the songs collection
                as: "relatedSongs" // Output array field
            }
        },
        // Step 5: Unwind the related songs array to get individual documents
        {
            $unwind: "$relatedSongs"
        },
        // Step 6: Group again to get unique artists and their full song details
        {
            $group: {
                _id: "$relatedSongs.artistName", // Group by artist name
                songs: { $push: "$relatedSongs" } // Collect all song details for the artist
            }
        },
        // Step 7: Exclude the current artist from the results
        {
            $match: {
                _id: { $ne: artistName } // Exclude the current artist
            }
        },
        // Step 8: Project the final output
        {
            $project: {
                _id: 1, // Include artist name
                songs: 1 // Include their full song details
            }
        }
    ])


    if (artistDetails) {
        res.render('./layouts/base', {
            page: 'artist',
            title: `${artistName}`,
            widgets: ['related-artists', 'artist-top-songs'],
            sessionUser: req.session.user,
            route: req.originalUrl,
            relatedArtists,
            songsBySameArtist,
            artist: artistDetails[0],
            moment
        });
    } else {
        res.status(404).send('Song not found');
    }
}

module.exports = {
    renderArtist
}

