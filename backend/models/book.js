//Models

const mongoose = require('mongoose');                                   //pour interagir avec MongoDB


//création du schéma livre qui contient les champs
const bookSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [{
    userId: { type: String, required: true },
    grade: { type: Number, min: 1, max: 5, required: true } // Note entre 1 et 5
  }],
  averageRating: { type: Number, default: 0 } // Note moyenne
})


//mise à jour de la note moyenne
bookSchema.methods.updateAverageRating = function () {
  //somme = cummul des notes + note , initialiser à 0
  const sum = this.ratings.reduce((accumulator, rating) => accumulator + rating.grade, 0); 
  //moyenne = si il y a des notes, (la somme des notes / nombre de notes) , sinon 0
  this.averageRating = this.ratings.length ? sum / this.ratings.length : 0;
}


//exporter schéma en tant que modèle Mongoose pour créer et manipuler les doc de la collection Book 
module.exports = mongoose.model('Book', bookSchema)