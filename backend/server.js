// const http = require('http');
// const app = require('./app');

// app.set('port', process.env.PORT || 4000);
// const server = http.createServer(app);

// //serveur en ecoute soit variable d'environnement ou 4000 par defaut
// server.listen(process.env.PORT || 4000); 
// console.log('Server running on port 4000');


const http = require('http');
const app = require('./app');

// Fonction pour normaliser le port que l'application utilise
// elle renvoie port valide soit en format numérique ou chaine
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Définir le port de l'app dans les variables d'environnement ou 4000 par défaut
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

// Fonction pour gérer les erreurs lors du démarrage du serveur
    // Si l'erreur n'est pas liée à l'écoute du serveur, la propager
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port; //adress est une chaine ou un num de port
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' le port nécessite des privilèges élevés');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' le port est déjà utilisé');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Créer serveur HTTP avec l'app Express
const server = http.createServer(app);

// Gestion des event de l'erreur et l'écoute du serveur
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// Démarrer le serveur
server.listen(port);