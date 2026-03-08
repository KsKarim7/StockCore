const express = require('express');
const protect = require('../middleware/protect');
const {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  addPayment,
  cancelPurchase,
} = require('../controllers/purchaseController');

const router = express.Router();

router.get('/', getAllPurchases);
router.post('/', protect, createPurchase);
router.get('/:id', getPurchaseById);
router.post('/:id/pay', protect, addPayment);
router.post('/:id/cancel', protect, cancelPurchase);

module.exports = router;

