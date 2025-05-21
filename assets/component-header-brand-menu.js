document.addEventListener('DOMContentLoaded', function () {
  // Initialize header brand menu functionality
  initHeaderBrandMenu();

  // Listen for brand changes
  document.addEventListener('brandChange', handleBrandChange);
});

/**
 * Initialize the header brand menu functionality
 */
function initHeaderBrandMenu() {
  // Check if there's a stored brand menu in session storage
  const storedBrandMenu = sessionStorage.getItem('activeBrandMenu');

  if (storedBrandMenu) {
    updateHeaderMenu(storedBrandMenu);
  }
}

/**
 * Handle brand change events
 * @param {CustomEvent} event - The brand change event
 */
function handleBrandChange(event) {
  const brandMenu = event.detail.brandMenu;

  if (brandMenu) {
    updateHeaderMenu(brandMenu);
  }
}

/**
 * Update the header menu based on the selected brand
 * @param {string} menuHandle - The menu handle to display
 */
function updateHeaderMenu(menuHandle) {
  // We don't need to do anything here as the menu is already set server-side
  // This is just a placeholder for any client-side menu adjustments if needed

  // For example, you could use this to highlight specific menu items
  // or to make other adjustments to the menu based on the active brand

  // Update the header data attribute for potential CSS targeting
  const header = document.querySelector('.header');
  if (header) {
    header.setAttribute('data-active-menu', menuHandle);
  }
}
