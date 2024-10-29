//la configuration qui facilite la gestion des téléchargements de fichiers

const multer = require('multer')    
const fs = require('fs');
// const path = require('path');

//Configuration des types MIME
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
}

//Configuration du stockage pour multer
const storage = multer.diskStorage({

  destination: (req, file, callback) => { callback(null, 'images') },   
                                                                
  filename: (req, file, callback) => {                                  
    const name = file.originalname.split(' ').join('_')                 
    const namefile = name.split('.')[0]
    callback(null, namefile + Date.now() + '.' + 'webp')                
  }
})


//Création de l'objet upload avec la configuration de stockage - utilisé dans les routes
const upload = multer({ storage: storage })


module.exports = {upload}