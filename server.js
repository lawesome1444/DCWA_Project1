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

  //Make sure the storeID is unique
  var uniqueSID = await sqlDAO.checkStores(addSID);
  //If results are found, entries are added to test. This makes test's length (entries) bigger than 0, meaning the ID was not unique.
  if(!(uniqueSID.length == 0)){
    console.log("Store ID already exists");
    passCondition = 0;
  }

  //Make sure the manager exists
  const existsManager = await sqlDAO.checkManagersExist(addManager);
  if(!existsManager){
    console.log("A manager with this ID does not exist.");
    passCondition = 0;
  }

  //Make sure the manager is not already assigned to a store
  const assignedManager = await sqlDAO.checkManagersAssigned(addManager);
  if(!(assignedManager == 0)){
    console.log("This manager is already assigned to a store.");
    passCondition = 0;
  }

  //If none of the checks fail, add the store
  if(passCondition == 1){
    const attemptAdd = sqlDAO.addStore(addSID, addLocation, addManager);
    res.redirect('/stores');
  }
  //Otherwise...
  else{
    console.log("Fail");
  }
})

//Display the storesEdit page
app.get('/stores/edit/:id', async(req, res) =>{
  //Grab the passed on sid
  const sid = req.params.id;
  //Render the edit store page. Use the passed on sid as the read-only value to the SID field on that page
  res.render('storesEdit', {sid:sid});//Render the page with the passed on store details
})
//Handles editing store entries
app.post('/stores/edit/:id', async(req, res) =>{
  var passCondition = 1;//Required to be 1 in order to add a new store. 0 = fail, 1 = success
  //Getting the edits made by the user
  const editSID = req.params.id;
  const editLocation = req.body.location;
  const editManager = req.body.mgrid;

    //Make sure the manager exists
    const existsManager = await sqlDAO.checkManagersExist(editManager);
    if(!existsManager){
      console.log("A manager with this ID does not exist.");
      passCondition = 0;
    }

  //Make sure the manager is not already assigned to a store
  const assignedManager = await sqlDAO.checkManagersAssigned(editManager);
  if(!(assignedManager == 0)){
    console.log("This manager is already assigned to a store.");
    passCondition = 0;
  }

  console.log(editSID);

    //If none of the checks fail, apply the edits
    if(passCondition == 1){
      const attemptEdit = sqlDAO.editStore(editSID, editLocation, editManager);
      res.redirect('/stores');
    }
    //Otherwise...
    else{
      console.log("Fail");
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