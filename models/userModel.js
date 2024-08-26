const db = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Nombre de rounds pour le hashage

const userModel = {
  addUser: (user, callback) => {
    const { password, email } = user;

    const lowercasedEmail = email.toLowerCase();
    // Hashage du mot de passe
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) return callback(err);
  
      const query = `
        INSERT INTO users (password, email)
        VALUES (?, ?)
      `;
      db.run(query, [hashedPassword, lowercasedEmail], function(err) {
        callback(err, this.lastID);
      });
    });
  },
  getUserByEmail: (email, callback) => {
    const lowercasedEmail = email.toLowerCase();
    const query = 'SELECT * FROM users WHERE email = ?';
    db.get(query, [lowercasedEmail], (err, row) => {
      callback(err, row);
    });
  }
}


module.exports = userModel;
