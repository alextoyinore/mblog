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
const theSongFile  = document.querySelector('[data-song-file]');
const theSongArtwork  = document.querySelector('[data-artwork]');

const handleSubmitSong = async (event) => {
    event.preventDefault();
    submitSongBtn.setAttribute('disabled', '');
    
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    submitSongBtn.innerHTML = '';
    submitSongBtn.appendChild(spinner);

    // Creating formData object
    const formData = new FormData(form);

    formData.append('songFile', theSongFile.files[0])
    formData.append('artwork', theSongArtwork.files[0])

    // handle case where no artwork has been selected
    if (!formData.get('artwork').size) {
        // Enable publish button and show error
        submitSongBtn.removeAttribute('disabled');
        submitSongBtn.removeChild(spinner); // remove the spinner to the button
        submitSongBtn.innerHTML = 'Publish Song'
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
        submitSongBtn.removeChild(spinner); // remove the spinner to the button
        submitSongBtn.innerHTML = 'Publish Song'
        // Show snackbar
        Snackbar({
            type: 'error',
            message: `Your artwork size is ${formData.get('artwork').size}. Artwork size cannot be larger than ${config.artwork.maxByteSize / 1024}Kb`
        });
        return;
    }
    
    // override artwork type from file to base64
    formData.set('artwork', await imageAsDataURL(formData.get('artwork')));
    
    // handle song file larger than required
    const songFile = theSongFile;
    if (songFile && songFile.size > config.songFile.maxByteSize) {
        submitSongBtn.removeAttribute('disabled');
        submitSongBtn.removeChild(spinner);
        submitSongBtn.innerHTML = 'Publish Song';
        
        // Show snackbar with correct size calculations
        Snackbar({
            type: 'error',
            message: `Your song file size is ${(songFile.size / (1024 * 1024)).toFixed(2)}MB. Song file size cannot be larger than ${(config.songFile.maxByteSize / (1024 * 1024)).toFixed(2)}MB`
        });
        return;
    }
    // Pass audio path to FormData
    
    // handle case no song title
    if (!formData.get('songTitle')) {
        submitSongBtn.removeAttribute('disabled');
        submitSongBtn.removeChild(spinner); // remove the spinner to the button
        submitSongBtn.innerHTML = 'Publish Song'
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
        submitSongBtn.removeChild(spinner);
        submitSongBtn.innerHTML = 'Publish Song';
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
        submitSongBtn.removeChild(spinner);
        submitSongBtn.innerHTML = 'Publish Song';
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
            submitSongBtn.removeChild(spinner);
            submitSongBtn.innerHTML = 'Publish Song';
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
            submitSongBtn.removeChild(spinner);
            submitSongBtn.innerHTML = 'Publish Song';
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
            submitSongBtn.removeChild(spinner);
            submitSongBtn.innerHTML = 'Publish Song';
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
            submitSongBtn.removeChild(spinner);
            submitSongBtn.innerHTML = 'Publish Song';
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
            submitSongBtn.removeChild(spinner);
            submitSongBtn.innerHTML = 'Publish Song';
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
            submitSongBtn.removeChild(spinner);
            submitSongBtn.innerHTML = 'Publish Song';
            // Show snackbar
            Snackbar({
                type: 'error',
                message: 'The Deezer url you provided is not a valid "dzr.page.link" url'
            });
            return;
        }
    }

    try {
        // Send multipart form data without converting to JSON
        const response = await fetch(`${window.location.origin}/publish`, {
            method: 'POST',
            body: formData // Don't set Content-Type header, let the browser set it
        });

        if (response.ok) {
            Snackbar({
                message: 'Your song has been published successfully.'
            });
            return window.location = response.url;
        }

        if (response.status >= 400) {
            submitSongBtn.removeChild(spinner);
            submitSongBtn.innerHTML = 'Publish Song';
            submitSongBtn.removeAttribute('disabled');
            const { message } = await response.json();
            Snackbar({
                type: 'error',
                message: message
            });
        }
    } catch (error) {
        console.error('Upload error:', error);
        submitSongBtn.removeChild(spinner);
        submitSongBtn.innerHTML = 'Publish Song';
        submitSongBtn.removeAttribute('disabled');
        Snackbar({
            type: 'error',
            message: 'Failed to upload song. Please try again.'
        });
    }
}

form.addEventListener('submit', handleSubmitSong);


// Preview artwork
/* function previewArtwork(input) {
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
      // Store the file in a variable accessible during form submission
      window.selectedAudioFile = file;

      console.log(window.selectedAudioFile)

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

const genres = [
  'Afrobeat', 'Amapiano', 'Hip Hop', 'Gospel', 'RnB', 'Pop', 'Rock', 'Alternative', 'Jazz', 'Classical', 'Electronic', 'Dance', 'Reggae', 'Blues', 'Country', 'Folk', 'Metal', 'Punk', 'Soul', 'Funk', 'Disco', 'House', 'Techno', 'Trap', 'Drill', 'Grime', 'Indie', 'Juju', 'Fuji', 'High Life', 'Ska', 'Bluegrass', 'K-Pop', 'Celtic', 'New Age', 
  'Ambient', 'Post-Rock', 'Synthwave', 'Lo-fi', 'Chillwave', 'Dubstep', 'Hardcore', 'Salsa', 'Bachata', 'Merengue', 'Tango', 'Cumbia', 'Reggaeton', 'Afrofusion', 'Zouk', 'Kizomba', 'Bossa Nova', 'Gqom'
];

const genreInput = document.getElementById('genreInput');
const suggestionsDiv = document.getElementById('genreSuggestions');
let selectedGenre = '';

// Show suggestions based on input
genreInput.addEventListener('input', function(e) {
  const value = e.target.value.toLowerCase();
  selectedGenre = ''; // Clear selected genre when typing
  
  // Filter genres based on input
  const filteredGenres = genres.filter(genre => 
    genre.toLowerCase().includes(value)
  );

  // Show/hide and populate suggestions
  if (value && filteredGenres.length) {
    suggestionsDiv.innerHTML = filteredGenres
      .map(genre => `
        <div class="suggestion-item px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
          ${genre}
        </div>
      `)
      .join('');
    suggestionsDiv.classList.remove('hidden');
  } else {
    suggestionsDiv.classList.add('hidden');
  }

  // Clear input if no genre is selected
  if (!selectedGenre) {
    setTimeout(() => {
      if (!selectedGenre) {
        genreInput.value = '';
      }
    }, 100);
  }
});

// Handle suggestion clicks
suggestionsDiv.addEventListener('click', function(e) {
  if (e.target.classList.contains('suggestion-item')) {
    selectedGenre = e.target.textContent.trim();
    genreInput.value = selectedGenre;
    suggestionsDiv.classList.add('hidden');
  }
});

// Handle keyboard navigation
genreInput.addEventListener('keydown', function(e) {
  const items = suggestionsDiv.getElementsByClassName('suggestion-item');
  const currentIndex = Array.from(items).findIndex(item => 
    item.classList.contains('bg-gray-100') || 
    item.classList.contains('dark:bg-gray-700')
  );

  switch(e.key) {
    case 'ArrowDown':
      e.preventDefault();
      if (currentIndex < items.length - 1) {
        if (currentIndex >= 0) {
          items[currentIndex].classList.remove('bg-gray-100', 'dark:bg-gray-700');
        }
        items[currentIndex + 1].classList.add('bg-gray-100', 'dark:bg-gray-700');
        items[currentIndex + 1].scrollIntoView({ block: 'nearest' });
      }
      break;

    case 'ArrowUp':
      e.preventDefault();
      if (currentIndex > 0) {
        items[currentIndex].classList.remove('bg-gray-100', 'dark:bg-gray-700');
        items[currentIndex - 1].classList.add('bg-gray-100', 'dark:bg-gray-700');
        items[currentIndex - 1].scrollIntoView({ block: 'nearest' });
      }
      break;

    case 'Enter':
      e.preventDefault();
      const selectedItem = suggestionsDiv.querySelector('.bg-gray-100, .dark:bg-gray-700');
      if (selectedItem) {
        selectedGenre = selectedItem.textContent.trim();
        genreInput.value = selectedGenre;
        suggestionsDiv.classList.add('hidden');
      }
      break;

    case 'Escape':
      suggestionsDiv.classList.add('hidden');
      break;
  }
});

// Close suggestions when clicking outside
document.addEventListener('click', function(e) {
  if (!genreInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
    suggestionsDiv.classList.add('hidden');
    if (!selectedGenre) {
      genreInput.value = '';
    }
  }
});



const regionInput = document.getElementById('regionInput');
const regionSuggestionsDiv = document.getElementById('regionSuggestionsDiv');
let selectedRegion = '';

// Show suggestions based on input
regionInput.addEventListener('input', function(e) {
const value = e.target.value.toLowerCase();
selectedRegion = ''; // Clear selected region when typing

// Filter regions based on input
const filteredRegions = regions.filter(region => 
  region.toLowerCase().includes(value)
);

// Show/hide and populate suggestions
if (value && filteredRegions.length) {
  regionSuggestionsDiv.innerHTML = filteredRegions
    .map(region => `
      <div class="suggestion-item px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
        ${region}
      </div>
    `)
    .join('');
  regionSuggestionsDiv.classList.remove('hidden');
} else {
  regionSuggestionsDiv.classList.add('hidden');
}

// Clear input if no region is selected
if (!selectedRegion) {
  setTimeout(() => {
    if (!selectedRegion) {
      regionInput.value = '';
    }
  }, 100);
}
});

// Handle suggestion clicks
regionSuggestionsDiv.addEventListener('click', function(e) {
if (e.target.classList.contains('suggestion-item')) {
  selectedRegion = e.target.textContent.trim();
  regionInput.value = selectedRegion;
  regionSuggestionsDiv.classList.add('hidden');
}
});

// Handle keyboard navigation
regionInput.addEventListener('keydown', function(e) {
const items = regionSuggestionsDiv.getElementsByClassName('suggestion-item');
const currentIndex = Array.from(items).findIndex(item => 
  item.classList.contains('bg-gray-100') || 
  item.classList.contains('dark:bg-gray-700')
);

switch(e.key) {
  case 'ArrowDown':
    e.preventDefault();
    if (currentIndex < items.length - 1) {
      if (currentIndex >= 0) {
        items[currentIndex].classList.remove('bg-gray-100', 'dark:bg-gray-700');
      }
      items[currentIndex + 1].classList.add('bg-gray-100', 'dark:bg-gray-700');
      items[currentIndex + 1].scrollIntoView({ block: 'nearest' });
    }
    break;

  case 'ArrowUp':
    e.preventDefault();
    if (currentIndex > 0) {
      items[currentIndex].classList.remove('bg-gray-100', 'dark:bg-gray-700');
      items[currentIndex - 1].classList.add('bg-gray-100', 'dark:bg-gray-700');
      items[currentIndex - 1].scrollIntoView({ block: 'nearest' });
    }
    break;

  case 'Enter':
    e.preventDefault();
    const selectedItem = regionSuggestionsDiv.querySelector('.bg-gray-100, .dark:bg-gray-700');
    if (selectedItem) {
      selectedRegion = selectedItem.textContent.trim();
      regionInput.value = selectedRegion;
      regionSuggestionsDiv.classList.add('hidden');
    }
    break;

  case 'Escape':
    regionSuggestionsDiv.classList.add('hidden');
    break;
}
});

// Close suggestions when clicking outside
document.addEventListener('click', function(e) {
if (!regionInput.contains(e.target) && !regionSuggestionsDiv.contains(e.target)) {
  regionSuggestionsDiv.classList.add('hidden');
  if (!selectedRegion) {
    regionInput.value = '';
  }
}
});

const countries = [
'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 
'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 
'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 
'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 
'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 
'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 
'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 
'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Democratic Republic of the Congo', 
'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 
'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 
'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 
'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 
'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 
'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 
'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 
'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, North', 
'Korea, South', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 
'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 
'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 
'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 
'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 
'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 
'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 
'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway', 
'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 
'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 
'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 
'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 
'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 
'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 
'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 
'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 
'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 
'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 
'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 
'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 
'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 
'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 
'Yemen', 'Zambia', 'Zimbabwe'
];

const countryInput = document.getElementById('countryInput');
const countrySuggestionsDiv = document.getElementById('countrySuggestionsDiv');
let selectedCountry = '';

// Show suggestions based on input
countryInput.addEventListener('input', function(e) {
const value = e.target.value.toLowerCase();
selectedCountry = ''; // Clear selected country when typing

// Filter countries based on input
const filteredCountries = countries.filter(country => 
  country.toLowerCase().includes(value)
);

// Show/hide and populate suggestions
if (value && filteredCountries.length) {
  countrySuggestionsDiv.innerHTML = filteredCountries
    .map(country => `
      <div class="suggestion-item px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
        ${country}
      </div>
    `)
    .join('');
  countrySuggestionsDiv.classList.remove('hidden');
} else {
  countrySuggestionsDiv.classList.add('hidden');
}

// Clear input if no country is selected
if (!selectedCountry) {
  setTimeout(() => {
    if (!selectedCountry) {
      countryInput.value = '';
    }
  }, 100);
}
});

// Handle suggestion clicks
countrySuggestionsDiv.addEventListener('click', function(e) {
if (e.target.classList.contains('suggestion-item')) {
  selectedCountry = e.target.textContent.trim();
  countryInput.value = selectedCountry;
  countrySuggestionsDiv.classList.add('hidden');
}
});

// Handle keyboard navigation
countryInput.addEventListener('keydown', function(e) {
const items = countrySuggestionsDiv.getElementsByClassName('suggestion-item');
const currentIndex = Array.from(items).findIndex(item => 
  item.classList.contains('bg-gray-100') || 
  item.classList.contains('dark:bg-gray-700')
);

switch(e.key) {
  case 'ArrowDown':
    e.preventDefault();
    if (currentIndex < items.length - 1) {
      if (currentIndex >= 0) {
        items[currentIndex].classList.remove('bg-gray-100', 'dark:bg-gray-700');
      }
      items[currentIndex + 1].classList.add('bg-gray-100', 'dark:bg-gray-700');
      items[currentIndex + 1].scrollIntoView({ block: 'nearest' });
    }
    break;

  case 'ArrowUp':
    e.preventDefault();
    if (currentIndex > 0) {
      items[currentIndex].classList.remove('bg-gray-100', 'dark:bg-gray-700');
      items[currentIndex - 1].classList.add('bg-gray-100', 'dark:bg-gray-700');
      items[currentIndex - 1].scrollIntoView({ block: 'nearest' });
    }
    break;

  case 'Enter':
    e.preventDefault();
    const selectedItem = countrySuggestionsDiv.querySelector('.bg-gray-100, .dark:bg-gray-700');
    if (selectedItem) {
      selectedCountry = selectedItem.textContent.trim();
      countryInput.value = selectedCountry;
      countrySuggestionsDiv.classList.add('hidden');
    }
    break;

  case 'Escape':
    countrySuggestionsDiv.classList.add('hidden');
    break;
}
});

// Close suggestions when clicking outside
document.addEventListener('click', function(e) {
if (!countryInput.contains(e.target) && !countrySuggestionsDiv.contains(e.target)) {
  countrySuggestionsDiv.classList.add('hidden');
  if (!selectedCountry) {
    countryInput.value = '';
  }
}
});

const regions = [
'Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America', 'Australia', 'New Zealand'
];

function filterRegions() {
const input = document.getElementById('region').value.toLowerCase();
const suggestions = document.getElementById('region-suggestions');
suggestions.innerHTML = ''; // Clear previous suggestions

if (input) {
  const filteredRegions = regions.filter(region => 
    region.toLowerCase().includes(input)
  );

  filteredRegions.forEach(region => {
    const suggestionItem = document.createElement('div');
    suggestionItem.classList.add('suggestion-item');
    suggestionItem.textContent = region;
    suggestionItem.onclick = () => {
      document.getElementById('region').value = region; // Set input value
      suggestions.innerHTML = ''; // Clear suggestions
    };
    suggestions.appendChild(suggestionItem);
  });
}
}
 */
