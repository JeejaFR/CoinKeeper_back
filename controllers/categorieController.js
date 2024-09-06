const notificationModel = require("../models/notificationModel");
const categorieModel = require("../models/categorieModel");
const transactionModel = require("../models/transactionModel");

const categorieController = {
  createCategorie: (req, res) => {
    var { name, month_limit } = req.body;
    const userID = req.user.id;

    categorieModel.addCategorie(name, month_limit, userID, (err, newCategorie) => {
      if (err) {
        notificationModel.addNotification("Echec de la création", null, 2, userID, (err) => {
          if (err) {
            return res.status(500).json({ error: "Erreur lors de l'ajout de la notification" });
          }
        });
        return res.status(500).json({ error: err.message });
      }

      notificationModel.addNotification("Categorie créée!", null, 0, userID, (err) => {
        if (err) {
          return res.status(500).json({ error: "Erreur lors de l'ajout de la notification" });
        }
      });
      res.status(201).json(newCategorie);
    });
  },
  getCategories: (req, res) => {
    const userID = req.user.id;
    categorieModel.getCategorieAllCategories(userID, (err, categories) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(categories);
    });
  },
  updateCategorieByID: (req, res) => {
    const id = req.params.id;
    const userID = req.user.id;
    const categorie = req.body;

    categorieModel.editCategorieByID(id, categorie, userID, (err, id) => {
      if (err) {
        notificationModel.addNotification("Erreur lors de l'édition de la categorie", null, 2, userID, (err) => {});
        return res.status(500).json({ error: err.message });
      }
      notificationModel.addNotification("Catégorie modifiée!", null, 0, userID, (err) => {});
      res.status(201).json({ id });
    });
  },
  deleteCategorieByID: (req, res) => {
    const id = req.params.id;
    const userID = req.user.id;

    categorieModel.deleteCategorieByID(id, userID, async (err) => {
      if (err) {
        notificationModel.addNotification("Erreur lors de la suppression de la catégorie", null, 2, userID, (err) => {});
        return res.status(500).json({ error: err.message });
      }

      notificationModel.addNotification("Catégorie supprimée!", null, 0, userID, (err) => {});
      res.status(201).json({ id });
    });
  },
  checkCategoryLimit(userID, categoryName) {
    const endDate = new Date();
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1); // 1 MOIS

    categorieModel.getCategorieByName(categoryName, userID, (err, category) => {
      if (err) {
        console.log("erreur: " + err);
        return;
      }

      transactionModel.getTransactionByPeriode(userID, startDate, endDate, (err, transactions) => {
        const sumCategoryTransactions = transactions.filter((transaction) => transaction.category === category[0].name).reduce((sum, transaction) => sum + transaction.amount, 0);

        if (category[0].month_limit > 0 && sumCategoryTransactions > category[0].month_limit) {
          notificationModel.addNotification(`[${category[0].name}] limite mensuelle dépassée`, null, 1, userID, (err) => {});
        }
      });
    });
  },
};

module.exports = categorieController;
