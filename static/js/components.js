// Load and inject components
async function loadComponent(url, targetSelector) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    const container = document.querySelector(targetSelector);
    if (container) {
      container.innerHTML = html;
      
      // Re-initialize event listeners for the component
      if (targetSelector === '.sidebar-container') {
        initializeSidebar();
      } else if (targetSelector === '.header-right-container') {
        initializeProfileDropdown();
      }
    }
  } catch (error) {
    console.error('Error loading component:', error);
  }
}

// Sidebar initialization
function initializeSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.overlay');
  const hamburger = document.querySelector('.hamburger');

  if (!sidebar || !overlay || !hamburger) return;

  function openSide() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
  }

  function closeSide() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  }

  hamburger.addEventListener('click', openSide);
  overlay.addEventListener('click', closeSide);

  // Handle submenu toggles
  const submenus = document.querySelectorAll('.has-submenu > a');
  submenus.forEach(submenu => {
    submenu.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parent = submenu.parentElement;
      
      // Close other open submenus
      submenus.forEach(other => {
        if (other !== submenu) {
          other.parentElement.classList.remove('active');
        }
      });
      
      // Toggle current submenu
      parent.classList.toggle('active');
    });
  });

  // Handle mobile menu closing
  document.querySelectorAll('.sidebar a:not(.has-submenu > a)').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeSide();
      }
    });
  });
}

// Profile dropdown initialization
function initializeProfileDropdown() {
  const avatarBtn = document.querySelector('.avatar-btn');
  const userMenu = document.querySelector('.user-dropdown');

  if (!avatarBtn || !userMenu) return;

  avatarBtn.addEventListener('click', e => {
    e.stopPropagation();
    userMenu.classList.toggle('show');
  });

  document.addEventListener('click', e => {
    if (!userMenu.contains(e.target) && !avatarBtn.contains(e.target)) {
      userMenu.classList.remove('show');
    }
  });
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loadComponent('./components/sidebar.html', '.sidebar-container');
  loadComponent('./components/profile-dropdown.html', '.header-right-container');
});