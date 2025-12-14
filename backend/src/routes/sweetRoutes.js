const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { createSweet, getSweets, purchaseSweet, deleteSweet, updateSweet, getMyOrders } = require('../controllers/sweetController');
const router = express.Router();

// Public/User Routes
router.get('/', protect, getSweets); 
router.post('/:id/purchase', protect, purchaseSweet); 
router.get('/myorders', protect, getMyOrders); // <--- NEW ROUTE

// Admin Only
router.post('/', protect, admin, createSweet); 
router.put('/:id', protect, admin, updateSweet);
router.delete('/:id', protect, admin, deleteSweet); 

module.exports = router;