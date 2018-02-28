var OrientDB = require('orientjs');

var sever = OrientDB({
    host : 'localhost',
    port : 2424,
    username : 'root',
    password : 'djflsdl1'
});

var db = sever.use('tuto');
/*
db.record.get('#27:0').then(function (record){
    console.log('Loaded record:', record.title);
});
*/

//CREATE
/*
var sql = 'SELECT FROM topic';
db.query(sql).then(function(results){
    console.log(results);
});

var sql = 'SELECT FROM topic WHERE @rid=:rid';
var param = {
    params:{
        rid:'#27:0'
    }
};
db.query(sql, param).then(function(results){
    console.log(results);
});
*/

//INSERT
/*
var sql = "INSERT INTO topic (title, description) VALUES(:title, :description)";
db.query(sql, {
    params:{
        title:'Express',
        description:'Express is framework for web'
    }
}).then(function(results){
    console.log(results);
});
*/

//UPDATE
/*
var sql = "UPDATE topic SET title=:title WHERE @rid=:rid";

var param = {
    params: {
    title:'Expressjs',
    rid:'#26:1'
}
};
db.query(sql, param).then(function(results){
    console.log(results);
});

*/

//DELETE

var sql = "DELETE FROM topic WHERE @rid=:rid";
db.query(sql, {params:{rid:'#26.1'}}).then(function(results){
    console.log(results);
});