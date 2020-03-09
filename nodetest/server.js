var http = require("http");
var url = require("url");
var querystring = require('querystring')

function startServer(route,handle){
    http.createServer(function(request,response){
        var pathname = url.parse(request.url,true).pathname;
        console.log("server request "+pathname);
        var data = ""
        request.on("error", function (error) {
            console.error(error)
        }).on("data", function (chunk) {
            data += chunk
        }).on("end", function () {
            if (request.method === "POST") {
                if (data.length > 1e6) {
                    request.connection.destroy() // 如果数据很大，就断开
                }
                console.log(data)
                route(handle, pathname, response, querystring.parse(data))
            } else {
                var params = url.parse(request.url, true).query
                route(handle, pathname, response, params)
            }
            
            // 或者
            // var data = []
            // data.push(chunk)
            // data = Buffer.concat(data).toString()
        })
    }).listen(3000,"127.0.0.1");
}
module.exports.startServer = startServer;