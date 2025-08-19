const express = require('express');
const Feedback = require('../models/Feedback');
const router = express.Router();

const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const feedback = new Feedback({
      userId: payload.id,         
      productId: req.body.productId,
      rating: req.body.rating,
      comment: req.body.comment
    });

    await feedback.save();
    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Unauthorized' });
  }
});


router.get('/product/:id', async (req, res) => {
  const feedbacks = await Feedback.find({ productId: req.params.id })
    .populate('userId', 'name') 
    .populate('productId', 'name'); 
  res.json(feedbacks);
});

router.get('/user/:id', async (req, res) => {
  const feedbacks = await Feedback.find({ userId: req.params.id })
    .populate('productId', 'name');
  res.json(feedbacks);
});


router.delete('/:id', async (req, res) => {
  await Feedback.findByIdAndDelete(req.params.id);
  res.send('Deleted');
});

module.exports = router;