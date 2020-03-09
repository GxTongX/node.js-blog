const blogRouter = require("./src/router/blog");
const userRouter = require("./src/router/user");
const { access } = require("./src/utils/log");
const queryString = require("querystring");
const { get, set } = require('./src/db/redis');

//获取过期时间
const cookieExpires = () => {
    var d = new Date();
    console.log(d)
    d.setTime(d.getTime() + 24*60*60*1000);
    console.log(d)
    console.log(" d.toGMTString...", d.toGMTString())
    return d.toGMTString();
}

//session数据
// const SESSION_DATA = {};

//用于处理postData
const getPostData = (req) => {
    const promise = new Promise((resolve,reject) => {
        if(req.method !== "POST"){
            resolve({});
            return ; 
        }
        if(req.headers["content-type"] != "application/json"){
            resolve({});
            return ;
        }
        let postData = "";
        req.on("data",chunk => {
            postData += chunk.toString();
        })
        req.on("end",() => {
            if(!postData){
                resolve({});
                return ;
            }else{
                resolve(
                    JSON.parse(postData)
                )
            }
        })
    })
    return promise;
}

const startServer = (req,res)=>{
    //记录access log
    access(`${Date.now()} -- ${req.method} -- ${req.url} -- ${req.headers['user-agent']}`)

    //设置返回格式为json
    res.setHeader("content-type","application/json");

    //获得path和query
    const url = req.url;
    req.path = url.split("?")[0];
    req.query = queryString.parse(url.split("?")[1]);

    //获得cookie
    req.cookie = {};
    const cookieStr = req.headers.cookie || "";
    cookieStr.split(";").forEach(item => {
        if(!item){
            return ; 
        }
        let arr = item.split("=");
        let key = arr[0].trim();
        let val = arr[1];
        req.cookie[key] = val;
    });
    //解析session
    // let needSetCookie = false;
    // let userId = req.cookie.userid;
    // if(userId){
    //     if(!SESSION_DATA[userId]){
    //         SESSION_DATA[userId] = {};
    //     }
    // }else{
    //     needSetCookie = true;
    //     userId = `${Date.now()}_${Math.random()}`;
    //     SESSION_DATA[userId] = {};
    // }
    // req.session = SESSION_DATA[userId];

    // 解析 session （使用 redis）
    let needSetCookie = false;
    let userId = req.cookie.userid;
    if(!userId){
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`;
        // 初始化 redis 中的 session 值
        set(userId, {})
    }
    // 获取 session
    req.sessionId = userId;

    //判断该userId和sessionId在redis里有没有
    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            // 初始化 redis 中的 session 值
            set(req.sessionId, {})
            // 设置 session
            req.session = {}
        } else {
            // 设置 session
            req.session = sessionData
        }

        // 处理 post data
        return getPostData(req)
    }).then(postData => {
        req.body = postData;

        //处理blog路由
        // const blogData = blogRouter(req,res);
        // if(blogData){
        //     res.end(
        //         JSON.stringify(blogData)
        //     )
        //     return ;
        // }
        const blogResult = blogRouter(req,res);
        if(blogResult){
            blogResult.then(blogData => {
                if(needSetCookie){
                    res.setHeader('set-Cookie',`userid=${userId};path=/;httpOnly;expires=${cookieExpires()}`)
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return ;
        }

        //处理user路由
        const userRusult = userRouter(req,res);
        if(userRusult){
            userRusult.then(userData => {
                if(needSetCookie){
                    res.setHeader('set-Cookie',`userid=${userId};path=/;httpOnly;expires=${cookieExpires()}`)
                }
                res.end(
                    JSON.stringify(userData)
                )
            })
            return ;
        }

        //未命中路由返回404
        res.writeHead(404 , {"content-type":"text/plain"});
        res.write("404 not found");
        res.end();
    })


}
module.exports = startServer;