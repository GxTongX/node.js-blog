var express = require('express');
var router = express.Router();
const { login } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../model/resModel");

router.post('/login', function (req, res, next) {
    const { username,password } = req.body;
    const result = login(username,password);
    result.then(data => {
        if(data.username){
            //登录成功设置session 会自动同步到redis因为express-session
            req.session.username = data.username;
            req.session.realname = data.realname;
            res.json(new SuccessModel());
        }else{
            res.json(new ErrorModel("登录失败"));
        }
    })
});

router.get('/login-test', function (req, res, next) {
    if(req.session.username){
        res.json({
            error: 0,
            msg: "已经登录"
        })
    }else{
        res.json({
            error: 1,
            msg: "未登录"
        })

    }
})

// router.get('/session-test', function (req, res, next) {
//     const session = req.session;
//     if(session.viewNum == null){
//         session.viewNum = 0;
//     }
//     session.viewNum++;
//     res.json({
//         viewNum: session.viewNum,
//         seesion: session
//     })
// });

module.exports = router;