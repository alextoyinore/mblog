// import Snackbar from './utils/snackbar.js';

async function toggleFavorite(songId) {
    const response = await fetch('/liked', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songId }),
    });

    if (response.ok) {
        const result = await response.json();
        const button = document.querySelector(`button[data-song-id-for-like="${songId}"]`);
        const favoriteText = button.querySelector('.favourite-text');
        const likeIcon = button.querySelector('.like-icon');

        // Update the button text and icon color based on the result
        if (result.isFavorited) {
            favoriteText.textContent = 'Liked';
            likeIcon.classList.remove('text-gray-500');
            likeIcon.classList.add('text-red-500');
            button.classList.remove('text-gray-500');
            button.classList.add('text-red-500');
        } else {
            favoriteText.textContent = 'Like';
            likeIcon.classList.remove('text-red-500');
            likeIcon.classList.add('text-gray-500');
            button.classList.remove('text-red-500');
            button.classList.add('text-gray-500');
        }
    } else {
        console.error('Failed to toggle favorite');
    }
}

