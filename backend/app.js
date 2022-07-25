const express = require("express")

const app = express();
// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use((req, res, next) => {
console.log("requete")
next();
})



app.use((req, res, next) => {
    res.json({ message: "requete reçu"})
})

module.exports = app;