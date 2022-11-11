const users = require('express').Router();

const {
  getAllusers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

users.get('/', getAllusers);
users.get('/:userId', getUser);
users.post('/', createUser);
users.patch('/me', updateProfile);
users.patch('/me/avatar', updateAvatar);

module.exports = users;
