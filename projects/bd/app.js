var app = require('./config/express')();
var passport = require('./config/passport')(app);

var board = require('./routes/board')();
app.use('/board', board);
 
var index = require('./routes/index')(passport);
app.use('/', index);

app.listen(3001, function(){
    console.log('Connected port 3001')
});