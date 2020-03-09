const fs = require("fs");
const path = require("path");

const fileName = path.resolve(__dirname, "data.txt");

//读取文件内容
// fs.readFile(fileName, (err, data) => {
//     if(err){
//         console.log(err);
//         return ;
//     }
//     //data是二进制，需要转换为字符串
//     console.log(data);
//     console.log(data.toString());
// })


//写文件
var content = `\n这是新加的内容`;
const opt = {
    flag : "a" //追加写入  覆盖用"w""
}
fs.writeFile(fileName, content, opt, (err) => {
    if(err){
        console.log(err);
        
    }
})

//判断文件是否存在
// fs.exists(fileName, (exist) => {
//     console.log(exist);
    
// })