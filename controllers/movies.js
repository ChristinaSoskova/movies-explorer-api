const MovieSchema = require('../models/movie');
const NotFound = require('../errors/NotFound');
const CurrentError = require('../errors/CurrentError');
const BadRequest = require('../errors/BadRequest');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN } = req.body;
  MovieSchema
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner: req.user._id
    })
    .then((movie) => res.send(movie))
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
  .find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  MovieSchema
    .findById(req.params.movieId)
    .orFail(new NotFound('Передан несуществующий _id фильма'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new CurrentError('Вы не можете удалить фильм'));
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

