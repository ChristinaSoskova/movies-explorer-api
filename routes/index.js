const router = require('express').Router();
const NotFound = require('../errors/NotFound');

router.use('/movies', require('./movies'));
router.use('/users', require('./users'));

router.use('/*', (req, res, next) => {
  next(new NotFound('Такая страница не существует'));
});

module.exports = router;
