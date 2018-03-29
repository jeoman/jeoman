module.exports = function(passport){
    var bkfd2Password = require("pbkdf2-password");
    var hasher = bkfd2Password();
    var conn = require('../config/db')();
    var route = require('express').Router();

    route.get('/', function(req,res){
        res.render('index', {
            title : 'Welcome to Daily'
        });
    });

    route.get('/login', function(req, res){
        res.render('login', {
            title : 'Login'
        });
    });


    route.post('/login',
        passport.authenticate('local', 
        { 
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash : false
        },
    ))


    route.get('/home', function(req, res){
        if(req.user && req.user.nick){
        res.render('home', {
            title : 'Hi! '+req.user.nick
        }
        );
        } else {
            res.redirect('/')
        }
    });

    route.get('/register', function(req, res){
        res.render('register', {
            title : 'Register'
        })
    });

    route.post('/register', function(req, res){
        hasher({password:req.body.password}, function(err,pass,salt,hash){
            var user = {
                authId:'local:'+req.body.username,
                name : req.body.username,
                password :hash,
                salt : salt,
                nick : req.body.nick
            };
            var sql = 'INSERT INTO caracter SET ?';
            conn.query(sql, user, function(err, results){
                if(err){
                    console.log(err);
                    res.status(500);
                } else {
                    req.login(user, function(err){
                    res.redirect('/home')
            })}
            })
        })
    });

    route.get('/facebook', 
        passport.authenticate('facebook', {
            authType : 'rerequest', 
            scope: ['public_profile', 'email']
        }
    ));
    route.get('/facebook/callback', 
        passport.authenticate('facebook', {
            successRedirect:'/home',
            failureRedirect: '/'
        }
    ));


    route.get('/logout', function(req, res){
        req.logout();
        res.redirect('/')
  });
  return route;
}