//import express et appel methode express qui est dans serveur.js
const express = require('express');     
const app = express();                  

// Middleware pour 
app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !' }); 
 });

// Middleware pour analyser les requêtes JSON
app.use(express.json());

module.exports = app;   //exporter app pour y accèder depuis d'autres fichiers 

