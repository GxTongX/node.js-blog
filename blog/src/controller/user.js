const { exec, escape } = require("../db/mysql");
const { genPassword } = require("../utils/cryp.js");
const login = (username,password) => {
    username = escape(username);

    //生成加密密码
    password = genPassword(password);

    password = escape(password);
    let sql = `select realname,username from users where username=${username} and password=${password}`;
    console.log(sql)
    return exec(sql).then(rows => {
        return rows[0] || {}
    })
}

module.exports = {
    login
}