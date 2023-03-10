const userSchema = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const ConflictError = require('../errors/ConflictError');

module.exports.getCurrentUser = (req, res, next) => {
  userSchema
    .findById(req.user._id)
    .orFail(new NotFound('Пользователь по указанному _id не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Введен некорректный _id пользователя'));
      } else {
        next(error);
      }
    });
};

module.exports.updateInfo = (req, res, next) => {
  const { name, email } = req.body;
  userSchema
    .findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    )
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else if (error.name === 'ValidationError' || error.name === 'CastError') {
        next(
          new BadRequest('Переданы некорректные данные при обновлении профиля.'),
        );
      } else {
        next(error);
      }
    });
};
