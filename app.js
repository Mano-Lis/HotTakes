const express = require("express");
const mongoose = require("mongoose");

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

module.exports = app;
