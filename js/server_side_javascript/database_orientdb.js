var OrientDB = require('orientjs');

var sever = OrientDB({
    host : 'localhost',
    port : 2424,
    username : 'root',
    password : '920326'
});

var db = sever.use('o2');
/*
db.record.get('#27:0').then(function(record){
    console.log('Loaded record:', record.title);
});
*/

//CREATE
/*
var sql = 'SELECT FROM topic';
db.query(sql).then(function(results){
    console.log(results);
});
*/
/*
var sql = 'SELECT FROM topic WHERE @rid=:rid';
var param = {
    params : {
        rid : '#27:0'
    }
};
db.query(sql, param).then(function(results){
    console.log(results);
});
*/

//INSERT
/*
var sql = "INSERT INTO topic(title, description) VALUES(:title, :desc)";
var param = {
    params : {
        title:'Express',
        desc:'Express is framework for web'
    }
}
db.query(sql, param).then(function(results){
    console.log(results);
})
*/

//UPDATE
/*
var sql = "UPDATE topic SET description=:desc WHERE @rid=:rid";
db.query(sql, {params:{desc:'Express is framework for web', rid:'#28:0'}}).then(function(results){
    console.log(results);
})
*/

//DELETE

var sql = "DELETE VERTEX FROM topic WHERE @rid=:rid";
db.query(sql, {params:{rid:'#28:0'}}).then(function(results){
    console.log(results);
})