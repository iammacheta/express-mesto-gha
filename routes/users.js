const users = require('express').Router();

const { getAllusers, getUser, createUser } = require('../controllers/users');

users.get('/', getAllusers);
users.get('/:userId', getUser);
users.post('/', createUser);

module.exports = users;
