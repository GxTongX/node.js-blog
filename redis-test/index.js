const redis = require("redis");

//创建客户端
const redisClient = redis.createClient(6379,"127.0.0.1");
redisClient.on("error", err => {
    console.log(err)
})

//测试
redisClient.set("id","132131",redis.print);
redisClient.get("id", (err, val) => {
    if(err){
        console.log("error is ", err);
        return;
    }
    console.log("val is ", val);
    redisClient.quit();
})