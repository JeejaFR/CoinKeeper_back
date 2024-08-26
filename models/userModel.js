const db = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Nombre de rounds pour le hashage

const userModel = {
  addUser: (user, callback) => {
    const { username, password, email } = user;
    // Hashage du mot de passe
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) return callback(err);
  
      const query = `
        INSERT INTO users (username, password, email)
        VALUES (?, ?, ?)
      `;
      db.run(query, [username, hashedPassword, email], function(err) {
        callback(err, this.lastID);
      });
    });
  },
  getUserByUsername: (username, callback) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    db.get(query, [username], (err, row) => {
      callback(err, row);
    });
  }
}


module.exports = userModel;
