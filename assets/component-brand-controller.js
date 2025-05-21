document.addEventListener('DOMContentLoaded', function () {
  // Initialize brand controller functionality
  initBrandController();
});

function initBrandController() {
  const dropdownToggle = document.querySelector('.brand-controller__dropdown-toggle');
  const brandLinks = document.querySelectorAll('.brand-controller__brand-link');

  // Add click event listeners to brand links
  brandLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      // Only prevent default if we're just switching brands without navigation
      if (this.getAttribute('data-prevent-navigation') === 'true') {
        e.preventDefault();
      }

      // Store the selected brand in session storage for client-side use
      const brandId = this.getAttribute('data-brand-id');
      const brandHandle = this.getAttribute('data-brand-handle');
      const brandMenu = this.getAttribute('data-brand-menu');

      sessionStorage.setItem('activeBrand', brandId);
      sessionStorage.setItem('activeBrandHandle', brandHandle);
      sessionStorage.setItem('activeBrandMenu', brandMenu);

      // Broadcast the brand change event for other components to listen for
      const brandChangeEvent = new CustomEvent('brandChange', {
        detail: {
          brandId: brandId,
          brandHandle: brandHandle,
          brandMenu: brandMenu,
          brandTitle: this.getAttribute('data-brand-title'),
          brandUrl: this.getAttribute('href'),
        },
      });
      document.dispatchEvent(brandChangeEvent);

      // Remove active class from all links
      brandLinks.forEach((link) => {
        link.classList.remove('brand-controller__brand-link--active');
        link.closest('.brand-controller__brand-item')?.classList.remove('brand-controller__brand-item--active');
      });

      // Add active class to this link
      this.classList.add('brand-controller__brand-link--active');
      this.closest('.brand-controller__brand-item')?.classList.add('brand-controller__brand-item--active');

      // Update dropdown toggle
      updateDropdownToggle(this);
    });
  });

  // Dropdown toggle functionality for mobile
  if (dropdownToggle) {
    dropdownToggle.addEventListener('click', function () {
      const brandsList = document.querySelector('.brand-controller__brands-list');
      if (brandsList) {
        brandsList.classList.toggle('brand-controller__brands-list--open');
        dropdownToggle.classList.toggle('brand-controller__dropdown-toggle--open');
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (event) {
      const container = document.querySelector('.brand-controller__brands-container');
      if (container && !container.contains(event.target)) {
        const brandsList = document.querySelector('.brand-controller__brands-list');
        if (brandsList && brandsList.classList.contains('brand-controller__brands-list--open')) {
          brandsList.classList.remove('brand-controller__brands-list--open');
          dropdownToggle.classList.remove('brand-controller__dropdown-toggle--open');
        }
      }
    });
  }
}

// Helper function to update the dropdown toggle content
function updateDropdownToggle(activeBrandLink) {
  const dropdownToggle = document.querySelector('.brand-controller__dropdown-toggle');
  if (!dropdownToggle) return;

  const currentBrandElement = dropdownToggle.querySelector('.brand-controller__current-brand');
  if (!currentBrandElement) return;

  // Clone the content from the active brand link
  const brandContent = activeBrandLink.cloneNode(true);

  // Clear the current content
  currentBrandElement.innerHTML = '';

  // If there's an image, use it
  const brandImage = brandContent.querySelector('img');
  if (brandImage) {
    brandImage.classList.add('brand-controller__current-brand-image');
    currentBrandElement.appendChild(brandImage);
  } else {
    // Otherwise use the text
    const brandText = brandContent.querySelector('.brand-controller__brand-text');
    if (brandText) {
      currentBrandElement.appendChild(brandText);
    }
  }
}
