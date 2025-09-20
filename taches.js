document.addEventListener('DOMContentLoaded', () => {
  loadTasks();

  const btnNouvelleTache = document.querySelector('.add-task');
  if (btnNouvelleTache) {
    btnNouvelleTache.addEventListener('click', () => openTaskModal());
  }
  
  setupFilters();
});

let allTasks = [];
let allProjects = [];
let allUsers = [];

async function loadTasks() {
  try {
    [allTasks, allProjects, allUsers] = await Promise.all([
      api.getTaches(),
      api.getProjets(),
      api.getUtilisateurs()
    ]);
    displayTasks(allTasks);
  } catch (error) {
    showNotification("Erreur lors du chargement des tâches", "error");
  }
}

function displayTasks(taches) {
  const tbody = document.querySelector('.task-table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (taches.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6">Aucune tâche trouvée.</td></tr>';
    return;
  }

  taches.forEach(tache => {
    const user = allUsers.find(u => u.id_utilisateur === tache.id_utilisateur);
    const projet = allProjects.find(p => p.id_projet === tache.id_projet);

    const tr = document.createElement('tr');
    tr.dataset.status = tache.statut.toLowerCase().replace(' ', '-');
    
    tr.innerHTML = `
      <td>${tache.titre}</td>
      <td>${user ? user.nom : 'Non assigné'}</td>
      <td><span class="tag ${tache.priorite.toLowerCase()}">${tache.priorite}</span></td>
      <td>${formatDate(tache.date_echeance)}</td>
      <td><span class="status ${tr.dataset.status}">${tache.statut}</span></td>
      <td>
        <button class="btn-edit">✏️</button>
        <button class="btn-delete">🗑️</button>
      </td>
    `;

    tr.querySelector('.btn-edit').addEventListener('click', () => openTaskModal(tache));
    tr.querySelector('.btn-delete').addEventListener('click', () => deleteTask(tache.id_tache));

    tbody.appendChild(tr);
  });
}

function setupFilters() {
  const filters = document.querySelectorAll('.filter');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const status = btn.dataset.filter;
      
      const statusMap = {
        'todo': 'À faire',
        'progress': 'En cours',
        'done': 'Terminée'
      };
      const targetStatus = statusMap[status];

      const filteredTasks = status === 'all' 
        ? allTasks 
        : allTasks.filter(t => t.statut === targetStatus);
        
      displayTasks(filteredTasks);
    });
  });
}

function openTaskModal(tache = null) {
  const modalTitle = tache ? 'Modifier la Tâche' : 'Nouvelle Tâche';
  const modalContent = `
    <form id="formTache">
      <input type="hidden" name="id_tache" value="${tache ? tache.id_tache : ''}">
      
      <div class="form-group">
        <label for="titre">Titre de la tâche</label>
        <input type="text" name="titre" id="titre" value="${tache ? tache.titre : ''}" required>
      </div>
      
      <div class="form-group">
        <label for="description">Description</label>
        <textarea name="description" id="description">${tache ? tache.description : ''}</textarea>
      </div>

      <div class="form-group-grid">
        <div class="form-group">
          <label for="id_projet">Projet</label>
          <select name="id_projet" id="id_projet">
            <option value="">Aucun</option>
            ${allProjects.map(p => `<option value="${p.id_projet}" ${tache && tache.id_projet === p.id_projet ? 'selected' : ''}>${p.titre}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label for="id_utilisateur">Assigné à</label>
          <select name="id_utilisateur" id="id_utilisateur">
            <option value="">Personne</option>
            ${allUsers.map(u => `<option value="${u.id_utilisateur}" ${tache && tache.id_utilisateur === u.id_utilisateur ? 'selected' : ''}>${u.nom}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="form-group-grid">
        <div class="form-group">
          <label for="statut">Statut</label>
          <select name="statut" id="statut">
            <option value="À faire" ${tache && tache.statut === 'À faire' ? 'selected' : ''}>À faire</option>
            <option value="En cours" ${tache && tache.statut === 'En cours' ? 'selected' : ''}>En cours</option>
            <option value="Terminée" ${tache && tache.statut === 'Terminée' ? 'selected' : ''}>Terminée</option>
          </select>
        </div>
        <div class="form-group">
          <label for="priorite">Priorité</label>
          <select name="priorite" id="priorite">
            <option value="Basse" ${tache && tache.priorite === 'Basse' ? 'selected' : ''}>Basse</option>
            <option value="Moyenne" ${tache && tache.priorite === 'Moyenne' ? 'selected' : ''}>Moyenne</option>
            <option value="Haute" ${tache && tache.priorite === 'Haute' ? 'selected' : ''}>Haute</option>
          </select>
        </div>
      </div>
      
      <div class="form-group">
        <label for="date_echeance">Date d'échéance</label>
        <input type="date" name="date_echeance" id="date_echeance" value="${tache ? tache.date_echeance : ''}">
      </div>
      
      <div class="form-actions">
        <button type="submit" class="btn-principal">${tache ? 'Enregistrer' : 'Créer'}</button>
      </div>
    </form>
  `;

  showModal(modalTitle, modalContent);

  document.getElementById('formTache').addEventListener('submit', handleTaskFormSubmit);
}

async function handleTaskFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const tacheData = Object.fromEntries(formData.entries());
  const tacheId = tacheData.id_tache;

  try {
    if (tacheId) {
      await api.updateTache(tacheId, tacheData);
      showNotification('Tâche mise à jour avec succès');
    } else {
      await api.createTache(tacheData);
      showNotification('Tâche créée avec succès');
    }
    closeModal();
    loadTasks();
  } catch (error) {
    showNotification("Erreur lors de la sauvegarde de la tâche", "error");
  }
}

async function deleteTask(id) {
  if (confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
    try {
      await api.deleteTache(id);
      showNotification('Tâche supprimée avec succès');
      loadTasks();
    } catch (error) {
      showNotification("Erreur lors de la suppression de la tâche", "error");
    }
  }
}
