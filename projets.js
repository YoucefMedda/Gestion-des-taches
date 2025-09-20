document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
  
  const btnNouveauProjet = document.getElementById('btnNouveauProjet');
  if(btnNouveauProjet) {
    btnNouveauProjet.addEventListener('click', () => openProjectModal());
  }
});

let allTasks = [];
let allUsers = [];

async function loadProjects() {
  try {
    const [projets, taches, utilisateurs] = await Promise.all([
      api.getProjets(),
      api.getTaches(),
      api.getUtilisateurs()
    ]);
    allTasks = taches;
    allUsers = utilisateurs;
    displayProjects(projets);
  } catch (error) {
    showNotification("Erreur lors du chargement des projets", "error");
  }
}

function displayProjects(projets) {
  const listeProjets = document.getElementById('listeProjets');
  if (!listeProjets) return;
  listeProjets.innerHTML = '';

  if (projets.length === 0) {
    listeProjets.innerHTML = '<p>Aucun projet trouvé.</p>';
    return;
  }

  projets.forEach(projet => {
    const projectTasks = allTasks.filter(t => t.id_projet === projet.id_projet);
    const progress = calculateProgress(projectTasks);
    
    const carteProjet = document.createElement('div');
    carteProjet.className = 'carte-projet';
    carteProjet.dataset.id = projet.id_projet;

    carteProjet.innerHTML = `
      <div class="carte-top">
        <h3>${projet.titre}</h3>
        <span class="taches-count">${projectTasks.length} tâches</span>
      </div>
      <p>${projet.description || 'Pas de description'}</p>
      <div class="progress">
        <div class="progress-text">
          <span>Progression</span>
          <span>${progress}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${progress}%"></div>
        </div>
      </div>
      <div class="carte-actions">
        <button class="btn-edit">Modifier</button>
        <button class="btn-delete">Supprimer</button>
      </div>
    `;
    
    carteProjet.querySelector('.btn-edit').addEventListener('click', () => openProjectModal(projet));
    carteProjet.querySelector('.btn-delete').addEventListener('click', () => deleteProject(projet.id_projet));

    listeProjets.appendChild(carteProjet);
  });
}

function openProjectModal(projet = null) {
  const modalTitle = projet ? 'Modifier le Projet' : 'Nouveau Projet';
  const modalContent = `
    <form id="formProjet">
      <input type="hidden" name="id_projet" value="${projet ? projet.id_projet : ''}">
      
      <div class="form-group">
        <label for="titre">Titre du projet</label>
        <input type="text" name="titre" id="titre" value="${projet ? projet.titre : ''}" required>
      </div>
      
      <div class="form-group">
        <label for="description">Description</label>
        <textarea name="description" id="description">${projet ? projet.description : ''}</textarea>
      </div>
      
      <div class="form-group">
        <label for="date_echeance">Date d'échéance</label>
        <input type="date" name="date_echeance" id="date_echeance" value="${projet ? projet.date_echeance : ''}">
      </div>

      <div class="form-group">
        <label for="id_utilisateur">Utilisateur assigné</label>
        <select name="id_utilisateur" id="id_utilisateur">
          ${allUsers.map(user => `<option value="${user.id_utilisateur}" ${projet && projet.id_utilisateur === user.id_utilisateur ? 'selected' : ''}>${user.nom}</option>`).join('')}
        </select>
      </div>
      
      <div class="form-actions">
        <button type="submit" class="btn-principal">${projet ? 'Enregistrer' : 'Créer'}</button>
      </div>
    </form>
  `;

  showModal(modalTitle, modalContent);

  document.getElementById('formProjet').addEventListener('submit', handleProjectFormSubmit);
}

async function handleProjectFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const projetData = Object.fromEntries(formData.entries());
  const projetId = projetData.id_projet;

  try {
    if (projetId) {
      await api.updateProjet(projetId, projetData);
      showNotification('Projet mis à jour avec succès');
    } else {
      await api.createProjet(projetData);
      showNotification('Projet créé avec succès');
    }
    closeModal();
    loadProjects();
  } catch (error) {
    showNotification("Erreur lors de la sauvegarde du projet", "error");
  }
}

async function deleteProject(id) {
  if (confirm('Voulez-vous vraiment supprimer ce projet et toutes ses tâches associées ?')) {
    try {
      await api.deleteProjet(id);
      showNotification('Projet supprimé avec succès');
      loadProjects();
    } catch (error) {
      showNotification("Erreur lors de la suppression du projet", "error");
    }
  }
}
