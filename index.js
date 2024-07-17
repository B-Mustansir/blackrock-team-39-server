const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
require('./jobs');
require('dotenv').config();
require('./Models/db');

app.use(express.urlencoded({extended:true}));

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