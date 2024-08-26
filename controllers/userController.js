const userModel = require('../models/userModel');
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
      res.status(201).json({ token });
    });
  },
  login: (req, res) => {
    const { email, password } = req.body;
    userModel.getUserByEmail(email, (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (!result) {
          return res.status(401).json({ message: 'Authentication failed' });
        }
  
        // Générer un JWT
        const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ token });
      });
    });
  }
}

module.exports = userController;