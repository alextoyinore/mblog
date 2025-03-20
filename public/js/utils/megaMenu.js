const toggleMegaMenu = (event) => {
const megaMenuContent = event.currentTarget.nextElementSibling;
const genreButton = document.querySelector('#genreButton');
    // Toggle the clicked accordion
if (megaMenuContent.classList.contains('hidden')) {
    megaMenuContent.classList.remove('hidden');
    megaMenuContent.style.maxHeight = megaMenuContent.scrollHeight + 'px'; // Set max-height for animation
    } else {
    megaMenuContent.classList.add('hidden');
    megaMenuContent.style.maxHeight = '0'; // Reset max-height for animation
    }
}
