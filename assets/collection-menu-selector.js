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
    console.log('Available collection links:', Array.from(this.links).map(link => {
      return {
        id: link.dataset.collectionId,
        menuHandle: link.dataset.menuHandle,
        hasMenu: link.dataset.hasMenu
      };
    }));
    
    // If no collection is selected, select the first one
    if (!localStorage.getItem('selectedCollectionId') && this.links.length > 0) {
      const firstCollectionId = this.links[0].dataset.collectionId;
      console.log('Setting default collection ID:', firstCollectionId);
      localStorage.setItem('selectedCollectionId', firstCollectionId);

      // Add active class to the first collection
      this.links[0].classList.add('active');

      // Dispatch event to notify the header
      this.dispatchCollectionChangeEvent(firstCollectionId);
    } else if (localStorage.getItem('selectedCollectionId')) {
      console.log('Found stored collection ID:', localStorage.getItem('selectedCollectionId'));
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
    const menuHandle = link.dataset.menuHandle;
    const hasMenu = link.dataset.hasMenu;

    console.log('Collection clicked:', {
      collectionId,
      menuHandle,
      hasMenu,
      linkElement: link
    });

    // Remove active class from all links
    this.links.forEach((link) => link.classList.remove('active'));

    // Add active class to clicked link
    link.classList.add('active');

    // Save selected collection to localStorage
    localStorage.setItem('selectedCollectionId', collectionId);
    console.log('Saved collection ID to localStorage:', collectionId);

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
    this.createMenuContainers();
    this.menuContainers = this.querySelectorAll('[data-collection-menu]');
    this.initializeMenu();

    // Listen for collection selection changes
    document.addEventListener('collection:selected', this.handleCollectionChange.bind(this));
  }
  
  createMenuContainers() {
    console.log('Creating menu containers in header');
    // Find all collection links with menus
    const collectionLinks = document.querySelectorAll('.collection-icons-list__link[data-has-menu="true"]');
    console.log('Found collection links with menus:', collectionLinks.length);
    
    // Clear any existing menu containers
    this.innerHTML = '';
    
    // Create a menu container for each collection that has a menu
    collectionLinks.forEach(link => {
      const collectionId = link.dataset.collectionId;
      const menuHandle = link.dataset.menuHandle;
      
      if (!collectionId || !menuHandle) {
        console.log('Missing data attributes for link:', link);
        return;
      }
      
      console.log(`Creating menu container for collection ${collectionId} with menu ${menuHandle}`);
      
      // Create the menu container
      const menuContainer = document.createElement('div');
      menuContainer.className = 'header-collection-menu hidden';
      menuContainer.dataset.collectionId = collectionId;
      menuContainer.dataset.collectionMenu = '';
      menuContainer.dataset.menuHandle = menuHandle;
      
      // Fetch the menu content
      this.fetchMenuContent(menuHandle, menuContainer);
      
      // Add to the header
      this.appendChild(menuContainer);
    });
  }
  
  fetchMenuContent(menuHandle, container) {
    // Create the menu structure
    const menuLinks = window.linklists && window.linklists[menuHandle] ? window.linklists[menuHandle].links : [];
    
    if (!menuLinks || menuLinks.length === 0) {
      console.log(`No links found for menu handle: ${menuHandle}`);
      return;
    }
    
    console.log(`Found ${menuLinks.length} links for menu handle: ${menuHandle}`);
    
    // Create the menu HTML
    const nav = document.createElement('nav');
    nav.className = 'header__inline-menu';
    
    const ul = document.createElement('ul');
    ul.className = 'list-menu list-menu--inline';
    ul.setAttribute('role', 'list');
    
    menuLinks.forEach(link => {
      const li = document.createElement('li');
      
      const a = document.createElement('a');
      a.href = link.url;
      a.className = 'header__menu-item list-menu__item link link--text focus-inset';
      
      const span = document.createElement('span');
      span.textContent = link.title;
      
      a.appendChild(span);
      li.appendChild(a);
      ul.appendChild(li);
    });
    
    nav.appendChild(ul);
    container.appendChild(nav);
  }

  initializeMenu() {
    console.log('HeaderCollectionMenu - Available menus:', Array.from(this.menuContainers).map(container => {
      return {
        id: container.dataset.collectionId,
        element: container
      };
    }));
    
    const selectedCollectionId = localStorage.getItem('selectedCollectionId');
    console.log('HeaderCollectionMenu - Retrieved collection ID from localStorage:', selectedCollectionId);
    
    if (selectedCollectionId) {
      this.showMenu(selectedCollectionId);
    } else if (this.menuContainers.length > 0) {
      // Show the first menu by default
      const firstMenuId = this.menuContainers[0].dataset.collectionId;
      console.log('HeaderCollectionMenu - No stored ID, using first menu:', firstMenuId);
      this.showMenu(firstMenuId);
    }
  }

  handleCollectionChange(event) {
    const { collectionId } = event.detail;
    this.showMenu(collectionId);
  }

  showMenu(collectionId) {
    console.log('HeaderCollectionMenu - Attempting to show menu for collection ID:', collectionId);
    
    // Hide all menus
    this.menuContainers.forEach((container) => {
      container.classList.add('hidden');
    });

    // Show the selected menu
    const selectedMenu = Array.from(this.menuContainers).find(
      (container) => container.dataset.collectionId === collectionId
    );

    console.log('HeaderCollectionMenu - Found menu?', selectedMenu ? 'Yes' : 'No', 
                selectedMenu ? `(ID: ${selectedMenu.dataset.collectionId})` : '');

    if (selectedMenu) {
      selectedMenu.classList.remove('hidden');
      console.log('HeaderCollectionMenu - Menu displayed for collection ID:', collectionId);
    } else {
      console.log('HeaderCollectionMenu - No menu found for collection ID:', collectionId);
    }
  }
}

customElements.define('header-collection-menu', HeaderCollectionMenu);
