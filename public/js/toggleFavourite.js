
// import Snackbar from './utils/snackbar.js';

function toggleFavorite(songId) {
    const isFavorited = checkIfFavorited(songId); // Implement this function to check if the song is already favorited

    const url = `/favourite/${songId}`;
    const method = isFavorited ? 'DELETE' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId: currentUserId}) // Assuming you have the current user's ID
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message);
        // Update UI to reflect the favorite state
        updateFavoriteIcon(songId, !isFavorited);
    })
    .catch(error => {
        console.log(error)
    });
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

