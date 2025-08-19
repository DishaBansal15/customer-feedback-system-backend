const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.post('/', async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
});

module.exports = router;
