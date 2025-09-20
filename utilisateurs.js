// =====================
//  Gestion des utilisateurs - Page utilisateurs.html
// =====================

let utilisateurs = [];
let taches = [];
let projets = [];

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Charger les données
    await loadData();
    
    // Afficher les utilisateurs
    displayUtilisateurs();
    
    // Mettre à jour les statistiques
    updateStats();
    
    // Configurer les événements
    setupEventListeners();

  } catch (error) {
    console.error('Erreur lors du chargement:', error);
    showNotification('Erreur lors du chargement des utilisateurs', 'error');
  }
});

// =====================
//  Chargement des données
// =====================
async function loadData() {
  [utilisateurs, taches, projets] = await Promise.all([
    api.getUtilisateurs(),
    api.getTaches(),
    api.getProjets()
  ]);
}

// =====================
//  Affichage des utilisateurs
// =====================
function displayUtilisateurs() {
  const tbody = document.getElementById('utilisateurs-table');
  
  if (utilisateurs.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2rem;">
          Aucun utilisateur trouvé
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = utilisateurs.map(utilisateur => {
    const userTaches = taches.filter(t => t.id_utilisateur === utilisateur.id_utilisateur);
    const userProjets = projets.filter(p => p.id_utilisateur === utilisateur.id_utilisateur);
    
    return `
      <tr data-user-id="${utilisateur.id_utilisateur}">
        <td>
          <div class="user-info">
            <img src="https://i.pravatar.cc/40?u=${utilisateur.email}" alt="Avatar" class="user-avatar">
            <span class="user-name">${utilisateur.nom}</span>
          </div>
        </td>
        <td>${utilisateur.email}</td>
        <td><span class="role-badge ${getRoleClass(utilisateur.role)}">${utilisateur.role}</span></td>
        <td>${userTaches.length} tâches</td>
        <td>${userProjets.length} projets</td>
        <td>
          <button class="edit" onclick="editUtilisateur(${utilisateur.id_utilisateur})" title="Modifier">✏️</button>
          <button class="delete" onclick="deleteUtilisateur(${utilisateur.id_utilisateur})" title="Supprimer">🗑️</button>
        </td>
      </tr>
    `;
  }).join('');
}

// =====================
//  Mise à jour des statistiques
// =====================
function updateStats() {
  const total = utilisateurs.length;
  const admins = utilisateurs.filter(u => u.role === 'admin').length;
  const users = utilisateurs.filter(u => u.role === 'user').length;

  document.getElementById('count-total').textContent = `${total} utilisateurs`;
  document.getElementById('count-admin').textContent = `${admins} admins`;
  document.getElementById('count-users').textContent = `${users} utilisateurs`;
}

// =====================
//  Configuration des événements
// =====================
function setupEventListeners() {
  // Bouton "Nouvel Utilisateur"
  document.getElementById('btnNouvelUtilisateur').addEventListener('click', showCreateUtilisateurModal);
}

// =====================
//  Actions sur les utilisateurs
// =====================
function showCreateUtilisateurModal() {
  const modal = createUtilisateurModal();
  document.body.appendChild(modal);
}

function createUtilisateurModal(utilisateur = null) {
  const isEdit = utilisateur !== null;
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>${isEdit ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}</h3>
        <button class="close-modal">&times;</button>
      </div>
      <form class="modal-form" id="utilisateurForm">
        <div class="form-group">
          <label for="nom">Nom complet *</label>
          <input type="text" id="nom" name="nom" value="${utilisateur?.nom || ''}" required>
        </div>
        <div class="form-group">
          <label for="email">Email *</label>
          <input type="email" id="email" name="email" value="${utilisateur?.email || ''}" required>
        </div>
        <div class="form-group">
          <label for="mot_de_passe">Mot de passe ${isEdit ? '(laisser vide pour ne pas changer)' : '*'}</label>
          <input type="password" id="mot_de_passe" name="mot_de_passe" ${isEdit ? '' : 'required'}>
        </div>
        <div class="form-group">
          <label for="role">Rôle *</label>
          <select id="role" name="role" required>
            <option value="user" ${utilisateur?.role === 'user' ? 'selected' : ''}>Utilisateur</option>
            <option value="admin" ${utilisateur?.role === 'admin' ? 'selected' : ''}>Administrateur</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" onclick="closeModal()">Annuler</button>
          <button type="submit" class="btn-principal">${isEdit ? 'Modifier' : 'Créer'}</button>
        </div>
      </form>
    </div>
  `;

  // Gestion de la fermeture
  modal.querySelector('.close-modal').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Gestion du formulaire
  modal.querySelector('#utilisateurForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleUtilisateurSubmit(utilisateur?.id_utilisateur);
  });

  return modal;
}

async function handleUtilisateurSubmit(utilisateurId = null) {
  const form = document.getElementById('utilisateurForm');
  const formData = new FormData(form);
  
  const utilisateurData = {
    nom: formData.get('nom'),
    email: formData.get('email'),
    role: formData.get('role')
  };

  // Ajouter le mot de passe seulement s'il est fourni
  const motDePasse = formData.get('mot_de_passe');
  if (motDePasse) {
    utilisateurData.mot_de_passe = motDePasse;
  }

  try {
    if (utilisateurId) {
      // Pour l'édition, on utilise l'API existante
      await api.updateUtilisateur(utilisateurId, utilisateurData);
      showNotification('Utilisateur modifié avec succès', 'success');
    } else {
      await api.createUtilisateur(utilisateurData);
      showNotification('Utilisateur créé avec succès', 'success');
    }
    
    closeModal();
    await loadData();
    displayUtilisateurs();
    updateStats();
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    showNotification('Erreur lors de la sauvegarde de l\'utilisateur', 'error');
  }
}

function editUtilisateur(utilisateurId) {
  const utilisateur = utilisateurs.find(u => u.id_utilisateur === utilisateurId);
  if (utilisateur) {
    const modal = createUtilisateurModal(utilisateur);
    document.body.appendChild(modal);
  }
}

async function deleteUtilisateur(utilisateurId) {
  const utilisateur = utilisateurs.find(u => u.id_utilisateur === utilisateurId);
  if (!utilisateur) return;

  // Vérifier si l'utilisateur a des tâches ou projets assignés
  const userTaches = taches.filter(t => t.id_utilisateur === utilisateurId);
  const userProjets = projets.filter(p => p.id_utilisateur === utilisateurId);

  let message = `Voulez-vous vraiment supprimer l'utilisateur "${utilisateur.nom}" ?`;
  if (userTaches.length > 0 || userProjets.length > 0) {
    message += `\n\nCet utilisateur a ${userTaches.length} tâches et ${userProjets.length} projets assignés.`;
  }

  if (!confirm(message)) {
    return;
  }

  try {
    await api.deleteUtilisateur(utilisateurId);
    showNotification('Utilisateur supprimé avec succès', 'success');
    await loadData();
    displayUtilisateurs();
    updateStats();
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    showNotification('Erreur lors de la suppression de l\'utilisateur', 'error');
  }
}

function closeModal() {
  const modal = document.querySelector('.modal-overlay');
  if (modal) {
    modal.remove();
  }
}

// =====================
//  Utilitaires
// =====================
function getRoleClass(role) {
  return role === 'admin' ? 'admin' : 'user';
}

// Ajouter les styles CSS pour les utilisateurs
const userStyles = `
  .user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #e5e7eb;
  }
  
  .user-name {
    font-weight: 500;
    color: #111827;
  }
  
  .role-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
  }
  
  .role-badge.admin {
    background-color: #fef3c7;
    color: #92400e;
  }
  
  .role-badge.user {
    background-color: #dbeafe;
    color: #1e40af;
  }
  
  .table-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin-top: 2rem;
  }
`;

// Ajouter les styles au document
const styleSheet = document.createElement('style');
styleSheet.textContent = userStyles;
document.head.appendChild(styleSheet);


