const {  getList,getDetail,newBlog,updateBlog,delBlog } = require("../controller/blog");
const  { SuccessModel,ErrorModel, } = require("../model/resModel")

const loginCheck = (req) => {
    if(!req.session.username){
        return Promise.resolve(new ErrorModel("尚未登录"))
    }
}

const blogRouter = (req,res) => {
    const method = req.method;
     
    //获取博客列表
    if(method == "GET" && req.path == "/api/blog/list"){
        let author = req.query.author || "";
        const keyword = req.query.keyword || "";

        if(req.query.isadmin){
            //管理员界面
            const loginCheckResult = loginCheck(req);
            if(loginCheckResult){
                //未登录
                return loginCheckResult
            }
            //强制查询自己的博客
            author = req.session.username;
        }

        // const listData = getList(author,keyword);
        // return new SuccessModel(listData);
        const result = getList(author,keyword);
        return result.then((listData) => {
            return new SuccessModel(listData);
        })
    }
    
    //获取博客详情
    if(method == "GET" && req.path == "/api/blog/detail"){
        const id = req.query.id;
        // const data = getDetail(id);
        // return new SuccessModel(data);
        const result = getDetail(id);
        return result.then((data) => {
            return new SuccessModel(data);
        })
    }
    
    //新建一篇博客
    if(method == "POST" && req.path == "/api/blog/new"){
        const loginCheckResult = loginCheck(req);
        if(loginCheckResult){
            // 未登录
            return loginCheckResult;
        }
        // const data = newBlog(blogData);
        // return new SuccessModel(data);
        req.body.author = req.session.username;
        const result = newBlog(req.body);
        console.log("result.....",result)
        return result.then((data) => {
            return new SuccessModel(data);
        })
    }
    
    //更新一篇博客
    if(method == "POST" && req.path == "/api/blog/update"){
        const loginCheckResult = loginCheck(req);
        if(loginCheckResult){
            // 未登录
            return loginCheckResult;
        }
        const id = req.query.id;
        const result = updateBlog(id,req.body);
        return result.then(val => {
            if(val){
                return new SuccessModel()
            }else{
                return new ErrorModel("更新博客失败")
            }
        })
    }
    
    //删除一篇博客
    if(method == "POST" && req.path == "/api/blog/del"){
        const loginCheckResult = loginCheck(req);
        if(loginCheckResult){
            // 未登录
            return loginCheckResult;
        }
        const id = req.query.id;
        req.body.author = req.session.username;
        const result = delBlog(id,req.body.author);
        return result.then(val => {
            if(val){
                return new SuccessModel()
            }else{
                return new ErrorModel("删除博客失败")
            }
        })
    }
}

module.exports = blogRouter;