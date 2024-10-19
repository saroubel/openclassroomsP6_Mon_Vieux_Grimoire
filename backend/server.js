const http = require('http');

const server = http.createServer((req, res) => {
    res.end('welcome to the server');
});

server.listen(process.env.PORT || 3000);