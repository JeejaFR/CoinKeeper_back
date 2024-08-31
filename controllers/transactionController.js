const transactionModel = require("../models/transactionModel");
const notificationModel = require("../models/notificationModel");


const transactionController = {
  createTransaction: (req, res) => {
    const transaction = req.body;
    const userID = req.user.id;

    if (transaction.amount <= 0) {
      notificationModel.addNotification('Le montant doit être supérieur à 0', null, 1, userID, (err) => {
        if (err) {
          return res.status(500).json({ error: "Erreur lors de l'ajout de la notification" });
        }
      });
      return res.status(401).send("Le montant doit être supérieur à 0");
    }
    transactionModel.addTransaction(transaction, userID, (err, newTransaction) => {
      if (err) {
        notificationModel.addNotification('Erreur lors de la création de la transaction',null,2,userID, (err) => {
          if (err) {
            return res.status(500).json({ error: "Erreur lors de l'ajout de la notification" });
          }
        });
        return res.status(500).json({ error: err.message });
      }
      notificationModel.addNotification('Erreur lors de la création de la transaction',null,2,userID, (err) => {
        if (err) {
          return res.status(500).json({ error: "Erreur lors de l'ajout de la notification" });
        }
      });
      res.status(201).json(newTransaction);
    });
  },
  getAllTransactions: (req, res) => {
    const userID = req.user.id;
    transactionModel.getAllTransactions(userID, (err, transaction) => {
      if (err) {
        notificationModel.addNotification('Erreur lors de la récupération des transactions', null , 0, userID, (err) => {
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
      case '0': // Cette semaine
        startDate = new Date();
        startDate.setDate(endDate.getDate() - endDate.getDay());
        break;
      case '1': // 2 dernières semaines
        startDate = new Date();
        startDate.setDate(endDate.getDate() - (endDate.getDay() + 7));
        break;
      case '2': // Ce mois-ci
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        break;
      case '3': // 6 derniers mois
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 5, 1);
        break;
      case '4': // Cette année
        startDate = new Date(endDate.getFullYear(), 0, 1);
        break;
      case '5':
        transactionModel.getAllTransactions(userID, (err, transactions) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          return res.status(200).json(transactions);
        });
        return;
      default:
        notificationModel.addNotification('Période invalide', null , 0, userID, (err) => {
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
      notificationModel.addNotification('Le montant doit être supérieur à 0', null , 0, userID, (err) => {
        if (err) {
          return res.status(500).json({ error: "Erreur lors de l'ajout de la notification" });
        }
      });
      return res.status(401).send("Le montant doit être supérieur à 0");
    }

    transactionModel.editTransactionByID(id, transaction, (err, id) => {
      if (err) {
        notificationModel.addNotification('Erreur lors de l\'édition de la transaction', null , 0, userID, (err) => {
          if (err) {
            return res.status(500).json({ error: "Erreur lors de l'ajout de la notification" });
          }
        });
        return res.status(500).json({ error: err.message });
      }
      notificationModel.addNotification('Transaction modifiée!', null , 0, userID, (err) => {
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
        notificationModel.addNotification('Erreur lors de la suppresion de la transaction',null , 0, userID, (err) => {
          if (err) {
            return res.status(500).json({ error: "Erreur lors de l'ajout de la notification" });
          }
        });
        return res.status(500).json({ error: err.message });
      }
      notificationModel.addNotification('Transaction supprimée!',null , 0, userID, (err) => {
        if (err) {
          return res.status(500).json({ error: "Erreur lors de l'ajout de la notification" });
        }
      });
      res.status(201).json({ id });
    });
  },
};

module.exports = transactionController;
