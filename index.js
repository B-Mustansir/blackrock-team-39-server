const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
require('./jobs');
require('dotenv').config();
require('./Models/db');

app.use(express.urlencoded({extended:true}));

app.use(cors({
    origin: 'https://mustansir-blackrock-hackknight.vercel.app',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);

app.use(require('./Routes/AssetsMgmt'))
app.use(require('./Routes/Payments'))

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})