document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobileMenu');
    const openButton = document.getElementById('openMobileMenu');
    const closeButton = document.getElementById('closeMobileMenu');
    const body = document.body;

    function openMenu() {
        mobileMenu.classList.remove('translate-x-full');
        mobileMenu.classList.add('translate-x-0');
        body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    }

    function closeMenu() {
        mobileMenu.classList.remove('translate-x-0');
        mobileMenu.classList.add('translate-x-full');
        body.style.overflow = ''; // Restore scrolling
    }

    // Open menu when hamburger is clicked
    openButton.addEventListener('click', openMenu);

    // Close menu when X is clicked
    closeButton.addEventListener('click', closeMenu);

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('translate-x-0') && // Menu is open
            !mobileMenu.contains(e.target) && // Click is outside menu
            !openButton.contains(e.target)) { // Click is not on hamburger
            closeMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('translate-x-0')) {
            closeMenu();
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) { // lg breakpoint
            closeMenu();
        }
    });
});

