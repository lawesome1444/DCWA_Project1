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
app.get('/stores/edit/:sid', async(req, res) =>{
  //Grab the passed on sid
  const sid = req.params.sid;
  //Render the edit store page. Use the passed on sid as the read-only value to the SID field on that page
  res.render('storesEdit', {sid:sid});//Render the page with the passed on store details
})
//Handles editing store entries
app.post('/stores/edit/:sid', async(req, res) =>{
  var passCondition = 1;//Required to be 1 in order to edit store details. 0 = fail, 1 = success
  //Getting the edits made by the user
  const editSID = req.params.sid;
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
//Handle product deletion requests
app.get('/products/delete/:pid', async(req, res) =>{
  var passCondition = 1;//Required to be 1 in order to delete a product. 0 = fail, 1 = success
  
  console.log(req.params.pid);
  //Store the PID passed by the specific delete button
  const testPID = req.params.pid;
  //Attempt to check the PID
  var stockedPID = await sqlDAO.checkProducts(testPID);
  console.log(stockedPID);
  if(!(stockedPID.length == 0)){
    console.log("This product is still in stock in stores!");
    passCondition = 0;
  }

  //If the pid isn't in stores, delete it from the product table
  if(passCondition == 1){
    const deleteProduct = sqlDAO.deleteProducts(testPID);
    res.redirect('/products');//"Refresh" the page to reflect product deletion
  }
  else{
    res.render('productsDelete', {pid:testPID});//If the product is in stores, go to an product deletion error page
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

//Display managerAdd page
app.get('/managers/add', (req, res) =>{
  //Render the manager add page
  res.render('managersAdd');
})

//Handle Manager addition requests
app.post('/managers/add', async (req, res) =>{
  //Create array for adding JSON to mongoDB
  const newManager = {
    _id: req.body._id,
    name: req.body.name,
    salary: Number(req.body.salary)
  };
  
  //Check if the manager exists.
  const checkManager = await sqlDAO.checkManagersExist(req.body._id);
  //If no manager exists with this manager ID, add them to MongoDB
  if(!checkManager){
    const addManager = await sqlDAO.addManager(newManager);
    res.redirect('/managers');
  }
  //Otherwise, log an error
  else{
    //The layout for this error message was found on Stack Overflow. A link can be found below.
    //https://stackoverflow.com/questions/42106506/express-js-how-to-send-alert-from-express-to-client-using-res-render-not-res#answer-61981784
    res.send(`<script>alert("Error: Manager `+req.body._id+` already exists in MongoDB"); window.location.href = "/managers/add";</script>`);
  }

})


//Basic feedback for server console
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})