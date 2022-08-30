const router = require('express').Router();
const {
  PrismaClient,
} = require('@prisma/client');

const bcrypt = require('bcrypt');

const prisma = new PrismaClient();


router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({})
    res.json({
      status: 200,
      users: users,
    })
  } catch (error) {
    res.json({
      error: error.message,
      stack: error.stack
    })
  }
})

router.post('/register', async (req, res) => {
  try {
    const {
      displayName,
      name,
      bio,
      email,
      password
    } = req.body;



  } catch (error) {
    console.log(error);
    res.json({
      error: error.message,
      stack: error.stack
    })
  }
})

module.exports = router;