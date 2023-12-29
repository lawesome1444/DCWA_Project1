//mySQL Data Access Object

var conPool;//Hold connection pool for accessing databases
var promiseSQL;//Used to create a connection pool later and holds the db's configuration settings

//Setup the connection pool
promiseSQL.createPool({
    connectionLimit: 5,
    host: 'localhost', //IP for local SQL server on host PC.
    user: 'root',
    password: 'root',//Default root admin login for SQL server
    database: 'proj2023'
})
//If successful, assign conPool to the db on mySQL server
.then((res) =>{
    conpool = res;//Set connection pool using response from mySQL server
})
//If this is unsuccessful, log the error reason to the console
.catch((err) =>{
    console.log("Error with Connection pool...\n"+err)
})