const express = require('express');
const router = express.Router();
const ensureAuthenticated=require('../Middlewares/Auth')

const Assets=require('../Models/Assets')
const Tokens=require('../Models/Tokens')
const User=require('../Models/User');
const { number } = require('joi');



// const generateTokens = (n, assetId, faceValue, currentValue, status, maturityDate) => {
//     const tokens = [];

//     for (let i = 0; i < n; i++) {
//         const token = new Tokens({
//             assetId: assetId,
//             faceValue: faceValue,
//             currentValue: currentValue,
//             status: status,
//             maturityDate: maturityDate,
//         });

//         tokens.push(token);
//         token.save();
//     }

//     return tokens;
// };

router.post('/registerasset',ensureAuthenticated, async (req, res) => {
    try {
        console.log(req.body);
        const asset = new Assets({
            createdBy: req.user.email,
            plantType: req.body.plantType,
            variety: req.body.variety,
            plantingDate: new Date(req.body.plantingDate),
            expectedHarvestDate: new Date(req.body.expectedHarvestDate),
            estimatedYield: req.body.estimatedYield,
            cultivationMethod: req.body.cultivationMethod,
            riskScore: req.body.riskScore,
            seedValue:req.body.seedValue,
            numberOfSeeds:req.body.numberOfSeeds,
            imageOfCrop:req.body.imageOfCrop
        });
        await asset.save();
        
        const tokens= new Tokens({
            assetId: asset._id,  // Reference to Asset model
            faceValue: asset.seedValue,
            currentValue: asset.seedValue,
            maturityDate: asset.expectedHarvestDate,
            tokenCount:asset.numberOfSeeds
        })
        await tokens.save();
        return res.status(201).send(asset);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Route to get tokens with corresponding asset image URL
router.get('/tokens', async (req, res) => {
    try {
        const tokens = await Tokens.find();

        const tokensWithAssets = await Promise.all(tokens.map(async (token) => {
            const asset = await Assets.findById(token.assetId).exec();
            return {
                tokenId: token._id,
                faceValue: token.faceValue,
                currentValue: token.currentValue,
                maturityDate: token.maturityDate,
                createdAt: token.createdAt,
                tokenCount: token.tokenCount,
                asset: {
                    assetId: asset._id,
                    createdBy: asset.createdBy,
                    plantType: asset.plantType,
                    variety: asset.variety,
                    plantingDate: asset.plantingDate,
                    expectedHarvestDate: asset.expectedHarvestDate,
                    cultivationMethod: asset.cultivationMethod,
                    seedValue: asset.seedValue,
                    numberOfSeeds: asset.numberOfSeeds,
                    imageOfCrop: asset.imageOfCrop
                }
            };
        }));

        res.json(tokensWithAssets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tokens with assets', error });
    }
});

router.post('/buytokens',ensureAuthenticated, async(req,res)=>{

    const user= await User.findOne({email:req.user.email});
    
    const assetId=req.body.assetId;
    const n=req.body.NumberOfTokens;

    const token= await Tokens.findOne({assetId:assetId})
    const amountRequired=token.currentValue*n;
    if(amountRequired>user.balance){
        return  res.status(400).send({message:"Insufficient balance"});
    }
    const existingHolding = user.tokenHoldings.find(holding => holding.assetId === assetId);

    if (existingHolding) {
        existingHolding.count += n;
    } else {
        user.tokenHoldings.push({ assetId, count: n });
    }

    token.tokenCount -= n;
    await token.save();

    await user.save();
    return res.status(201).send({message:"Token purchased succesfully"});

});

router.post('/selltokens',ensureAuthenticated, async(req,res)=>{

    const user= await User.findOne({email:req.user.email});
    
    const assetId=req.body.assetId;
    const n=req.body.NumberOfTokens;

    const existingHolding = user.tokenHoldings.find(holding => holding.assetId === assetId);
    
    if(!existingHolding || existingHolding.count<n){
        return  res.status(400).send({message:"Insufficient balance"});
    }

    existingHolding.count -= n;
    const token= await Tokens.findOne({assetId:assetId})
    const amount=token.currentValue*n;
    
    user.balance=user.balance+amount;

    await user.save();
    return res.status(201).send({message:"Token purchased succesfully"});

});

module.exports = router;