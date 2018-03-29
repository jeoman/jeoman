var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    name : String,
    data : Object,
});
module.exports = mongoose.model('User', userSchema);