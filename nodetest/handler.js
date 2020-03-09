var fs = require('fs')

function home(response) {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    fs.createReadStream(__dirname + "/index.html", "utf8").pipe(response);
}

function json(response,params) {
    // console.log(params)
    response.writeHead(200, {
        'Content-Type': 'application/json'
    });
    response.end(JSON.stringify(params));
}

module.exports = {
    home: home,
    json: json
}