const express = require('express')                  //framework pour Node.js
const app = express()                               //méthode pour configuration de serveur
const mongoose = require('mongoose')                //biblio ODM (Object Data Modeling) qui facilite les opérations CRUD
const path = require('path')                        //manipuler les chemins de fichiers
require("dotenv").config({ path: ".env" })          //Charge les variables d'environnement

const userRoutes = require('./routes/user')         
const bookRoutes = require('./routes/book')



// Middleware pour analyser les requêtes JSON
app.use(express.json())

// Middleware pour gérer les headers CORS 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Accède à l'API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Autorise certains headers
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Autorise certaines méthodes HTTP
    next();
  })



// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGODB_CLUSTER_URL,
    { useNewUrlParser: true, })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))


// Routes à utiliser 
app.use('/api/auth', userRoutes)
app.use('/api/books', bookRoutes)



// Middleware pour gestion des erreurs 404
app.use((req, res, next) => {
    res.status(404).send("Not Found");
    next();
})


//Exporter app 
module.exports = app;