const express = require('express');     //importer framework pour NodeJs
const app = express();                  // appel cette méthode pour configuration de serveur


// Middleware pour analyser les requêtes JSON
app.use(express.json());

// Middleware pour gérer les headers CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Autorise les requêtes depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Autorise certains en-têtes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Autorise certaines méthodes HTTP
    next();
  });

// Middleware pour gestion des erreurs 404
app.use((req, res, next) => {
    res.status(404).send("Not Found");
    next();
});

//Exporter app 
module.exports = app;