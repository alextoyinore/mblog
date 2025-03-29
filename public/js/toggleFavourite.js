// import Snackbar from './utils/snackbar.js';

async function toggleFavorite(songId) {
    const response = await fetch('/api/favorite', {
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

function updateFavoriteIcon(songId, isFavorited) {
    const songItem = document.querySelector(`.song-item[data-song-id="${songId}"]`);
    const favoriteButton = songItem.querySelector('button');

    if (isFavorited) {
        favoriteButton.classList.add('text-red-500'); // Change color to indicate favorited
    } else {
        favoriteButton.classList.remove('text-red-500'); // Change color back
    }
}

let userFavorites = []; // This will hold the user's favorite song IDs

// Function to fetch user favorites
async function fetchUserFavorites() {
    try {
        const response = await fetch('/favourite'); // Adjust the endpoint as necessary
        const data = await response.json();
        userFavorites = data.favourites; // Assuming the response contains an array of favorite song IDs
    } catch (error) {
        console.error('Error fetching user favorites:', error);
    }
}

// Function to check if a song is already favorited
async function checkIfFavorited(songId) {
    // Ensure userFavorites is populated
    const userFavorites = await fetchUserFavorites(); // Fetch favorites if not already fetched
    return userFavorites.includes(songId);
}

