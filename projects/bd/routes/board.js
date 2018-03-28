module.exports = function(){
    var route = require('express').Router();
    var conn = require('../config/db')();
    var pool = require('../config/db')();
    route.get('/', function(req,res,next){
        res.redirect('/board/list/1');
    });
    
    
    route.get('/list/:page', function(req,res,next){
        var page = req.params.page;
        // pool.getConnection(function(err, conn){
        var sql = "SELECT id,title,name,hit,DATE_FORMAT(moddate, '%Y/%m/%d %T') as moddate FROM board order by id desc";
        conn.query(sql, function(err,rows,fields){
            if(err) console.log(err);
            res.render('list', {
                title : 'Board list',
                rows:rows,
                page : page,
                leng : Object.keys(rows).length-1,
                page_num : 10,
                pass : true
            });
            // conn.release();
        })
        // })
    });
    
    route.get('/edit/:id', function(req,res, next){
        var id = req.params.id;
        // pool.getConnection(function(err, conn){
            var sql ='SELECT id,title,name,content FROM board';
            conn.query(sql, function(err, rows, fields){
                if(id){
                    var sql = 'SELECT * FROM board WHERE id=?';
                    conn.query(sql, [id], function(err, rows, fields){
                        if(err){
                            conn.rollback(function(){
                                console.err('rollback error')
                            });
                        } else {
                            res.render('edit', {rows:rows,rows:rows[0]})
                        }
                    })
                } else {
                    conn.rollback(function(){
                        console.err('rollback error')
                    })
                }
            // })
        })
        
    })
    
    route.post('/edit/:id', function(req,res){
        var title = req.body.title;
        var content = req.body.content;
        var name = req.body.name;
        var password = req.body.password;   
        var id = req.params.id;
        var sql = 'SELECT id,password FROM board WHERE id=?';
        conn.query(sql, [id,password], function(err,row){
            var sql = 'UPDATE board SET title=?, content=?, name=?, password=? WHERE id=?';
            conn.query(sql, [title,content,name,password,id], function(err,rows,fields){
                if(err){
                    conn.rollback(function(){
                        console.err('rollback error')
                    });
                } else {
                    conn.commit(function(err){ 
                        if(err) console.log(err)
                        if(password === row[0].password){
                            res.redirect('/board/read/'+id)
                        }
                    })
                }
            })
        })
        
        })
    
        
    
    route.get('/read/:id',function(req,res,next){
        var id = req.params.id;
        var sql = 'UPDATE board set hit=hit+1 WHERE id=?';
        var sql1 = 'SELECT * FROM board WHERE id=?';
        conn.query(sql, [id], function(err,results){
            if(err){
                conn.rollback(function(){
                    console.err('rollback error1')
                });
            } else {
                conn.query(sql1, [id], function(err,rows){
                    if(err){
                        conn.rollback(function(){
                            console.err('rollback error2')
                        });
                    } else {
                        conn.commit(function(err){
                            if(err) console.log(err)
                            res.render('read',{title:rows[0].title,rows:rows})
                        })
                    }
                })
            }
        })
    })
    
    route.get('/write', function(req,res,next){
        res.render('write', {
            title: 'Write page'
        })
    });
    
    route.post('/write', function(req,res,next){
        var name = req.body.name;
        var title = req.body.title;
        var content = req.body.content;
        var password = req.body.password;
        var sql = 'INSERT INTO board(title,name,content,password) VALUES(?,?,?,?)'
        conn.query(sql, [title,name,content,password],function(err){
            if(err){
                conn.rollback(function(){
                    console.err('rollback error3')
                });
            } else {
                var sql1 = 'SELECT LAST_INSERT_ID() as id'
                conn.query(sql1,function(err,rows){
                    if(err){
                        conn.rollback(function(){
                            console.err('rollback error3')
                        });
                    } else {
                        conn.commit(function(err){
                            var id = rows[0].id;
                            res.redirect('/board/read/'+id)
                        })
                    }
                })
            }
        })
    })
    
    route.get('/delete/:id', function(req, res){
        var sql = 'SELECT * FROM board';
        var id = req.params.id;
        conn.query(sql, function(err, rows){
            var sql= 'SELECT * FROM board WHERE id=?';
            conn.query(sql, [id], function(err, row){
                if(err){
                    conn.rollback(function(){
                        console.err('rollback error')
                    });
                } else {
                    if(row.length === 0){
                        console.log('There is no record');
                        res.status(500)
                    } else {
                        res.render('delete', {title:'Do you want to delete ', rows:rows, row:row[0]})
                    }
                }
            })
        })
    })
    
    route.post('/delete/:id',function(req,res){
        var id = req.params.id;
        var sql = 'DELETE FROM board WHERE id=?';
        conn.query(sql, [id], function(err,result){
            var sql ='ALTER TABLE board auto_increment=1';
            conn.query(sql, function(err,result){
                var sql = 'SET@COUNT=0';
                conn.query(sql, function(err,result){
                    var sql = 'UPDATE board SET board.id =@COUNT:=@COUNT+1';
                    conn.query(sql, function(err,result){
                                res.redirect('/board/list/1')
                    })
                })
            })
        })
    })
    return route;
}
