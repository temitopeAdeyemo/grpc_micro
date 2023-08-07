const PROTO_PATH = __dirname + "/protos/user.proto";

const Grpc = require("@grpc/grpc-js");

const server = new Grpc.Server();

exports.startGrpcServer = function () {
  server.bindAsync("127.0.0.1:5005", Grpc.ServerCredentials.createInsecure(), (err) => {
    if (err) throw new Error(err) 
    server.start();
    console.log("Server Running...");
  })
};

exports.getGrpcServer = function () { 
  return server;
}

