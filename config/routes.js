const axios = require('axios');
const bcrypt = require('bcryptjs');
const db = require('../database/dbConfig.js');
const jwt = require('jsonwebtoken');
const { authenticate } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 4);
  user.password = hash;

  db('users').insert(user)
    .then(found_ids => {
      db('users').where({ id: found_ids[0] })
        .then(found_users => {
          const token = generateToken(found_users[0]);
          res.status(200).json({ token });
        })
        .catch(err => {
          res.status(500).json(err);
        });
    })
    .catch(err => {
      res.status(500).json(err);
    });
}

function login(req, res) {

  const { username, password } = req.body;

  db('users').where({ username: username })
    .then(users => {
      if (users && bcrypt.compareSync(password, users[0].password)) {
        const token = generateToken(users[0]);
        res.status(200).json({ token });
      } else {
        res.status(401).json({ message: 'Invalid credentials, sorry Jake'});
      }
    })
    .catch(err => {
      res.status(500).json(err);
    })
}

generateToken = user => {
  const secret = process.env.JWT_SECRET;
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: '20m',
  };
  return jwt.sign(payload, secret, options);
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
