let currentAudio = null;
let currentPlayBtn = null;
let isLooping = false;
let miniPlayer = null;

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
        miniPlayer.className = 'fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg transform translate-y-full transition-transform duration-300 ease-in-out';
        document.body.appendChild(miniPlayer);
    }

    miniPlayer.innerHTML = `
        <div class="flex items-center justify-between p-4">
            <div class="flex items-center gap-4">
                <img src="${artworkUrl}" alt="${songTitle}" class="w-12 h-12 rounded object-cover"/>
                <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">${songTitle}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${artistName}</p>
                </div>
            </div>
            <button 
                onclick="togglePlay('${songId}')" 
                class="mini-play-pause-btn"
                data-song-id="${songId}">
                <svg class="play-icon w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                <svg class="pause-icon w-8 h-8 hidden" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
            </button>
        </div>
    `;

    // Show mini player
    requestAnimationFrame(() => {
        miniPlayer.classList.add('translate-y-0');
    });
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
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        
        // Show mini player if not looping
        if (!isLooping) {
            createMiniPlayer(songId, songTitle, artistName, artworkUrl);
        }
    } else {
        currentAudio.pause();
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
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

        // Hide mini player
        if (miniPlayer) {
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
