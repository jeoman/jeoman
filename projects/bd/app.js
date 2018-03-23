var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);
var bkfd2Password = require('pbkdf2-password');
var hasher = bkfd2Password();
var mysql = require('mysql');
var conn = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '920326',
        database: 'o2'
});
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'o2',
    password: '920326'
});

conn.connect();

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
app.use(passport.initialize());
app.use(passport.session());

var users = [{
    name : 'jeo',
    password : 'eQbwwOrIplQbJV65cuAD9Vz/5COnJmmTeWis/nfCo/AD4Au/zKL/nDYRDWkDmI6uQ1KMxHkHbvYUIhp6hyLb5i5dteBA1k5XXcmBLlBS9s+5FJHjBoxzHDQReZbKgsOJnnsP2i1f8oH5XKjVkx6CxJRPJMUKwt8UD/cJA+yLqs4=',
    salt : '063Mak3bqEQV/xwR6+ucwuu9wwxyPi1hYVFS5yhKVG8fmgVP14tO4kgu7b3i8Ogvx9hW8rb/IcNXbvdfU7dVMw==',
    nick : 'JEO'
},
{
    name : 'myuck',
    password : 'T/XhmwwvFCpxvHq8CwIGSSCRcWWCKr93/BuYqrgnc67O+y0lzD3YYNLdldfUqvRCMfhHv5BWCkjXcR0c6MlFBTrP8YMGg/O4/ka0k+G1JYoe43LLhQp9GhLgUi4f+AtJFIOl+1foj2opJnEsGeFn9ub6qV+cGuH+XQDGnmgNgmI=',
    salt : 'aXB66S2MGBBXMUppmeUOoi91G2cx9z+f39sPTIFPjb7ilIRrgPkXoEzfv/yuv26aGwwpa+E8GgiliV17Yo/Cfw==',
    nick : 'Myuck'   
}
];

app.get('/', function(req,res){
    res.render('index', {
        title : 'Welcome to Daily'
    });
});

app.get('/login', function(req, res){
    res.render('login', {
        title : 'Login'
    });
});

passport.serializeUser(function(user,done){
    done(null, user.authId);
});

passport.deserializeUser(function(id, done){
    var sql = 'SELECT * FROM caracter WHERE authId=?';
    conn.query(sql, [id], function(err,results){
        if(err){
            done('There is no user.')
        } else {
            done(null, results[0]);
        }
    })
})

passport.use(new LocalStrategy(
   function(username, password, done){
    var name = username;
    var pwd = password;
    var sql = 'SELECT * FROM caracter WHERE authId=?';
    conn.query(sql, ['local:'+name], function(err,results){
        if(err){
            return done('There is no user.');
        } 
        var user = results[0];
        return hasher({password:pwd, salt:user.salt}, function(err,pss,salt,hash){
            if(hash === user.password){
                done(null, user);
            } else {
                done(null, false);
            }
        })
    })
   }));


app.post('/login',
    passport.authenticate('local', 
    { 
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash : false
    },
))


app.get('/home', function(req, res){
    if(req.user && req.user.nick){
    res.render('home', {
        title : 'Hi! '+req.user.nick
    }
    );
    } else {
        res.redirect('/')
    }
  });

  app.get('/register', function(req, res){
    res.render('register', {
        title : 'Register'
    })
  });

app.post('/register', function(req, res){
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

app.get('/board', function(req,res,next){
    res.redirect('/board/list/1');
});


app.get('/board/list/:page', function(req,res,next){
    pool.getConnection(function(err, conn){
        var sql = "SELECT * FROM board order by id desc";
        conn.query(sql, function(err,rows,fields){
            if(err) console.log(err);
            res.render('list', {
                title : 'Board list',
                rows:rows
            });
            conn.release();
        })
    })
});

app.get('/board/edit/:id', function(req,res, next){
    var id = req.params.id;
    pool.getConnection(function(err, conn){
        var sql ='SELECT id,title,name,content FROM board';
        conn.query(sql, function(err, rows, fields){
            console.log('rows', rows)
            if(id){
                var sql = 'SELECT * FROM board WHERE id=?';
                conn.query(sql, [id], function(err, rows, fields){
                   
                    console.log('rows', rows)
                    if(err){
                        conn.rollback(function(){
                            console.err('rollback error')
                        });
                    } else {
                        res.render('edit', {rows:rows,rows:rows[0]})
                    }
                })
            } else {
                conn.rollback(function(){
                    console.err('rollback error')
                })
            }
        })
    })
    
})

app.post('/board/edit/:id', function(req,res){
    var title = req.body.title;
    var content = req.body.content;
    var name = req.body.name;
    var password = req.body.password;
    var id = req.params.id;
    var sql = 'UPDATE board SET title=?, content=?, name=?, password=? WHERE id=?';
    var sql1 = 'SELECT * FROM board';
    conn.query(sql, [title,content,name,password,id], function(err,rows,fields){
        if(err){
            conn.rollback(function(){
                console.err('rollback error')
            });
        } else {
            conn.commit(function(err){
                if(err) console.log(err)
                res.redirect('/board/read/'+id)
            })
        }
    })
    })

    

app.get('/board/read/:id',function(req,res,next){
    var id = req.params.id;
    var sql = 'UPDATE board set hit=hit+1 WHERE id=?';
    var sql1 = 'SELECT * FROM board WHERE id=?';
    conn.query(sql, [id], function(err,results){
        if(err){
            conn.rollback(function(){
                console.err('rollback error1')
            });
        } else {
            conn.query(sql1, [id], function(err,rows){
                if(err){
                    conn.rollback(function(){
                        console.err('rollback error2')
                    });
                } else {
                    conn.commit(function(err){
                        if(err) console.log(err)
                        res.render('read',{title:rows[0].title,rows:rows})
                    })
                }
            })
        }
    })
})

app.get('/board/write', function(req,res,next){
    res.render('write', {
        title: 'Write page'
    })
});

app.post('/board/write', function(req,res,next){
    var name = req.body.name;
    var title = req.body.title;
    var content = req.body.content;
    var password = req.body.password;
    var sql = 'INSERT INTO board(title,name,content,password) VALUES(?,?,?,?)'
    conn.query(sql, [title,name,content,password],function(err){
        if(err){
            conn.rollback(function(){
                console.err('rollback error3')
            });
        } else {
            var sql1 = 'SELECT LAST_INSERT_ID() as id'
            conn.query(sql1,function(err,rows){
                if(err){
                    conn.rollback(function(){
                        console.err('rollback error3')
                    });
                } else {
                    conn.commit(function(err){
                        var id = rows[0].id;
                        res.redirect('/board/read/'+id)
                    })
                }
            })
        }
    })
})

app.get('/logout', function(req, res){
      req.logout();
      res.redirect('/')
  });




// conn.query('SELECT * from topic', function(err, rows, fields) {
//   if (!err)
//     console.log('The solution is: ', rows);
//   else
//     console.log('Error while performing Query.', err);
// });



app.listen(3001, function(){
    console.log('Connected port 3001')
});