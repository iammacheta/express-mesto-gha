const users = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');

const {
  getAllusers,
  getUser,
  updateProfile,
  updateAvatar,
  aboutMe,
} = require('../controllers/users');

users.get('/', getAllusers);
users.get('/me', aboutMe);
users.get('/:userId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().required().length(24),
  }),
}), getUser);
users.patch('/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);
users.patch('/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().required().regex(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$|#?$/i),
  }),
}), updateAvatar);

module.exports = users;
