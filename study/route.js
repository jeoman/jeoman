var express = require('express');
var router = express.Router();
router.get('/', (req, res) =>{
    res.render('main');
});
router.get('/about', (req, res)=>{
    res.render('about')
});
router.get('/:name', (req, res)=>{
    User.find({ name : req.params.name}, (err, user)=>{
        res.render('main', {user:user})
    });
});
module.exports = router;