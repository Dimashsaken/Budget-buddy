import express from 'express';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getAnalytics
} from '../controllers/transactionController.js';

const router = express.Router();

// Get all transactions
router.get('/', getTransactions);

// Get analytics data
router.get('/analytics', getAnalytics);

// Get a single transaction by id
router.get('/:id', getTransactionById);

// Create a new transaction
router.post('/', createTransaction);

// Update a transaction
router.put('/:id', updateTransaction);

// Delete a transaction
router.delete('/:id', deleteTransaction);

export default router; 