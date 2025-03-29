
function incrementPlays(songId) {
    // Make an AJAX request to your server to increment the totalPlays
    fetch(`/incrementPlays/${songId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ increment: 1 }) // Sending the increment value
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Total plays incremented successfully');
            // Optionally, update the UI or notify the user
        } else {
            console.error('Error incrementing total plays:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

