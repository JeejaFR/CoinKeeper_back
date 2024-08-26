var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

// Route pour créer un nouvel utilisateur
router.post('/', userController.createUser);

// Route pour authentifier un utilisateur
router.post('/login', userController.authenticateUser);

module.exports = router;
