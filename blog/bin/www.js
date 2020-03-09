const http = require("http");
const startServer = require("../app");
const port = 8000;
const server = http.createServer(startServer)
server.listen(port);
console.log("ok")
