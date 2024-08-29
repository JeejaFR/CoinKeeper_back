const db = require("../db");

const transactionModel = {
  addTransaction: (transaction, userID, callback) => {
    const { amount, category, date, description } = transaction;

    if (amount <= 0) {
      return callback(new Error("Amount must be positive."));
    }

    const transactionDescription = description ?? "";
    const transactionDate = date ? new Date(date) : new Date();

    const formattedDate = transactionDate.toISOString().split("T")[0];

    const query = `
      INSERT INTO transactions (amount, category, date, description, userID) 
      VALUES (?, ?, ?, ?, ?)
    `;
    db.run(query, [amount, category, formattedDate, transactionDescription, userID], function (err) {
      if (err) {
        return callback(err);
      }

      const transactionID = this.lastID;

      const selectQuery = `
        SELECT * FROM transactions WHERE id = ?
      `;

      db.get(selectQuery, [transactionID], (err, row) => {
        if (err) {
          return callback(err);
        }
        callback(null, row);
      });
    });
  },
  getAllTransactions: (userID, callback) => {
    const query = "SELECT * FROM transactions WHERE userID=?";
    db.all(query, [userID], (err, rows) => {
      callback(err, rows);
    });
  },
  getTransactionByID: (id, callback) => {
    const query = "SELECT * FROM transactions WHERE id=?";
    db.all(query, [id], (err, rows) => {
      callback(err, rows);
    });
  },
  getTransactionByPeriode: (userID, startDate, endDate, callback) => {
    const query = `
      SELECT * FROM transactions 
      WHERE userID = ? 
      AND date >= ? 
      AND date <= ?
    `;
    db.all(query, [userID, startDate.toISOString(), endDate.toISOString()], (err, rows) => {
      callback(err, rows);
    });
  },
  editTransactionByID(id, transaction, callback) {
    const { amount, category, date, description } = transaction;

    // Validation de amount si il est présent
    if (amount !== undefined && amount <= 0) {
      return callback(new Error("Amount must be positive."));
    }

    // Construction de la requête SQL dynamique
    let query = "UPDATE transactions SET ";
    const updates = [];
    const params = [];

    // Ajouter les champs modifiés à la requête
    if (amount !== undefined) {
      updates.push("amount = ?");
      params.push(amount);
    }
    if (category !== undefined) {
      updates.push("category = ?");
      params.push(category);
    }
    if (date !== undefined) {
      updates.push("date = ?");
      const transactionDate = date ? new Date(date) : new Date();

      const formattedDate = transactionDate.toISOString().split("T")[0];
      params.push(formattedDate);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      params.push(description);
    }

    if (updates.length === 0) {
      return callback(new Error("No fields to update."));
    }

    query += updates.join(", ");
    query += " WHERE id = ?";
    params.push(id);

    // Exécuter la requête SQL
    db.run(query, params, function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, this.changes);
    });
  },
  deleteTransactionByID: (id, callback) => {
    if (!id || isNaN(id)) {
      return callback(new Error("Invalid ID."));
    }

    const query = "DELETE FROM transactions WHERE id = ?";

    db.run(query, [id], function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, this.changes);
    });
  },
};

module.exports = transactionModel;
