const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const volleyball = require('volleyball');
const {
  notFound,
  errorHandler
} = require('./middleware');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: process.env.DEV ? 'http://localhost:5045' : process.env.DEPLOYMENTURL
}));
app.use(helmet());
app.use(volleyball);
app.use(express.json());

const authRoute = require('./api/auth');

app.use('/api/v1/auth', authRoute);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5054;
app.listen(PORT, () => {
  console.log('Listening on port:', PORT);
})