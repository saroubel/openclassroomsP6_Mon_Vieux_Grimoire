//Controller

const Book = require('../models/book')


// Création d'un nv livre
exports.createBook = (req, res, next) => {
  try {
    //Reception des infos du corps de la requête
    const bookObject = JSON.parse(req.body.book) //json.parse(): transforme un string en objet

    //supprimer les infos inutiles pour éviter les modifications non souhaitées
    delete bookObject._id
    delete bookObject._userId

    //Crée nv objet Book avec les info reçues
    const book = new Book({
      ...bookObject,                //spread operator pour copie tout les info de l'objet
      userId: req.auth.userId,      //auth middleware pour sécuriser la route d'ajout juste pour l'utilisateur connecté
      imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null 
    })

    //Sauvegarde livre dans BD
    book.save()     
      .then(() => res.status(201).json({ message: 'Livre est sauvegardé avec succès !' }))
      .catch(error => res.status(400).json({ error: error.message }))

  } catch (error) {
    res.status(400).json({ error: 'Données invalides' })
  }
}