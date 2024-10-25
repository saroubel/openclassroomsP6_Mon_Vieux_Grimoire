//la configuration qui facilite la gestion des téléchargements de fichiers

const multer = require('multer')    //module pour télécharger des fichiers

//Configuration des types MIME
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
}

//Configuration du stockage pour multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => { callback(null, 'images') },   //Où le fichier sera stocké
                                                                        //callback pour indiquer quand l'opération est terminée
  filename: (req, file, callback) => {                                  
    const name = file.originalname.split(' ').join('_')                 //Nom du fichier, Remplace les espaces par des underscores
    const extension = MIME_TYPES[file.mimetype]                         //Extension basée sur le type MIME
    callback(null, name + Date.now() + '.' + extension)
  }
})


//Création de l'objet upload avec la configuration de stockage pour l'utilisation dans les routes
const upload = multer({ storage: storage })


module.exports = {upload}