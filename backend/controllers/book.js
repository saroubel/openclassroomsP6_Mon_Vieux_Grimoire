//Controller

const Book = require('../models/book')


//Création d'un nouveau livre
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



//Affichage d'un livre par son id
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })                                                //findOne(): méthode de moongoose pour chercher dans BD
      .then(book => {                                                                   //req.params.id: ID du livre passé dans l'URL de la requête
        if (!book) return res.status(404).json({ message: 'Livre non trouvé!' })        
        res.status(200).json(book)                                                      //200 : renvoie le livre trouvé
      })
      .catch(error => res.status(500).json({ error: error.message }))
  }



//Affichage de tous les livres
exports.getAllBooks = (req, res, next) => {
    Book.find()
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({ error: error.message }))
  }



//Affichage des livres les mieux notés
exports.getBestRating = (req, res, next) => {
    console.log('Récupération des livres les mieux notés')
    Book.find()
    .sort({ averageRating: -1 })                                //Trie les livres par note moyenne décroissante
    .limit(3)                                                   //Limite résultat aux 3 premiers livres
      
    .then(books => {
        console.log('Livres récupérés avec succès', books)
        res.status(200).json(books)                             //Envoie les livres 
      })

    .catch(error => {
        console.error('Erreur lors de la récupération des livres les mieux notés', error)
        res.status(500).json({ error: error.message })
    })
  }