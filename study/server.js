var express = require('express');
var path = require('path');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var app = express();
var db = require('./db.js');
var route = require('./route.js');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
db(); // db 불러오기
app.use(express.static(path.join(__dirname, 'views')));
app.use('/', route);
// 에러처리 부분
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.listen(8080, () =>{
    console.log('Express App on port 8080');
});