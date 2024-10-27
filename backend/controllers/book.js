//Controller

const Book = require('../models/book')
const fs = require('fs')                    //file system pour la suppression des images sauvegardées


//Création d'un nouveau livre//
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
      userId: req.auth.userId,      //auth middleware pour sécuriser la route d'ajout juste pour user connecté
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
        res.status(200).json(book)                                                      //200 : renvoie le livre trouvé
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
    .sort({ averageRating: -1 })                                //Trie les livres par note moyenne décroissante, averageRating=note moyenne
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


  
//Modification d'un livre// 
exports.updateBook = async (req, res, next) => {
    try {
        //Préparation des nouvelles données du livre
        const bookObject = req.file ? {
            ...JSON.parse(req.body.book),                                                       //json.parse(): Transforme la chaîne JSON en objet
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`        //url de l'image
        } : { ...req.body };                                                                    //Sinon utilise les données du body

        delete bookObject._userId;

        //Recherche du livre dans BD  
        const book = await Book.findOne({ _id: req.params.id });                                //await pour attendre la promesse d'une fonction async
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé!' })
        }
        if (book.userId !== req.auth.userId) {
            return res.status(401).json({ message: 'Utilisateur non autorisé' })
        }

        //Gestion des notes 
            //Si on a une note et user , convertir la note en nombre
            //Si la note n'est pas entre 1 et 5 , renvoie une erreur
        if (bookObject.rating && bookObject.userId) {
            const grade = Number(bookObject.rating);
            if (grade < 1 || grade > 5) {
                return res.status(400).json({ message: "La note doit être comprise entre 1 et 5." })
            }


            //Trouvé si User a déjà noté ce livre , modifier la note existante sinon ajouter une nouvelle
            const existingRatingIndex = book.ratings.findIndex(r => r.userId.toString() === bookObject.userId)
            if (existingRatingIndex > -1) {
                book.ratings[existingRatingIndex].grade = grade
            } else {
                book.ratings.push({ userId: bookObject.userId, grade })
            }

            //Recalcul de la moyenne des notes
                //reduce: sommer toutes les notes 
                //parseFloat: Reconvertit le résultat en nombre 
                //toFixed: arrondir à 1 chiffre aprés la virgule 
            const totalGrade = book.ratings.reduce((accum, currentValue) => accum + currentValue.grade, 0)
            book.averageRating = parseFloat((totalGrade / book.ratings.length).toFixed(1))
        }

        //Mise à jour du livre
        Object.assign(book, bookObject);                                    //assign(): copie tout les info de l'objet bookObject dans book
        await book.save();               

        // Gestion de l'image
            //si la nouvelle img a été téléchargée , supprime l'ancienne img du serveur par fonction unlink()
        if (req.file && book.imageUrl) {
            const oldImagePath = book.imageUrl.split('/images/')[1]
            fs.unlink(`images/${oldImagePath}`, err => {
                if (err) console.error(`Erreur lors de la suppression de l'ancienne image: ${err.message}`)
            })
        }

        res.status(200).json({ message: 'Livre modifié!', book })
    } catch (error) {
        console.error("Erreur dans updateBook:", error)
        res.status(500).json({ error: error.message })
    }
}

