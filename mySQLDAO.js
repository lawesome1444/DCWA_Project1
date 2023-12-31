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
        conPool.query('SELECT * FROM store')
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
            conPool.query('SELECT sid FROM store WHERE sid=?', testSID)//See if a store exists with the ID that the user inputted
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

//Add new stores to the Database
function addStore(sid, location, mgrid){
            //Query layout for adding new store
            const sqlQuery =`
            INSERT INTO store (sid, location, mgrid) 
            VALUES (?, ?, ?);
            `;
            //Using default param names for resolve and reject
            return new Promise((resolve, reject) =>{
                //Attempt to add new store the the SQL database
                conPool.query(sqlQuery, [sid, location, mgrid])
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

//Edit an existing store's information
function editStore(sid, location, mgrid){
    //Query layout for editing store details
    const sqlQuery =`
    UPDATE store
    SET location=?, mgrid=?
    WHERE sid = ?;
    `;
        //Using default param names for resolve and reject
        return new Promise((resolve, reject) =>{
            //Attempt to add new store the the SQL database
            conPool.query(sqlQuery, [location, mgrid, sid])
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
    SELECT p.pid, p.productdesc, s.sid, s.location ,ps.Price FROM product p
    LEFT JOIN product_store ps ON p.pid = ps.pid
    LEFT JOIN store s ON ps.sid = s.sid;
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
//Check if a product ID exists on the product_store table (aka is it assigned to a store)
function checkProducts(testPID){
    //Using default param names for resolve and reject
    return new Promise((resolve, reject) =>{
        //Attempt to Query the mySQL database
        console.log(testPID);
        conPool.query('SELECT pid FROM product_store WHERE pid =?', testPID)//See if this PID exists in the product_store table
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
//Delete product IDs from SQL database
function deleteProducts(pid){
    //Using default param names for resolve and reject
    return new Promise((resolve, reject) =>{
        //Attempt to add new store the the SQL database
        conPool.query('DELETE FROM product WHERE pid=?', pid)
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
function checkManagersExist(testManager){
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
//Check if the manager is assigned to a store already
function checkManagersAssigned(testManager){
            //Using default param names for resolve and reject
            return new Promise((resolve, reject) =>{
                //Attempt to Query the mySQL database
                conPool.query('SELECT * FROM store WHERE mgrid=?', testManager)//See if a manager with this ID is already assigned to a store
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

function addManager(details){
    //Using default param names for resolve and reject
    return new Promise((resolve, reject) =>{
        //Attempt to add the manager to the mongo database
        var searchMongo = collMongo.insertOne(details)
        //If successful, send it to the server
        .then((res) =>{
            resolve(res)
        })
        //... Otherwise, return an error
        .catch((err)=>{
            reject(err)
        })
    })
}

//Let server.js access these functions
module.exports = { listStores, listProducts, listManagers, checkStores, checkManagersExist, checkManagersAssigned, addStore, editStore, checkProducts, deleteProducts, addManager };