//Routes

const express = require('express')         
const router = express.Router()             
const userCtrl = require('../controllers/user') 


//Post Routes
router.post('/signup', userCtrl.signup)     //route pour inscription     
router.post('/login', userCtrl.login)       //route pour connexion


//GET Routes 
router.get('/users', userCtrl.getUsers)     //liste des utilisateurs dans la BD



module.exports = router
