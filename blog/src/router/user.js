const { login } = require("../controller/user");
const  { SuccessModel,ErrorModel, } = require("../model/resModel");
const { set } = require("../db/redis")

const userRouter = (req,res) =>{
    const method = req.method;

    //登录
    if(method == "POST" && req.path == "/api/user/login"){
        const { username,password } = req.body;
        // const { username,password } = req.query;
        const result = login(username,password);
        return result.then(data => {
            if(data.username){
                //登录成功设置session
                req.session.username = data.username;
                req.session.realname = data.realname;
                // 同步到 redis
                set(req.sessionId, req.session)
                // console.log(req)
                // return new SuccessModel({req:req});
                return new SuccessModel();
            }else{
                return new ErrorModel("登录失败")
            }
        })
    }

    //登录测试
    // if(method == "GET" && req.path == "/api/user/loginTest"){
    //     // console.log(req)
    //     if(req.session.username){
    //         // return Promise.resolve(new SuccessModel({req:req}))
    //         return Promise.resolve(new SuccessModel({seesion:req.session}))
    //     }
    //     return Promise.resolve(new ErrorModel("登录失败"))

    // }
}

module.exports = userRouter;