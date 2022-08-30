const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const volleyball = require('volleyball');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: process.env.DEV ? 'http://localhost:5045' : process.env.DEPLOYMENTURL
}));
app.use(helmet());
app.use(volleyball);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: "Welcome"
  })
})

const PORT = process.env.PORT || 5054;

app.listen(PORT, () => {
  console.log('Listening on port:', PORT);
})