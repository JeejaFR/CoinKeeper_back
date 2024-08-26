var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

// Route pour créer un nouvel utilisateur
router.post('/register', userController.register);

// Route pour authentifier un utilisateur
router.post('/login', userController.login);

module.exports = router;
