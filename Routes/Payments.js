const express = require('express');
const router = express.Router();

const Razorpay = require('razorpay');
const env = require('dotenv');
env.config({ path: './.env' });
const payments = require('../models/payments');
const User = require('../Models/User')
const ensureAuthenticated = require('../Middlewares/Auth')


var instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })

router.post("/checkout", ensureAuthenticated, async (req, res) => {

  const user = await User.findOne({ email: req.user.email });
  const amount = req.body.amount;
  var options = {
    amount: amount * 100,  // amount in the smallest currency unit
    currency: "INR",

  };

  const order = await instance.orders.create(options);

  let paymentinstance = new payments({
    order_id: order.id,
    amount: order.amount,
    user_email: user.email,
    success: false
  })

  const result = await paymentinstance.save();

  res.send(order);

})

router.post("/verifypayment", async (req, res) => {

  try {
    const reqpayment = await payments.findOne({ order_id: req.body.razorpay_order_id });
    const user = await User.findOne({ email: reqpayment.user_email })
    console.log(reqpayment);

    user.balance = user.balance + reqpayment.amount
    reqpayment.success = true;
    await user.save();
    await reqpayment.save();

    return res.redirect(process.env.REACT_APP_FRONTEND_URL+'/home');
  }
  catch (e) {
    console.log(e);
    return res.status(400).send(e);

  }

});

module.exports = router