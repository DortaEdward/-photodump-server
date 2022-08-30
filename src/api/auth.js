const router = require('express').Router();
const {
  PrismaClient
} = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
  try {
    const users = await prisma.users.findMany({});
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
    const data = req.body;
    const salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(data.password, salt);
    const user = await prisma.users.create({
      data: {
        displayName: data.displayName,
        name: data.name,
        bio: data.bio,
        email: data.email,
        password: data.password
      }
    });

    if (user) {
      res.status(200).json({
        status: 200,
        message: 'User Created',
        user: user
      })
    };

  } catch (error) {
    console.log(error);
    res.json({
      error: error.message,
      stack: error.stack
    })
  }
})

module.exports = router;