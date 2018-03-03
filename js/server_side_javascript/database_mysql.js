var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '920326',
  database : 'o2'
});

conn.connect();
/*
var sql ='SELECT * FROM topic';
conn.query(sql, function(err, rows, fields){
  if(err){
    console.log(err);
  } else {
    for(var i=0; i<rows.length; i++){
      console.log(rows[i].title);
    }
  }
});
*/
/*
var sql = 'INSERT INTO topic (title,description, author) VALUES(?, ?, ?)';
var params = ['Supervisor', 'Watcher', 'LEe']
conn.query(sql, params, function(err, rows, fields){
  if(err){
    console.log(err);
  } else {
    console.log(rows.insertId);
  }
})
*/
/*
var sql = 'UPDATE topic SET title=?, author=? WHERE id=?';
var params = ['NPM', 'PARK', '1']
conn.query(sql, params, function(err, rows, fields){
  if(err){
    console.log(err);
  } else {
    console.log(rows.affectedRows);
  }
})
*/
var sql = 'DELETE FROM topic WHERE id=?';
var params = [1];
conn.query(sql, params, function(err, rows, fields){
  if(err){
    console.log(err);
  } else {
    console.log(rows.affectedRows);
  }
});

conn.end();
