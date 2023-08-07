const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');
const PROTO_PATH = __dirname + '/protos/user.proto';

const packageDefinitions = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  defaults: true,
  oneofs: true,
});

const UserService = grpc.loadPackageDefinition(packageDefinitions).UserService;

const client = new UserService(
  'localhost:5001',
  grpc.credentials.createInsecure()
);

exports.requireAuth = function requireAuth(req, res) {
  const token = req.headers['authorization'].split(' ')[1];

  client.isAuthenticated({ token }, (err, done) => {
    if (err) {
      console.error('Error', err);
      return err.status.json({
        sucess: false,
        message: 'User Auth err',
      });
    } else {
      const user = {
        id: msg.id,
        user_name: msg.user_name,
        email: msg.email,
      };
      req.user = user;
    }
    next();
  });
};
