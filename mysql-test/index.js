const mysql = require("mysql");

//创建链接对象
const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"gx123",
    port:"3306",
    database:"myblogs"
})

//开始连接
con.connect();

//执行sql
const sql = `insert into blogs (title,content,createtime,author) values ('标题c','内容c',87987,'zhangsan')`;
// const sql = `update users set realname="李四" where username="lisi"`;
con.query(sql,(err,result) =>{
    if(err){
        console.log(err);
        return ;
    }
    console.log(result);
})

//关闭连接
con.end()