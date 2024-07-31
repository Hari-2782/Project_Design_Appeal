const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const md5 = require('crypto-js/md5');

// Payment notification endpoint
router.post('/notify', async (req, res) => {
  const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig, ...otherParams } = req.body;

  const merchant_secret = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Your Merchant Secret
  const local_md5sig = md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + md5(merchant_secret).toString().toUpperCase()).toString().toUpperCase();

  if (local_md5sig === md5sig && status_code == 2) {
    const payment = new Payment({
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      verified: true,
      ...otherParams
    });
    await payment.save();
    // TODO: Update your order status in the database
    res.status(200).send('Payment verified and processed.');
  } else {
    res.status(400).send('Invalid payment notification.');
  }
});

module.exports = router;
