// alert('Hello there')

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
    // log
    console.log(Object.fromEntries(formData.entries()))
}
form.addEventListener('submit', handleAddSong);

