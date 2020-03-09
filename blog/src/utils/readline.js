const fs = require("fs");
const path = require("path");
const readline = require("readline");

//文件名
const fileName = path.resolve(__dirname,"../","../","logs/","access.log");


//创建read stream
const readStream = fs.createReadStream(fileName);

//创建readline对象
const rl = readline.createInterface({
    input:readStream
})

let mozillaNum = 0;
let sum = 0;

//逐行读取
rl.on("line", (lineData) => {
    if(!lineData){
        return ;
    }
    //总数
    sum++;
    const arr = lineData.split(" -- ");
    if(arr[3] && arr[3].indexOf("Mozilla") >= 0){
        mozillaNum++;
    }
})

//监听读取完成
rl.on("close",() => {
    console.log("mozilla 占比：" + mozillaNum/sum*100 +"%")
})