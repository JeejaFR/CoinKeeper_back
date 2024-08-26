var express = require('express');
var router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');


// Route pour récupérer toutes les transactions de l'utilisateurs
router.get('/', authMiddleware.isAuthenticated, transactionController.getAllTransactions);

// Route pour récupérer une transaction par id TODO IS AUTHORIZED (savoir si c'est la sienne);
router.get('/:id', authMiddleware.isAuthenticated, transactionController.getTransactionByID);

// Route pour modifier une transaction par id TODO IS AUTHORIZED (savoir si c'est la sienne);
router.put('/:id', authMiddleware.isAuthenticated, transactionController.updateTransactionByID);

// Route pour supprimer une transaction par id TODO IS AUTHORIZED (savoir si c'est la sienne);
router.delete('/:id', authMiddleware.isAuthenticated, transactionController.deleteTransactionByID);

// Route pour créer une nouvelle transaction
router.post('/', authMiddleware.isAuthenticated, transactionController.createTransaction);


module.exports = router;
