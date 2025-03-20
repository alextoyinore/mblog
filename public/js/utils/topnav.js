// Add this script to handle dropdown -->

document.addEventListener('DOMContentLoaded', () => {
    const profileButton = document.getElementById('profileButton');
    const profileDropdown = document.getElementById('profileDropdown');
    let isDropdownOpen = false;

    // Toggle dropdown
    profileButton.addEventListener('click', (e) => {
        e.stopPropagation();
        isDropdownOpen = !isDropdownOpen;
        profileDropdown.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (isDropdownOpen && !profileDropdown.contains(e.target)) {
            isDropdownOpen = false;
            profileDropdown.classList.add('hidden');
        }
    });

    // Close dropdown on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isDropdownOpen) {
            isDropdownOpen = false;
            profileDropdown.classList.add('hidden');
        }
    });
});


 // Keyboard shortcut function for search field
 document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !e.target.closest("input, textarea")) {
      e.preventDefault();
      document.querySelector('input[type="search"]').focus();
    }
  });

  // Function to apply the system theme
  function systemTheme() {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDarkScheme) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    localStorage.setItem('theme', 'system');
  }

  // Function to apply the light theme
  function lightTheme() {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    localStorage.setItem('theme', 'light');
  }

  // Function to apply the dark theme
  function darkTheme() {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    localStorage.setItem('theme', 'dark');
  }

  // Function to apply the saved theme on page load
  function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      darkTheme();
    } else if (savedTheme === 'light') {
      lightTheme();
    } else {
      systemTheme(); // Default to system theme
    }
  }

  // Call the function to apply the saved theme on page load
  document.addEventListener('DOMContentLoaded', applySavedTheme);

  // Toggle mobile menu
  const hamburgerButton = document.getElementById('hamburgerButton');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMobileMenu = document.getElementById('closeMobileMenu');

  hamburgerButton.addEventListener('click', () => {
    mobileMenu.classList.remove('translate-x-full');
  });

  closeMobileMenu.addEventListener('click', () => {
    mobileMenu.classList.add('translate-x-full');
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (event) => {
    if (!hamburgerButton.contains(event.target) && !mobileMenu.contains(event.target)) {
      mobileMenu.classList.add('translate-x-full');
    }
  });