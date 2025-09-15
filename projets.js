// Bouton "Nouveau Projet"
document.getElementById('btnNouveauProjet').addEventListener('click', () => {
  alert('Fonctionnalité de création de projet à venir !');
});

// Boutons "Supprimer"
document.querySelectorAll('.supprimer').forEach(btn => {
  btn.addEventListener('click', () => {
    if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
      btn.closest('.carte-projet').remove();
    }
  });
});

// Boutons "Voir détails"
document.querySelectorAll('.voir').forEach(btn => {
  btn.addEventListener('click', () => {
    alert('Page détails du projet à venir...');
  });
});
