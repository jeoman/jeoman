module.exports = function(){
    var express = require('express');
    var session = require('express-session');
    var bodyParser = require('body-parser');
    var MySQLStore = require('express-mysql-session')(session);
    
    var app = express();
    
    app.set('view engine', 'jade');
    app.set('views', './views')
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(session({
        secret : '129j0219jfh',
        resave : false,
        saveUninitialized : true,
        store : new MySQLStore({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '920326',
            database: 'o2'
        })
    }));
    return app;
}
