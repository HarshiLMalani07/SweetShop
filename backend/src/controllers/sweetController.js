const Sweet = require('../models/Sweet');
const Order = require('../models/Order'); // <--- Import this

// 1. Create Sweet (Admin) - Unchanged
exports.createSweet = async (req, res) => {
  try {
    const sweet = await Sweet.create(req.body);
    res.status(201).json(sweet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 2. Get Sweets with SEARCH & FILTERS
exports.getSweets = async (req, res) => {
  try {
    const { search, minPrice, maxPrice, category } = req.query;
    let query = {};

    // Search by Name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Filter by Category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by Price Range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(query);
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Purchase Sweet & Create Order
exports.purchaseSweet = async (req, res) => {
  try {
    const { qty } = req.body; // Get quantity from request
    const quantityToBuy = parseInt(qty) || 1; // Default to 1 if missing

    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
    
    // Check if enough stock exists
    if (sweet.quantity >= quantityToBuy) {
      // Decrement Stock
      sweet.quantity -= quantityToBuy;
      await sweet.save();

      // Create Order Record
      await Order.create({
        user: req.user.id,
        sweet: sweet._id,
        sweetName: sweet.name,
        price: sweet.price * quantityToBuy, // Save Total Price
        quantity: quantityToBuy // Save Quantity
      });

      res.json({ message: 'Purchase successful', sweet });
    } else {
      res.status(400).json({ message: `Only ${sweet.quantity} items left in stock` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Get My Orders (New Endpoint)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ... updateSweet and deleteSweet remain unchanged ...
exports.updateSweet = async (req, res) => {
    try {
      const sweet = await Sweet.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
      res.json(sweet);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
exports.deleteSweet = async (req, res) => {
try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);
    if(!sweet) return res.status(404).json({ message: 'Sweet not found' });
    res.json({ message: 'Sweet removed' });
} catch (error) {
    res.status(500).json({ error: error.message });
}
};