// =====================
//  API Abstraction Layer
// =====================
const API_BASE_URL = 'http://localhost:3000/api';

const api = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur serveur');
      }
      return response.json();
    } catch (error) {
      console.error(`Erreur API sur ${endpoint}:`, error);
      showNotification(error.message, 'error');
      throw error;
    }
  },

  // -- Utilisateurs --
  getUtilisateurs: () => api.request('/utilisateurs'),
  createUtilisateur: (data) => api.request('/utilisateurs', { method: 'POST', body: JSON.stringify(data) }),
  updateUtilisateur: (id, data) => api.request(`/utilisateurs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUtilisateur: (id) => api.request(`/utilisateurs/${id}`, { method: 'DELETE' }),

  // -- Projets --
  getProjets: () => api.request('/projets'),
  createProjet: (data) => api.request('/projets', { method: 'POST', body: JSON.stringify(data) }),
  updateProjet: (id, data) => api.request(`/projets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProjet: (id) => api.request(`/projets/${id}`, { method: 'DELETE' }),

  // -- Tâches --
  getTaches: () => api.request('/taches'),
  getTachesByProjet: (id) => api.request(`/projets/${id}/taches`),
  createTache: (data) => api.request('/taches', { method: 'POST', body: JSON.stringify(data) }),
  updateTache: (id, data) => api.request(`/taches/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTache: (id) => api.request(`/taches/${id}`, { method: 'DELETE' }),
};

// =====================
//  Notifications
// =====================
function showNotification(message, type = 'success') {
  const container = document.getElementById('notification-container');
  if (!container) {
    console.error("Le conteneur de notifications n'a pas été trouvé.");
    return;
  }
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  container.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// =====================
//  Formatage de date
// =====================
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// =====================
//  Calcul de progression
// =====================
function calculateProgress(taches) {
  if (taches.length === 0) return 0;
  const completed = taches.filter(t => t.statut === 'Terminée').length;
  return Math.round((completed / taches.length) * 100);
}
