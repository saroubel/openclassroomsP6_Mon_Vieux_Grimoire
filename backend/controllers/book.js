//Controller

const Book = require('../models/book')
const fs = require('fs')                    //file system pour la suppression des images sauvegardées



//Création d'un nouveau livre//
exports.createBook = (req, res, next) => {
  try {
    //Reception des infos du corps de la requête
    const bookObject = JSON.parse(req.body.book)                                                         //json.parse(): transforme un string en objet

    //supprimer les infos inutiles
    delete bookObject._id
    delete bookObject._userId

    //Crée nv objet Book avec les info reçues
    const book = new Book({
      ...bookObject,                                                                                     //spread operator pour copie tout les info de l'objet
      userId: req.auth.userId,                                                                           //auth middleware pour sécuriser la route d'ajout juste pour user connecté
      imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null     //req.protocol pour obtenir le premier segment http
                                                                                                         //req.get('host') pour obtenir l'adresse du serveur (localhost:3000)
    })

    //Sauvegarde livre dans BD
    book.save()     
      .then(() => res.status(201).json({ message: 'Livre est sauvegardé avec succès !' }))
      .catch(error => res.status(400).json({ error: error.message }))

  } catch (error) {
    res.status(400).json({ error: 'Données invalides' })
  }
}



//Affichage d'un livre par son id//
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })                                                //findOne(): méthode de moongoose pour chercher dans BD
      .then(book => {                                                                   //req.params.id: ID du livre passé dans l'URL de la requête
        if (!book) return res.status(404).json({ message: 'Livre non trouvé!' })        
        res.status(200).json(book)                                                      //200: renvoie le livre trouvé
      })
      .catch(error => res.status(500).json({ error: error.message }))
}



//Affichage de tous les livres//
exports.getAllBooks = (req, res, next) => {
    Book.find()
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({ error: error.message }))
}



//Affichage des livres les mieux notés//
exports.getBestRating = (req, res, next) => {
    console.log('Récupération des livres les mieux notés')
    Book.find()
    .sort({ averageRating: -1 })                                    //Afficher les livres par note moyenne décroissante
    .limit(3)                                                       //Limite résultat aux 3 premiers livres
    
    .then(books => {
        console.log('Livres récupérés avec succès', books)
        res.status(200).json(books)                             
      })

    .catch(error => {
        console.error('Erreur lors de la récupération des livres les mieux notés', error)
        res.status(500).json({ error: error.message })
    })
}


  
//Modification d'un livre// 
exports.updateBook = async (req, res, next) => {
    try {
        //* Préparation des nouvelles données du livre
        const bookObject = req.file ? {
            ...JSON.parse(req.body.book),                                                           //json.parse(): Transforme la chaîne JSON en objet
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`            //Sinon utilise les données du body
        } : { ...req.body };                                                                        

        //* Suppression des infos inutiles
        delete bookObject._userId;

        //* Recherche du livre dans BD  
        const book = await Book.findOne({ _id: req.params.id });                                    //await pour attendre la promesse d'une fonction async
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé!' })
        }
        if (book.userId !== req.auth.userId) {
            return res.status(401).json({ message: 'Utilisateur non autorisé' })
        }

        //* Gestion des notes 
        if (bookObject.rating && bookObject.userId) {

            //converti la note en nombre
            const grade = Number(bookObject.rating); 

            //verification que la note doit être comprise entre 1 et 5
            if (grade < 1 || grade > 5) { 
                return res.status(400).json({ message: "La note doit être comprise entre 1 et 5." })
            }

            //recherche si l'utilisateur a déja noté, modifier la note existante sinon ajouter une nouvelle
            const existingRating = book.ratings.findIndex(r => r.userId.toString() === bookObject.userId)
            if (existingRating > -1) {
                book.ratings[existingRating].grade = grade
            } else {
                book.ratings.push({ userId: bookObject.userId, grade })
            }

            //Recalcul la moyenne des notes = somme des notes / nombre de notes
            const totalGrade = book.ratings.reduce((accum, currentValue) => accum + currentValue.grade, 0)
            book.averageRating = parseFloat((totalGrade / book.ratings.length).toFixed(1))                              //parseFloat() avec toFixed(): Reconvertit le résultat en nombre avec 1 chiffre aprés la virgule
        }

        //* Gestion de l'image
        if (req.file && book.imageUrl) { 
            //si la nouvelle img a été téléchargée , supprime l'ancienne img du serveur
            const oldImagePath = book.imageUrl.split('/images/')[1]
            fs.unlink(`images/${oldImagePath}`, err => {
                if (err) console.error(`Erreur lors de la suppression de l'ancienne image: ${err.message}`)
            })
        }

        //* Mise à jour du livre
        Object.assign(book, bookObject);                                                    //assign(): copie tout les info de l'objet bookObject dans book
        await book.save();               
        res.status(200).json({ message: 'Livre modifié!', book });

    } catch (error) {
        console.error("Erreur dans updateBook:", error)
        res.status(500).json({ error: error.message })
    }
}



//Suppression d'un livre//
exports.deleteBook = (req, res, next) => {

    //* Recherche du livre dans BD
    Book.findOne({ _id: req.params.id })
      .then(book => {
        if (!book) return res.status(404).json({ message: 'Livre non trouvé!' })
        if (book.userId !== req.auth.userId) return res.status(401).json({ message: 'Non autorisé' });

        //* Suppression de l'image
        const filename = book.imageUrl.split('/images/')[1] //recup nom de fichier grâce à split 
        fs.unlink(`images/${filename}`, err => {
          if (err) {
            console.error(`Erreur lors de la suppression de l'image: ${err.message}`)
            return res.status(500).json({ error: 'Erreur lors de la suppression de l\'image' })
          }
  
          //* Suppression du livre
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Livre supprimé' }))
            .catch(error => res.status(400).json({ error: `Erreur lors de la suppression du livre: ${error.message}` }))
        });
      })

      .catch(error => res.status(500).json({ error: `Erreur lors de la recherche du livre: ${error.message}` }))
  }



//Notation d'un livre//