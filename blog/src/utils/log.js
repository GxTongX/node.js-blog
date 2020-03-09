const fs = require("fs");
const path = require("path");

// //写日志
// function writeLog(writeStream, log){
//     writeStream.write(log+"\n") //关键代码
// }

//生成writeStream
function creatWriteStream(fileName){
    const fullFileName = path.resolve(__dirname,"../","../","logs/",fileName);
    const writeStream = fs.createWriteStream(fullFileName, {
        flags:"a" //flags!!!
    })
    return writeStream;
}

//写访问日志
const accessWriteStream = creatWriteStream("access.log");
function access(log){
    accessWriteStream.write(log + "\n")
}

module.exports = {
    access
}