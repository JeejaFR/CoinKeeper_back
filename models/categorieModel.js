const db = require("../db");

const categorieModel = {
  addCategorie: (name, month_limit, userID, callback) => {
    month_limit = month_limit ?? 999999999999;

    const query = `
      INSERT INTO categories (name, month_limit, userID) 
      VALUES (?, ?, ?)
    `;
  
    db.run(query, [name, month_limit, userID], function (err) {
      if (err) {
        console.log("Erreur lors de la création de la catégorie : " + err.message);
        return callback(err);
      }

      const categorieID = this.lastID;

      const selectQuery = `
        SELECT * FROM categories WHERE id = ?
      `;

      db.get(selectQuery, [categorieID], (err, row) => {
        if (err) {
          return callback(err);
        }
        callback(null, row);
      });
    });
  },
  getCategorieAllCategories: (userID, callback) => {
    const query = "SELECT * FROM categories WHERE userID=?";
    db.all(query, [userID], (err, rows) => {
      callback(err, rows);
    });
  },
  getCategorieByName: (name, userID, callback) => {
    const query = "SELECT * FROM categories WHERE name=? AND userID=?";
    db.all(query, [name,userID], (err, rows) => {
      callback(err, rows);
    });
  },
  getCategorieByID: (id, userID, callback) => {
    const query = "SELECT * FROM categories WHERE id=? AND userID=?";
    db.all(query, [id,userID], (err, rows) => {
      callback(err, rows);
    });
  },
  editCategorieByID(id, categorie, userID, callback) {
    const { name, month_limit } = categorie;

    let query = "UPDATE categories SET ";
    const updates = [];
    const params = [];
    
    if (name !== undefined) {
      updates.push("name = ?");
      params.push(name);
    }
    if (month_limit !== undefined) {
      updates.push("month_limit = ?");
      params.push(month_limit);
    }

    if (updates.length === 0) {
      return callback(new Error("No fields to update."));
    }

    query += updates.join(", ");
    query += " WHERE id = ? AND userID=?";
    params.push(id,userID);

    db.run(query, params, function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, this.changes);
    });
  },
  deleteCategorieByID: (id, userID, callback) => {
    if (!id || isNaN(id)) {
      return callback(new Error("Invalid ID."));
    }

    const query = "DELETE FROM categories WHERE id = ? AND userID=?";

    db.run(query, [id, userID], function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, this.changes);
    });
  },
};

module.exports = categorieModel;
