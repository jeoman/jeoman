let fs = require('fs');
fs.mkdir('./ch4', 0666, (err)=>{
    if(err) throw err;
    console.log('새로운 ch4 폴더를 만들었습니다.');

    // fs.rmdir('./docs', (err)=>{
    //     console.log('docs 폴더를 삭제했습니다.')
    // })
})