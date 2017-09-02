module.exports = function(app) {
  console.log("YEE");
  
	 var https = require("https");
    var path = require('path');
    var API_endpoint = 'https://api-e1.authrocket.com/v1/';
    var hosted_logins = 'https://hlw3jklx.e1.loginrocket.com/'
    var token = null;
    var AuthRocket = require('authrocket');
    var authrocket = new AuthRocket({jsUrl: 'https://hlw3jklx.e1.loginrocket.com/',
    });  
    var jwt = require('jsonwebtoken'); 

    var secret = 'jsk_GiBY7CW58kQNbp8mqm1eKlmR8J1RN0lUBOqTeaVUruY'

 exports.verify = function(dest, res){
  console.log("in here");
   jwt.verify(token, secret, function(err, decoded) {
  if (err) {
    console.log("Error is " + err);
    return res.redirect('https://hlw3jklx.e1.loginrocket.com/');
  }else{
    console.log("Worked " + (decoded));
    return res.sendFile(path.join(__dirname, dest)); 
  }
});
}

function list_users(){
    
    var options = {
      host: 'api-e1.authrocket.com',
      path: '/v1/users/',
      method: 'GET',
      headers: { 
        // 'URI': API_endpoint,
        'Accept': 'application/json',
        // 'Content-type': 'application/x-www-form-urlencoded',
        'Content-type': 'application/json',
        'X-Authrocket-Api-Key': 'ko_0vTbtUvXMP2nvhM4NU9mlD-m2rWm6Gwkgrvcyn1qlk01tKH5yzOBW6w6Ic68t9Okzv',
        'X-Authrocket-Realm': 'rl_0vTbte0j1uuBjHipEcYH1b'

      }

  };
  var req = https.request(options, function(res) {
        // console.log("statusCode: ", res.statusCode);
        // console.log("headers: ", res.headers);

        res.on('data', function(d) {
             // process.stdout.write(d);  
        });
    });

    req.end();

}

function get_user(user){
    
    var options = {
      host: 'api-e1.authrocket.com',
      path: '/v1/users/' + user,
      method: 'GET',

      headers: { 
        // 'URI': API_endpoint,
        'Accept': 'application/json',
        'Content-type': 'application/json',
        // 'Content-type': 'application/x-www-form-urlencoded',
        'X-Authrocket-Api-Key': 'ko_0vTbtUvXMP2nvhM4NU9mlD-m2rWm6Gwkgrvcyn1qlk01tKH5yzOBW6w6Ic68t9Okzv',
        'X-Authrocket-Realm': 'rl_0vTbte0j1uuBjHipEcYH1b'

      }

  };
  var req = https.request(options, function(res) {
        
        res.on('data', function(d) {
            process.stdout.write(d);

        });
  });

    req.end();

}
	  app.get('/login', function(req, res){
	 	 res.sendFile(path.join(__dirname, '../views/login.html'));
	 	 // list_users();
     console.log("Here");
	 	
	  })
	

  // module.exports.verify = verify;
}
// 'Accept': 'application/json',