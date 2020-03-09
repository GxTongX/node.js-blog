const { exec } = require("../db/mysql");
const xss = require("xss");
const getList = async (author,keyword) => {
    let sql = `select * from blogs where 1=1 `;
    if(author){
        sql += `and author='${author}' `
    }
    if(keyword){
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc`;
    console.log(sql)
    //返回promise
    return await exec(sql);
}

const getDetail = async (id) => {
    let sql = `select * from blogs where id='${id}' `;
    console.log(sql);
    const rows = await exec(sql);
    return rows[0]
    //返回promise
    // return await exec(sql).then(rows => {
    //     return rows[0]
    // })
}

const newBlog = async (blogData = {}) => {
    //blogData是一个博客对象
    const author = blogData.author;
    const title = xss(blogData.title);
    const content = xss(blogData.content);
    const createtime = Date.now();
    let sql = `insert into blogs (title,content,createtime,author) values ('${title}','${content}',${createtime},'${author}')`;
    console.log(sql);
    const insertId = await exec(sql);
    return {
        id: insertId
    }
    // return await exec(sql).then(insertData => {
    //     return {
    //         id:insertData.insertId
    //     }
    // })
}

const updateBlog = async (id,blogData = {}) => {
    //id就是要更新的博客
    const title = blogData.title;
    const content = blogData.content;
    let sql = `update blogs set title='${title}',content='${content}' where id=${id}`
    console.log(sql);
    const updateData = await exec(sql);
    if(updateData.affectedRows > 0){
        return true
    }else{
        return false
    }
}

const delBlog = async (id,author) => {
    //id就是要删除的id
    const sql = `delete from blogs where id=${id} and author='${author}'`
    console.log(sql);
    const deleteData = await exec(sql);
    if(deleteData.affectedRows > 0){
        return true
    }else{
        return false
    }
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}