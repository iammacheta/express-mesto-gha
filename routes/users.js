const users = require('express').Router();

const { getAllusers, getUser, createUser, updateProfile } = require('../controllers/users');

users.get('/', getAllusers);
users.get('/:userId', getUser);
users.post('/', createUser);
users.patch('/me', updateProfile);

module.exports = users;
