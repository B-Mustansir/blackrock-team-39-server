const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
    assetId: String,  // Reference to Asset model
    faceValue: Number,
    currentValue: Number,
    maturityDate: Date,
    createdAt: {type:Date,default: Date.now},
    tokenCount:Number
});

const TokensModel = mongoose.model('tokens', TokenSchema);
module.exports = TokensModel;