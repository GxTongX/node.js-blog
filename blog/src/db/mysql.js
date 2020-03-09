const mysql = require("mysql");
const { MYSQL_CONF } = require("../conf/db");

//创建连接对象
const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"gx123",
    port:"3306",
    database:"myblogs"
});
// const con = mysql.createConnection(MYSQL_CONF);

//开始连接
con.connect();

//执行sql语句
function exec(sql){//有回调函数用promise
    const promise = new Promise((resolve,reject) => {
        con.query(sql,(err,result) =>{
            if(err){
                reject(err);
                return ;
            }
            resolve(result);
        })
    })
    return promise;
}

module.exports = {
    exec,
    escape : mysql.escape
}