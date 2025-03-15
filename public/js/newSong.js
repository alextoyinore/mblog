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
import Snackbar from './utils/snackbar.js'
import config from './utils/config.js'
import imageAsDataURL from './utils/imageAsDataURL.js';

/**
 * Handle Publish Song or URLs
 */
const form = document.querySelector('[data-add-song-form]');
const submitSongBtn = document.querySelector('[data-submit-song]');

const handleAddSong = async (event) => {
    // prevent default submission behaviour
    event.preventDefault();
    // Disable submit button
    submitSongBtn.setAttribute('disabled', '');
    // Creating formData object to capture form data
    const formData = new FormData(form);
    // handle case where no artwork has been selected
    if (!formData.get('artwork').size) {
        // Enable publish button and show error
        submitSongBtn.removeAttribute('disabled');
        // Show snackbar
        Snackbar({
            type: 'error',
            message: 'Please selected an artwork for the song.'
        });
        return;
    }
    // handle artwork size greater than 512k
    if (formData.get('artwork').size > config.artwork.maxByteSize) {
        // Enable publish button and show error
        submitSongBtn.removeAttribute('disabled');
        // Show snackbar
        Snackbar({
            type: 'error',
            message: `Your artwork size is ${formData.get('artwork').size}. Artwork size cannot be larger than ${config.artwork.maxByteSize} Kilobytes i.e. (${config.artwork.maxByteSize}k)`
        });
        return;
    }
    // override artwork type from file to base64
    formData.set('artwork', await imageAsDataURL(formData.get('artwork')));
    // handle case no song title
    if (!formData.get('songTitle')) {
        submitSongBtn.removeAttribute('disabled');
        // Show snackbar
        Snackbar({
            type: 'error',
            message: 'Please enter a title for your song.'
        });
        return;
    }
    // handle case no artist name
    if (!formData.get('artistName')) {
        submitSongBtn.removeAttribute('disabled');
        // Show snackbar
        Snackbar({
            type: 'error',
            message: 'Please enter the name of the artist.'
        });
        return;
    }
    // handle case no link added
    if (!formData.get('spotify') && !formData.get('appleMusic') && !formData.get('youtubeMusic') && !formData.get('boomplay') && !formData.get('tidal') && !formData.get('amazon') && !formData.get('pandora') && !formData.get('soundcloud') && !formData.get('deezer') && !formData.get('audiomack')) {
        submitSongBtn.removeAttribute('disabled');
        // Show snackbar
        Snackbar({
            type: 'error',
            message: 'You need to enter at least one streaming url in the streaming links section.'
        });
        return;
    }
    // handle case invalid spotify url
    if (formData.get('spotify')) {
        let isValid = formData.get('spotify').includes('open.spotify.com');
        if (!isValid) {
            submitSongBtn.removeAttribute('disabled');
            // Show snackbar
            Snackbar({
                type: 'error',
                message: 'The Spotify url you provided is not a valid "open.spotify.com" url'
            });
            return;
        }
    }
    // handle case invalid apple music url
    if (formData.get('appleMusic')) {
        let isValid = formData.get('appleMusic').includes('music.apple.com');
        if (!isValid) {
            submitSongBtn.removeAttribute('disabled');
            // Show snackbar
            Snackbar({
                type: 'error',
                message: 'The Apple Music url you provided is not a valid "music.apple.com" url'
            });
            return;
        }
    }
    // handle case invalid youtube music url
    if (formData.get('youtubeMusic')) {
        let isValid = formData.get('youtubeMusic').includes('music.youtube.com/watch?v=');
        if (!isValid) {
            submitSongBtn.removeAttribute('disabled');
            // Show snackbar
            Snackbar({
                type: 'error',
                message: 'The Youtube Music url you provided is not a valid "music.youtube.com" url'
            });
            return;
        }
    }
    // handle case invalid boomplay url
    if (formData.get('boomplay')) {
        let isValid = formData.get('boomplay').includes('boomplay.com/songs');
        if (!isValid) {
            submitSongBtn.removeAttribute('disabled');
            // Show snackbar
            Snackbar({
                type: 'error',
                message: 'The Boomplay url you provided is not a valid "boomplay.com" url'
            });
            return;
        }
    }
    // handle case invalid audiomack url
    if (formData.get('audiomack')) {
        let isValid = formData.get('audiomack').includes('audiomack.com/song');
        if (!isValid) {
            submitSongBtn.removeAttribute('disabled');
            // Show snackbar
            Snackbar({
                type: 'error',
                message: 'The Boomplay url you provided is not a valid "boomplay.com" url'
            });
            return;
        }
    }
    // handle case invalid deezer url
    if (formData.get('deezer')) {
        let isValid = formData.get('deezer').includes('dzr.page.link');
        if (!isValid) {
            submitSongBtn.removeAttribute('disabled');
            // Show snackbar
            Snackbar({
                type: 'error',
                message: 'The Deezer url you provided is not a valid "dzr.page.link" url'
            });
            return;
        }
    }
    // request body
    const body = Object.fromEntries(formData.entries())
    // send song data to the server for creating song record
    const response = await fetch(`${window.location.origin}/publish`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    // Handle when response is success
    if (response.ok) {
        Snackbar({
            message: 'Your song has been published successfully.'
        })
        return window.location = response.url
    }

    // handle case where response is 400 (Bad Request)
    if (response.status === 400) {
        const { message } = await response.json()
        Snackbar({
            type: 'error',
            message: message
        })
    }
}

form.addEventListener('submit', handleAddSong);
