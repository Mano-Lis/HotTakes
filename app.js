const express = require("express");
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');



const app = express();

const corsOptions = {
  origin: process.env.ACCESS_ORIGIN,
}

app.use(cors(corsOptions));

app.use(helmet({
  crossOriginResourcePolicy: {
    policy: 'cross-origin'
  }
}));


app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);

app.use('/api/sauces', saucesRoutes);

module.exports = app;
