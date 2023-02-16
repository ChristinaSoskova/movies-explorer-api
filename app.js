/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const process = require('process');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const router = require('./routes');
const { createUser, login } = require('./controllers/auth');
const {
  validationCreateUser,
  validationLogin,
} = require('./middlewares/validations');
const auth = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
app.use(cors());
mongoose.set('strictQuery', false);

const { PORT = 3001, DB = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
app.use(express.json());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUser);

app.use(auth);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});


app.use(limiter);
app.use(helmet());
app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect(DB);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`App connect to dateBase ${DB}`);
});

module.exports = { app, DB };
