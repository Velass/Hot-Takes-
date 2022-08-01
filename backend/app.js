const express = require("express")
const mongoose = require('mongoose');
const app = express();

const sauceRoutes = require('./routes/sauce')
const userRoutes = require("./routes/user")




mongoose.connect('mongodb+srv://floflo:JSXPi7nfAfniYWuc@hot-takes.jfeqy.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));





// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());


// requete create, read, update, delete (CRUD) de sauce
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);




module.exports = app;