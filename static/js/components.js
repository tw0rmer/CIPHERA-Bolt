// Load and inject components
async function loadComponent(url, targetSelector) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    document.querySelector(targetSelector).innerHTML = html;
    
    // Re-initialize event listeners for the component
    if (targetSelector === '.sidebar-container') {
      initializeSidebar();
    } else if (targetSelector === '.header-right-container') {
      initializeProfileDropdown();
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

  function openSide() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
  }

  function closeSide() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  }

  hamburger?.addEventListener('click', openSide);
  overlay?.addEventListener('click', closeSide);

  document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768 && !link.parentElement.classList.contains('has-submenu')) {
        closeSide();
      }
    });
  });

  document.querySelectorAll('.has-submenu > a').forEach(toggle => {
    toggle.addEventListener('click', e => {
      e.preventDefault();
      toggle.parentElement.classList.toggle('active');
    });
  });
}

// Profile dropdown initialization
function initializeProfileDropdown() {
  const avatarBtn = document.querySelector('.avatar-btn');
  const userMenu = document.querySelector('.user-dropdown');

  avatarBtn?.addEventListener('click', e => {
    e.stopPropagation();
    userMenu.classList.toggle('show');
  });

  document.addEventListener('click', e => {
    if (userMenu && !userMenu.contains(e.target) && !avatarBtn.contains(e.target)) {
      userMenu.classList.remove('show');
    }
  });
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loadComponent('/components/sidebar.html', '.sidebar-container');
  loadComponent('/components/profile-dropdown.html', '.header-right-container');
});