// import Snackbar from './utils/snackbar.js';

async function toggleToPlaylist(songId) {
    const response = await fetch('/playlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songId }),
    });

    if (response.ok) {
        const result = await response.json();
        const button = document.querySelector(`button[data-song-id-for-playlist="${songId}"]`);
        const playlistText = button.querySelector('.playlist-text');
        const playlistIcon = button.querySelector('.playlist-icon');

        // Update the button text and icon color based on the result
        if (result.isInPlaylist) {
            playlistText.textContent = 'Added';
            playlistIcon.classList.remove('text-gray-500');
            playlistIcon.classList.add('text-red-500');
            button.classList.remove('text-gray-500');
            button.classList.add('text-red-500');
        } else {
            playlistText.textContent = 'Add';
            playlistIcon.classList.remove('text-red-500');
            playlistIcon.classList.add('text-gray-500');
            button.classList.remove('text-red-500');
            button.classList.add('text-gray-500');
        }
    } else {
        console.error('Failed to toggle playlist');
    }
}

