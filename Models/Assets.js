const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AssetsSchema = new Schema({
    createdBy: String,  // Reference to Farm model
    plantType: String,
    variety: String,
    plantingDate: Date,
    expectedHarvestDate: Date,
    estimatedYield: Number,
    yieldUnit: Number,  // e.g., "kg", "units"
    location: String,
    cultivationMethod: String,
    riskScore: Number,
    createdAt: {type:Date,default: Date.now},
    seedValue:Number,
    numberOfSeeds:Number,
    imageOfCrop: String
});

const AssetsModel = mongoose.model('assets', AssetsSchema);
module.exports = AssetsModel;