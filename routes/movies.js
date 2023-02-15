const router = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  validationCreateMovie,
  validationMovieById,
} = require('../middlewares/validations');

router.get('/', getMovies);
router.delete('/:movieId', validationMovieById, deleteMovie);
router.post('/', validationCreateMovie, createMovie);


module.exports = router;
