const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Crée une instance de la base de données SQLite
const db = new sqlite3.Database(path.resolve(__dirname, './database.db'));

// Lire et exécuter le script SQL pour créer les tables
fs.readFile(path.join(__dirname, 'schema.sql'), 'utf8', (err, sql) => {
  if (err) {
    console.error('Erreur lors de la lecture du fichier schema.sql:', err.message);
    return;
  }

  db.exec(sql, (err) => {
    if (err) {
      console.error('Erreur lors de l\'exécution du script SQL:', err.message);
    } else {
      console.log('Tables créées ou déjà existantes.');
    }
  });
});

module.exports = db;
