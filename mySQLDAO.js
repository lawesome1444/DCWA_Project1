//mySQL Data Access Object

var conPool;//Hold connection pool for accessing databases
var promiseSQL = require('promise-mysql');//Used to create a connection pool later and holds the db's configuration settings

//Importing and configuring MongoDB
const { MongoClient } = require('mongodb');
MongoClient.connect('mongodb://127.0.0.1:27017')//attempt to connect to the local mongoDB
//If successful...
.then((res) =>{
    dbMongo = res.db('proj2023MongoDB')
    collMongo = dbMongo.collection('managers')
})
//Otherwise, print an error to the console
.catch((err)=>{
    console.log(err);
})


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
//Check if a store exists
function checkStores(testSID){
        //Using default param names for resolve and reject
        return new Promise((resolve, reject) =>{
            //Attempt to Query the mySQL database
            conPool.query('select sid from store where sid=?', testSID)//See if a store exists with the ID that the user inputted
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

//Search the MongoDB database for all the managers
function listManagers() {
    //Using default param names for resolve and reject
    return new Promise((resolve, reject) =>{
        //Attempt to search the database
        var searchMongo = collMongo.find();
        searchMongo.toArray()//Attempt to collect the manager JSON
        //If successful, send it to the server
        .then((res) =>{
            resolve(res)
        })
        //... Otherwise, return an error
        .catch((res)=>{
            reject(res)
        })
    })
}

//Check if a manager exists
function checkManagers(testManager){
        //Using default param names for resolve and reject
        return new Promise((resolve, reject) =>{
            //Attempt to search the database for a specific manager id
            var searchMongo = collMongo.findOne({ _id: testManager})
            //If successful, send it to the server
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
module.exports = { listStores, listProducts, listManagers, checkStores, checkManagers };