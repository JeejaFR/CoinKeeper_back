var express = require('express');
var router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');


// Route pour récupérer toutes les transactions de l'utilisateurs
router.get('/', authMiddleware.isAuthenticated, transactionController.getAllTransactions);

// Route pour récupérer une transaction par id
router.get('/:id', authMiddleware.isAuthenticated, authMiddleware.isAuthorizedToAccessTransaction, transactionController.getTransaction);

// route pour récupérer toutes les transactions de l'utilisateur pendant une période donnée.
router.get('/periode/:periode', authMiddleware.isAuthenticated, transactionController.getTransactionByPeriode);

// Route pour modifier une transaction par id
router.put('/:id', authMiddleware.isAuthenticated, authMiddleware.isAuthorizedToAccessTransaction, transactionController.updateTransactionByID);

// Route pour supprimer une transaction par id
router.delete('/:id', authMiddleware.isAuthenticated, authMiddleware.isAuthorizedToAccessTransaction, transactionController.deleteTransactionByID);

// Route pour créer une nouvelle transaction
router.post('/', authMiddleware.isAuthenticated, transactionController.createTransaction);

module.exports = router;
