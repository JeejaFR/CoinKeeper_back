const userModel = require("../models/userModel");
const notificationModel = require("../models/notificationModel");
const categorieModel = require("../models/categorieModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;

async function initCategories(userID) {
  const categories = ["Loisirs", "Alimentation", "Logement", "Transports", "Santé", "Éducation", "Vacances", "Autres"];

  try {
    const addCategoryPromises = categories.map(
      (category) =>
        new Promise((resolve, reject) => {
          categorieModel.addCategorie(category, 0, userID, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        })
    );

    await Promise.all(addCategoryPromises);
  } catch (error) {
    console.error("Erreur lors de l'ajout des catégories:", error);
    throw error;
  }
}

const userController = {
  register: async (req, res) => {
    const user = req.body;
    try {
      const id = await new Promise((resolve, reject) => {
        userModel.addUser(user, (err, id) => {
          if (err) {
            reject(err);
          } else {
            resolve(id);
          }
        });
      });

      const token = jwt.sign({ id: id, email: user.email }, secretKey, { expiresIn: "1h" });
      await initCategories(id);

      await new Promise((resolve, reject) => {
        notificationModel.addNotification("Bienvenue sur CoinKeeper!", null, 1, id, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      res.status(201).json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  login: (req, res) => {
    const { email, password } = req.body;
    userModel.getUserByEmail(email, (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(404).json({ error: "Utilisateur introuvable" });
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (!result) {
          return res.status(401).json({ message: "Echec de l'authentification" });
        }

        // Générer un JWT
        const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: "1h" });
        res.status(200).json({ token });
      });
    });
  },
};

module.exports = userController;
