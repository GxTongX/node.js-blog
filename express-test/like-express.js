const http = require("http");
const slice = Array.prototype.slice;

class likeExpress {
    constructor(){
        //存放中间件列表
        this.routes = {
            use: [], //app.use(...)
            get: [], //app.get(...)
            post: [], //app.post(...)
            ug: [],//use+get
            up: [],//use+post
        }
    }

    register(path){
        const info = {};
        if(typeof path === "string"){
            info.path = path;
            // 从第二个参数开始，转换为数组存入stack
            info.stack = slice.call(arguments, 1);
        }else{
            info.path = "/";
            // 从第一个参数开始，转换为数组存入stack
            info.stack = slice.call(arguments, 0);
        }
        return info;
    }

    use(){
        const info = this.register.apply(this, arguments);
        this.routes.use.push(info);
        this.routes.ug.push(info);
        this.routes.up.push(info);
    }

    get(){
        const info = this.register.apply(this, arguments);
        this.routes.get.push(info);
        this.routes.ug.push(info);
    }

    post(){
        const info = this.register.apply(this, arguments);
        this.routes.post.push(info);
        this.routes.up.push(info);
    }

    match(method, url){
        let stack = [];
        if(url == "/favicon.ico"){
            return stack;
        }

        //获取routes
        // let curRoutes = [];
        // curRoutes = curRoutes.concat(this.routes.use);
        // curRoutes = curRoutes.concat(this.routes[method]);
        let curRoutes;
        if(method == "get"){
            curRoutes = this.routes.ug;
        }else{
            curRoutes = this.routes.up;
        }

        curRoutes.forEach(route => {
            if(url.indexOf(route.path) == 0){
                stack = stack.concat(route.stack);
            }
        })
        return stack;
    }

    //核心的next机制
    handle(req, res, stack){
        const next = () => {
            //拿到第一个匹配的中间件
            const middleware = stack.shift();
            if(middleware){
                middleware(req, res, next);
            }
        }
        next()
    }

    callback(){
        return (req, res) => {
            res.json = (data) => {
                res.setHeader("Content-Type", "application/json");
                res.end(
                    JSON.stringify(data)
                )
            }
            const url = req.url;
            const method = req.method.toLowerCase();

            const resultList = this.match(method, url);
            console.log(resultList.length)
            this.handle(req, res, resultList);
        }
    }

    listen(...args){
        const server = http.createServer(this.callback());
        server.listen(...args);
    }


}

//工厂函数
module.exports = () => {
    return new likeExpress
}