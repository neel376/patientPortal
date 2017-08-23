// var Connection = require('tedious').Connection;
// var Request = require('tedious').Request;
var express = require('express');
var app = express();
var path = require('path');
var database = require("./nodefiles/database.js");
// var LocalStorage = require('node-localstorage').LocalStorage;   
var http = require('http');
var https = require("https");
const url  = require('url');
var fs = require('fs');
var fsPath = require('fs-path');
var Promise = require('Promise');

var bodyParser = require('body-parser');
var multer = require('multer');

var upload = multer({dest: 'Public/'}) 
var port = process.env.PORT || 8080;
var client = require('twilio')("AC39ba5512b877a07a5e61021d51d286de", "c29754e52e19e7c65291fbf93d2cbeb3");
var twilio = require('twilio');
var azure = require('azure-storage');
var token = null;
var jwt = require('jsonwebtoken'); 
var secret = 'jsk_BFCLBspN0kDnIOGz1CgDf79bRawsWQaVSFg6dDvletu';
var username;
const sql = require('mssql');
var accessKey = 'nLIH4ldYFJ0d7YFZA8sLkC/1tvvpSnVULoKZ69H4AlUFM0NfRypsWiyQ7GzpR5HzAVEsCk8X1j5TiiI3KHYoJQ==';
var storageAccount = 'pportalstorage';

var blobService = azure.createBlobService(storageAccount, accessKey);

var config = {
  user: 'neel', 
  password: 'Dellftw225!',
  server: 'p-portal.database.windows.net',
  database: 'patientPortal',
  options: { 
      encrypt: true
  }
}
var connection = new sql.ConnectionPool(config); 
var request = new sql.Request(connection);

connection.connect(err => {
    if (err) {
        console.log(err);
    }
    else{  
       console.log("Connected!");   
    }
});

var startDate = new Date();
var expiryDate = new Date(startDate);
expiryDate.setMinutes(startDate.getMinutes() + 100);
startDate.setMinutes(startDate.getMinutes() - 100);

var sharedAccessPolicy = {
  AccessPolicy: {
    Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
    Start: startDate,
    Expiry: expiryDate
  },
};

app.use("/public", express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

http.createServer(function (req, res) {   
});

app.set('view engine', 'ejs');



app.post('/getPatientData',function(req, res){
  const array = [];
  const token = req.body.token;
      verifyTok(token).then(function(isVerified) {
        if(1) { //***************** pass in "1" instead for testing locally, otherwise pass "isVerified" *******************
          getUsername(token).then(function(username) { //Gets username
            getPatientInfo(username).then(function(patientData){ //Gets patient Summary
              array.push(patientData); //Push patient summary to array

            }).then(function(){
                StoreSASLink(username).then(function(SASLink){ //Stores generated SASLink into database

                }).then(function(){
                    getRefferals(username).then(function(refferalData){//Gets refferals
                      array.push(refferalData); //pushes refferals to array
                      
                    }).then(function(){
                        getImmunizations(username).then(function(ImmunData){ //gets Immunizations
                          array.push(ImmunData); //pushes Immunization data to array

                        }).then(function(){
                            getPatientLabs(username).then(function(labData){ //gets Patient Lab data(with new SAS links)
                              array.push(labData); //pushes lab data to array
                              //res.send(array); //sends data to front end
                            }).then(function () {
                                getPatientLabs(username).then(function (labData) { //gets Patient Lab data(with new SAS links)
                                    array.push(labData); //pushes lab data to array
                                    res.send(array); //sends data to front end
                                })
                            })
                        })
                    });
                });
            });
          });
        } else {
            res.redirect('/');
          }
    })
});

//Redirects



app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '/views/dashboard.html')); //******** change to '/views/dashboard.html' for 
});                                                            //testing locally, otherwise /views/login.html ************

app.get('/login', function(req, res,next){
  res.sendFile(path.join(__dirname, '/views/login.html'));
});
app.get('/labProto.html', function(req, res,next){
  res.sendFile(path.join(__dirname, '/views/labProto.html'));
});
app.get('/summary.html', function(req, res,next){
  res.sendFile(path.join(__dirname, '/views/summary.html')); 
 });
app.get('/labresults.html', function(req, res, next){
  res.sendFile(path.join(__dirname, '/views/labresults.html')); 
 });
app.get('/referrals.html', function(req, res,next){
    res.sendFile(path.join(__dirname, '/views/referrals.html')); 
 });
app.get('/immunization.html', function(req, res,next){
  res.sendFile(path.join(__dirname, '/views/immunization.html')); 
 });
app.get('/dashboard.html', function(req, res){
    res.sendFile(path.join(__dirname, '/views/dashboard.html'));
});
app.get('/login.html', function(req, res){
    res.sendFile(path.join(__dirname, '/views/login.html')); 
});
app.get('/Test.html', function (req, res) {
    res.sendFile(path.join(__dirname, '/views/Test.html'));
});


//functions for getting data

function getBlobName(username){ //Gets names of blobs
  return new Promise(function(resolve, reject){
    request.query("SELECT blobName FROM dbo.UsernameLabLink WHERE blobName IS NOT NULL AND Username = '" + username + "'", function(error, response){
        if(error){
          console.log(err);
          reject();
        }else{
          const blobNames = response.recordset;
          resolve(blobNames); //returns names of existing blobs (pdfs)
        }
    });
  });
}  

function StoreSASLink(username){ //Stores generated SAS Lab links into database to allow patient to access 
  var newUrls = [];              //private lab info
  var blobs = [];
  return new Promise(function(resolve, reject){
    getBlobName(username).then(function(blobNames){ //Gets name of blobs
      blobs = blobNames;
      generateSASLinks(blobNames).then(function(SASUrls){ //gets SAS links for the blobs
        newUrls = SASUrls;
      });
    }).then(function(){ // Updates database with new SAS links
        for(var i = 0; i< newUrls.length; i++){
          request.query("UPDATE dbo.UsernameLabLink SET LabLink = '" + newUrls[i] + "' WHERE blobName = '" + blobs[i].blobName +"'", function(error, response){
            if(error){
            console.log(error);
           }
         })
        }
    }) 
    resolve(true);
  }); 
}

function generateSASLinks(blobNames){ //Creates SAS Links with tokens
  return new Promise(function(resolve, reject){
    if(blobNames.length === 0 ){ //If there are no blobs (pdfs), return nothing
        reject("No pdfs found");
    }else{
      var array = [];
      var sasToken;
      var sasUrl;
      for(var i = 0; i < blobNames.length; i++){ //For each blob (pdf), generate a token and a url with that token
        sasToken = blobService.generateSharedAccessSignature('test-container', blobNames[i].blobName, sharedAccessPolicy);
        sasUrl = blobService.getUrl('test-container', blobNames[i].blobName, sasToken);
        array.push(sasUrl); //push url to array
      }
      resolve(array); //return the array of urls
    }
  });
}

function getPatientInfo(username){ //Gets patient Summary information
      return new Promise(function(resolve, reject) {
        request.query("SELECT * FROM dbo.Patients WHERE Username = '" + username + "'", function(error, response){
          if(error){
            console.log(error);
            reject();
            return;
          }else{
            const patientData = response.recordset;
            resolve(patientData);
        } 
      });      
     });    
    } 
      
// /Public/' + username + 'Patient.json
function getPatientLabs(username){ //Gets patient Lab information (including the new Lab SAS urls)
  return new Promise(function(resolve, reject) {
    request.query("SELECT * FROM dbo.UsernameLabLink WHERE Username = '" + username + "'", function(error, response){
        if(error){
          reject();
        }else{
            const labData = response.recordset;
            resolve(labData);
         }
     }); 
  });
}

function getRefferals(username){ //Gets refferal information
  return new Promise(function(resolve, reject) {
    request.query("SELECT * FROM dbo.Refferals WHERE Username = '" + username + "'", function(error, response){
        if(error){
          reject();
        }else{
            const refferalData = response.recordset;
            resolve(refferalData);
         }
     }); 
  });
}

function getImmunizations(username){//Gets Immunization information
  return new Promise(function(resolve, reject) {
    request.query("SELECT * FROM dbo.Immunizations WHERE Username = '" + username + "'", function(error, response){
        if(error){
          reject();
        }else{
            const ImmunData = response.recordset;
            resolve(ImmunData);
         }
     }); 
  });
}

function getToken(req) {
  return new Promise(function(resolve, reject) {
    // var tok = localStorage.getItem('token');
    if(tok === null) {
      var url = req.url;
      tok = url.split('=')[1];
    }if(tok === null || tok === ''){
      reject();
    }else{
      // localStorage.clear();
      // localStorage.setItem('token', tok);
      // resolve(localStorage.getItem('token'));
    }    
  });
}

function verifyTok(token) { //verifies if token is valid
  return new Promise(function(resolve, reject) {
     jwt.verify(token, secret, function(err, decoded) {
       if (err) { //if error redirect to login
        // console.log("ERROR IS " + err); ****************
        resolve(false);
      } else { 
        resolve(true);
      }
    });   
  });
}
 
function getUsername(token){
  return new Promise(function(resolve, reject) {
    if(token != null){
      var decoded = jwt.decode(token, {complete: true});
      resolve(decoded.payload.un);
    } else {
      reject();
    }
  });
     if(token != null){
     var decoded = jwt.decode(token, {complete: true}); 
     var un = decoded.payload.un;
     return un;    
    }else{
    return null;
  }
}
  // require('./nodefiles/auth.js')(app);
  // connection.execSql(request); for later use
app.listen(port);
console.log('Server running on ports: ' + port);

module.exports = app;


var i = 0;
var Test = "to check on VSTS commit 1";
