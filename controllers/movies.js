const cardSchema = require('../models/card');
const NotFound = require('../errors/NotFound');
const CurrentError = require('../errors/CurrentError');
const BadRequest = require('../errors/BadRequest');

module.exports.createMovie = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardSchema
    .create({ name, link, owner })
    .then((card) => {
      cardSchema.populate(card, ['owner'])
        .then((newcard) => res.send(newcard));
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(
          new BadRequest('Переданы некорректные данные при создании карточки'),
        );
      } else {
        next(error);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  cardSchema
    .find({})
    .sort({ createdAt: -1 })
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  cardSchema
    .findById(req.params.cardId)
    .orFail(new NotFound('Передан несуществующий _id карточки'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new CurrentError('Вы не можете удалить чужую карточку'));
      }

      return card
        .remove()
        .then(() => res.send({ message: 'Карточка успешно удалена' }));
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequest('Некорректные данные карточки.'));
      }
      return next(error);
    });
};

