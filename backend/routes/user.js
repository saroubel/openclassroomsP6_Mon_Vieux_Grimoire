//Routes

const express = require('express')         
const router = express.Router()             
const userCtrl = require('../controllers/user') 


router.post('/signup', userCtrl.signup)     //route pour inscription     
router.post('/login', userCtrl.login)       //route pour connexion


module.exports = router
