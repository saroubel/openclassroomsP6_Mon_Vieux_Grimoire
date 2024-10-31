//la configuration qui facilite la gestion des téléchargements de fichiers

const multer = require('multer')
const fs = require('fs')         //biblio pour modif ou supp des fichiers - file system
const path = require('path')     //biblio pour les chemins de fichiers
const sharp = require('sharp')   //biblio pour l'optimisation des images




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
    callback(null, namefile + '.' + 'webp')               
            
  }
})


//Création de l'objet upload avec la configuration de stockage - utilisé dans les routes
const upload = multer({ storage: storage })



//Middleware pour optimiser les images
const optimizeImage = async (req, res, next) => { 

  // Vérifié la présence de fichier
  if (!req.file) return next(); 
  
  // Récupère Nom et Chemin du fichier téléchargé
  const { filename, path: filePath } = req.file; 

  try {
    // Chemin du fichier de sortie après l'optimisation
    const outputFilePath = path.join('images', `${path.parse(filename).name +Date.now()}.webp`)
    sharp.cache(false)        // Désactive le cache de sharp
    await sharp(filePath)     
      .resize({ width: 260 })
      .webp({ quality: 100 })
      .toFile(outputFilePath); //save résultat dans le chemin de sortie

    // Supprimer le fichier original
    fs.unlink(filePath, err => {
      if (err) console.error('Error Suppression de fichier original:', err)
    });

    // Mettre à jour le chemin et le nom du fichier dans la requête
    req.file.filename = path.basename(outputFilePath)  
    req.file.path = outputFilePath                     
    next();
  } catch (error) {
    next(error);
  }
}


module.exports = {upload, optimizeImage};
