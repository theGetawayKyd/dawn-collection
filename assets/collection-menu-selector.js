class CollectionMenuSelector extends HTMLElement {
  constructor() {
    super();
    this.links = this.querySelectorAll('.collection-icons-list__link');
    this.setupEventListeners();
    this.initializeDefaultCollection();
  }

  setupEventListeners() {
    this.links.forEach((link) => {
      link.addEventListener('click', this.handleCollectionClick.bind(this));
    });
  }

  initializeDefaultCollection() {
    // If no collection is selected, select the first one
    if (!localStorage.getItem('selectedCollectionId') && this.links.length > 0) {
      const firstCollectionId = this.links[0].dataset.collectionId;
      localStorage.setItem('selectedCollectionId', firstCollectionId);

      // Add active class to the first collection
      this.links[0].classList.add('active');

      // Dispatch event to notify the header
      this.dispatchCollectionChangeEvent(firstCollectionId);
    } else if (localStorage.getItem('selectedCollectionId')) {
      // If a collection is already selected, highlight it
      const selectedId = localStorage.getItem('selectedCollectionId');
      const selectedLink = Array.from(this.links).find((link) => link.dataset.collectionId === selectedId);

      if (selectedLink) {
        selectedLink.classList.add('active');
      }
    }
  }

  handleCollectionClick(event) {
    event.preventDefault();

    const link = event.currentTarget;
    const collectionId = link.dataset.collectionId;

    // Remove active class from all links
    this.links.forEach((link) => link.classList.remove('active'));

    // Add active class to clicked link
    link.classList.add('active');

    // Save selected collection to localStorage
    localStorage.setItem('selectedCollectionId', collectionId);
    console.log(collectionId);

    // Dispatch event to notify the header
    this.dispatchCollectionChangeEvent(collectionId);

    // Navigate to the collection page
    window.location.href = link.getAttribute('href');
  }

  dispatchCollectionChangeEvent(collectionId) {
    const event = new CustomEvent('collection:selected', {
      detail: { collectionId },
      bubbles: true,
    });
    this.dispatchEvent(event);
  }
}

customElements.define('collection-menu-selector', CollectionMenuSelector);

// Header menu handler
class HeaderCollectionMenu extends HTMLElement {
  constructor() {
    super();
    this.menuContainers = this.querySelectorAll('[data-collection-menu]');
    this.initializeMenu();

    // Listen for collection selection changes
    document.addEventListener('collection:selected', this.handleCollectionChange.bind(this));
  }

  initializeMenu() {
    const selectedCollectionId = localStorage.getItem('selectedCollectionId');
    if (selectedCollectionId) {
      this.showMenu(selectedCollectionId);
    } else if (this.menuContainers.length > 0) {
      // Show the first menu by default
      const firstMenuId = this.menuContainers[0].dataset.collectionId;
      this.showMenu(firstMenuId);
    }
  }

  handleCollectionChange(event) {
    const { collectionId } = event.detail;
    this.showMenu(collectionId);
  }

  showMenu(collectionId) {
    // Hide all menus
    this.menuContainers.forEach((container) => {
      container.classList.add('hidden');
    });

    // Show the selected menu
    const selectedMenu = Array.from(this.menuContainers).find(
      (container) => container.dataset.collectionId === collectionId
    );

    if (selectedMenu) {
      selectedMenu.classList.remove('hidden');
    }
  }
}

customElements.define('header-collection-menu', HeaderCollectionMenu);
