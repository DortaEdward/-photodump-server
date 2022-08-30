const router = require('express').Router();
const prisma = require('../db/prisma');
const {
  isLoggedIn
} = require('../middleware');

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

router.use(isLoggedIn);

// update user
router.put('/:id', async (req, res, next) => {
  try {
    const {
      id
    } = req.params;
    const payload = req.body;
    const user = prisma.users.update({
      where: {
        id: id
      },
      data: payload,
    })
  } catch (error) {
    next(error);
  }
})

// delete user
router.delete('/:id', async (req, res, next) => {
  try {
    const {
      id
    } = req.params;
    await prisma.users.delete({
      where: {
        id: Number(id)
      }
    });
    res.status(200).json({
      status: res.status,
      message: 'User Deleted'
    })
  } catch (error) {
    next(error);
  }
})

module.exports = router;