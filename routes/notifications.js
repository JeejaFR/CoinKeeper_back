var express = require('express');
var router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');


// Route pour récupérer toutes les notifications de l'utilisateurs
router.get('/', authMiddleware.isAuthenticated, notificationController.getNotifications);

// Route pour supprimer une notification par id
router.delete('/:id', authMiddleware.isAuthenticated, authMiddleware.isAuthorizedToAccessNotification, notificationController.deleteNotificationByID);

module.exports = router;
