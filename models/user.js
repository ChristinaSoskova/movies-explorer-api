const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: [true, '-Пользователь с таким адресом уже зарегистрирован.'],
    required: [true, '-Почта обязательна.'],
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Некорректый адрес почты',
    },
  },
  password: {
    type: String,
    required: [true, '-Пароль обязателен.'],
    select: false,
  },
  name: {
    type: String, // имя — это строка
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('user', userSchema);
