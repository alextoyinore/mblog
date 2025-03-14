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
    const reponse = await fetch(`${window.location.origin}/publish`, {
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


// Preview artwork
function previewArtwork(input) {
    const preview = document.getElementById("artworkPreview");
    const uploadPrompt = document.getElementById("uploadPrompt");

    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.classList.remove("hidden");
        uploadPrompt.classList.add("hidden");
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  // Update song file name
  function updateFileName(input) {
    const fileName = document.getElementById("songFileName");
    if (input.files && input.files[0]) {
      fileName.textContent = input.files[0].name;
    }
  }


// Wave Data Preview

let wavesurfer;
let isPlaying = false;

// Initialize WaveSurfer
function initWaveform() {
    wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#9ca3af',
        progressColor: '#ef4444',
        cursorColor: '#ef4444',
        barWidth: 2,
        barGap: 1,
        height: 96,
        responsive: true,
        normalize: true,
        fillParent: true
    });

    // Update time displays
    wavesurfer.on('audioprocess', () => {
        updateTime();
    });

    wavesurfer.on('ready', () => {
        document.getElementById('waveformContainer').classList.remove('hidden');
        updateTime();
    });

    wavesurfer.on('finish', () => {
        isPlaying = false;
        document.getElementById('playButton').textContent = '▶';
    });
}

// Handle audio file upload
function handleAudioUpload(input) {
    const file = input.files[0];
    if (file) {
        // Update file name display
        document.getElementById('songFileName').textContent = file.name;

        // Initialize waveform if not already done
        if (!wavesurfer) {
            initWaveform();
        }

        // Load the audio file
        wavesurfer.loadBlob(file);
    }
}

// Toggle play/pause
function togglePlay() {
    if (wavesurfer) {
        wavesurfer.playPause();
        isPlaying = !isPlaying;
        document.getElementById('playButton').textContent = isPlaying ? '⏸' : '▶';
    }
}

// Format time in seconds to MM:SS
function formatTime(seconds) {
    seconds = Math.floor(seconds);
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Update time displays
function updateTime() {
    if (wavesurfer) {
        const currentTime = wavesurfer.getCurrentTime();
        const duration = wavesurfer.getDuration();
        document.getElementById('currentTime').textContent = formatTime(currentTime);
        document.getElementById('duration').textContent = formatTime(duration);
    }
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (wavesurfer) {
        wavesurfer.destroy();
    }
});

