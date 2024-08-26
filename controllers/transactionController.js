const transactionModel = require('../models/transactionModel');

const transactionController = {
  createTransaction: (req, res) => {
    const transaction = req.body;
    if(transaction.amount<=0){
      return res.status(401).send("Le montant doit être supérieur à 0");
    }
    transactionModel.addTransaction(transaction,'1', (err, id) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id });
    });
  },
  getAllTransactions: (req, res) => {
    transactionModel.getAllTransactions('1',(err, transaction) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(transaction);
    });
  },
  getTransactionByID: (req, res) => {
    const id = req.params.id;
    transactionModel.getTransactionByID(id,(err, transaction) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(transaction);
    });
  },
  updateTransactionByID: (req, res) => {
    const id = req.params.id;
    const transaction = req.body;
  
    if(transaction.amount<=0){
      return res.status(401).send("Le montant doit être supérieur à 0");
    }

    transactionModel.editTransactionByID(id, transaction, (err, id) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id });
    });
  },
  deleteTransactionByID: (req, res) => {
    const id = req.params.id;

    transactionModel.deleteTransactionByID(id, (err, id) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id });
    });
  },
}

module.exports = transactionController;