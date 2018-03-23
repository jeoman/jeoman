

module.exports = function(app){
    var conn = require('./db')();
    var bkfd2Password = require("pbkdf2-password");
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var hasher = bkfd2Password();
    app.use(passport.initialize());
    app.use(passport.session());
    var users = [{
        authId : 'local : jeo',
        username : 'jeo',
        password : 'nvt/rs3CwyjEkyUdI7k69jcKR0TGXQ8P8KYUnhlcgXq/ZeQcHnSbuN59Yi80+0XwdlZRIJUSBGNPX6M4kryen1dvssMM1Ipbpx3GnlQ5HgAWCBUL1I1W9Yj948RoiojdR/SZIGpOMlTmWoLbq2K14AkO3N+ZQkzeuvhJexVPgNY=',
        salt : 'Kp5aON7/CEgGDuQpoY80PgsyjbFqQBxCVP+94NcmZE0u0k6Yt5T4n36+VFLGKkZVUbnjYm+JyvRZWc4JJrA62w==',
        displayName : 'Jeo'     
    }
];
    
    passport.serializeUser(function(user, done) {
        done(null, user.authId);
      });
      
    passport.deserializeUser(function(id, done) {
        var sql = 'SELECT * FROM users WHERE authId=?';
        conn.query(sql, [id], function(err, results){
            if(err){
                console.log(err);
                done('There is no user.');
            } else {
                done(null, results[0]);
            }
        });
    });
     
    passport.use(new LocalStrategy(
        function(username, password, done){
            var uname = username;
            var pwd = password;
            var sql = 'SELECT * FROM users WHERE authId=?';
            conn.query(sql, ['local'+uname], function(err, results){
                console.log(results);
                if(err){
                    return done('There is no user.');
                }
                var user = results[0];
                return hasher({password :pwd, salt :user.salt}, function(err,pass,salt,hash){
                if(hash === user.password){
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
            });
            
        }
    ));
    
    return passport;
}