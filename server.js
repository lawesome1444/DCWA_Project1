//Import modules
const express = require('express')
const sqlDAO = require('./mySQLDAO')
const app = express()
const port = 3000
const ejs = require('ejs');

//Use EJS to display html
app.set('view engine', 'ejs');

const bodyParser = require('body-parser');

// Add bodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }));

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
//Display the storesAdd page
app.get('/stores/add', async(req, res) =>{
  res.render('storesAdd');
})
//Handle adding new stores
app.post('/stores/add', async(req, res) =>{
  //Get the store info inputted by the user
  const addID = req.body.sid;
  const addLocation = req.body.location;
  const addManager = req.body.mgrid;

  console.log(addID+addLocation+addManager);
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

//Display the Managers page
app.get('/managers', async (req, res) =>{
  //Attempt to call the listStores function in the SQL DAO
  try{
    var allManagers = await sqlDAO.listManagers();
    res.render('managers', {allManagers : allManagers});
  }
  //if unsuccesful
  catch (err){
    console.error(err);
    res.status(500).send('MongoDB Search error: Managers page');
  }
})


//Basic feedback for server console
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})