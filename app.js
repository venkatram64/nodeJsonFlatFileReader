var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var fs = require("fs");
var session = require('express-session');


var app = express()

app.use(session({secret: 'mysecret'}));

//body parser middleware
app.use(bodyParser.json());

//set static path
app.use(express.static(path.join(__dirname, 'data')));


//http://localhost:3000/listRequests
app.get('/listRequests', function (req, res) {
   fs.readFile( __dirname + "/data/" + "requests.json", 'utf8', function (err, data) {

       res.end( data );
   });
});

//persisting pagination values

function updatePagination(start, end){

  var fileName = __dirname + '/data/pagination.json';
  var file = require(fileName);

  file.start = start;
  file.end = end;

  fs.writeFile(fileName, JSON.stringify(file), function (err) {
    if (err) return console.log(err);
    console.log(JSON.stringify(file));
    console.log('writing to ' + fileName);
  });  
}

//reading persisted data

var page ={
  start : 0,
  end : 0
}
fs.readFile( __dirname + "/data/" + "pagination.json", 'utf8', function (err, data) {
  
  if (err) return console.log(err);
  var dataP = JSON.parse(data);
  console.log("Reading start and end values are " + dataP.start + ", " + dataP.end);
  page.start = dataP.start;
  page.end = dataP.end;
  return page;
});

//session is managed pagination
//http://localhost:3000/persistListRequests
app.get('/persistListRequests', function (req, res) {
   fs.readFile( __dirname + "/data/" + "requests.json", 'utf8', function (err, data) {
 
    var dataP = JSON.parse(data);
    var reqArray = dataP
     console.log("Requests " + reqArray.length);
     //var page = getPagination();
     var start = page.start;
     var end = page.end;
     console.log("start and end " + start + ", " + end);
     if(start){
       start = parseInt(start);
       start = start + 5;
     }else{
       start = 1;
     }
     if(end){
       end = parseInt(end);
       end = end + 5;
     }else{
       end = 5;
     }
     updatePagination(start, end);
     if(end > reqArray.length){
       end = reqArray.length;
     }
     if(start > reqArray.length || start < 0){
       start = 0
     }
     if(start > 0){
       start = start - 1;
     }

     console.log("start " + start);
     console.log("end " + end);
     var newRecs = [];
     data = reqArray.slice(parseInt(start),parseInt(end));
     
    res.end( JSON.stringify(data) )

     
   });
});

//session is managed pagination
//http://localhost:3000/randomListRequests
app.get('/randomListRequests', function (req, res) {
   fs.readFile( __dirname + "/data/" + "requests.json", 'utf8', function (err, data) {
 
    var dataP = JSON.parse(data);
    var reqArray = dataP
     console.log("Requests " + reqArray.length);
     var start = 0;
     var end = 0;
     if(session.start){
       start = parseInt(session.start);
       session.start = start + 5;
     }else{
       session.start = 1;
       start = parseInt(session.start);
     }
     if(session.end){
       end = parseInt(session.end);
       session.end = end + 5;
     }else{
       session.end = 5;
       end = parseInt(session.end);
     }
     if(end > reqArray.length){
       end = reqArray.length;
     }
     if(start > reqArray.length || start < 0){
       start = 0
     }
     if(start > 0){
       start = start - 1;
     }

     console.log("start " + start);
     console.log("end " + end);
     var newRecs = [];
     data = reqArray.slice(parseInt(start),parseInt(end));
     
    res.end( JSON.stringify(data) )

     
   });
});

//http://localhost:3000/listRequests/4/6
app.get('/listRequests/:start/:end', function (req, res) {
   fs.readFile( __dirname + "/data/" + "requests.json", 'utf8', function (err, data) {
 
    var dataP = JSON.parse(data);
    var reqArray = dataP
     console.log("Requests " + reqArray.length);

     var s = req.params.start;
     var ps = req.params.end;
     if(ps > reqArray.length){
       ps = reqArray.length;
     }
     if(s > reqArray.length || s < 0){
       s = 0
     }
     if(s > 0){
       s = s - 1;
     }
     var newRecs = [];
     data = reqArray.slice(s,ps);
     
    res.end( JSON.stringify(data) );
   });
});

//http://localhost:3000/listRequests/4/6
//please do not use this request.
app.get('/keeplistRequests/:start/:end', function (req, res) {
   fs.readFile( __dirname + "/data/" + "requests.json", 'utf8', function (err, data) {
 
    var dataP = JSON.parse(data);
    var reqArray = dataP.Requests
     console.log("Requests " + reqArray.length);

     var s = req.params.start;
     var ps = req.params.end;
     if(ps > reqArray.length){
       ps = reqArray.length;
     }
     if(s > reqArray.length || s < 0){
       s = 0
     }
     if(s > 0){
       s = s - 1;
     }
     var newRecs = [];
     data = reqArray.slice(s,ps);
     /*var myReq = {
       "Requests":[]
     }
     myReq.Requests = data;
     res.end( JSON.stringify(myReq) );
     */

    //console.log(myReq);
    res.end( JSON.stringify(data) );
   });
});





//http://localhost:3000/tesserDecision

/*
{
     "EmpRequestID":"1234",
     "ComplianceReviewDecision":"Some test decision",
      "Decision  ":[
       {"ComplianceReviewDecisionLimitations":"Some test decision"},
       {"ComplianceReviewDecisionLimitations":"Some test decision2"}
      ],
         
    "ComplianceReviewDecisionDate":"04/19/2017",
    "ComplianceReviewDecisionComments" :"some testing comments"
    
}
*/
app.post('/tesserDecision', function(req, res){
   
    var TesserDecision = req.body;
    res.json(TesserDecision);
    
});
//http://localhost:3000/prodClassiification
/*
  {
	"EmpRequestID":"1234",
	"EmpProductID":"Prod1234",
	"ProductConfirmationDate":"04/12/2017",
	"ProductClassification": "test clasification"

}
*/
app.post('/prodClassiification', function(req, res){
   
    var ProdClassiification = req.body;
    res.json(ProdClassiification);

});




/*app.get('/listRequests/:start/:end', function (req, res) {
   fs.readFile( __dirname + "/data/" + "requests.json", 'utf8', function (err, data) {
 
    var dataP = JSON.parse(data);
    var reqArray = dataP.Requests
     console.log("Requests " + reqArray.length);

     var s = req.params.start;
     var e = req.params.end;
     if(e > reqArray.length){
       e = reqArray.length;
     }
     if(s > reqArray.length || s < 0){
       s = 0
     }
     var newRecs = [];
     data = reqArray.slice(s,e);
     var myReq = {
       "Requests":[]
     }
     myReq.Requests = data;
    console.log(myReq);
       res.end( JSON.stringify(myReq) );
   });
});*/

//Global validationErrors
app.use(function(req, res, next){
  res.locals.errors = null;
  next();
});



app.listen(3000, function () {
  console.log('app listening on port 3000!')
})