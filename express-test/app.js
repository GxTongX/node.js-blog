const express = require("express");

//本次http请求实例
const app = express();

app.use((req, res, next) => {
    console.log("请求开始了。。。", req.method, req.url);
    next();
})

app.use((req, res, next) => {
    //假设处理cookie
    req.cookie = {
        userId: "123asd"
    }
    next();
})

app.use((req, res, next) => {
    //假设处理post data
    //异步
    setTimeout(() => {
        req.body = {
            a: 100,
            b: 200
        }
        next();
    })
})

app.use('/api', (req, res, next) => {
    console.log('处理 /api路由');
    next();
})

app.get('/api', (req, res, next) => {
    console.log('get /api路由');
    next();
})

app.post('/api', (req, res, next) => {
    console.log('post /api路由');
    next();
})

//模拟验证登录
function loginCheck(req, res, next){
    console.log("模拟登录成功");
    setTimeout(() => {
        next();
    })
    // console.log("模拟登录失败");
    // res.json({
    //     error: 1,
    //     msg: "登陆失败"
    // })
}

app.get('/api/get-cookie', loginCheck, (req, res, next) => {
    console.log('get /api/get-cookie路由');
    res.json({
        error: 0,
        data: req.cookie
    })
})

app.post('/api/get-post-data', (req, res, next) => {
    console.log('post /api/get-post-data路由');
    res.json({
        error: 0,
        data: req.body
    })
})

app.use((req, res, next) => {
    console.log("处理404");
    res.json({
        error: 1,
        msg: "not found 404"
    })
})

app.listen(3000, () => {
    console.log("server run port 3000");
    
})