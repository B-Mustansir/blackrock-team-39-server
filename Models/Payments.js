const mongoose = require('mongoose');

// mongoose.connect('mongodb://0.0.0.0:27017/mentormee');

const paymentSchema = mongoose.Schema({
    user_email: String,
    amount: Number,
    date: { type: Date, default: Date.now },
    order_id: String
})

const payments = mongoose.model("payment", paymentSchema);
module.exports = payments;