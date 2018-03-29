module.exports = function(app){
    var conn = require('./db')();
    var pool = require('./db')();
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var bkfd2Password = require('pbkdf2-password');
    var hasher = bkfd2Password();
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
       
    passport.use(new FacebookStrategy({
    clientID : '1648296715230547',
    clientSecret : 'e1c88ec7b215f9e7d3641dde96bdff4c',
    callbackURL : '/facebook/callback',
    passReqToCallback : true,}, 
    (req, accessToken, refreshToken, profile, done)=>{
    User.findOne({id:profile.id}, (err, user)=>{
        if(user){
            return done(err,user);
        } // 회원 정보가 있으면 로그인
        var newUser = new User({ //없으면 회원생성
            id : profile.id
        });
        newUser.save((user)=>{
            return done(null, user); // 새로운 회원 생성 후 로그인
        })
    })
    }))

       return passport;
}
