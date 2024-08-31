var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');


// Route pour créer un nouvel utilisateur
router.post('/register', userController.register);

// Route pour authentifier un utilisateur
router.post('/login', userController.login);

// Route pour verifier le token de l'utilisateur
router.get('/checkToken', authMiddleware.checkToken);

module.exports = router;
