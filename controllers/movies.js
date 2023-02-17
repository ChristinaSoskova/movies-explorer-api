const MovieSchema = require('../models/movie');
const NotFound = require('../errors/NotFound');
const CurrentError = require('../errors/CurrentError');
const BadRequest = require('../errors/BadRequest');

module.exports.createMovie = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  MovieSchema
    .create({ name, link, owner })
    .then((movie) => {
      MovieSchema.populate(movie, ['owner'])
        .then((newMovie) => res.send(newMovie));
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(
          new BadRequest('Переданы некорректные данные при создании фильма'),
        );
      } else {
        next(error);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  MovieSchema
    .find({})
    .sort({ createdAt: -1 })
    .populate(['owner', 'likes'])
    .then((movie) => res.send(movie))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  MovieSchema
    .findById(req.params.movieId)
    .orFail(new NotFound('Передан несуществующий _id карточки'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new CurrentError('Вы не можете удалить чужой фильм'));
      }

      return movie
        .remove()
        .then(() => res.send({ message: 'Фильм успешно удален из подборки' }));
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequest('Некорректные данные фильма.'));
      }
      return next(error);
    });
};

