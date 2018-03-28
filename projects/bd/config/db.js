module.exports = function(){
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

    return conn;
}
