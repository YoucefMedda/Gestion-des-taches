// =====================
//  Gestion du header commun
// =====================

document.addEventListener('DOMContentLoaded', () => {
  initializeHeader();
});

function initializeHeader() {
  // Ajouter les événements de navigation
  setupNavigation();
  
  // Ajouter les événements de notifications
  setupNotifications();
  
  // Ajouter les événements de profil
  setupProfile();
  
  // Gérer le menu mobile
  setupMobileMenu();
  
  // Marquer la page active
  markActivePage();
}

// =====================
//  Navigation
// =====================
function setupNavigation() {
  const navLinks = document.querySelectorAll('header nav a, .header-nav a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Si c'est un lien vers une page existante, on laisse le comportement par défaut
      if (link.getAttribute('href') && !link.getAttribute('href').startsWith('#')) {
        return;
      }
      
      // Sinon, on empêche le comportement par défaut
      e.preventDefault();
      
      // Afficher un message temporaire
      const pageName = link.textContent.trim();
      showNotification(`Page "${pageName}" en cours de développement`, 'info');
    });
  });
}

// =====================
//  Notifications
// =====================
function setupNotifications() {
  const notificationBtn = document.querySelector('.notif, .header-notifications');
  
  if (notificationBtn) {
    notificationBtn.addEventListener('click', () => {
      showNotificationDropdown();
    });
  }
}

function showNotificationDropdown() {
  // Créer le dropdown des notifications
  const existingDropdown = document.querySelector('.notification-dropdown');
  if (existingDropdown) {
    existingDropdown.remove();
    return;
  }
  
  const dropdown = document.createElement('div');
  dropdown.className = 'notification-dropdown';
  dropdown.innerHTML = `
    <div class="notification-header">
      <h4>Notifications</h4>
      <button class="close-notifications">&times;</button>
    </div>
    <div class="notification-list">
      <div class="notification-item">
        <div class="notification-icon">📋</div>
        <div class="notification-content">
          <p>Nouvelle tâche assignée</p>
          <span class="notification-time">Il y a 2 heures</span>
        </div>
      </div>
      <div class="notification-item">
        <div class="notification-icon">✅</div>
        <div class="notification-content">
          <p>Projet "Alpha" terminé</p>
          <span class="notification-time">Il y a 1 jour</span>
        </div>
      </div>
      <div class="notification-item">
        <div class="notification-icon">⚠️</div>
        <div class="notification-content">
          <p>Échéance approchante</p>
          <span class="notification-time">Il y a 2 jours</span>
        </div>
      </div>
    </div>
    <div class="notification-footer">
      <button class="view-all-notifications">Voir toutes les notifications</button>
    </div>
  `;
  
  // Styles pour le dropdown
  dropdown.style.cssText = `
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    min-width: 300px;
    max-width: 400px;
    z-index: 1000;
    margin-top: 0.5rem;
  `;
  
  // Ajouter les styles pour les éléments internes
  const style = document.createElement('style');
  style.textContent = `
    .notification-dropdown .notification-header {
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .notification-dropdown .notification-header h4 {
      margin: 0;
      color: #111827;
      font-size: 1rem;
    }
    
    .notification-dropdown .close-notifications {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #6b7280;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s;
    }
    
    .notification-dropdown .close-notifications:hover {
      background-color: #f3f4f6;
    }
    
    .notification-dropdown .notification-list {
      max-height: 300px;
      overflow-y: auto;
    }
    
    .notification-dropdown .notification-item {
      padding: 1rem;
      border-bottom: 1px solid #f3f4f6;
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
      transition: background-color 0.2s;
    }
    
    .notification-dropdown .notification-item:hover {
      background-color: #f9fafb;
    }
    
    .notification-dropdown .notification-item:last-child {
      border-bottom: none;
    }
    
    .notification-dropdown .notification-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
    }
    
    .notification-dropdown .notification-content p {
      margin: 0 0 0.25rem 0;
      color: #111827;
      font-size: 0.875rem;
    }
    
    .notification-dropdown .notification-time {
      color: #6b7280;
      font-size: 0.75rem;
    }
    
    .notification-dropdown .notification-footer {
      padding: 1rem;
      border-top: 1px solid #e5e7eb;
    }
    
    .notification-dropdown .view-all-notifications {
      width: 100%;
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .notification-dropdown .view-all-notifications:hover {
      background: #2563eb;
    }
  `;
  
  document.head.appendChild(style);
  
  // Positionner le dropdown
  const notificationBtn = document.querySelector('.notif, .header-notifications');
  if (notificationBtn) {
    notificationBtn.style.position = 'relative';
    notificationBtn.appendChild(dropdown);
    
    // Gérer la fermeture
    dropdown.querySelector('.close-notifications').addEventListener('click', () => {
      dropdown.remove();
    });
    
    dropdown.querySelector('.view-all-notifications').addEventListener('click', () => {
      showNotification('Fonctionnalité en cours de développement', 'info');
      dropdown.remove();
    });
    
    // Fermer en cliquant à l'extérieur
    document.addEventListener('click', (e) => {
      if (!notificationBtn.contains(e.target)) {
        dropdown.remove();
      }
    });
  }
}

// =====================
//  Profil utilisateur
// =====================
function setupProfile() {
  const profileSection = document.querySelector('.profile, .header-profile');
  
  if (profileSection) {
    profileSection.addEventListener('click', () => {
      showProfileDropdown();
    });
  }
}

function showProfileDropdown() {
  const existingDropdown = document.querySelector('.profile-dropdown');
  if (existingDropdown) {
    existingDropdown.remove();
    return;
  }
  
  const dropdown = document.createElement('div');
  dropdown.className = 'profile-dropdown';
  dropdown.innerHTML = `
    <div class="profile-info">
      <div class="profile-avatar">
        <img src="https://i.pravatar.cc/60" alt="Avatar">
      </div>
      <div class="profile-details">
        <h4>Admin</h4>
        <p>Administrateur</p>
      </div>
    </div>
    <div class="profile-menu">
      <a href="#" class="profile-menu-item">
        <span class="menu-icon">👤</span>
        Mon profil
      </a>
      <a href="#" class="profile-menu-item">
        <span class="menu-icon">⚙️</span>
        Paramètres
      </a>
      <a href="#" class="profile-menu-item">
        <span class="menu-icon">📊</span>
        Statistiques
      </a>
      <hr>
      <a href="#" class="profile-menu-item logout">
        <span class="menu-icon">🚪</span>
        Déconnexion
      </a>
    </div>
  `;
  
  // Styles pour le dropdown de profil
  dropdown.style.cssText = `
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    min-width: 250px;
    z-index: 1000;
    margin-top: 0.5rem;
    overflow: hidden;
  `;
  
  // Ajouter les styles
  const style = document.createElement('style');
  style.textContent = `
    .profile-dropdown .profile-info {
      padding: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
    
    .profile-dropdown .profile-avatar img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }
    
    .profile-dropdown .profile-details h4 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
    }
    
    .profile-dropdown .profile-details p {
      margin: 0;
      font-size: 0.875rem;
      opacity: 0.9;
    }
    
    .profile-dropdown .profile-menu {
      padding: 0.5rem 0;
    }
    
    .profile-dropdown .profile-menu-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: #374151;
      text-decoration: none;
      transition: background-color 0.2s;
    }
    
    .profile-dropdown .profile-menu-item:hover {
      background-color: #f3f4f6;
    }
    
    .profile-dropdown .profile-menu-item.logout {
      color: #ef4444;
    }
    
    .profile-dropdown .profile-menu-item.logout:hover {
      background-color: #fef2f2;
    }
    
    .profile-dropdown .menu-icon {
      font-size: 1.125rem;
      width: 20px;
      text-align: center;
    }
    
    .profile-dropdown hr {
      margin: 0.5rem 0;
      border: none;
      border-top: 1px solid #e5e7eb;
    }
  `;
  
  document.head.appendChild(style);
  
  // Positionner le dropdown
  const profileSection = document.querySelector('.profile, .header-profile');
  if (profileSection) {
    profileSection.style.position = 'relative';
    profileSection.appendChild(dropdown);
    
    // Gérer les clics sur les éléments du menu
    dropdown.querySelectorAll('.profile-menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const itemText = item.textContent.trim();
        showNotification(`Fonctionnalité "${itemText}" en cours de développement`, 'info');
        dropdown.remove();
      });
    });
    
    // Fermer en cliquant à l'extérieur
    document.addEventListener('click', (e) => {
      if (!profileSection.contains(e.target)) {
        dropdown.remove();
      }
    });
  }
}

// =====================
//  Menu mobile
// =====================
function setupMobileMenu() {
  const mobileToggle = document.querySelector('.header-mobile-toggle');
  const nav = document.querySelector('header nav, .header-nav');
  
  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
    
    // Fermer le menu en cliquant sur un lien
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
      });
    });
  }
}

// =====================
//  Marquer la page active
// =====================
function markActivePage() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('header nav a, .header-nav a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const linkPage = href.split('/').pop();
      if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}

// =====================
//  Utilitaires
// =====================
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Styles inline pour les notifications
  notification.style.cssText = `
    position: fixed;
    top: 1rem;
    right: 1rem;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 1001;
    max-width: 400px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    animation: slideInRight 0.3s ease;
  `;
  
  // Couleurs selon le type
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6',
    warning: '#f59e0b'
  };
  notification.style.backgroundColor = colors[type] || colors.info;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}
