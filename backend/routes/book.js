//Routes

const express = require('express')         
const router = express.Router()             
const bookCtrl = require('../controllers/book') 
const auth = require('../middleware/auth')                      //middleware pour authentifier l'utilisateur
const { upload } = require('../middleware/multer-config')       //importation de la config multer

//POST Routes
router.post('/', auth, upload.single('image'), bookCtrl.createBook)     //ajouter un livre
// router.post('/:id/rating', auth, bookCtrl.rateBook)                     //noter un livre


//GET Routes
// router.get('/bestrating', bookCtrl.getBestRating)               //meilleurs livres par note
router.get('/:id', bookCtrl.getOneBook)                         //livre par id
// router.get('/', bookCtrl.getAllBooks)                           //liste des livres


//PUT Routes
// router.put('/:id', auth, upload.single('image'), bookCtrl.updateBook) //modifier un livre par id


//DELETE Routes
// router.delete('/:id', auth, bookCtrl.deleteBook)                //supprimer un livre par id


module.exports = router
