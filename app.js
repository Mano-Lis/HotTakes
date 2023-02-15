const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce');
const dotenv = require("dotenv");
const path = require('path');
dotenv.config();

(async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://manolis:projet6@clusterhottakes.2ejpcfn.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connexion à MongoDB réussie !");
  } catch (error) {
    console.log("Connexion à MongoDB échouée !", error);
  }
})();

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);

app.use('/api/sauces', saucesRoutes);

module.exports = app;
