let fs = require('fs');

//파일을 비동기식 IO로 읽어 들입니다.
fs.readFile('./package.json', 'utf8', (err, data)=>{   
    console.log(data);
})

console.log('프로젝트 폴더 안의 packge.json 파일을 읽도록 요청했습니다.');