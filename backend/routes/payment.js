const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');

// @desc    Create Stripe payment intent
// @route   POST /api/payment/create-intent
// @access  Private
router.post('/create-intent', protect, async (req, res) => {
  try {
    const { amount } = req.body;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId: req.user._id.toString(),
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ message: 'Payment processing error', error: error.message });
  }
});

// @desc    Confirm payment and update order
// @route   POST /api/payment/confirm
// @access  Private
router.post('/confirm', protect, async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const order = await Order.findById(orderId);

      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date().toISOString(),
          email_address: req.user.email,
        };
        order.status = 'processing';

        await order.save();

        res.json({
          success: true,
          order,
        });
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } else {
      res.status(400).json({ message: 'Payment not succeeded' });
    }
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: 'Payment confirmation error', error: error.message });
  }
});

module.exports = router;
