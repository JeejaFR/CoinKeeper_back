var express = require('express');
var router = express.Router();
const categorieController = require('../controllers/categorieController');
const authMiddleware = require('../middleware/authMiddleware');


// Route pour récupérer toutes les categories de l'utilisateurs
router.get('/', authMiddleware.isAuthenticated, categorieController.getCategories);

// Route pour modifier une categorie par id
router.put('/:id', authMiddleware.isAuthenticated, categorieController.updateCategorieByID);

// Route pour supprimer une categorie par id
router.delete('/:id', authMiddleware.isAuthenticated, categorieController.deleteCategorieByID);

// Route pour créer une nouvelle categorie
router.post('/', authMiddleware.isAuthenticated, categorieController.createCategorie);


module.exports = router;
