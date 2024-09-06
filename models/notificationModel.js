const db = require("../db");

const notificationModel = {
  addNotification: (content, date, type, userID, callback) => {
    const notificationDate = date ? new Date(date) : new Date();
    const formattedDate = notificationDate.toISOString();
  
    const query = `
      INSERT INTO notifications (content, date, type, userID) 
      VALUES (?, ?, ?, ?)
    `;
  
    db.run(query, [content, formattedDate, type, userID], function (err) {
      if (err) {
        console.log("Erreur lors de l'insertion de la notification : " + err.message);
        return callback(err);
      }
      callback(null, this.lastID);
    });
  },
  getNotificationByID: (id, callback) => {
    const query = "SELECT * FROM notifications WHERE id=?";
    db.all(query, [id], (err, rows) => {
      callback(err, rows);
    });
  },
  getAllNotifications: (userID, callback) => {
    const query = "SELECT * FROM notifications WHERE userID=?";
    db.all(query, [userID], (err, rows) => {
      callback(err, rows);
    });
  },
  deleteNotificationByID: (id, callback) => {
    if (!id || isNaN(id)) {
      return callback(new Error("Invalid ID."));
    }

    const query = "DELETE FROM notifications WHERE id = ?";

    db.run(query, [id], function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, this.changes);
    });
  },
  deleteAllUserNotifications: (id, callback) => {
    if (!id || isNaN(id)) {
      return callback(new Error("Invalid ID."));
    }

    const query = "DELETE FROM notifications WHERE userID = ?";

    db.run(query, [id], function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, this.changes);
    });
  },
};

module.exports = notificationModel;
