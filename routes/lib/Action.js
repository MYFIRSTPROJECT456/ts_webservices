    var async = require('async');
    var connection = require('./dbconnection');

    var Action={ 
       exeDML:function setserv(sql,params,col3,col4,callback){

           var sql1 = sql;
           var params = params;
/*
           pool.getConnection(function(err, connection){
            if (err) {
                console.log('connection error',err);
            }
            else{*/
                connection.query(sql1, params,function(err, results){

                   var resp ;
                   var error= null;
                   if (err) {
                    error = err;
                    resp = {
                        status: "1",
                        status_msg: error["sqlMessage"],
                        new_id: null
                    };
                } else {
                    if(results && results.affectedRows > 0){
                        resp = {
                            status: "0",
                            status_msg: "success",
                            new_id: results.insertId
                        };
                    }else{
                        resp = {
                            status: "1",
                            status_msg: "failed to insert",
                            new_id: null
                        };
                    }
                }
                var response = JSON.parse(JSON.stringify(resp));
             return callback(error,response);

            });
            // connection.release();
            /*}
            
        });*/

       },
       exeSEL:function getserv(sql,params,col3,col4,callback){

           var sql1 = sql;
           var params = params;

          /* pool.getConnection(function(err, connection){
            if (err) {
                console.log('connection error',err);
            }
            else{*/
                connection.query(sql1, params,function(err, results){

                    var resp ;
                    var error = null;
                    if (results && results.length>0) {
                        resp = {
                            status: "0",
                            status_msg: "success",
                            data: results
                        };
                    } else {
                        if(err){
                            error = err;
                            resp = {
                                status: "1",
                                status_msg: error["sqlMessage"],
                                data: []
                            };
                        }else{
                            resp = {
                                'status': "1",
                                'status_msg': "failed",
                                'data': []
                            };
                        }
                    }
                    var response = JSON.parse(JSON.stringify(resp));
                   return  callback(error,response);

                });
              // connection.release();
           /* }
          
        });*/

       },
       exeSelParallel: function getParallel(arr_Sql_Params, col2, col3,col4, callback){

        var objects = arr_Sql_Params;
        async.map(objects, function(obj, callback) {
            getData(obj, function (err, res) {
                callback(err, res);
            })
        }, function(err, results) {
            return callback(err,results);
        });

        function getData(obj,callback){
           var sql1 = obj.sql;
           var params = obj.params;

         /*  pool.getConnection(function(err, connection){
            if (err) {
                console.log('connection error',err);
            }
            else{*/
                connection.query(sql1,params ,function(err, results){

                 var resp ;
                 var error= null;
                 if (results && results.length>0) {
                    resp = {
                        status: "0",
                        status_msg: "success",
                        data: results
                    };
                } else {
                    if(err){
                        error = err;
                        resp = {
                            status: "1",
                            status_msg: error["sqlMessage"],
                            data: []
                        };
                    }else{
                        resp = {
                            status: "1",
                            status_msg: "failed",
                            data: []
                        };
                    }
                }
                var response = JSON.parse(JSON.stringify(resp));
                 return callback(error,response);
            });
            /*connection.release();
            }
            
        });*/
       }
   },
       exeSELMulti:function exeSELMulti(sql,params,col3,col4,callback){

           var sql1 = sql;
           var params = params;

          /* pool.getConnection(function(err, connection){
            if (err) {
                console.log('connection error',err);
            }
            else{*/
                connection.query(sql1, params,function(err, results){

                    var resp ;
                    var error = null;
                        if(err){
                            error = err;
                            resp = {
                                status: "1",
                                status_msg: error["sqlMessage"],
                                data: []
                            };
                        }else{
                            resp = {
                                status: "0",
                                status_msg: "success",
                                data: results
                            };
                        }
                    
                    var response = JSON.parse(JSON.stringify(resp));
                   return  callback(error,response);

                });
              // connection.release();
           /* }
          
        });*/

       }    
}
module.exports = Action;  