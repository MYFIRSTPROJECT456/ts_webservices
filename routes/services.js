 
var async = require('async');
var express = require('express');
var router = express.Router();  
var Data_POST = require('./lib/auth_post.js');
var FMaster_SEL = require('./masters/FMaster_SEL.js');
var FMaster_INS = require('./masters/FMaster_INS.js');
var Ticket = require('./masters/ticket.js');
var User = require('./masters/users.js');
var Unit = require('./masters/unit.js');
var CodeM = require('./masters/codemaster.js');
var Dashboard = require('./masters/dashboard.js');
var Dropdown = require('./masters/dropdowns.js');
var Chart = require('./masters/charts.js');

router.post('/api', function(req, res, next) {  

var authFlg = 1;

if((req.body.reqid +'') == '20185001'){
    authFlg = 0;
}

    var Data = Data_POST.getData(req,authFlg);

    if(Data && Data.status.status == "0"){
        main_Execute(Data, function (err,result){
            res.send(result[1]);
        });
    }
    else{
    	    res.send(Data.status);
	    }

    function main_Execute(Data1,callback){

        var fdata= Data1.data;
        async.parallel([
                async.apply(log,fdata),
                async.apply(execute,fdata)
            ], function(err, done) {
                return callback(err,done);
            });
    }

    function execute(data,callback){

        var reqid = ''+data.reqid; 
    	    console.log("Formatted Data execute",data);
	        switch(reqid){

                            case '20185000': //delete
                                          
                            break;

                            case '20185001': //auth
                            User.login(data,callback);                
                            break;

                            case '20185002': //detail
                            User.getuserdetails(data,callback);                
                            break;            

                            case '20185003': //kpis
                            FMaster_SEL.getkpis(data,callback);                
                            break;

                            case '20185004':
                            FMaster_SEL.getnotification(data,callback);
                            break;   

                            case '20185005':
                            Unit.getAllunitdetails(data,callback);    
                            break;

                            case '20185006':
                            Ticket.raiseticket(data,callback);
                            break;

                            case '20185007':
                            Ticket.gettktsts(data,callback);    
                            break;

                            case '20185008': //detail
                            User.saveuser(data,callback);                
                            break; 

                            case '20185009':
                            FMaster_SEL.getTicketHistory(data,callback);    
                            break;

                            case '20185010': //detail
                            User.userdetails(data,callback);                
                            break;  
                            
                            case '20185011': //detail
                            Ticket.gettkt(data,callback);                
                            break;  

                            case '20185012': //detail
                                         
                            break;     

                            case '20185013': //detail
                            Unit.getunitdetails(data,callback);                
                            break;  

                            case '20185014': //detail
                            Unit.saveunit(data,callback);                
                            break;  

                            case '20185015': //detail
                            CodeM.getAllcodes(data,callback);                
                            break; 

                            case '20185016': //detail
                            CodeM.getcodedetails(data,callback);                
                            break; 

                            case '20185017': //detail
                            CodeM.savecode(data,callback);                
                            break; 

                            case '20185018': //detail
                            FMaster_SEL.getTicketApproval(data,callback);                
                            break; 

                            case '20185019': //detail
                            FMaster_SEL.getSanctions(data,callback);                
                            break; 

                            case '20185020': //detail
                            Ticket.approve(data,callback);                
                            break; 

                            case '20185021': //detail
                            Ticket.reject(data,callback);                
                            break; 

                            case '20185022': //detail
                            FMaster_INS.getFeedbacks(data,callback);                
                            break; 

                            case '20185025': //detail
                            Dashboard.getDashboard(data,callback);                
                            break; 

                            case '20185026': //detail
                            Ticket.updatetkt(data,callback);                
                            break; 

                            case '20185027': //detail
                            Chart.getChartData(data,callback);                
                            break; 

                            case '20185028': //detail
                            Dropdown.getDropdownData(data,callback);                
                            break; 

			     case '20185030': //detail
                     			FMaster_SEL.getEsc(data,callback);              
                            break; 


                            case '20185031': //detail
                            FMaster_INS.uptfcm(data,callback);                
                            break; 

				case '20185032': //detail
                          //  FMaster_INS.uptfcm(data,callback);                
                            break; 


				case '20185033': //detail
                            //FMaster_INS.uptfcm(data,callback);                
                            break; 


                            default:
                            var resp = {
                                status: "1",
                                status_msg: "Request ID not recognized"
                            };
                            return callback(null,resp);
                            break;
                		}
                    }
    function log(data,callback){
    var resp = {
        status: "0",
        status_msg: "success"
    };
    return callback(null,resp);
	}
}); 

module.exports = router;
