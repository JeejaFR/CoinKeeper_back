const jwt = require("jsonwebtoken");

// Clé secrète pour JWT stockée dans le fichier .env
const secretKey = process.env.SECRET_KEY;
const transactionController = require("../controllers/transactionController");
const notificationController = require("../controllers/notificationController");


const authMiddleware = {
  isAuthenticated: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.status(401).json({ error: "Aucun token fourni" });

    jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.status(403).json({ error: "Token invalide" });
      req.user = user;
      next();
    });
  },
  isAuthorizedToAccessTransaction: (req, res, next) => {
    try {
      const transactionId = req.params.id;
      const userID = req.user.id;

      transactionController.getTransactionByID(transactionId, (err, transaction) => {
        if (err || !transaction) return res.status(404).json({ error: "Transaction introuvable" });

        if (transaction[0].userID !== userID) {
          return res.status(403).json({ error: "Interdit: Vous n'avez pas l'autorisation d'accéder à cette transaction" });
        }
        next();
      });
    } catch (error) {
      return res.status(500).send("Erreur lors de la vérification de l'autorisation de l'utilisateur");
    }
  },
  isAuthorizedToAccessNotification: (req, res, next) => {
    try {
      const notificationID = req.params.id;
      const userID = req.user.id;

      notificationController.getNotificationByID(notificationID, (err, notification) => {
        if (err || !notification) return res.status(404).json({ error: "Notification introuvable" });

        if (notification[0].userID !== userID) {
          return res.status(403).json({ error: "Interdit: Vous n'avez pas l'autorisation d'accéder à cette notification" });
        }
        next();
      });
    } catch (error) {
      return res.status(500).send("Erreur lors de la vérification de l'autorisation de l'utilisateur");
    }
  },
  checkToken: (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.status(200).json({ valid: false });

    jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.status(200).json({ valid: false });
      res.status(200).json({ valid: true });
    });
  },
  
};

module.exports = authMiddleware;
