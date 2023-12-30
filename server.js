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
  var passCondition = 1;//Required to be 1 in order to add a new store. 0 = fail, 1 = success
  
  //Get the store info inputted by the user
  const addSIDlower = req.body.sid;
  const addSID = addSIDlower.toUpperCase();//Make it all capitals
  const addLocation = req.body.location;
  const addManager = req.body.mgrid;
  //Print them to the console
  console.log(addSID+addLocation+addManager);

  //Make sure the Store ID is formatted properly
  if(!(addSID.length == 5)){
    console.log("Store ID too short/long");
    passCondition = 0;
  }
  //Make sure the storeID is unique
  var uniqueSID = await sqlDAO.checkStores(addSID);
  //If results are found, entries are added to test. This makes test's length (entries) bigger than 0, meaning the ID was not unique.
  if(!uniqueSID){
    console.log("Store ID already exists");
    passCondition = 0;
  }

  //Make sure the location is atleast 1 character long
  if(!(addLocation.length == 1)){
    console.log("Location should be a minimum of 1 character");
    passCondition = 0;
  }

  //Make sure the manager exists
  //const


  res.render('storesAdd');
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