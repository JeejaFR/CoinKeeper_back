const notificationModel = require("../models/notificationModel");


const categorieController = {
  getNotifications: (req, res) => {
    const userID = req.user.id;
    notificationModel.getAllNotifications(userID, (err, notifications) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(notifications);
    });
  },
  getNotificationByID: async (id, callback) => {
    try {
      notificationModel.getNotificationByID(id, (err, notification) => {
        if (err) {
          callback(err, null);
        }
        callback(null, notification);
      });
    } catch (error) {
      callback(error, null);
    }
  },
  deleteNotificationByID: (req, res) => {
    const id = req.params.id;

    notificationModel.deleteNotificationByID(id, (err, id) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id });
    });
  },
  deleteAllNotifications: (req, res) => {
    const userID = req.user.id;

    notificationModel.deleteAllUserNotifications(userID, (err, id) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id });
    });
  },
};

module.exports = categorieController;
