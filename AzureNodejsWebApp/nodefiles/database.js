const sql = require('mssql');

//var config = {
//  user: 'neel', 
//  password: 'Dellftw225!',
//  server: 'p-portal.database.windows.net',
//  database: 'patientPortal',
//  options: { 
//      encrypt: true
//  }
//}

var config = {
    user: 'mybhma',
    password: 'Propeers1',
    server: 'wllrytrffc.database.windows.net',
    database: 'patientPortal',
    options: {
        encrypt: true
    }
}


var connection = new sql.ConnectionPool(config); 
var req = new sql.Request(connection);

connection.connect(err => {
    if (err) {
        console.log(err);
    }
    else{
    	console.log("Connected!");
    	// queryDB(); 
    }
})

function createTable(){
	
	request = new Request(
       "CREATE TABLE dbo.Test2 (name varchar(25) NOT NULL)",
        function(err, rowCount, rows) {
            console.log(rowCount + ' row(s) inserted');
            if(err){
            	console.log("error creating table " + err);
            }
        }
    );
connection.execSql(request);

}

function insertDataIntoTable(){
    console.log("Insertingldshaodiu a brand new product into database...");
    request = new Request(
        "INSERT INTO dbo.Test2 (name) VALUES ('oii')", function(err, rowCount, rows) {
            console.log(rowCount + ' row(s) inserted');
            if(err) {
            	console.log("error in inserting " + err);
            }
        }
    ); 
    connection.execSql(request);
}




function queryDB(){
      req.query(
     	"SELECT TOP 100 * FROM dbo.Lab", function(error, results){
     	
		if(error){
			console.log(error);
		}else{
      
			fs.writeFile('./Public/lab.json', JSON.stringify(results.recordsets[0]), function (err) {
    	  if (err) throw err;
    	  console.log('Converted to JSON!');
   		 });


		}
		// connection.end();
	});
}

function printL(){
return "EEOFIJWEOFIJWEOFIJ";

}
