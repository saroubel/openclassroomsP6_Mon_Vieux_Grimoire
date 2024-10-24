//Routes

const express = require('express')         
const router = express.Router()             
const userCtrl = require('../controllers/user') 


//Post Routes
router.post('/signup', userCtrl.signup)     //route pour inscription     
router.post('/login', userCtrl.login)       //route pour connexion



//GET Routes pour lister les utilisateurs dans la BD
router.get('/users', userCtrl.getUsers)



module.exports = router
