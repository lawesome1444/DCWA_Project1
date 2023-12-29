//Import modules
const express = require('express')
const sqlDAO = require('./mySQLDAO')
const app = express()
const port = 3000
const ejs = require('ejs');

//Importing and configuring basic mongoDB settings
const { MongoClient } = require('mongodb');
const clientMongo = new MongoClient('mongodb://127.0.0.1:27017');

//Connecting to the local MongoDB Database
async function connectMongo(){
  try{
    //Attempt to connect...
    await clientMongo.connect();
    console.log("Connected to local MongoDB");
    //Then access the managers collection
    const dbMongo = clientMongo.db('proj2023MongoDB');
    const collMongo = dbMongo.collection('managers');
  }
  //Otherwise, print an error to the console
  catch(err){
    console.error(err);
  }
}connectMongo();

//Use EJS to display html
app.set('view engine', 'ejs');

//Display home.ejs if at localhost:3000
app.get('/', (req, res) => {
  res.render('home')
})

//Display the stores page
app.get('/stores', async (req, res) =>{
  //Attempt to call the listStores function in the SQL DAO
  try{
    var allStores = await sqlDAO.listStores();
    res.render('stores', {allStores : allStores});
  }
  //if unsuccesful
  catch (err){
    console.error(err);
    res.status(500).send('SQL Connection Pool error: Stores page');
  }
})

//Display the products page
app.get('/products', async (req, res) =>{
  //Attempt to call the listStores function in the SQL DAO
  try{
    var allProducts = await sqlDAO.listProducts();
    res.render('products', {allProducts : allProducts});
  }
  //if unsuccesful
  catch (err){
    console.error(err);
    res.status(500).send('SQL Connection Pool error: Products page');
  }
})


//Basic feedback for server console
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})