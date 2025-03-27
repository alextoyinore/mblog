let currentAudio = null;
let currentPlayBtn = null;
let isLooping = false;
let miniPlayer = null;

// Add this at the top level of your file
document.addEventListener('keydown', handleSpaceBar);

function handleSpaceBar(e) {
    // Check if the pressed key is spacebar and we're not in an input field
    if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault(); // Prevent page scroll
        if (currentAudio) {
            togglePlayPause();
        }
    }
}

// Function to toggle player visibility
function togglePlayerVisibility(trigger) {
    const wrapper = trigger.closest('.audio-wrapper');
    const accordion = wrapper.querySelector('.player-accordion');
    
    // Toggle the hidden class
    if (accordion.classList.contains('hidden')) {
        accordion.classList.remove('hidden');
        // Add animation classes
        accordion.classList.add('opacity-0');
        setTimeout(() => {
            accordion.classList.remove('opacity-0');
            accordion.classList.add('opacity-100');
        }, 50);
    } else {
        accordion.classList.add('opacity-0');
        setTimeout(() => {
            accordion.classList.add('hidden');
            accordion.classList.remove('opacity-0', 'opacity-100');
        }, 300);
    }
}

function createMiniPlayer(songId, songTitle, artistName, artworkUrl) {
    if (!miniPlayer) {
        miniPlayer = document.createElement('div');
        miniPlayer.className = 'fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg transform translate-y-full transition-transform duration-300 ease-in-out z-50';
        document.body.appendChild(miniPlayer);
    }

    // Save the current song info to the miniPlayer element
    miniPlayer.setAttribute('data-song-id', songId);
    miniPlayer.setAttribute('data-song-title', songTitle);
    miniPlayer.setAttribute('data-artist-name', artistName);
    miniPlayer.setAttribute('data-artwork-url', artworkUrl);

    miniPlayer.innerHTML = `
        <div class="max-w-7xl mx-auto">
            <!-- Progress Bar -->
            <div class="seeker-container relative h-1 bg-gray-200 dark:bg-gray-700 cursor-pointer">
                <div class="seeker-progress h-full bg-red-500" style="width: 0%"></div>
            </div>
            
            <div class="flex items-center justify-between p-4">
                <!-- Song Info -->
                <div class="flex items-center gap-4">
                    <img src="${artworkUrl || '/images/default-artwork.jpg'}" alt="${songTitle}" class="w-12 h-12 rounded object-cover"/>
                    <div class="song-info">
                        <h3 class="font-medium text-gray-900 dark:text-white">${songTitle}</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">${artistName}</p>
                    </div>
                </div>

                <!-- Controls -->
                <div class="flex items-center gap-6">
                    <button onclick="toggleLoop()" class="loop-btn text-gray-600 dark:text-gray-400 hidden lg:block hover:text-red-500">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                    </button>
                    <button onclick="skipBackward()" class="text-gray-600 dark:text-gray-400 hidden lg:block hover:text-red-500">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                        </svg>
                    </button>
                    <button onclick="togglePlayPause()" class="play-pause-btn">
                        <svg class="play-icon w-8 h-8 text-red-500 hidden" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        <svg class="pause-icon w-8 h-8 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                        </svg>
                    </button>
                    <button onclick="skipForward()" class="text-gray-600 dark:text-gray-400 hidden lg:block hover:text-red-500">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
                        </svg>
                    </button>
                    <span class="time-display hidden lg:block text-sm text-gray-600 dark:text-gray-400">0:00</span>
                </div>
            </div>
        </div>
    `;

    // Show mini player
    requestAnimationFrame(() => {
        miniPlayer.classList.remove('translate-y-full');
    });

    // Set up time update handler for the seeker
    if (currentAudio) {
        const seekerProgress = miniPlayer.querySelector('.seeker-progress');
        const timeDisplay = miniPlayer.querySelector('.time-display');
        const seekerContainer = miniPlayer.querySelector('.seeker-container');

        // Update progress and time
        currentAudio.addEventListener('timeupdate', () => {
            const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
            seekerProgress.style.width = `${progress}%`;
            
            const minutes = Math.floor(currentAudio.currentTime / 60);
            const seconds = Math.floor(currentAudio.currentTime % 60).toString().padStart(2, '0');
            timeDisplay.textContent = `${minutes}:${seconds}`;
        });

        // Enable seeking
        seekerContainer.addEventListener('click', (e) => {
            const rect = seekerContainer.getBoundingClientRect();
            const clickPosition = (e.clientX - rect.left) / rect.width;
            currentAudio.currentTime = clickPosition * currentAudio.duration;
        });
    }
}

function togglePlayer(trigger) {
    const wrapper = trigger.closest('.audio-wrapper');
    const accordion = wrapper.querySelector('.player-accordion');
    accordion.classList.toggle('hidden');
}

function togglePlay(songId, songUrl, songTitle, artistName, artworkUrl) {
    const playBtn = document.querySelector(`button.play-pause-btn[data-song-id="${songId}"]`);
    const playIcon = playBtn.querySelector('.play-icon');
    const pauseIcon = playBtn.querySelector('.pause-icon');
    const seekerContainer = playBtn.closest('.audio-player').querySelector('.seeker-container');
    const seekerProgress = seekerContainer.querySelector('.seeker-progress');
    const timeDisplay = playBtn.closest('.audio-player').querySelector('.time-display');

    // If there's already a song playing and it's different from the current one
    if (currentAudio && currentAudio.dataset.songId !== songId) {
        stopCurrentAudio();
    }

    // If this is a new audio instance
    if (!currentAudio || currentAudio.dataset.songId !== songId) {
        currentAudio = new Audio(songUrl);
        currentAudio.dataset.songId = songId;
        
        // Set up time update handler
        currentAudio.addEventListener('timeupdate', () => {
            const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
            seekerProgress.style.width = `${progress}%`;
            
            const minutes = Math.floor(currentAudio.currentTime / 60);
            const seconds = Math.floor(currentAudio.currentTime % 60).toString().padStart(2, '0');
            timeDisplay.textContent = `${minutes}:${seconds}`;
        });

        // Set up seeker click handler
        seekerContainer.addEventListener('click', (e) => {
            const rect = seekerContainer.getBoundingClientRect();
            const clickPosition = (e.clientX - rect.left) / rect.width;
            currentAudio.currentTime = clickPosition * currentAudio.duration;
        });

        // Set loop state
        currentAudio.loop = isLooping;
    }

    // Toggle play/pause
    if (currentAudio.paused) {
        currentAudio.play();
        updatePlayState(true);
        
        if (!isLooping) {
            createMiniPlayer(songId, songTitle, artistName, artworkUrl);
        }
    } else {
        currentAudio.pause();
        updatePlayState(false);
    }

    currentPlayBtn = playBtn;

    if (!isLooping && !currentAudio.paused) {
        createMiniPlayer(songId, songTitle, artistName, artworkUrl);
    }
}

function stopCurrentAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        
        if (currentPlayBtn) {
            const playIcon = currentPlayBtn.querySelector('.play-icon');
            const pauseIcon = currentPlayBtn.querySelector('.pause-icon');
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        }

        // Update mini player
        if (miniPlayer) {
            const miniPlayIcon = miniPlayer.querySelector('.play-icon');
            const miniPauseIcon = miniPlayer.querySelector('.pause-icon');
            miniPlayIcon.classList.remove('hidden');
            miniPauseIcon.classList.add('hidden');
            miniPlayer.classList.add('translate-y-full');
        }
    }
}

function toggleLoop() {
    isLooping = !isLooping;
    if (currentAudio) {
        currentAudio.loop = isLooping;
    }
    document.querySelector('.loop-btn').classList.toggle('text-red-500');
}

function skipForward(songId) {
    if (currentAudio) {
        currentAudio.currentTime = Math.min(currentAudio.currentTime + 10, currentAudio.duration);
    }
}

function skipBackward(songId) {
    if (currentAudio) {
        currentAudio.currentTime = Math.max(currentAudio.currentTime - 10, 0);
    }
}

function togglePlayPause() {
    if (!currentAudio) return;
    
    if (currentAudio.paused) {
        currentAudio.play();
        updatePlayState(true);
    } else {
        currentAudio.pause();
        updatePlayState(false);
    }
}

function updatePlayState(isPlaying) {
    // Update mini player
    if (miniPlayer) {
        const miniPlayIcon = miniPlayer.querySelector('.play-icon');
        const miniPauseIcon = miniPlayer.querySelector('.pause-icon');
        
        if (isPlaying) {
            miniPlayIcon.classList.add('hidden');
            miniPauseIcon.classList.remove('hidden');
            miniPauseIcon.classList.remove('text-red-500');
        } else {
            miniPlayIcon.classList.remove('hidden');
            miniPauseIcon.classList.add('hidden');
            miniPlayIcon.classList.add('text-red-500');
        }
    }

    // Update main player
    const songId = currentAudio.dataset.songId;
    const mainPlayer = document.querySelector(`button[data-song-id="${songId}"]`);
    if (mainPlayer) {
        const mainPlayIcon = mainPlayer.querySelector('.play-icon');
        const mainPauseIcon = mainPlayer.querySelector('.pause-icon');
        
        if (isPlaying) {
            mainPlayIcon.classList.add('hidden');
            mainPauseIcon.classList.remove('hidden');
        } else {
            mainPlayIcon.classList.remove('hidden');
            mainPauseIcon.classList.add('hidden');
        }
    }
}

// Update the audio event listeners
function setupAudioEventListeners() {
    if (!currentAudio) return;

    currentAudio.addEventListener('pause', () => {
        updatePlayState(false);
    });

    currentAudio.addEventListener('play', () => {
        updatePlayState(true);
    });

    // Add ended event listener
    currentAudio.addEventListener('ended', () => {
        updatePlayState(false);
    });
}

// Add these styles to your CSS
const styles = `
.audio-wrapper {
    position: relative;
}

.player-accordion {
    transition: all 0.3s ease;
}

.seeker-container {
    width: 100%;
    height: 4px;
    border-radius: 2px;
    overflow: hidden;
    background-color: rgba(229, 231, 235, 0.5);
}

.seeker-progress {
    transition: width 0.1s linear;
}

.controls {
    padding: 0.5rem 0;
}

.play-pause-btn,
.skip-forward-btn,
.skip-backward-btn,
.loop-btn {
    transition: transform 0.2s ease;
}

.play-pause-btn:hover,
.skip-forward-btn:hover,
.skip-backward-btn:hover,
.loop-btn:hover {
    transform: scale(1.1);
}

.time-display {
    min-width: 45px;
    text-align: right;
}

/* Mini Player */
.mini-player {
    z-index: 50;
    border-top: 1px solid rgba(229, 231, 235, 0.5);
}

@media (max-width: 640px) {
    .mini-player {
        padding: 0.5rem;
    }
}
`;
