const router = require('express').Router();
const {
  createJWT
} = require('../middleware');

const prisma = require('../db/prisma');

const bcrypt = require('bcrypt');

router.post('/register', async (req, res, next) => {
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
      })
    };

  } catch (error) {
    console.log(error);
    res.json({
      error: error.message,
      stack: error.stack
    })
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body;
    const user = await prisma.users.findUnique({
      where: {
        email: String(email)
      }
    });

    if (!user) {
      const error = new Error("User does not exist");
      res.status(404);
      next(error);
    }

    const validPassword = await bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      const error = new Error("Password does not match");
      res.status(404);
      next(error);
    }
    const payload = {
      id: user.id,
      name: user.name,
      displayName: user.displayName,
      bio: user.bio,
      image: user.image === null ? 'default.png' : user.image
    }
    createJWT(payload, res);

  } catch (error) {
    res.status(500);
    next(error);
  }
});

module.exports = router;