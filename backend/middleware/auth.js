//Middleware authentification de l'utilisateur pour sécuriser les routes dans l'API

const jwt = require('jsonwebtoken')             //pour la gestion des tokens JWT
require("dotenv").config({ path: ".env" })



module.exports = (req, res, next) => {
  try {

     //Vérifie si le header Authorization est présent
    if (!req.headers.authorization) return res.status(401).json({ error: 'Requête non authentifiée!' })


    //Récupère le token depuis le header Authorization
    const token = req.headers.authorization.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Token manquant!' }) 


    //Vérifie et décode le token avec jwt.verify()
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)          // Vérifie le token avec la clé secrète
    req.auth = { userId: decodedToken.userId }                              // Ajoute user id décodé à l'objet req.auth
    next() 
  } catch (error) {
    res.status(401).json({ error: 'Requête non authentifiée!' })
  }
}