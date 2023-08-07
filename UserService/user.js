const { Client } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const clientConfig = {
  user: 'postgres',
  database: 'gapi',
};

const client = new Client(clientConfig);

client.connect();

exports.createUser = function createUser(call, cb) {
  const { user_name, email, password } = call.request.user;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return cb(err, null);
    }

    bcrypt.hash(password, salt, (err, hashedPassword) => {
      if (err) return cb(err, null);

      client.query(
        'insert into users(user_name, email, password) values($1, $2, $3) returning id',
        [user_name, email, hashedPassword],
        function (err, res) {
          if (err) return cb(err);
          const response = {
            id: res.rows[0].id,
          };

          return cb(null, response);
        }
      );
    });
  });
};

exports.getUser = function (call, cb) {
  const { id } = call.request;

  client.query(
    'select username, email from users where id = $1',
    [id],
    function (err, res) {
      if (err) {
        return cb(err);
      }
      const response = {
        user_name: res.rows[0].username,
        email: res.rows[0].email,
      };
    }
  );
};

exports.createToken = function createToken(call, cb) {
  const user = call.request.user;

  const email = user.email;

  client.query(
    'select id, user_name, password from users where email = $1',
    [email],
    (err, res) => {
      if (err) {
        return cb(err);
      }

      bcrypt.compare(user.password, res.rows[0].password.trim(), (err, ok) => {
        if (err) {
          return cb(err);
        }

        if (ok) {
          user.id = res.rows[0].id;
          user.user_name = res.rows[0].user_name;
          delete user.password;

          jwt.sign(user, 'SECRET', (err, token) => {
            if (err) {
              return cb(err);
            }
            const response = { token };

            return cb(null, response);
          });
        }
        if (!ok) {
          return cb(new Error('Wrong Pass'), null);
        }
      });
    }
  );
};

exports.isAuthenticated = function isAuthenticated() {
  const token = call.request.token;

  jwt.verify(token, 'SECRET', (err, user) => {
    if (err) return cb(err, { ok: false });
    const response = { ok: true, user };

    return cb(null, response);
  });
};
