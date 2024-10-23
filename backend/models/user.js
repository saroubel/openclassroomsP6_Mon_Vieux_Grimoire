//Models

const mongoose = require('mongoose')                                   //pour interagir avec MongoDB
const uniqueValidator = require('mongoose-unique-validator')           //plugin pour valider les champs uniques


//création du schéma utilisateur qui contient les champs 
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});


//appliquer le plugin au schéma
userSchema.plugin(uniqueValidator)


//exporter schéma en tant que modèle Mongoose pour créer et manipuler les doc de la collection User
module.exports = mongoose.model('User', userSchema)

