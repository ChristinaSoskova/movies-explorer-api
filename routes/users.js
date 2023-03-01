const router = require('express').Router();

const {
  getCurrentUser,
  updateInfo,
} = require('../controllers/users');

const {
  validationUpdateUser,
} = require('../middlewares/validations');

router.get('/me', getCurrentUser);
router.patch('/me', validationUpdateUser, updateInfo);

module.exports = router;
