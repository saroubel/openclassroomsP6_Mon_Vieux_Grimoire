//Routes

const express = require('express')         
const router = express.Router()             
const bookCtrl = require('../controllers/book') 
const auth = require('../middleware/auth')


//POST Routes
router.post('/', auth, multer, bookCtrl.createBook)     //ajouter un livre
router.post('/:id/rating', auth, bookCtrl.rateBook)     //noter un livre


//GET Routes
router.get('/', bookCtrl.getAllBooks)                   //liste des livres
router.get('/:id', bookCtrl.getOneBook)                 //livre par id
router.get('/bestrating', bookCtrl.getBestRating)       //meilleurs livres par note


//PUT Routes
router.put('/:id', auth, bookCtrl.updateBook)           //modifier un livre par id


//DELETE Routes
router.delete('/:id', auth, bookCtrl.deleteBook)        //supprimer un livre par id


module.exports = router
