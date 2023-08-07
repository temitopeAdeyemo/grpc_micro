const express = require('express');
const { requireAuth } = require('./auth');
const router = express.Router();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = __dirname + '/protos/user.proto';

const packageDefinitions = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  defaults: true,
  oneofs: true,
});

const UserService = grpc.loadPackageDefinition(packageDefinitions).UserService;

const client = new UserService(
  'localhost:5005',
  grpc.credentials.createInsecure()
);

router.post(
  '/register',
  // requireAuth,
  (req, res) => {
    const { user_name, email, password } = req.body;
    if (!user_name || !email || !password) {
      return res
        .status(401)
        .json({ success: false, msg: 'missing fields to register user' });
    }
    const createUserRequest = {
      user: {
        email,
        user_name,
        password,
      },
    };
    client.createUser(createUserRequest, (err, message) => {
      if (err) {
        return res.status(500).json({
          sucess: false,
          message: 'User Auth err',
        });
      }
      return res.status(200).json({
        sucess: true,
        message: 'User created',
        id: message.id,
      });
    });
  }
);

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const createTokenRequest = {
    user: {
      email,
      password,
    },
  };

  await client.createToken(createTokenRequest, (err, response) => {
    if (err) {
      return res.status(500).json({
        statusCode: 500,
        err: err.details,
      });
    }

    return res.status(200).json({
      message: "Logged in siccessfully",
      ...response,
    });
  });
});

module.exports = router;
