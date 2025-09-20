CREATE DATABASE IF NOT EXISTS gestion_projets;

USE gestion_projets;

CREATE TABLE IF NOT EXISTS utilisateurs (
    id_utilisateur INTEGER PRIMARY KEY AUTOINCREMENT,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS projets (
    id_projet INTEGER PRIMARY KEY AUTOINCREMENT,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    date_creation DATE,
    date_echeance DATE,
    id_utilisateur INT,
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id_utilisateur)
);

CREATE TABLE IF NOT EXISTS taches (
    id_tache INTEGER PRIMARY KEY AUTOINCREMENT,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    statut VARCHAR(50),
    priorite VARCHAR(50),
    date_creation DATE,
    date_echeance DATE,
    id_projet INT,
    id_utilisateur INT,
    FOREIGN KEY (id_projet) REFERENCES projets(id_projet),
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id_utilisateur)
);

-- Insertion de données initiales
INSERT INTO utilisateurs (nom, email, role) VALUES
('Admin', 'admin@test.com', 'admin'),
('Amine', 'amine@test.com', 'user'),
('Sarah', 'sarah@test.com', 'user'),
('Yacine', 'yacine@test.com', 'user');

INSERT INTO projets (titre, description, date_creation, date_echeance, id_utilisateur) VALUES
('Projet Alpha', 'Application web de gestion de clients', '2024-09-01', '2024-12-31', 1),
('Projet Beta', 'Migration du système de facturation', '2024-09-01', '2024-11-15', 1),
('Projet Gamma', 'Nouvelle interface de tableau de bord', '2024-09-01', '2024-10-30', 1);

INSERT INTO taches (titre, description, statut, priorite, date_creation, date_echeance, id_projet, id_utilisateur) VALUES
('Corriger bug #23', 'Résoudre le problème d''affichage sur mobile', 'En cours', 'Haute', '2024-09-01', '2024-09-15', 1, 2),
('Réunion design', 'Présenter les maquettes au client', 'À faire', 'Moyenne', '2024-09-01', '2024-09-20', 1, 3),
('Relecture du rapport', 'Vérifier la documentation technique', 'Terminée', 'Basse', '2024-09-01', '2024-09-10', 1, 4),
('Refonte du design', 'Mettre à jour l''interface utilisateur', 'En cours', 'Moyenne', '2024-09-01', '2024-09-25', 2, 3),
('Rédiger le rapport', 'Documenter les changements apportés', 'Terminée', 'Basse', '2024-09-01', '2024-09-12', 2, 4),
('Tests d''intégration', 'Vérifier le bon fonctionnement des modules', 'À faire', 'Haute', '2024-09-01', '2024-09-18', 3, 2);
