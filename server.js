// =====================
//  Serveur Node.js + Express + SQLite
// =====================
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DB_FILE = "gestion_projets.db";

// =====================
//  Connexion et initialisation de la base de données
// =====================
const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error("❌ Erreur de connexion à SQLite:", err.message);
    process.exit(1);
  }
  console.log("✅ Connecté à la base de données SQLite.");
  initializeDatabase();
});

function initializeDatabase() {
  // Vérifier si la table des utilisateurs existe
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='utilisateurs'", (err, table) => {
    if (err) {
      console.error("Erreur lors de la vérification des tables:", err);
      return;
    }
    if (!table) {
      console.log("🟡 Les tables n'existent pas. Initialisation en cours...");
      // Lire et exécuter le script SQL d'initialisation
      const sqlScript = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
      // Adapter le script pour SQLite (supprimer les commandes spécifiques à MySQL)
      const sqliteScript = sqlScript
        .replace(/AUTO_INCREMENT/g, 'AUTOINCREMENT')
        .replace(/INT AUTOINCREMENT PRIMARY KEY/g, 'INTEGER PRIMARY KEY AUTOINCREMENT')
        .replace(/CREATE DATABASE IF NOT EXISTS gestion_projets;/g, '')
        .replace(/USE gestion_projets;/g, '');

      db.exec(sqliteScript, (execErr) => {
        if (execErr) {
          console.error("❌ Erreur lors de l'initialisation de la base de données:", execErr);
        } else {
          console.log("✅ Base de données initialisée avec succès.");
        }
      });
    } else {
      console.log("👍 Les tables existent déjà.");
    }
  });
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// =====================
//  Wrapper pour les requêtes (similaire à mysql2/promise)
// =====================
const dbQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      // Pour INSERT, this.lastID est l'ID de la nouvelle ligne
      // Pour UPDATE/DELETE, this.changes est le nombre de lignes affectées
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};


// =====================
//  Routes API
// =====================

// -- Utilisateurs --
app.get("/api/utilisateurs", async (req, res) => {
  try {
    const rows = await dbQuery("SELECT * FROM utilisateurs");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/utilisateurs", async (req, res) => {
  const { nom, email, role } = req.body;
  try {
    const result = await dbRun(
      "INSERT INTO utilisateurs (nom, email, role) VALUES (?, ?, ?)",
      [nom, email, role || "user"]
    );
    res.json({ id_utilisateur: result.lastID, nom, email, role: role || "user" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/utilisateurs/:id", async (req, res) => {
    const { id } = req.params;
    const { nom, email, role } = req.body;
    try {
        await dbRun(
            "UPDATE utilisateurs SET nom = ?, email = ?, role = ? WHERE id_utilisateur = ?",
            [nom, email, role, id]
        );
        res.json({ message: "Utilisateur mis à jour" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/utilisateurs/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await dbRun("UPDATE taches SET id_utilisateur = 1 WHERE id_utilisateur = ?", [id]);
        await dbRun("UPDATE projets SET id_utilisateur = 1 WHERE id_utilisateur = ?", [id]);
        await dbRun("DELETE FROM utilisateurs WHERE id_utilisateur = ?", [id]);
        res.json({ message: "Utilisateur supprimé", id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -- Projets --
app.get("/api/projets", async (req, res) => {
  try {
    const rows = await dbQuery("SELECT * FROM projets");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/projets", async (req, res) => {
  const { titre, description, date_echeance, id_utilisateur } = req.body;
  try {
    const result = await dbRun(
      "INSERT INTO projets (titre, description, date_echeance, id_utilisateur, date_creation) VALUES (?, ?, ?, ?, ?)",
      [titre, description, date_echeance, id_utilisateur || 1, new Date().toISOString().split('T')[0]]
    );
    res.json({ id_projet: result.lastID, titre, description, date_echeance, id_utilisateur });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/projets/:id", async (req, res) => {
    const { id } = req.params;
    const { titre, description, date_echeance } = req.body;
    try {
        await dbRun(
            "UPDATE projets SET titre = ?, description = ?, date_echeance = ? WHERE id_projet = ?",
            [titre, description, date_echeance, id]
        );
        res.json({ message: "Projet mis à jour" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/projets/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await dbRun("DELETE FROM taches WHERE id_projet = ?", [id]);
        await dbRun("DELETE FROM projets WHERE id_projet = ?", [id]);
        res.json({ message: "Projet et tâches associées supprimés", id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -- Tâches --
app.get("/api/taches", async (req, res) => {
  try {
    const rows = await dbQuery("SELECT * FROM taches");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/taches", async (req, res) => {
  const { titre, description, statut, priorite, date_echeance, id_projet, id_utilisateur } = req.body;
  try {
    const result = await dbRun(
      "INSERT INTO taches (titre, description, statut, priorite, date_echeance, id_projet, id_utilisateur, date_creation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [titre, description, statut || 'À faire', priorite || 'Moyenne', date_echeance, id_projet, id_utilisateur, new Date().toISOString().split('T')[0]]
    );
    res.json({ id_tache: result.lastID, titre, description, statut, priorite, date_echeance, id_projet, id_utilisateur });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/taches/:id", async (req, res) => {
    const { id } = req.params;
    const { titre, description, statut, priorite, date_echeance, id_projet, id_utilisateur } = req.body;
    try {
        await dbRun(
            "UPDATE taches SET titre = ?, description = ?, statut = ?, priorite = ?, date_echeance = ?, id_projet = ?, id_utilisateur = ? WHERE id_tache = ?",
            [titre, description, statut, priorite, date_echeance, id_projet, id_utilisateur, id]
        );
        res.json({ message: "Tâche mise à jour" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/taches/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await dbRun("DELETE FROM taches WHERE id_tache = ?", [id]);
        res.json({ message: "Tâche supprimée", id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route pour obtenir les tâches d'un projet
app.get("/api/projets/:id/taches", async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await dbQuery("SELECT * FROM taches WHERE id_projet = ?", [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route par défaut pour servir index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// =====================
//  Lancement du serveur
// =====================
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
