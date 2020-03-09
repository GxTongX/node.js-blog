const http = require("http")

const server = http.createServer((req, res) => {
    //模拟日志
    console.log("current time.", Date.now())
    //模拟错误日志
    console.error("假装出错", Date.now());
    //模拟一个错误
    if(req.url == "/err"){
        throw new Error("/err 出错啦")
    }
    
    res.setHeader("Content-Type", "application/json");
    res.end(
        JSON.stringify({
            error: 0,
            msg: "pm2 test server 1"
        })
    )
})

server.listen(3000);
console.log("server is listening on port 3000")