// =====================
//  Page d'accueil - Chargement des données
// =====================

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Charger les données en parallèle
    const [taches, projets] = await Promise.all([
      api.getTaches(),
      api.getProjets()
    ]);

    // Mettre à jour les statistiques
    updateStats(taches);
    
    // Afficher les tâches récentes
    displayRecentTasks(taches);
    
    // Afficher les tâches à venir
    displayUpcomingTasks(taches);
    
    // Afficher les projets
    displayProjects(projets, taches);

  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    showNotification('Erreur lors du chargement des données', 'error');
  }
});

// =====================
//  Mise à jour des statistiques
// =====================
function updateStats(taches) {
  const stats = {
    todo: taches.filter(t => t.statut === 'À faire').length,
    progress: taches.filter(t => t.statut === 'En cours').length,
    done: taches.filter(t => t.statut === 'Terminée').length
  };

  document.getElementById('count-todo').textContent = `${stats.todo} tâches`;
  document.getElementById('count-progress').textContent = `${stats.progress} tâches`;
  document.getElementById('count-done').textContent = `${stats.done} tâches`;
}

// =====================
//  Affichage des tâches récentes
// =====================
function displayRecentTasks(taches) {
  const recentTasksList = document.getElementById('recent-tasks');
  
  // Trier par date de création (les plus récentes en premier)
  const recentTasks = taches
    .sort((a, b) => new Date(b.date_creation) - new Date(a.date_creation))
    .slice(0, 3);

  if (recentTasks.length === 0) {
    recentTasksList.innerHTML = '<li>Aucune tâche récente</li>';
    return;
  }

  recentTasksList.innerHTML = recentTasks.map(task => {
    const statusClass = getStatusClass(task.statut);
    return `
      <li>
        <strong>${task.titre}</strong> — 
        <span class="${statusClass}">${task.statut}</span>
      </li>
    `;
  }).join('');
}

// =====================
//  Affichage des tâches à venir
// =====================
function displayUpcomingTasks(taches) {
  const upcomingTasksList = document.getElementById('upcoming-tasks');
  
  // Filtrer les tâches avec échéance et non terminées
  const upcomingTasks = taches
    .filter(task => task.date_echeance && task.statut !== 'Terminée')
    .sort((a, b) => new Date(a.date_echeance) - new Date(b.date_echeance))
    .slice(0, 3);

  if (upcomingTasks.length === 0) {
    upcomingTasksList.innerHTML = '<li>Aucune tâche à venir</li>';
    return;
  }

  upcomingTasksList.innerHTML = upcomingTasks.map(task => {
    const dueDate = formatDate(task.date_echeance);
    return `<li>${task.titre} — ${dueDate}</li>`;
  }).join('');
}

// =====================
//  Affichage des projets
// =====================
function displayProjects(projets, taches) {
  const projectGrid = document.getElementById('project-grid');
  
  // Garder le bouton "Créer un projet"
  const createButton = projectGrid.querySelector('.project.create');
  
  // Vider la grille et remettre le bouton
  projectGrid.innerHTML = '';
  projectGrid.appendChild(createButton);

  if (projets.length === 0) {
    const noProjects = document.createElement('div');
    noProjects.className = 'project';
    noProjects.innerHTML = '<p>Aucun projet créé</p>';
    projectGrid.insertBefore(noProjects, createButton);
    return;
  }

  // Afficher les projets (maximum 3 sur la page d'accueil)
  projets.slice(0, 3).forEach(projet => {
    const projectTaches = taches.filter(t => t.id_projet === projet.id_projet);
    const progress = calculateProgress(projectTaches);
    const progressClass = getProgressClass(progress);

    const projectElement = document.createElement('div');
    projectElement.className = 'project';
    projectElement.innerHTML = `
      <h3>${projet.titre}</h3>
      <div class="progress">
        <div style="width: ${progress}%"></div>
      </div>
      <span>${progress}% terminé</span>
    `;

    // Ajouter un clic pour aller vers la page des projets
    projectElement.addEventListener('click', () => {
      window.location.href = 'projets.html';
    });

    projectGrid.insertBefore(projectElement, createButton);
  });
}

// =====================
//  Utilitaires
// =====================
function getStatusClass(statut) {
  const statusMap = {
    'À faire': 'status-todo',
    'En cours': 'status-progress',
    'Terminée': 'status-done'
  };
  return statusMap[statut] || '';
}

function getProgressClass(progress) {
  if (progress >= 80) return 'green';
  if (progress >= 50) return 'yellow';
  return 'red';
}
