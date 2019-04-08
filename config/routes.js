const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticate } = require('../auth/authenticate');

const userDB = require('../database/helpers/userDb')

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 12)

  userDB.add(user)
  .then(id => {
    res.status(201).json(id)
  })
  .catch(err => {
    res.status(500).json({message:'cannot register user'})
  })
}

function login(req, res) {
  const user = req.body;

  userDB.get(user)
    .then(users => {
        if(users.length && bcrypt.compareSync(user.password, users[0].password)) {
            const token = jwt.sign({ username: users[0].username }, 'secret');
            res.json({ message: `Welcome ${user.username}`, token: token });
        } else {
            res.status(404).json({ message: 'Unable to login' });
        }
    })
    .catch(err => {
        res.status(500).json({ errorMessage: 'Failed to verify. Please try again.' });
    });
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
