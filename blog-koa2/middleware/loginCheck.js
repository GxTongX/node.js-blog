const { ErrorModel } = require("../model/resModel");

module.exports = async (ctx, next) => {//中间件
    if(!ctx.session.username){
        ctx.body = new ErrorModel("未登录")
    }else{
        await next()
    }
}