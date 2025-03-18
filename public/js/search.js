
document.getElementById('searchInput').addEventListener('input', function() {
    const query = this.value;

    // Fetch search results from the server
    fetch(`/search?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('searchResults');
            resultsContainer.innerHTML = ''; // Clear previous results

            // Display search results
            data.forEach(song => {
                const songElement = document.createElement('div');
                songElement.textContent = `${song.title} by ${song.artist}`;
                resultsContainer.appendChild(songElement);
            });
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
        });
});
