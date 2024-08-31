const userModel = require('../models/userModel');
const notificationModel = require('../models/notificationModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;

const userController = {
  register: (req, res) => {
    const user = req.body;
    userModel.addUser(user, (err, id) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const token = jwt.sign({ id: id, email: user.email }, secretKey, { expiresIn: '1h' });
  
      notificationModel.addNotification('Bienvenue sur CoinKeeper!', null, 1, id, (err) => {
        if (err) {
          return res.status(500).json({ error: "Erreur lors de l'ajout de la notification" });
        }
        res.status(201).json({ token });
      });
    });
  },
  login: (req, res) => {
    const { email, password } = req.body;
    userModel.getUserByEmail(email, (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur introuvable' });
      }
  
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (!result) {
          return res.status(401).json({ message: 'Echec de l\'authentification' });
        }
  
        // Générer un JWT
        const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ token });
      });
    });
  }
}

module.exports = userController;