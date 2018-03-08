var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var bkfd2Password = require("pbkdf2-password");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var hasher = bkfd2Password();
var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '920326',
  database : 'o2'
});
conn.connect();
var app = express();
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
app.use(passport.initialize());
app.use(passport.session());

app.get('/count', function(req,res){
    if(req.session.count){
        req.session.count++;
    } else {
        req.session.count =1;
    }
    res.send('count : '+req.session.count)
});



var users = [{
        authId : 'local : jeo',
        username : 'jeo',
        password : 'nvt/rs3CwyjEkyUdI7k69jcKR0TGXQ8P8KYUnhlcgXq/ZeQcHnSbuN59Yi80+0XwdlZRIJUSBGNPX6M4kryen1dvssMM1Ipbpx3GnlQ5HgAWCBUL1I1W9Yj948RoiojdR/SZIGpOMlTmWoLbq2K14AkO3N+ZQkzeuvhJexVPgNY=',
        salt : 'Kp5aON7/CEgGDuQpoY80PgsyjbFqQBxCVP+94NcmZE0u0k6Yt5T4n36+VFLGKkZVUbnjYm+JyvRZWc4JJrA62w==',
        displayName : 'Jeo'     
    }
];

app.get('/auth/login', function(req,res){
    var output = `
    <h1>Login</h1>
    <form action = "/auth/login" method = "post">
        <p><input type ="text" name ="username" placeholder="username"></p>
        <p><input type="text" name="password" placeholder="password"></p>
        <p><input type = "submit"></p>
    </form>
    <a href="/auth/facebook">facebook</a>
    `;
    res.send(output);
});

passport.serializeUser(function(user, done) {
    done(null, user.authId);
  });
  
passport.deserializeUser(function(id, done) {
    var sql = 'SELECT * FROM users WHERE authId=?';
    conn.query(sql, [id], function(err, results){
        console.log(sql, err, results);
    })
    // for(var i =0; i<users.length;i++){
    //     var user = users[i];
    //     if(user.authId === id){
    //         return  done(null, user);
    //     }
    // }
    // done('There is no user.')
});
 
passport.use(new LocalStrategy(
    function(username, password, done){
        var uname = username;
        var pwd = password;
        var sql = 'SELECT * FROM users WHERE authId=?';
        conn.query(sql, ['local:'+uname], function(err, results){
            if(err){
                return done('There is no user.');
            } 
            var user = results[0];
            return hasher({password :pwd, salt :user.salt}, function(err,pass,
            salt,hash){
                if(hash === user.password){
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        });
    }
));




app.post('/auth/login',
    passport.authenticate('local', { 
        successRedirect: '/welcome',
        failureRedirect: '/auth/login',
        failureFlash: false
    })
);



// app.post('/auth/login', function(req,res){
//     var uname = req.body.username;
//     var pwd = req.body.password;
//     for(var i =0; i<users.length;i++){
//         var user = users[i];
//         if(uname === user.username) {
//            return hasher({password :pwd, salt :user.salt}, function(err,pass,salt,hash){
//                 if(hash === user.password){
//                     req.session.displayName = user.displayName;
//                     req.session.save(function(){
//                         res.redirect('/welcome');
//                     })
//                 } else {
//                     res.send('Who are you? <a href="/auth/login">login</a>');
//                 }
//             });
//         }
// };
    
// });
        // if(uname === user.username && sha256(pwd+user.salt) === user.password){
        //     req.session.displayName = user.displayName;
        //     return req.session.save(function(){
        //         res.redirect('/welcome');
        //     });
        // } 



app.get('/welcome', function(req,res){
    if(req.user && req.user.displayName){
        res.send(`
            <h1>Hello, ${req.user.displayName}</h1>
            <a href="/auth/logout">Logout</a>
            `);
    } else {
        res.send(`
            <h1>Welcome</h1>
            <li><a href="auth/login">Login</a></li>
            <li><a href="/auth/register">Register</a></li>
        `);
    };
    
});

app.get('/auth/register', function(req,res){
    var output = `
    <h1>Register</h1>
    <form action = "/auth/register" method = "post">
        <p><input type ="text" name ="username" placeholder="username"></p>
        <p><input type="text" name="password" placeholder="password"></p>
        <p><input type="text" name="displayName" placeholder="displayName"></p>
        <p><input type = "submit"></p>
    </form>
    `;
    res.send(output);
});

app.post('/auth/register', function(req, res){
    hasher({password:req.body.password}, function(err, pass, salt, hash){
        var user = {
            authId : 'local'+req.body.username,
            username : req.body.username,
            password : hash,
            salt : salt,
            displayName : req.body.displayName
        };
        var sql = 'INSERT INTO users SET ?';
        conn.query(sql, user, function(err, results){
            if(err){
                console.log(err);
                res.status(500);
            } else {
                res.redirect('/welcome')
            }
        });
    // users.push(user);
    // req.login(user, function(err){
    //     req.session.save(function(){
    //         res.redirect('/welcome');
    // });
    //});
});
});
app.get('/auth/logout', function(){
    req.logout();
    req.session.save(function(){
        res.redirect('/welcome');
    })
})

app.listen(3003, function(){
    console.log('Connected 3003 port!!');
});