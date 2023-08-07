const express = require('express');
const { requireAuth } = require('./auth');
const userRouter = require('./user');
const app = express();

const port = 5000;
app.use(express.json());

// app.use(requireAuth)
app.use('/user', userRouter);
app.listen(port, () => {
  console.log('listening on port ' + port);
});
