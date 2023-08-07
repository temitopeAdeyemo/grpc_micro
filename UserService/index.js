const { startGrpcServer, getGrpcServer } = require('./grpc');

const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');
const { createToken, createUser, isAuthenticated, getUser } = require('./user');

const PROTO_PATH = __dirname + '/protos/user.proto';

const packageDefinitions = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  defaults: true,
  oneofs: true,
});

const user_proto = grpc.loadPackageDefinition(packageDefinitions);

startGrpcServer();

const server = getGrpcServer();

server.addService(user_proto.UserService.service, {
  createToken,
  createUser,
  isAuthenticated, //Should give err cuz of spelling wahala... Check proto file for correct service name.
  getUser,
});
