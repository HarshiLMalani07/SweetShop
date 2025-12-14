const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sweet: { type: mongoose.Schema.Types.ObjectId, ref: 'Sweet', required: true },
  sweetName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 }, // <--- Added this
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);