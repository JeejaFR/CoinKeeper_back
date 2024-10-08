const transactionModel = require("../models/transactionModel");
const notificationModel = require("../models/notificationModel");
const categorieController = require("../controllers/categorieController");

const transactionController = {
  createTransaction: (req, res) => {
    const transaction = req.body;
    const userID = req.user.id;

    if (transaction.amount <= 0) {
      notificationModel.addNotification("Montant négatif", null, 1, userID, (err) => {
        if (err) {
          return res.status(500).json({ error: "Erreur lors de l'ajout de la notification" });
        }
      });
      return res.status(401).send("Le montant doit être supérieur à 0");
    }

    transactionModel.addTransaction(transaction, userID, (err, newTransaction) => {
      if (err) {
        notificationModel.addNotification("Echec de la création", null, 2, userID, (err) => {
          if (err) {
            return res.status(500).json({ error: "Erreur lors de l'ajout de la notification" });
          }
        });
        return res.status(500).json({ error: err.message });
      }

      notificationModel.addNotification("Transaction créée!", null, 0, userID, (err) => {
        if (err) {
          return res.status(500).json({ error: "Erreur lors de l'ajout de la notification" });
        }
      });
      categorieController.checkCategoryLimit(userID, transaction.category);
      res.status(201).json(newTransaction);
    });
  },
  getAllTransactions: (req, res) => {
    const userID = req.user.id;
    transactionModel.getAllTransactions(userID, (err, transaction) => {
      if (err) {
        notificationModel.addNotification("Echec récupération transaction", null, 2, userID, (err) => {
          if (err) {
            return res.status(500).json({ error: "Erreur lors de l'ajout de la notification" });
          }
        });
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(transaction);
    });
  },
  getTransactionByID: async (id, callback) => {
    try {
      transactionModel.getTransactionByID(id, (err, transaction) => {
        if (err) {
          callback(err, null);
        }
        callback(null, transaction);
      });
    } catch (error) {
      callback(error, null);
    }
  },
  getTransaction: (req, res) => {
    const id = req.params.id;
    transactionModel.getTransactionByID(id, (err, transaction) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(transaction);
    });
  },
  getTransactionByPeriode: (req, res) => {
    const userID = req.user.id;
    const periode = req.params.periode;
    let startDate;
    let endDate = new Date();

    switch (periode) {
      case "0": // Cette semaine (lundi au dimanche)
        startDate = new Date();
        const dayOfWeek = startDate.getDay();
        const difference = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startDate.setDate(startDate.getDate() - difference);
        endDate.setDate(startDate.getDate() + 6);
        break;
      case "1": // 2 dernières semaines
        startDate = new Date();
        startDate.setDate(endDate.getDate() - (endDate.getDay() + 7));
        break;
      case "2": // Ce mois-ci
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0); // Dernier jour du mois actuel
        break;
      case "3": // 6 derniers mois
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 5, 1);
        break;
      case "4": // Cette année
        startDate = new Date(endDate.getFullYear(), 0, 1);
        endDate.setMonth(11, 31); // 31 décembre
        break;
      case "5": // Tout
        transactionModel.getAllTransactions(userID, (err, transactions) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          return res.status(200).json(transactions);
        });
        return;
      // Périodes décalées dans le passé
      case "6": // Semaine dernière (lundi au dimanche)
        startDate = new Date();
        const dayOfWeekLast = startDate.getDay();
        const differenceLast = dayOfWeekLast === 0 ? 6 : dayOfWeekLast - 1;
        startDate.setDate(startDate.getDate() - differenceLast - 7);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        break;
      case "7": // 2 semaines avant les 2 dernières semaines
        startDate = new Date();
        startDate.setDate(startDate.getDate() - (startDate.getDay() + 21)); // Reculer de 3 semaines au total
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 13); // 2 semaines de plus
        break;
      case "8": // Mois dernier
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1);
        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 0); // Dernier jour du mois dernier
        break;
      case "9": // 6 mois avant les 6 derniers mois
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 11, 1);
        endDate = new Date(endDate.getFullYear(), endDate.getMonth() - 6, 0); // Fin du mois avant 6 mois
        break;
      case "10": // Année dernière
        startDate = new Date(endDate.getFullYear() - 1, 0, 1);
        endDate = new Date(endDate.getFullYear() - 1, 11, 31); // 31 décembre de l'année dernière
        break;
      case "11": // Année avant l'année dernière
        startDate = new Date(endDate.getFullYear() - 2, 0, 1);
        endDate = new Date(endDate.getFullYear() - 2, 11, 31); // 31 décembre de l'année avant l'année dernière
        break;
      default:
        notificationModel.addNotification("Période invalide", null, 0, userID, (err) => {
          if (err) {
            return res.status(500).json({ error: "Erreur lors de l'ajout de la notification" });
          }
        });
        return res.status(400).json({ error: "Période invalide" });
    }

    transactionModel.getTransactionByPeriode(userID, startDate, endDate, (err, transactions) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(transactions);
    });
  },
  updateTransactionByID: (req, res) => {
    const id = req.params.id;
    const userID = req.user.id;
    const transaction = req.body;

    if (transaction.amount <= 0) {
      notificationModel.addNotification("Le montant doit être supérieur à 0", null, 1, userID, (err) => {
        if (err) {
          return res.status(500).json({ error: "Erreur lors de l'ajout de la notification" });
        }
      });
      return res.status(401).send("Le montant doit être supérieur à 0");
    }

    transactionModel.editTransactionByID(id, transaction, (err, id) => {
      if (err) {
        notificationModel.addNotification("Erreur lors de l'édition de la transaction", null, 2, userID, (err) => {
          if (err) {
            return res.status(500).json({ error: "Erreur lors de l'ajout de la notification" });
          }
        });
        return res.status(500).json({ error: err.message });
      }
      notificationModel.addNotification("Transaction modifiée!", null, 0, userID, (err) => {
        if (err) {
          return res.status(500).json({ error: "Erreur lors de l'ajout de la notification" });
        }
      });
      res.status(201).json({ id });
    });
  },
  deleteTransactionByID: (req, res) => {
    const id = req.params.id;
    const userID = req.user.id;

    transactionModel.deleteTransactionByID(id, (err, id) => {
      if (err) {
        notificationModel.addNotification("Erreur lors de la suppresion de la transaction", null, 2, userID, (err) => {
          if (err) {
            return res.status(500).json({ error: "Erreur lors de l'ajout de la notification" });
          }
        });
        return res.status(500).json({ error: err.message });
      }
      notificationModel.addNotification("Transaction supprimée!", null, 0, userID, (err) => {
        if (err) {
          return res.status(500).json({ error: "Erreur lors de l'ajout de la notification" });
        }
      });
      res.status(201).json({ id });
    });
  },
};

module.exports = transactionController;
