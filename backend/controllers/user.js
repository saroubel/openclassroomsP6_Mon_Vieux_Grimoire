//Controllers

const User = require('../models/user')             //pour interagir avec la BD
const bcrypt = require('bcrypt')                   //module pour le hachage du mdp avec une technique "salage"
const jwt = require('jsonwebtoken')                //module pour la création et vérification des tokens JWT
require('dotenv').config({ path: ".env" })         //chargement des var d'environnement depuis .env


//validation de l'email//
const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }



//inscription//
exports.signup = (req, res, next) => {
    
    //Récupèration mail et mdp du corps de la requête
    const { email, password } = req.body 
  
    //Vérification si mail est valide
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Email invalide !' })
    }
  
    //Hachage du mdp avant l'enregistrer dans BD
    bcrypt.hash(password, 10)                               //10: nombre de fois que le mdp sera hacher
      .then(hash => {
        const user = new User({ email, password: hash })    //Création nv user 
        user.save()                                         //Sauvegarde user dans BD
          .then(() => res.status(201).json({ message: 'Utilisateur est créé avec succès !' }))
          // .catch(error => res.status(400).json({ error: 'Erreur lors de la création de l\'utilisateur' }))
          .catch(error => {console.error('Erreur lors de la création de l\'utilisateur:', error)
            res.status(400).json({ error: 'Erreur lors de la création de l\'utilisateur' })
          })
      })
      .catch(error => res.status(500).json({ error: 'Erreur serveur lors de l\'hachage du mot de passe.' }))
  }


//liste des utilisateurs//
exports.getUsers = (req, res, next) => {
    User.find()
      .then(users => res.status(200).json(users))
      .catch(error => res.status(400).json({ error: 'Erreur lors de la recherche des utilisateurs.' }))
}


//connexion//
exports.login = (req, res, next) => {
    const { email, password } = req.body 

    //Recherche user par mail dans BD
    User.findOne({ email })
      .then(user => {
        if (!user) { //si user n'existe pas 
          return res.status(401).json({ error: 'Utilisateur non trouvable !' })
        }

        //Comparaison entre mdp saisie et mdp de bcrypt
        bcrypt.compare(password, user.password)
          .then(valid => {
            if (!valid) { 
              return res.status(401).json({ error: 'Mot de passe incorrect !' })
            }
            //Si mdp correct, renvoi userId et token JWT signé
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },       
                process.env.JWT_SECRET,     // Clé secrète pour signer token, chargée depuis var d'environnement
                { expiresIn: '24h' })       // Durée de validité du token
            })
          })
          .catch(error => res.status(500).json({ error: 'Erreur serveur lors de la comparaison du mot de passe.' }))
      })
      .catch(error => res.status(500).json({ error: 'Erreur serveur lors de la recherche de l\'utilisateur.' }))    
}