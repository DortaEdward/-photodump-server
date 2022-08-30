const jwt = require('jsonwebtoken');
const sanitizeRequest = require('express-sanitize-middleware');
const sanitize = [sanitizeRequest({
  body: true
}), ];

const notFound = (req, res, next) => {
  const error = new Error('Not Found - ' + req.originalUrl);
  res.status(404);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    error: error.message,
    stack: process.env.NODE_ENV === 'production' ? 'Somewhere' : error.stack,
  });
};

const createJWT = (payload, res) => {
  jwt.sign(payload, process.env.JWTSECRET, {
    expiresIn: '1d'
  }, (error, token) => {
    if (error) {
      console.log(error)
      res.status(500).json(error);
    } else {
      res.status(200).json({
        status: res.statusCode,
        token: token
      });
    }
  })
};

const checkTokenSetUser = (req, res, next) => {
  const authHeader = req.get('authorization');
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      jwt.verify(token, process.env.JWTSECRET, (error, user) => {
        if (error) {
          next(error);
        }
        req.user = user;
        next();
      })
    } else {
      next();
    }
  } else {
    next();
  }
};

const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    const error = new Error('Unauthorized');
    res.status(401);
    next(error);
  }
};

module.exports = {
  notFound,
  errorHandler,
  createJWT,
  isLoggedIn,
  checkTokenSetUser
}