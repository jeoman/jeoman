var express = require('express');
var path = require('path');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//check connection
db.once('open', function(){
    console.log('Connected to mongodb')
}); 

//chek for db errors
db.on('error', function(err){
    console.log(err);
});

var app = express();

//bring in models
let Article = require('./models/article');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', function(req, res){
    Article.find({}, function(err, articles){
        if(err){
            consol.log(err);
        } else {
            res.render('index', {
                title : 'Articles',
                articles:articles
            });
        }
    });
});

app.get('/articles/add', function(req, res){
    res.render('add_article', {
        title : 'Add Article'
    });
});

// add submit post route
app.post('/articles/add', function(req, res){ 
    console.log('Submitted');
    return;
})

app.listen(3000, function(){
    console.log('Server started on port 3000!')
});