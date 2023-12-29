//mySQL Data Access Object

var conPool;//Hold connection pool for accessing databases
var promiseSQL = require('promise-mysql');//Used to create a connection pool later and holds the db's configuration settings

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
    conPool = res;//Set connection pool using response from mySQL server
})
//If this is unsuccessful, log the error reason to the console
.catch((res) =>{
    console.log("Error with Connection pool...\n"+res)
})

//Query the mySQL DB for all the stores and return them to the express server
function listStores() {
    //Using default param names for resolve and reject
    return new Promise((resolve, reject) =>{
        //Attempt to Query the mySQL database
        conPool.query('select * from store')
        //If the SQL query is valid...
        .then((res) =>{
            resolve(res)
        })
        //... Otherwise, return an error
        .catch((res)=>{
            reject(res)
        })
    })
}

//Query the mySQL DB for all the products and return them to the express server
function listProducts() {
    //Layout for the product page query
    const sqlQuery =`
    select p.pid, p.productdesc, s.sid, s.location ,ps.Price from product p
    left join product_store ps on p.pid = ps.pid
    left join store s on ps.sid = s.sid;
    `;

    //Using default param names for resolve and reject
    return new Promise((resolve, reject) =>{
        //Attempt to Query the mySQL database
        conPool.query(sqlQuery)
        //If the SQL query is valid...
        .then((res) =>{
            resolve(res)
        })
        //... Otherwise, return an error
        .catch((res)=>{
            reject(res)
        })
    })
}

//Let server.js access these functions
module.exports = { listStores, listProducts };