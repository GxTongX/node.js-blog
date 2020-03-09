const { ErrorModel } = require("../model/resModel");

module.exports = (req, res, next) => {//中间件
    if(!req.session.username){
        res.json(new ErrorModel("未登录"))
    }else{
        next()
    }
}