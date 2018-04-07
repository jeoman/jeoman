let fs = require('fs');

//파일을 동기식 IO로 읽어 들입니다.
let data = fs.readFileSync('./package.json', 'utf8');

console.log(data);