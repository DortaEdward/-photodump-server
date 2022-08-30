const router = require('express').Router();
const prisma = require('../db/prisma');

// get user by id
router.get('/:id', async (req, res, next) => {
  try {
    const {
      id
    } = req.params;
    const user = await prisma.users.findUnique({
      where: {
        id: Number(id)
      }
    });
    if (!user) {
      const error = new Error('User does not exist');
      next(error);
    };
    delete user.password;
    user.image = user.image === null ? 'default.png' : user.image;
    res.status(200).json({
      status: 200,
      user: user
    })
  } catch (error) {
    next(error);
  };
});

// update user

// delete user

module.exports = router;