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

  // Dark mode toggle functionality
  const darkModeToggle = document.getElementById("darkModeToggle");
  darkModeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    // Optional: Save preference to localStorage
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("darkMode", isDark);
  });

  // Check for saved dark mode preference
  if (
    localStorage.getItem("darkMode") === "true" ||
    (!localStorage.getItem("darkMode") &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  }