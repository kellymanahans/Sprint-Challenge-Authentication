const axios = require('axios');
const bcrypt = require('bcryptjs');
const { authenticate } = require('../auth/authenticate');

const userDB = require('../database/helpers/userDB')

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
  // implement user login
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
