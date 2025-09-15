// =====================
//  Serveur Node.js + Express
// =====================
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Servir les fichiers statiques

// =====================
//  Données en mémoire (simulation de base de données)
// =====================
let nextId = 1;

const utilisateurs = [
  { id_utilisateur: 1, nom: "Admin", email: "admin@test.com", role: "admin" },
  { id_utilisateur: 2, nom: "Amine", email: "amine@test.com", role: "user" },
  { id_utilisateur: 3, nom: "Sarah", email: "sarah@test.com", role: "user" },
  { id_utilisateur: 4, nom: "Yacine", email: "yacine@test.com", role: "user" }
];

const projets = [
  { 
    id_projet: 1, 
    titre: "Projet Alpha", 
    description: "Application web de gestion de clients", 
    date_creation: "2024-09-01", 
    date_echeance: "2024-12-31", 
    id_utilisateur: 1 
  },
  { 
    id_projet: 2, 
    titre: "Projet Beta", 
    description: "Migration du système de facturation", 
    date_creation: "2024-09-01", 
    date_echeance: "2024-11-15", 
    id_utilisateur: 1 
  },
  { 
    id_projet: 3, 
    titre: "Projet Gamma", 
    description: "Nouvelle interface de tableau de bord", 
    date_creation: "2024-09-01", 
    date_echeance: "2024-10-30", 
    id_utilisateur: 1 
  }
];

const taches = [
  { 
    id_tache: 1, 
    titre: "Corriger bug #23", 
    description: "Résoudre le problème d'affichage sur mobile", 
    statut: "En cours", 
    priorite: "Haute", 
    date_creation: "2024-09-01", 
    date_echeance: "2024-09-15", 
    id_projet: 1, 
    id_utilisateur: 2 
  },
  { 
    id_tache: 2, 
    titre: "Réunion design", 
    description: "Présenter les maquettes au client", 
    statut: "À faire", 
    priorite: "Moyenne", 
    date_creation: "2024-09-01", 
    date_echeance: "2024-09-20", 
    id_projet: 1, 
    id_utilisateur: 3 
  },
  { 
    id_tache: 3, 
    titre: "Relecture du rapport", 
    description: "Vérifier la documentation technique", 
    statut: "Terminée", 
    priorite: "Basse", 
    date_creation: "2024-09-01", 
    date_echeance: "2024-09-10", 
    id_projet: 1, 
    id_utilisateur: 4 
  },
  { 
    id_tache: 4, 
    titre: "Refonte du design", 
    description: "Mettre à jour l'interface utilisateur", 
    statut: "En cours", 
    priorite: "Moyenne", 
    date_creation: "2024-09-01", 
    date_echeance: "2024-09-25", 
    id_projet: 2, 
    id_utilisateur: 3 
  },
  { 
    id_tache: 5, 
    titre: "Rédiger le rapport", 
    description: "Documenter les changements apportés", 
    statut: "Terminée", 
    priorite: "Basse", 
    date_creation: "2024-09-01", 
    date_echeance: "2024-09-12", 
    id_projet: 2, 
    id_utilisateur: 4 
  },
  { 
    id_tache: 6, 
    titre: "Tests d'intégration", 
    description: "Vérifier le bon fonctionnement des modules", 
    statut: "À faire", 
    priorite: "Haute", 
    date_creation: "2024-09-01", 
    date_echeance: "2024-09-18", 
    id_projet: 3, 
    id_utilisateur: 2 
  }
];

console.log("✅ Données en mémoire initialisées");

// =====================
//  Routes API
// =====================

// -- Utilisateurs --
app.get("/api/utilisateurs", (req, res) => {
  res.json(utilisateurs);
});

app.post("/api/utilisateurs", (req, res) => {
  const { nom, email, mot_de_passe, role } = req.body;
  
  // Vérifier si l'email existe déjà
  const existingUser = utilisateurs.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: "Un utilisateur avec cet email existe déjà" });
  }
  
  const newUser = {
    id_utilisateur: ++nextId,
    nom,
    email,
    role: role || "user"
  };
  utilisateurs.push(newUser);
  res.json(newUser);
});

app.put("/api/utilisateurs/:id", (req, res) => {
  const { id } = req.params;
  const { nom, email, role } = req.body;
  const userIndex = utilisateurs.findIndex(u => u.id_utilisateur == id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: "Utilisateur non trouvé" });
  }
  
  // Vérifier si l'email existe déjà (sauf pour l'utilisateur actuel)
  const existingUser = utilisateurs.find(u => u.email === email && u.id_utilisateur != id);
  if (existingUser) {
    return res.status(400).json({ error: "Un utilisateur avec cet email existe déjà" });
  }
  
  utilisateurs[userIndex] = { ...utilisateurs[userIndex], nom, email, role };
  res.json(utilisateurs[userIndex]);
});

app.delete("/api/utilisateurs/:id", (req, res) => {
  const { id } = req.params;
  const userIndex = utilisateurs.findIndex(u => u.id_utilisateur == id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: "Utilisateur non trouvé" });
  }
  
  // Ne pas permettre la suppression du dernier admin
  const user = utilisateurs[userIndex];
  if (user.role === 'admin') {
    const adminCount = utilisateurs.filter(u => u.role === 'admin').length;
    if (adminCount <= 1) {
      return res.status(400).json({ error: "Impossible de supprimer le dernier administrateur" });
    }
  }
  
  // Réassigner les tâches et projets à l'utilisateur admin (ID 1)
  taches.forEach(tache => {
    if (tache.id_utilisateur == id) {
      tache.id_utilisateur = 1;
    }
  });
  
  projets.forEach(projet => {
    if (projet.id_utilisateur == id) {
      projet.id_utilisateur = 1;
    }
  });
  
  utilisateurs.splice(userIndex, 1);
  res.json({ message: "Utilisateur supprimé", id });
});

// -- Projets --
app.get("/api/projets", (req, res) => {
  res.json(projets);
});

app.post("/api/projets", (req, res) => {
  const { titre, description, date_echeance, id_utilisateur } = req.body;
  const newProject = {
    id_projet: ++nextId,
    titre,
    description,
    date_creation: new Date().toISOString().split('T')[0],
    date_echeance,
    id_utilisateur: id_utilisateur || 1
  };
  projets.push(newProject);
  res.json(newProject);
});

app.put("/api/projets/:id", (req, res) => {
  const { id } = req.params;
  const { titre, description, date_echeance } = req.body;
  const projectIndex = projets.findIndex(p => p.id_projet == id);
  
  if (projectIndex === -1) {
    return res.status(404).json({ error: "Projet non trouvé" });
  }
  
  projets[projectIndex] = { ...projets[projectIndex], titre, description, date_echeance };
  res.json(projets[projectIndex]);
});

app.delete("/api/projets/:id", (req, res) => {
  const { id } = req.params;
  const projectIndex = projets.findIndex(p => p.id_projet == id);
  
  if (projectIndex === -1) {
    return res.status(404).json({ error: "Projet non trouvé" });
  }
  
  // Supprimer aussi les tâches associées
  const taskIndices = taches.map((t, i) => t.id_projet == id ? i : -1).filter(i => i !== -1);
  taskIndices.reverse().forEach(i => taches.splice(i, 1));
  
  projets.splice(projectIndex, 1);
  res.json({ message: "Projet supprimé", id });
});

// -- Tâches --
app.get("/api/taches", (req, res) => {
  res.json(taches);
});

app.post("/api/taches", (req, res) => {
  const { titre, description, statut, priorite, date_echeance, id_projet, id_utilisateur } = req.body;
  const newTask = {
    id_tache: ++nextId,
    titre,
    description,
    statut: statut || "À faire",
    priorite: priorite || "Moyenne",
    date_creation: new Date().toISOString().split('T')[0],
    date_echeance,
    id_projet: id_projet || null,
    id_utilisateur: id_utilisateur || null
  };
  taches.push(newTask);
  res.json(newTask);
});

app.put("/api/taches/:id", (req, res) => {
  const { id } = req.params;
  const { titre, description, statut, priorite, date_echeance, id_projet, id_utilisateur } = req.body;
  const taskIndex = taches.findIndex(t => t.id_tache == id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Tâche non trouvée" });
  }
  
  taches[taskIndex] = { 
    ...taches[taskIndex], 
    titre, 
    description, 
    statut, 
    priorite, 
    date_echeance, 
    id_projet, 
    id_utilisateur 
  };
  res.json(taches[taskIndex]);
});

app.delete("/api/taches/:id", (req, res) => {
  const { id } = req.params;
  const taskIndex = taches.findIndex(t => t.id_tache == id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Tâche non trouvée" });
  }
  
  taches.splice(taskIndex, 1);
  res.json({ message: "Tâche supprimée", id });
});

// Route pour obtenir les tâches d'un projet
app.get("/api/projets/:id/taches", (req, res) => {
  const { id } = req.params;
  const projectTasks = taches.filter(t => t.id_projet == id);
  res.json(projectTasks);
});

// Route par défaut pour servir index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// =====================
//  Lancement du serveur
// =====================
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});