require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const ratelimiter = require('express-rate-limit');

const authrouter = require('./routes/auth');
const jobsrouter = require('./routes/jobs');
const connectDB = require('./db/connect');
const authenticateuser = require('./middleware/authentication');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
app.set('trust proxy',1);
app.use(
  ratelimiter({
    windowMs: 15*60*1000,
    max:100,
})
);
app.use(helmet());
app.use(cors());
app.use(xss());

// extra packages

// routes
app.use('/api/v1/auth',authrouter);
app.use('/api/v1/jobs',authenticateuser,jobsrouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
